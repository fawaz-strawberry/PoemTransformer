import requests
from config import API_TOKEN
import base64
import json
import os
from github import Github
 
GIT_HUB = Github(API_TOKEN)

def get_base64_encoded_image(image_path):
    with open(image_path, "rb") as img_file:
        # 
        return "data:image/png;base64," + base64.b64encode(img_file.read()).decode('utf-8')

def sendImage(fileName):
    encoded_image = get_base64_encoded_image("C:/Users/fawaz/Pictures/ig_images/" + fileName)
    print(encoded_image[:100])
    commit_message = "Uploading Image"

    repo = GIT_HUB.get_repo("fawaz-strawberry/PoemTransformer")
    repo.create_file("images/" + fileName, message=commit_message, content=encoded_image)
    
# def getFiles(path):

GITHUB_API = "https://api.github.com/repos/fawaz-strawberry/"
ADD_FILE = "PoemTransformer/contents/images/"

FULL_PATH = "https://api.github.com/repos/fawaz-strawberry/PoemTransformer/contents/"


SAMPLE_PATH = "hi.txt"

# encoded_image = get_base64_encoded_image(SAMPLE_PATH)
# commit_message = "Uploading Image"

# authorization = {"Accept": "application/vnd.github.v3+json", "Authorization":"Token fawaz-strawberry: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"}
# contents = {"message":commit_message, "content":encoded_image}

# print(authorization)
# print(contents)

# # response = requests.get(FULL_PATH)
# # print(response.content)
# response = requests.put(FULL_PATH, data=contents, headers=authorization)
# print(response.request.body)
# print(response.content)


local_images = os.listdir("C:/Users/fawaz/Pictures/ig_images/")
current_images = []
contents = GIT_HUB.get_repo("fawaz-strawberry/PoemTransformer").get_contents("images")
for content in contents:
    current_images.append(content.name)
    print(content.name)
print("-------------------")
for image in local_images:
    print(image)
    if(image not in current_images):
        # sendImage(image)
        print("Adding above file")
        sendImage(image)







