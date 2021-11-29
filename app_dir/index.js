const {API_TOKEN, FACEBOOK_TOKEN} = require('../app_dir/keys.js')
const fs = require('fs')
const axios = require('axios')
const Buffer = require('buffer')

//PREDEFINED LINKS
var GITHUB_API = "https://api.github.com/repos/fawaz-strawberry/"
var ADD_FILE = "PoemTransformer/contents/images/"
var FULL_PATH = "https://api.github.com/repos/fawaz-strawberry/PoemTran5sformer/contents/"
var FACEBOOK_API = "https://graph.facebook.com/v12.0/"
var FACEBOOK_API_SUBSET = "https://graph.facebook.com/"

var IMAGES_FOLDER = "C:/Users/fawaz/Documents/GitHub/PoemTransformer/images/"
var POSTED_TEXT = "C:/Users/fawaz/Documents/GitHub/PoemTransformer/app_dir/posted_images.txt"
function getFileList(path){

    var all_files = []

    console.log(path)
    fs.readdir(path, (err, files) => {
        if (err){
            throw err
        }

        files.forEach(file => {
            all_files.push(file)
        })

        
    })

    return all_files
}

async function getGithubImages(){
    

    var all_files = await axios.get(GITHUB_API + ADD_FILE).then(response => {
        var myData = response.data
        var all_files = []

        for(var i = 0; i < myData.length; i++)
        {
            all_files.push(myData[i]["name"])
        }
        
        return all_files
    })

    return all_files

}

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return (bitmap).toString('base64');
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

async function compareFiles(){
    
    local_files = await getFileList(IMAGES_FOLDER)
    github_files = await getGithubImages()

    console.log(local_files)
    console.log(github_files)
    
    for(var i = 0; i < local_files.length; i++)
    {
        if(github_files.indexOf(local_files[i]) !== -1)
        {
            console.log("Matched " + local_files[i])
            // await postImage(github_files)
        }
        else
        {
            console.log("Inserting " + local_files[i])
            encoding = base64_encode(IMAGES_FOLDER + local_files[i])
            addImage(encoding, local_files[i], github_files)
            // await postImage(github_files)
            // break
        }
    }

    //Post an image to IG
    await postImage(github_files)

}

function postImage(files_to_add)
{
    var results = fs.readFileSync(POSTED_TEXT).toString()
    
    images = results.split("\r\n")

    console.log("\n\n============")
    console.log("Images and Files to add diff is...")
    console.log(images)
    console.log(files_to_add)
    console.log("============\n\n")

    for(var i = 0; i < files_to_add.length; i++){

        if(images.indexOf(files_to_add[i]) === -1)
        {
            console.log("Posting image: " + files_to_add[i])
            fs.writeFile(path=POSTED_TEXT, data=results + "\r\n" + files_to_add[i], () => {}) 

            //Ask Github for the file URL of the image
            console.log("Calling GITHUB API: " + GITHUB_API + ADD_FILE + files_to_add[i])
            axios.get(GITHUB_API + ADD_FILE + files_to_add[i]).then(response => {
                download_url = response["data"]["download_url"]
                console.log("Download URL: " + download_url)

                //Make the call to facebook accounts "me/accounts"
                console.log("Calling Facebook API: " + FACEBOOK_API + "me/accounts?access_token=" + FACEBOOK_TOKEN)
                axios.get(FACEBOOK_API + "me/accounts?access_token=" + FACEBOOK_TOKEN).then(response2 => {
                    console.log(response2["data"])
                    var page_id = response2["data"]["data"][0]["id"]
                    console.log("Page ID: " + page_id)

                    //Make the call to get facebook instagram accounts
                    console.log("Calling Facebook API: " + FACEBOOK_API + page_id + "?fields=instagram_business_account&access_token=" + FACEBOOK_TOKEN)
                    axios.get(FACEBOOK_API + page_id + "?fields=instagram_business_account&access_token=" + FACEBOOK_TOKEN).then(response3 => {
                        var ig_id = response3["data"]["instagram_business_account"]["id"]
                        console.log("IG ID: " + ig_id)

                        //Create the Post and send it to the API servers
                        console.log("Posting Image with: " + FACEBOOK_API + ig_id + "/media?image_url=" + download_url + "&access_token=" + FACEBOOK_TOKEN)
                        axios.post(FACEBOOK_API + ig_id + "/media?image_url=" + download_url + "&access_token=" + FACEBOOK_TOKEN).then(response4 => {
                            console.log(response4["data"])
                            container_id = response4["data"]["id"]
                            
                            //Actually publish the image to Instagram
                            console.log("Publishing Image with: " +FACEBOOK_API + ig_id + "/media_publish?creation_id=" + container_id + "&access_token=" + FACEBOOK_TOKEN)
                            axios.post(FACEBOOK_API + ig_id + "/media_publish?creation_id=" + container_id + "&access_token=" + FACEBOOK_TOKEN).then(response5 => {
                                console.log(response5["data"])
                            })

                        }).catch(err => {console.log("Failed POST Request: " + err)})

                    }).catch(err => {console.log("Failed GET Request: " + err)})

                }).catch(err => {console.log("Failed GET Request: " + err)})

                //Make the call to get instagram business accounts
                
                //Make the call to media?image_url=insertURLHere&caption=insertCaptionHere

                //Make the call to the API to send image

            }).catch(err => {console.log("Failed to get URL: " + err)})
            break
        }
    }
}

function addImage(encoding, filename, github_files)
{
    axios.put(GITHUB_API + ADD_FILE + filename, {
        "message":"poggers bro",
        "content":encoding
      }, {
        headers: {
          'Authorization': `Token ${API_TOKEN}` 
        }
      }).then(response => {
            console.log("Successful ?")
            postImage(github_files)
      })
}


compareFiles()
