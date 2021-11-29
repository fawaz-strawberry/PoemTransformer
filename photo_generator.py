import os
import random
from PIL import Image, ImageDraw, ImageFont


file1 = open("latest_generation.txt")
lines = file1.readlines()

title = "Pogger Poem"
author = "Unknown"

poem = "Roses are red\
\nViolets are blue\
\nHe’s in love with me,\
\nAnd not exactly for you.\
\nAnd if you take my place,\
\nI’ll take my plate and smash your face. -" + author

poem = ""

nextLineTitle = False
nextLinePoet = False
for line in lines:
    print(line)
    if(line == "Poem Start\n"):
        nextLineTitle = True
        continue
    if(line == "END\n"):
        nextLinePoet = True
        continue

    if(nextLineTitle):
        nextLineTitle = False
        title = line.replace("\n", "")
        continue
    elif(nextLinePoet):
        nextLinePoet = False
        author = line.replace("\n", "")
        continue
    else:
        if(len(line) >= 50):
            newLine = False
            for i in range(len(line)):
                if(i+1 % 45 == 0):
                    newLine = True

                if(line[i] == " " and newLine):
                    poem += "\n"
                    newLine = True
                else:
                    poem += line[i]
        else:            
            poem += line


print(title)
print(author)

poem += "\n-" + author

BACKGROUNDS_FOLDER = "C:/Users/fawaz/Pictures/IG_BACKGROUNDS/"

images = os.listdir(BACKGROUNDS_FOLDER)

random_choice = random.randint(0, len(images) - 1)

img = Image.open(BACKGROUNDS_FOLDER + images[random_choice])

xMin = 25
xMax = img.size[0]
yMin = 25
yMax = img.size[1]

d1 = ImageDraw.Draw(img)

#FONT_TTF = "C:/Users/fawaz/Documents/Fonts/WinterSong-owRGB.ttf"
FONT_TTF = "C:/Users/fawaz/Documents/Fonts/futura bold/Futura Bold.ttf"
FONT_TTF = "C:/Users/fawaz/Documents/Fonts/Starmoon-lg5v5.otf"

myFont = ImageFont.truetype(FONT_TTF, int(xMax * .121))
miniFont = ImageFont.truetype(FONT_TTF, int(xMax * .12))

authorFont = ImageFont.truetype(FONT_TTF, int(xMax * .051))
authorMiniFont = ImageFont.truetype(FONT_TTF, int(xMax * .05))

poemFont = ImageFont.truetype(FONT_TTF, int(xMax * .0451))
poemMiniFont = ImageFont.truetype(FONT_TTF, int(xMax * .045))

coordinates = (xMin, random.randint(yMin, int(yMax / 8)))

d1.text(coordinates, title, font=myFont, fill=(0, 0, 0))
d1.text((coordinates[0] - 5, coordinates[1]), title, font=miniFont, fill=(255, 255, 255))

# d1.text((coordinates[0], coordinates[1] + 150), author, font=authorFont, fill=(0, 0, 0))
# d1.text((coordinates[0] - 2, coordinates[1] + 150 - 2), author, font=authorMiniFont, fill=(255, 255, 255))

d1.text((coordinates[0], coordinates[1] + int(xMax * .2)), poem, font=poemFont, fill=(0, 0, 0))
d1.text((coordinates[0] - 3, coordinates[1] + int(xMax * .2)), poem, font=poemMiniFont, fill=(255, 255, 255))



img.show()
img_size = img.size

maxWidth = 1000
maxHeight = 1000
if(img_size[0] > 1000):
    percentage = maxWidth/img_size[0]
    img_size = (1000, int(percentage * img_size[1]))

if(img_size[1] > 1000):
    percentage = maxHeight/img_size[1]
    img_size = (int(percentage * img_size[0]), 1000)

print("size: ")
print(img_size)
out = img.resize(img_size)
title = title.replace(".", "")
author = author.replace(" ", "_")
full_file_name = ("images/" + author + "_" + title + ".jpg").replace(" ", "")
out.save(full_file_name, "JPEG", quality=99, optimize=True)