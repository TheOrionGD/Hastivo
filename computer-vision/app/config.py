from pathlib import Path
from pydantic_settings import BaseSettings

_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_DEFAULT_DATASET_DIR = str(_REPO_ROOT / "data" / "isl_dataset")
_DEFAULT_PARQUET_FILE = str(_REPO_ROOT / "data" / "isl_dataset" / "data" / "train-00000-of-00001-a1731e778755d263.parquet")

class VisionSettings(BaseSettings):
    PORT: int = 8001
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"
    SERVICE_NAME: str = "Hastivo Real-Time Computer Vision & Hand Landmark Service"
    API_VERSION: str = "1.0.0"
    MIN_DETECTION_CONFIDENCE: float = 0.65
    MIN_TRACKING_CONFIDENCE: float = 0.60
    MAX_NUM_HANDS: int = 2
    CAMERA_DEVICE_INDEX: int = 0
    ISL_DATASET_DIR: str = _DEFAULT_DATASET_DIR
    ISL_PARQUET_FILE: str = _DEFAULT_PARQUET_FILE

    class Config:
        env_file = ".env"
        extra = "allow"

vision_settings = VisionSettings()
