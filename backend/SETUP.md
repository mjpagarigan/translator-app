# Backend Setup Tutorial

## Step 1: Open Terminal

Open the Terminal app on your Mac (Applications > Utilities, or press **Cmd+Space** and type "Terminal").

## Step 2: Navigate to the backend folder

```bash
cd /Users/mj/Documents/GitHub/translator-app/backend
```

## Step 3: Check that Python 3.12 is available

```bash
/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 --version
```

You should see `Python 3.12.x`.

## Step 4: (Optional) Set your ElevenLabs API key

Open `backend/.env` and replace `your_key_here` with your real API key from [elevenlabs.io](https://elevenlabs.io). This is only needed for the voice cloning/TTS feature — skip this if you just want to test translation.

## Step 5: Install dependencies (first time only)

```bash
/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -m pip install -r requirements.txt
```

This may take a while since it downloads PyTorch and Whisper.

## Step 6: Start the server

```bash
/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Step 7: Verify it's running

Once you see **"All models loaded. Server ready."** in the terminal, open a browser and go to:

```
http://localhost:8000/health
```

You should see a JSON response like:

```json
{"status": "ok", "whisper_loaded": true, "nllb_loaded": true, "elevenlabs_configured": false}
```

## Step 8: Keep it running

Leave that Terminal window open while you use the app. The backend needs to stay running. Press **Ctrl+C** to stop it when you're done.

---

**Tip:** The first launch will be slow because it downloads the Whisper and NLLB translation models (~1-2 GB). Subsequent launches will be much faster since the models are cached.
