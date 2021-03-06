var AWS = require('aws-sdk');
var async = require('async');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var diaryEntries = getData();

async.eachSeries(diaryEntries, function(value, callback) {
		var params = {};
		params.Item = value; 
		params.TableName = "deardiary";
		
		dynamodb.putItem(params, function (err, data) {
		  if (err) console.log(err, err.stack); // an error occurred
		  else     console.log(data);           // successful response
		});
    setTimeout(callback, 1000); 
}); 

function getData() {
 return [{"dayt":{"S":"Leg"},"startEpochPK":{"N":"1539204661"},"duration":{"N":"60"},"prep":{"SS":["drank water","reviewed russian twist"]},"bagel":{"SS":["everything"]},"exercises":{"SS":["legLift","russianTwist","skullcrushers"]},"exerDuration":{"NS":["23","21","11"]},"address":{"S":"1245 Fulton St."},"city":{"S":"Brooklyn"},"state":{"S":"NY"},"zip":{"N":"11216"}},{"dayt":{"S":"Arm"},"startEpochPK":{"N":"1539291061"},"duration":{"N":"45"},"exercises":{"SS":["legLift","skullcrushers"]},"exerDuration":{"NS":["21","11"]},"address":{"S":"1245 Fulton St."},"city":{"S":"Brooklyn"},"state":{"S":"NY"},"zip":{"N":"11216"}},{"dayt":{"S":"Leg"},"startEpochPK":{"N":"1539463861"},"duration":{"N":"80"},"prep":{"SS":["drank water"]},"bagel":{"SS":["plain"]},"exercises":{"SS":["russianTwist","eliptical"]},"exerDuration":{"NS":["23","60"]},"address":{"S":"1245 Fulton St."},"city":{"S":"Brooklyn"},"state":{"S":"NY"},"zip":{"N":"11216"}},{"dayt":{"S":"Core"},"startEpochPK":{"N":"1539636661"},"duration":{"N":"50"},"prep":{"SS":["stretched","drank water"]},"exercises":{"SS":["russianTwist","skullcrushers"]},"exerDuration":{"NS":["21","11"]},"address":{"S":"22 E 14th St."},"city":{"S":"New York"},"state":{"S":"NY"},"zip":{"N":"10003"}},{"dayt":{"S":"Arm"},"startEpochPK":{"N":"1539723061"},"duration":{"N":"60"},"prep":{"SS":["protein shake","ate tofu"]},"exercises":{"SS":["eliptical","skullcrushers"]},"exerDuration":{"NS":["45","12"]},"address":{"S":"1245 Fulton St."},"city":{"S":"Brooklyn"},"state":{"S":"NY"},"zip":{"N":"11216"}}];
 
}
