var request = require('request');
const { Client } = require('pg');

// PARTICLE PHOTON
var device_url = 'https://api.particle.io/v1/devices/3d0027000647373034353237/json?access_token=3cec1fb82142abe2656b32f67585872d691c581d';

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'wolfm2';
db_credentials.host = 'instance.ce54cjiwuvvo.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

lastTime = 0;

var getAndWriteData = function() {
    
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {
        
        var b = JSON.parse(JSON.parse(body).result);
        var z = b.z; // z axis 
        var t = b.t; // UNIX epoch time
        // console.log(b, z, t);

				if (t == lastTime || t == undefined) { // return if no new event or timeout
					return;
				}
			
				lastTime = t; // update time
				
				console.log('Inserting...');
        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        var thisQuery = "INSERT INTO sensorData VALUES (" + z + ", " + t + " );";
        console.log(thisQuery); // for debugging

        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
    });
};

// write a new row of sensor data every minute - not always writing to DB
setInterval(getAndWriteData, 60000);
