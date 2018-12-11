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
			strDate = new Date((cEpoch - (6 * hr)) * 1000);
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
db_credentials.host = 'instance.ce54cjiwuvvo.us-east-1.rds.amazonaws.com';
db_credentials.database = 'mydb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var fs  = require("fs");
var array; // the testfile = fs.readFileSync('tools/data/se.dat').toString().split('\n');

var min = 60;
var hr = min * 60;
var day = hr * 24;

function prepData(rows) {
  var dArr = []; // data array
  
	var weekday = new Array(7);
	weekday[0] =  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	
	array = rows;
// function test() {	
	array.forEach((d,i) => {
		if (i%2 == 1 || i > array.length - 2) // if odd or done
		  return;
		
		console.log(i);  
		// for testfile
		// from = (JSON.parse(d.replace(/'/g, "\"")).t) - 5 * hr;
		// to = (JSON.parse(array[parseInt(i)+1].replace(/'/g, "\"")).t) - 5 * hr;
		// for db
		from = d.sensortime;
		to = array[parseInt(i)+1].sensortime;
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
	
	return(dArr);
}

// respond to requests for /sensor
app.get('/se', function(req, res) {
	
	const client = new Pool(db_credentials);
	var q = `SELECT sensortime FROM sensorData WHERE sensortime >= 1542220527;`;

	client.connect();
	client.query(q, (qerr, qres) => {
			if (qerr) { throw qerr }
			else {
					// res.send(qres.rows);
					console.log(qres.rows);
					var dArr = prepData(qres.rows);
					console.log(dArr);
					res.send(se_he + JSON.stringify(dArr) + se_fo);
					client.end();
					console.log('1) responded to request for sensor data');
			}
	});
});

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
    var q = `SELECT sensortime FROM sensorData WHERE sensortime >= 1542220527;`;

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

// create templates
var aa_he = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="utf-8">
	  <title>AA Meetings</title>
	  <meta name="description" content="Meetings of AA in Manhattan">
	  <meta name="author" content="AA">
	  <!-- <link rel="stylesheet" href="css/styles.css?v=1.0"> -->
	  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
	   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
	   crossorigin=""/>
	</head>
	<body>
		<table>
			<tr>
				<td>
				<div id="mapid" style="width: 600px; height: 400px;"></div>
				</td>
				<td style="text-align: left; vertical-align: top; background: LIGHTBLUE; padding: 10px;">
				<div id="meetings">this is a <br>test</div>
				</td>
			</tr>
		</table>
	
	  <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
	   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
	   crossorigin=""></script>
	  <script>
	  var data = 
  `;
  
var aa_fo = `;
	</script>
  <script src="js/aa-main.js"></script>
	</body>
	</html>`;
    
// respond to requests for /aameetings
app.get('/aa', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    var thisQuery = `SELECT mtgaddress, mtglocation as location, json_agg(json_build_object('day', mtgday, 'time', mtgtime)) as meetings
                 FROM aadata 
                 WHERE mtgday = 'Tuesday' and mtghour >= 19 
                 GROUP BY mtgaddress, mtglocation
                 ;`;
    
    var hr = 60 * 60;
    var now = new Date()
    var startT = parseInt(now.getTime() / 1000)  % (24 * hr);  // get sec since day started
    var endT = startT + (6 * hr) // 4hrs
    endT %= 24*hr; // Not many meetings close to midnight but just to cover the edge case...
    
    var days = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
		// var dayName = days[now.getDay()];
		// bound to EST
		var dayName = days[new Date(now.getTime() - (5 * hr * 1000)).getUTCDay()];
    
		var q = `SELECT lat, long, title, address, meta, details, wchair, tbeg, tend, ttype FROM aalocations WHERE day = '${dayName}' and tbeg >= ${startT} and tbeg < ${endT};`;
    console.log(q);
             
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
					  console.log(qres.rows);
            // res.send(qres.rows);
            // test [{lat:'40.734636', lon:'-73.994997', meetings:'stuff'}]
            var mappedData = qres.rows.map((d,i) => {
							var wchair = d.wchair=='0'?'No':'Yes';
							return {"lat":d.lat, "lon":d.long, "beg":d.tbeg, "end":d.tend, "typ":d.ttype, "title":d.title, "meetings": "<br>" + d.address + "<br>" + d.meta + "<br>" + d.details + "<br>Wheelchair Access: " + wchair};
						});
            res.send(aa_he + JSON.stringify(mappedData) + aa_fo);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});


// respond to requests for /deardiary
app.get('/dd-core', function(req, res) {

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
        
        
        KeyConditionExpression: "dayt = :dayt and startEpochPK > :sEpoch", // the query expression
				//FilterExpression: 'zip = :zip',
				ExpressionAttributeValues: { // the query values
						":dayt": {S: "core"},
		        ":sEpoch": {N: String(0)},
		        //":zip": {N: String(11216)}
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

// respond to requests for /deardiary
app.get('/dd-leg', function(req, res) {

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
        
        
        KeyConditionExpression: "dayt = :dayt and startEpochPK > :sEpoch", // the query expression
				//FilterExpression: 'zip = :zip',
				ExpressionAttributeValues: { // the query values
						":dayt": {S: "leg"},
		        ":sEpoch": {N: String(0)},
		        //":zip": {N: String(11216)}
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

// respond to requests for /deardiary
app.get('/dd-arm', function(req, res) {

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
        
        
        KeyConditionExpression: "dayt = :dayt and startEpochPK > :sEpoch", // the query expression
				//FilterExpression: 'zip = :zip',
				ExpressionAttributeValues: { // the query values
						":dayt": {S: "arm"},
		        ":sEpoch": {N: String(0)},
		        //":zip": {N: String(11216)}
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
