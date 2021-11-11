const {API_TOKEN} = require('../app_dir/keys.js')
const fs = require('fs')
const axios = require('axios')
const Buffer = require('buffer')

//PREDEFINED LINKS
var GITHUB_API = "https://api.github.com/repos/fawaz-strawberry/"
var ADD_FILE = "PoemTransformer/contents/images/"
var FULL_PATH = "https://api.github.com/repos/fawaz-strawberry/PoemTran5sformer/contents/"

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

async function compareFiles(){
    
    local_files = await getFileList("../images/")
    github_files = await getGithubImages()

    console.log(local_files)
    console.log(github_files)
    
    for(var i = 0; i < local_files.length; i++)
    {
        if(github_files.indexOf(local_files[i]) !== -1)
        {
            console.log("Matched " + local_files[i])
        }
        else
        {
            console.log("Inserting " + local_files[i])
            encoding = base64_encode("../images/" + local_files[i])
            addImage(encoding, local_files[i])
        }
    }
}

function addImage(encoding, filename)
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
      })
}

compareFiles()
