"""
Signora AI — Indian Sign Language (ISL) Dataset Downloader
Downloads the full Indian Sign Language (A-Z, 1-9) dataset from Hugging Face
and saves it to o:\sign\data\isl_dataset.
"""
import os
import sys
import time
from pathlib import Path
from huggingface_hub import hf_hub_download
import pandas as pd

DATASET_REPO = "Hemg/Indian_sign_language_dataset"
REPO_ROOT = Path(__file__).resolve().parent.parent
TARGET_DIR = Path(os.getenv("ISL_DATASET_DIR", REPO_ROOT / "data" / "isl_dataset"))

def download_dataset():
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[*] Target Directory: {TARGET_DIR}")
    print(f"[*] Downloading ISL Dataset from Hugging Face repository: {DATASET_REPO}...")
    
    start_time = time.time()
    
    # 1. Download README
    readme_path = hf_hub_download(
        repo_id=DATASET_REPO,
        repo_type="dataset",
        filename="README.md",
        local_dir=str(TARGET_DIR)
    )
    print(f"[+] Downloaded README: {readme_path}")
    
    # 2. Download Parquet Dataset
    parquet_path = hf_hub_download(
        repo_id=DATASET_REPO,
        repo_type="dataset",
        filename="data/train-00000-of-00001-a1731e778755d263.parquet",
        local_dir=str(TARGET_DIR)
    )
    print(f"[+] Downloaded Parquet Data: {parquet_path}")
    
    elapsed = time.time() - start_time
    print(f"[+] Download completed in {elapsed:.1f} seconds.")
    
    # 3. Read dataset summary
    print("[*] Inspecting dataset structure...")
    df = pd.read_parquet(parquet_path)
    print(f"[+] Total samples: {len(df)}")
    print(f"[+] Columns: {list(df.columns)}")
    
    # Map label IDs to readable names if available
    label_counts = df['label'].value_counts().sort_index()
    print(f"[+] Total Classes: {len(label_counts)}")
    print("[+] Sample Class Distribution:")
    for label, count in list(label_counts.items())[:10]:
        print(f"    Class {label}: {count} samples")
        
    print("\n[SUCCESS] ISL Dataset is successfully downloaded and ready for training & validation!")

if __name__ == "__main__":
    download_dataset()

