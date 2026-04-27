import gdown
import zipfile
import os

url = "https://drive.google.com/drive/folders/1lyNla2CzaWPttSnITOdYpJTCf6zlUyM9?usp=drive_link"
output = "dataset.zip"

# Download dataset
gdown.download(url, output, quiet=False)

# Extract dataset
with zipfile.ZipFile(output, 'r') as zip_ref:
    zip_ref.extractall("dataset")

# Optional: delete zip after extract
os.remove(output)

print("Dataset downloaded and extracted successfully!")