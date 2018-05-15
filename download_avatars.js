var args = process.argv.slice(2);
var param1 = args[0];
var param2 = args[1];
if (args.length !== 2) {
  throw "Input exactly two parameters";
}

require('dotenv').config();


var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
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
}

getRepoContributors(param1, param2, function(err, result) {
  console.log("Errors:", err);
  for (var i = 0; i < result.length; i++) {
    console.log("avatar_url: ", result[i]['avatar_url']);
    downloadImageByURL(result[i]['avatar_url'], './images/' + result[i]['login'] + '.jpg');
  }
});


function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function (err) {
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}