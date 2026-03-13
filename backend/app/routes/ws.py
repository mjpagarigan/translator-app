"""WebSocket endpoint for real-time streaming translation."""

import json
import logging
import time

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.pipeline import translate_speech
from app.services.audio_utils import compute_energy

router = APIRouter()
logger = logging.getLogger(__name__)

# VAD settings
SILENCE_THRESHOLD = 500  # RMS energy threshold
SILENCE_DURATION = 1.5  # seconds of silence before processing
MAX_BUFFER_DURATION = 10.0  # max seconds before forced processing


@router.websocket("/ws/translate")
async def websocket_translate(websocket: WebSocket):
    """
    Real-time translation via WebSocket.

    Query params:
        target_lang: NLLB language code (e.g., "kor_Hang")
        voice_id: Optional ElevenLabs voice ID
    """
    await websocket.accept()

    target_lang = websocket.query_params.get("target_lang", "eng_Latn")
    voice_id = websocket.query_params.get("voice_id", None)

    audio_buffer = bytearray()
    last_voice_time = time.time()
    buffer_start_time = time.time()

    async def send_status(status: str):
        await websocket.send_json({"type": "status", "status": status})

    try:
        while True:
            # Receive audio chunk (binary frame)
            data = await websocket.receive_bytes()
            audio_buffer.extend(data)

            current_time = time.time()
            buffer_duration = current_time - buffer_start_time

            # Simple energy-based VAD
            energy = compute_energy(bytes(data))
            if energy > SILENCE_THRESHOLD:
                last_voice_time = current_time

            silence_duration = current_time - last_voice_time

            # Process if silence detected or buffer too long
            should_process = (
                len(audio_buffer) > 0
                and (silence_duration > SILENCE_DURATION or buffer_duration > MAX_BUFFER_DURATION)
            )

            if should_process:
                await send_status("processing")

                try:
                    result = await translate_speech(
                        audio_bytes=bytes(audio_buffer),
                        target_language=target_lang,
                        voice_id=voice_id,
                        source_format="wav",
                        on_status=send_status,
                    )

                    await websocket.send_json(
                        {
                            "type": "translation",
                            "source_text": result.source_text,
                            "translated_text": result.translated_text,
                            "audio_base64": result.audio_base64,
                            "source_language": result.source_language,
                            "processing_time_ms": result.processing_time_ms,
                        }
                    )
                except Exception as e:
                    logger.error("Pipeline error: %s", e)
                    await websocket.send_json(
                        {"type": "error", "message": str(e)}
                    )

                # Reset buffer
                audio_buffer = bytearray()
                buffer_start_time = time.time()
                last_voice_time = time.time()

    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error("WebSocket error: %s", e)
        try:
            await websocket.close()
        except Exception:
            pass
