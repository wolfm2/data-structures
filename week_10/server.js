var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'wolfm2';
db_credentials.host = 'instance.ce54cjiwuvvo.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    //~ var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             //~ AVG(sensorValue::int) as num_obs
             //~ FROM sensorData
             //~ GROUP BY sensorday
             //~ ORDER BY sensorday;`;
    var q = `SELECT sensorvalue FROM sensorData WHERE sensortime >= 1542220527;`;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
});

// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    //~ var thisQuery = `SELECT mtgaddress, mtglocation as location, json_agg(json_build_object('day', mtgday, 'time', mtgtime)) as meetings
                 //~ FROM aadata 
                 //~ WHERE mtgday = 'Tuesday' and mtghour >= 19 
                 //~ GROUP BY mtgaddress, mtglocation
                 //~ ;`;
    //var thisQuery = `SELECT * FROM aadata;`;
    var thisQuery = "SELECT address, wchair, meta, ttype FROM aalocations WHERE day = 'Wednesdays' and tbeg >= 6120;";

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) query
    var params = {
        TableName: "deardiary",
        //~ KeyConditionExpression: "#tp = :topicName", // the query expression
        //~ ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            //~ "#tp": "topic"
        //~ },
        //~ ExpressionAttributeValues: { // the query values
            //~ ":topicName": { S: "cats" }
        //~ }
        
        
        KeyConditionExpression: "dayt = :dayt and startEpochPK BETWEEN :sEpoch AND :eEpoch", // the query expression
				FilterExpression: 'zip = :zip',
				ExpressionAttributeValues: { // the query values
						":dayt": {S: "Leg"},
		        ":sEpoch": {N: String(1539291000)},
		        ":eEpoch": {N: String(1539636700)},
		        ":zip": {N: String(11216)}
		        //~ ":testt": {N: String(1539204661)}
		    }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });

});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});
