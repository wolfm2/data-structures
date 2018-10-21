const { Client } = require('pg');
var async = require('async');
var fs = require('fs');

function getSec(time) { // sec from midnight
    return Date.parse(`1/1/70 ${time}`) / 1000;
}

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'wolfm2'; //182
// db_credentials.host = 'dsdemo.c2g7qw1juwkg.us-east-1.rds.amazonaws.com';
// db_credentials.host = 'mydb.ce54cjiwuvvo.us-east-1.rds.amazonaws.com';
db_credentials.host = 'instance.ce54cjiwuvvo.us-east-1.rds.amazonaws.com'; // had to create it twice.

db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// (address varchar(100), meta varchar(300), title varchar(100), wchair varchar(1), day varchar(10), 
//  tbeg int, tend int, ttype varchar(2), lat double precision, long double precision, details varchar(300));";

var addressesForDb = JSON.parse(fs.readFileSync('data/d10.json', 'utf8')); // increment manually

async.eachSeries(addressesForDb, function(v, callback) {
    v.meetings.forEach((d) => {  // array day time time type
      const client = new Client(db_credentials);
      client.connect();
      
			var tbeg = getSec(d[1]);
			var tend = getSec(d[2]);
			// if (v.lat == undefined) v.lat = 0;
			// if (v.lon == undefined) v.lon = 0;
			if (v.adrMeta == undefined) v.adrMeta = [''];
			var adrMeta = v.adrMeta.join().replace(/'/g, '\'\''); // sql escape for '
			if (v.details == undefined) v.details = [''];
			var details = v.details.replace(/'/g, '\'\'');
			var title = v.title.replace(/'/g, '\'\'');
			wheelc = v.wheelc=='true'?'1':'0';
			
	    var thisQuery = `INSERT INTO aalocations VALUES (E'${v.address}', '${adrMeta}', '${title}', '${wheelc}', '${d[0]}', ${tbeg}, ${tend}, '${d[3]}', ${v.lat}, ${v.lon}, '${details}');`;
			console.log (thisQuery);
	    client.query(thisQuery, (err, res) => {
	        console.log(err, res);
					client.end();
	    });
		});
    setTimeout(callback, 1000); 
}); 
