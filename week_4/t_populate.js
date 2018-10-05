const { Client } = require('pg');
var async = require('async');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'wolfm2'; //182
// db_credentials.host = 'dsdemo.c2g7qw1juwkg.us-east-1.rds.amazonaws.com';
// db_credentials.host = 'mydb.ce54cjiwuvvo.us-east-1.rds.amazonaws.com';
db_credentials.host = 'instance.ce54cjiwuvvo.us-east-1.rds.amazonaws.com'; // had to create it twice.


db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ];
var addressesForDb = [{"street":"122 E 37TH ST New York NY ","lat":"40.7483929","lon":"-73.9787906"},{"street":"30 E 35TH ST New York NY ","lat":"40.7479892","lon":"-73.9817564"},{"street":"350 E 56TH ST New York NY ","lat":"40.757654","lon":"-73.963834"},{"street":"619 LEXINGTON AVE New York NY ","lat":"40.6894374","lon":"-73.9367705"},{"street":"122 E 37TH ST New York NY ","lat":"40.7483929","lon":"-73.9787906"},{"street":"28 E 35TH ST New York NY ","lat":"40.748023","lon":"-73.9818371"},{"street":"350 E 56TH ST New York NY ","lat":"40.757654","lon":"-73.963834"},{"street":"283 LEXINGTON AVE New York NY ","lat":"40.7479969","lon":"-73.9783809"},{"street":"122 E 37TH ST New York NY ","lat":"40.7483929","lon":"-73.9787906"},{"street":"619 LEXINGTON AVE New York NY ","lat":"40.7588016","lon":"-73.9704542"},{"street":"141 E 43RD ST New York NY ","lat":"40.7518754","lon":"-73.9747248"},{"street":"122 E 37TH ST New York NY ","lat":"40.7483929","lon":"-73.9787906"},{"street":"122 E 37TH ST New York NY ","lat":"40.7483929","lon":"-73.9787906"},{"street":"141 E 43RD ST New York NY ","lat":"40.7518754","lon":"-73.9747248"},{"street":"209 MADISON AVE New York NY ","lat":"40.7486487","lon":"-73.9821254"},{"street":"122 E 37TH ST New York NY ","lat":"40.7483929","lon":"-73.9787906"},{"street":"619 LEXINGTON AVE New York NY ","lat":"40.7588016","lon":"-73.9704542"},{"street":"240 E 31ST ST New York NY ","lat":"40.6447249","lon":"-73.948097"},{"street":"114 E 35TH ST New York NY ","lat":"40.7473169","lon":"-73.9800724"},{"street":"230 E 60TH ST New York NY ","lat":"40.7615607","lon":"-73.9649474"},{"street":"244 E 58TH ST New York NY ","lat":"40.6492925","lon":"-73.9225408"},{"street":"619 LEXINGTON AVE New York NY ","lat":"40.7588016","lon":"-73.9704542"},{"street":"325 PARK AVE New York NY ","lat":"40.7574552","lon":"-73.9733937"},{"street":"236 E 31ST ST New York NY ","lat":"40.6448323","lon":"-73.9481079"},{"street":"308 E 55TH ST New York NY ","lat":"40.6501686","lon":"-73.9254937"},{"street":"244 E 58TH ST New York NY ","lat":"40.6492925","lon":"-73.9225408"},{"street":"244 E 58TH ST New York NY ","lat":"40.6492925","lon":"-73.9225408"},{"street":"109 E 50TH ST New York NY ","lat":"40.7570109520275","lon":"-73.9733483642645"}];

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.street + "', " + value.lat + ", " + value.lon + ");";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
