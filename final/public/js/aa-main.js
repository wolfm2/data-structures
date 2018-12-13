function GetTimeStr(date_obj) {
  // formats a javascript Date object into a 12h AM/PM time string
  var hour = date_obj.getHours();
  var minute = date_obj.getMinutes();
  var amPM = (hour > 11) ? "pm" : "am";
  if(hour > 12) {
    hour -= 12;
  } else if(hour == 0) {
    hour = "12";
  }
  if(minute < 10) {
    minute = "0" + minute;
  }
  return hour + ":" + minute + amPM;
}

var timeDict = {}; // meeting times by latlong

function showData(e) {
	var ll = this.getLatLng();
	var key = ll['lat'].toString() + ll['lng'].toString();
	console.log(timeDict[key]);
	var html = `<b>Meetings in time period specified: ${data.length}</b><br><br>Meeting Place/Time/Type:<br>${timeDict[key]}`;
	document.getElementById("meetings").innerHTML = html;
}
  
var mymap = L.map('mapid').setView([40.7829,-73.9654], 11);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox.streets',
		// accessToken: 'your.mapbox.access.token'
		accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
}).addTo(mymap);

data.forEach((d,i) => {
	// correcting for bad data
  if (d.title.toLowerCase().includes("citicorp center")) {
		d.lat = 40.7583;
		d.lon = -73.9702;
		}
	L.marker([d.lat, d.lon])
		.bindPopup(d.title + d.meetings).addTo(mymap)
		.on('mouseover', showData);
	var key = d.lat.toString() + d.lon.toString();
	if (!(key in timeDict)) {
		timeDict[key] = d.title + "<br>";
		// timeDict[key] = d.title;
	} 
	timeDict[key] += GetTimeStr(new Date(d.beg*1000)) + " " + GetTimeStr(new Date(d.end*1000)) + " " + d.typ + "<br>";
});

var html = `<b>Meetings in time period specified: ${data.length}</b><br><br>Hover over markers for meetings.<br>Click for location information.`;
document.getElementById("meetings").innerHTML = html;
