FROM python:3.11-slim

# System dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install CPU-only PyTorch first (CUDA wheel is ~2.5 GB and blows out the
# Render build disk). The CPU wheel is ~200 MB and satisfies torch==2.2.2
# in requirements.txt below.
RUN pip install --no-cache-dir torch==2.2.2 \
    --index-url https://download.pytorch.org/whl/cpu

# openai-whisper==20231117's setup.py imports pkg_resources at the top, which
# was removed from setuptools 81+. Pin the pip build-isolation env to a
# setuptools that still ships pkg_resources so the wheel build succeeds.
RUN echo "setuptools<81" > /tmp/pip-constraints.txt
ENV PIP_CONSTRAINT=/tmp/pip-constraints.txt

# Install remaining Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download models (makes container large but startup fast)
RUN python -c "import whisper; whisper.load_model('base')"
RUN python -c "from transformers import AutoModelForSeq2SeqLM, AutoTokenizer; AutoTokenizer.from_pretrained('facebook/nllb-200-distilled-600M'); AutoModelForSeq2SeqLM.from_pretrained('facebook/nllb-200-distilled-600M')"

# Copy application code
COPY . .

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000}"]
