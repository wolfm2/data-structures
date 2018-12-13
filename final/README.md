## EC2 Site links for all projects
http://54.146.142.168:8080/ (or click on screenshots below)

## AA Project

[![AA Project](img/aa.png)](http://54.146.142.168:8080/aa)

# Goals

My use case was to provide the most near-term (chronologically) help to seekers of AA information as possible.  

# What It Does

To the above end, the map starts in a mode which shows all meetings from current time and for a 6hr window.  I started the project with a 4hr window but as I tested this left a handful of maps with very few markers.  Upping the window to 6hrs seemed a reasonable compromise.  I originally intended to put meeting times in the pop-up bubble but this was too messy for places with several meetings.  I therefore moved all meeting information to the DIV on the right and used the pop-up for title and meta-information (if it existed).

Pop-ups of course respond to clicking, and the meeting information is filled in on a map marker hover event.

# Binding Methods

Since this project was envisioned to be more static, I used a technique very close to the one outlined in class. I have an upper and lower half of HTML that I sew together around the JSON data structure returned from the RDB query.  Additionally I pulled out all the code into a separate js file to constrain the complexity of using the code in the string templates therefore allowing easier debugging.  

At the lowest level, (see server code below) I kept the JSON return structure as small and simple as possible by combining relevant address and meta info strings into one string.  The only string attribute which necessarily remained un-concatenated was title, as I used this in both the DIV and popup.



Mapped Data From server.js:

return {"lat":d.lat, "lon":d.long, "beg":d.tbeg, "end":d.tend, "typ":d.ttype, "title":d.title, "meetings": "<br>" + d.address + "<br>" + d.meta + "<br>" + d.details + "<br>Wheelchair Access: " + wchair};


# Issues

Several!  There were the handful of bugs which you might expect.  Working on the client code before I separated it from the template was very error-prone.  While I fixed several incorrect lat/lon lookups before I inserted the data into RDB, mapping revealed (at least) one (Citibank Center) which I did not catch.  These last minute ones I remediated in the server code.

The most unexpectedly worst one, which would have pointed to a more fundamental parsing error with my code, was luckily a problem with the source material.  Zone 4 (4 W 43RD) has a meeting starting at 12:30am and ending at 1:30pm!   

Other than this, the node code was not the most reliable.  I had to build in several error handlers as one in twenty INSERTs would usually fail.  I handled most by successful re-INSERTing but a few stragglers required some manual attention.  In the end, all rows have been successfully entered into the database.


## Sensor Project

[![Sensor Project](img/sensor.png)](http://54.146.142.168:8080/se)

## Diary Project

[![Diary Project](img/diary.png)](http://54.146.142.168:8080/di.html)
