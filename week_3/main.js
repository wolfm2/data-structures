// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request'); 

var apiKey = process.env.TAMU_KEY; 

var content = fs.readFileSync('out_05.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// Static part of url
var baseUrl = "https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?city=New%20York&state=NY&format=json&version=4.01&"
var apiKey = process.env.TAMU_KEY;

var delay = 0;

function callback (url, last) {
	console.log(url);
	request(url, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            sa = tamuGeo["InputAddress"]["StreetAddress"];
            lat = tamuGeo["OutputGeocodes"][0]["OutputGeocode"]["Latitude"];
            lon = tamuGeo["OutputGeocodes"][0]["OutputGeocode"]["Longitude"];
            // timer cb write to global works in js but not in node
            // data.push({"street":sa,"lat":lat,"lon":lon});
            fs.appendFileSync('data.json', JSON.stringify({"street":sa,"lat":lat,"lon":lon}));
            if (last)
				fs.appendFileSync('data.json', ']');  // close JSON at end
			else
				fs.appendFileSync('data.json', ',');  // or put a comma between objs
            // console.log(sa+lat+lon);
        }
    });
}

fs.writeFileSync('data.json', '[');

// look for td element with unique style attribute
selected = $('td[style="border-bottom:1px solid #e3e3e3; width:260px"]');
selLen = selected.length;
selected.each(function(i, elem) {
	$(elem).find('h4,b,br,div,span,img').remove();  // remove non-address elements
	// del tabs/nl, del multiple spaces, del padding spaces
	var text = $(elem).text().replace(/[\t\n]+/g, '').replace(/ +/g, " ").trim();
	
	// String cleanup.  
	text = text.replace(/ Ave[\w\W]+/, ' Ave.'); // Greedy match Avenue
	text = text.replace(/ St[\w\W]+| ST[\w\W]+/, ' St.'); // Greedy match Street
	
	text = text.replace(/ /g, '%20'); // URLify spaces
	
	url = `${baseUrl}streetAddress=${text}&apikey=${apiKey}`;

	setTimeout(callback, 1000*delay++, url, i == selLen-1); // call URLs slowly, increase delay, notify of last element
	//data.push({'location':text});
    //console.log("'" + url + "'");
});


