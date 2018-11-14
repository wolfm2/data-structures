const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'wolfm2';
db_credentials.host = 'instance.ce54cjiwuvvo.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE sensorData ( sensorValue int, sensorTime int );";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
