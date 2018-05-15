require('dotenv').config();
var args = process.argv.slice(2);
if (args.length > 2) {
  throw "Must have 2 parameters!";
}


var param1 = args[0];
var param2 = args[1];
if (args.length !== 2) {
  throw "Input exactly two parameters";
}


if(process.env.GITHUB_TOKEN){
  console.log("you can move on");
} else {
  throw "Where's the env file?!";
}

var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if (repoOwner && repoName) {
    var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + process.env.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var temp = JSON.parse(body);
    cb(err, temp);
    });
  } else {
    throw "No repoOwner or no repoName";
  }
}

getRepoContributors(param1, param2, function(err, result) {
  console.log("Errors:", err);
  for (var i = 0; i < result.length; i++) {
    console.log("avatar_url: ", result[i]['avatar_url']);
    downloadImageByURL(result[i]['avatar_url'], './images/' + result[i]['login'] + '.jpg');
  }
});


function downloadImageByURL(url, filePath) {
  if (!fs.existsSync(filePath)) {
    throw "The filePath does not exist";
  }
  request.get(url)
  .on('error', function (err) {
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}