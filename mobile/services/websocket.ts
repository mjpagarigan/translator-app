import { WS_BASE_URL } from "../constants/config";
import { WSMessage } from "../types";

type MessageHandler = (message: WSMessage) => void;
type StatusHandler = (connected: boolean) => void;

export class TranslationWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: MessageHandler;
  private onStatusChange: StatusHandler;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    targetLang: string,
    voiceId: string | null,
    onMessage: MessageHandler,
    onStatusChange: StatusHandler,
    baseUrl: string = WS_BASE_URL
  ) {
    let wsUrl = `${baseUrl}/ws/translate?target_lang=${targetLang}`;
    if (voiceId) {
      wsUrl += `&voice_id=${voiceId}`;
    }
    this.url = wsUrl;
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.onStatusChange(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        this.onMessage(msg);
      } catch {
        // ignore non-JSON messages
      }
    };

    this.ws.onclose = () => {
      this.onStatusChange(false);
      this.attemptReconnect();
    };

    this.ws.onerror = () => {
      this.onStatusChange(false);
    };
  }

  sendAudio(audioData: ArrayBuffer) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(audioData);
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // prevent reconnect
    this.ws?.close();
    this.ws = null;
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectTimeout = setTimeout(() => this.connect(), delay);
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
