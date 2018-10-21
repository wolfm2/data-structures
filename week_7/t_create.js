const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'wolfm2'; //182
// db_credentials.host = 'dsdemo.c2g7qw1juwkg.us-east-1.rds.amazonaws.com';
// db_credentials.host = 'mydb.ce54cjiwuvvo.us-east-1.rds.amazonaws.com';
db_credentials.host = 'instance.ce54cjiwuvvo.us-east-1.rds.amazonaws.com';
// db_credentials.host = '172.31.64.194';
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
// address meta300 title100 wheelc day10 fromInt toInt type2 details300
//var thisQuery = "CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);";
var thisQuery = "CREATE TABLE aalocations (address varchar(100), meta varchar(300), title varchar(100), wchair varchar(1), day varchar(10), tbeg int, tend int, ttype varchar(2), lat double precision, long double precision, details varchar(300));";
// Sample SQL statement to delete a table: 
// var thisQuery = "DROP TABLE aalocations;"; 
// Sample SQL statement to query the entire contents of a table: 
// var thisQuery = "SELECT * FROM aalocations;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
