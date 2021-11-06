import requests
from config import API_TOKEN
import base64
 
def get_base64_encoded_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')
    
GITHUB_API = "https://api.github.com/repos/fawaz-strawberry/"
ADD_FILE = "PoemTransformer/contents/images/"

SAMPLE_PATH = "C:/Users/fawaz/Pictures/simple_flower.png"

encoded_image = get_base64_encoded_image(SAMPLE_PATH)
commit_message = "Uploading Image"

authorization = {"Authorization":"fawaz-strawberry:" + API_TOKEN}
contents = {"message":commit_message, "content":encoded_image}

response = requests.put(GITHUB_API + ADD_FILE, data=contents, headers=authorization)
print(response)