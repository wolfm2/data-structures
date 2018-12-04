//~ create server
//~ include templates
//~ read from file

se_he = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Final Projects</title>
    <style>
				#run {
					width: 100px;
					position: absolute;
					top: 150px;
					left: 0px;
				}
				.left {
					width: 100px;
					z-index: 2;
				}
				.right {
					width: 100px;
				}
    </style>
  </head>
  <body>
	<div id="time"></div>
	<hr>
  <img id="run" src="img/run-1.gif">
  <img class="left" src="img/home.png">
  <img class="right" src="img/school.png">
  <img class="right" src="img/store.png">
  <img class="right" src="img/workout.png">
  <img class="right" src="img/ct.png">
  </body>
  <script src="js/jquery.min.js"></script>
  <script>
		var sEpoch = 1542220527 - (5 * 60) - 27;	// start
		var eEpoch = 1544749431;	// end
	  var cEpoch = sEpoch;			// current
	  
	  var trig = 0;  // trigger time to leave home
	  var dest = 0;  // where to go
	  var dur = 0;	// how long to stay there
		var lastTrig = 0;
		var iSrcIdx = 1;
		
		var t = 1542220527;
		var hr = 60 * 60;
		var day = hr * 24;
		
		var data = `;
		
		var se_fo = `;
		
		var gIdx = 0;  // global data index
		
		function update() {
			if (dest != 0) {
				trig += dur;
				dest = 0; // going home
				dur = 0;	
			}	else {
				trig = data[gIdx][0];
				dest = data[gIdx][1];
				dur = data[gIdx][2];
				gIdx += 1;
			}
		}
		
		function animate() {
				if (cEpoch > trig && lastTrig != trig) {
					
					iSrcIdx *= -1; // change animation
					$("#run").attr("src", "img/run" + iSrcIdx + ".gif")
					
					lastTrig = trig;
					
					sLoc = (100 * dest) + 20 + 'px';
					console.log(sLoc);
					
					if (dest != 0) {
						$(".right").eq(dest-1).css("z-index","-1");
						$(".right").css("z-index","3");
					}
					
					$("#run").animate({
						left: sLoc,
						}, 1000); 
						
					//~ trig += dur;
					//~ dest = 0; // going home
					//~ dur = 0;		
					
					update();
				}
		}
		
		function showTime() {
			strDate = new Date(cEpoch * 1000 + (5 * hr));
			//console.log(strDate);
			$("#time").html(strDate);
			cEpoch += 10 * 60; // 10min
			if (cEpoch > eEpoch) {
				cEpoch = sEpoch;
				gIdx = 0;
				$("#run").animate({
						left: 0,
						}, 1000); 
				$("#run").attr('src', 'img/fin.png'); 
				$("#time").css('display', 'none');
			}
			animate();
		}
		
		setInterval(showTime, 50);
		
		update()
		
  </script>
</html>
`;

var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'wolfm2';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var fs  = require("fs");
var array = fs.readFileSync('tools/data/se.dat').toString().split('\n');

var min = 60;
var hr = min * 60;
var day = hr * 24;

// respond to requests for /sensor
app.get('/se', function(req, res) {
  var dArr = []; // data array
  
	var weekday = new Array(7);
	weekday[0] =  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

// function test() {	
	array.forEach((d,i) => {
		if (i%2 == 1 || i > array.length - 2) // if odd or done
		  return;
		
		console.log(i);  
		from = (JSON.parse(d.replace(/'/g, "\"")).t) - 5 * hr;
		to = (JSON.parse(array[parseInt(i)+1].replace(/'/g, "\"")).t) - 5 * hr;
		console.log('from: ', weekday[new Date(from * 1000).getDay()], new Date(from * 1000));
		console.log(from + 5 * hr);
		console.log('to: ',   weekday[new Date(to   * 1000).getDay()], new Date(to * 1000));
		console.log(to + 5 * hr);
		
		var delta = to - from;
		if (delta < 45 * min) console.log("foodtown");
		if (delta >= 45 * min && delta < 1.5 * hr) console.log("gym");
		if (delta >= 1.5 * hr && delta < 10 * hr) console.log("school");
		if (delta >= 10 * hr) console.log("thanksgiving");
		
		// trigger, dest, duration
		if (delta < 45 * min) dArr.push([from + (5*hr), 2, delta]);
		if (delta >= 45 * min && delta < 1.5 * hr) dArr.push([from + (5*hr), 3, delta]);
		if (delta >= 1.5 * hr && delta < 10 * hr) dArr.push([from + (5*hr), 1, delta]);
		if (delta >= 10 * hr) dArr.push([from + (5*hr), 4, delta]);
		
		console.log('min: ' + delta / min);
		console.log('-------------------------------');
		
	});
	
	
	res.send(se_he + JSON.stringify(dArr) + se_fo);
//}
//test()
});

app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
    var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             AVG(sensorValue::int) as num_obs
             FROM sensorData
             GROUP BY sensorday
             ORDER BY sensorday;`;

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
    var thisQuery = `SELECT mtgaddress, mtglocation as location, json_agg(json_build_object('day', mtgday, 'time', mtgtime)) as meetings
                 FROM aadata 
                 WHERE mtgday = 'Tuesday' and mtghour >= 19 
                 GROUP BY mtgaddress, mtglocation
                 ;`;

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
        TableName: "aarondiary",
        KeyConditionExpression: "#tp = :topicName", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#tp": "topic"
        },
        ExpressionAttributeValues: { // the query values
            ":topicName": { S: "cats" }
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
