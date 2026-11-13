import uvicorn
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import vision_settings

if __name__ == "__main__":
    print(f"Starting {vision_settings.SERVICE_NAME} on http://localhost:{vision_settings.PORT}")
    uvicorn.run("app.main:app", host=vision_settings.HOST, port=vision_settings.PORT, reload=False)
