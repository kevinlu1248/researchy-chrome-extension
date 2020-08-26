import json
import zipfile
import os

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))

if __name__ == "__main__":
    version = json.load(open("chrome_extension/manifest.json"))["version"]
    zipf = zipfile.ZipFile('dist/{}.zip'.format(version), 'w', zipfile.ZIP_DEFLATED)
    zipdir('chrome_extension', zipf)
    zipf.close()
