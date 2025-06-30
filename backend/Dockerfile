FROM python:3.12-slim

# Install system dependencies required by Playwright
RUN apt-get update && apt-get install -y \
    curl unzip \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libxcomposite1 libxrandr2 libxdamage1 \
    libxss1 libxext6 libasound2 libx11-xcb1 libxshmfence1 \
    libxcb1 libx11-6 wget gnupg

# Set working directory
WORKDIR /app

# Copy backend files
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install Playwright and Chromium
RUN playwright install chromium

# Run the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
