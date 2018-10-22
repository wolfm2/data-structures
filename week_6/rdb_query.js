const { Client } = require('pg');
const cTable = require('console.table');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'wolfm2'; //182
db_credentials.host = 'instance.ce54cjiwuvvo.us-east-1.rds.amazonaws.com'; // had to create it twice.

db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// (address varchar(100), meta varchar(300), title varchar(100), wchair varchar(1), day varchar(10), 
//  tbeg int, tend int, ttype varchar(2), lat double precision, long double precision, details varchar(300));";

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: 
// get 2 zones of data. due 2 weeks.
//~ var thisQuery = "SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";
//~ var thisQuery = "SELECT distinct (uniq) mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";
//~ var thisQuery = "SELECT count(*) (get number) mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";
//~ var thisQuery = "SELECT count(distinct mtgaddress) (get number) mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";

var thisQuery = "SELECT address, wchair, meta, ttype FROM aalocations WHERE day = 'Wednesdays' and tbeg >= 6120;";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});
