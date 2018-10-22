// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

// can only use = on pk?!?!
// https://stackoverflow.com/questions/47771226/query-key-condition-not-supported-already-have-a-hash-and-a-range-key?rq=1
var params = {
    TableName : "deardiary",
    //~ KeyConditionExpression: "#tp = :topicName and dt between :minDate and :maxDate", // the query expression
    //~ ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        //~ "#tp" : "topic"
    //~ },
    //~ ExpressionAttributeValues: { // the query values
        //~ ":topicName": {S: "work"},
        //~ ":minDate": {N: new Date("September 1, 2018").valueOf().toString()},
        //~ ":maxDate": {N: new Date("October 16, 2018").valueOf().toString()}
    //~ }
    //KeyConditionExpression: "startEpochPK between :sEpoch and :eEpoch", // the query expression
    // KeyConditionExpression: "startEpochPK = :testt", // works!
    // KeyConditionExpression: "#addr = :bsty and startEpochPK = :testt", // the query expression
    
    KeyConditionExpression: " startEpochPK = :testt", // the query expression
    FilterExpression: 'zip = :zip',
    // KeyConditionExpression: "startEpochPK BETWEEN :sEpoch AND :eEpoch", // the query expression
    
    
		//~ ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        //~ "#addr" : "address"
    //~ },
    ExpressionAttributeValues: { // the query values
				//~ ":bsty": {S: "Brooklyn"},
        //~ ":sEpoch": {N: String(1539291000)},
        //~ ":eEpoch": {N: String(1539636700)}
        ":zip": {N: String(11216)},
        ":testt": {N: String(1539204661)}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});
