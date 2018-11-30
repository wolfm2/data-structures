## AA
![alt text](https://raw.githubusercontent.com/wolfm2/data-structures/master/week_11/aa.png)
### Interactivity
Initial location metadata and meeting times are hidden.  A user can choose to reveal them by clicking on a map marker, thus revealing a popup with meetings and a populating a div with info germane to the location.

### Data Mapping
The most important data in my opinion are the lat/lon, meeting time, meeting day, and meta information (if any).
I will show meetings for the current hour till +4 hrs.

#### Visual Components:
lat/lon: Marker on map

meeting time: Schedule appearing in popup when you click on marker

day: Determines what meetings will show

meta info: In div at lower left hand corner of map

### Data Mapping Methods
lat/lon: No processing is necessary here as the software retrieves and handles it in the data structure I pass.

meeting time: I will convert start and end times from a week based epoch and display the resulting strings.

day: I will derive a week based epoch for the current day with moment.js and use it as a query filter.

meta info: No processing necessary.  I will just take the text if any and display it in the div

### Default View
The initial view will be a map populated with time-relevant markers.

### Assumptions about user
Having done no research I am assuming that the website is focused on those with a more immediate need and no a priori preparation.  Therefore, the relevant information is limited to those factors that would get a user into an appropriate meeting as quick as possible.

## Dear Diary
![alt text](https://raw.githubusercontent.com/wolfm2/data-structures/master/week_11/diary.png)
### Interactivity
The exercise focus "[leg|arm] day" can be selected.  Once this happens, a specific instance of that day can be chosen.  

### Data Mapping
Once the above is chosen,  and the location will be listed.
#### Visual Components:
icons associated with that days exercises:  These will be highlighted 

durations:  The duration of each exercise will be listed underneath it.

exercise preparation text (if any): Listed in a div

location: Listed in a div

### Data Mapping Methods
icons associated with that days exercises:  These will be used as binary values.  If an exercise object exists, the appropriate icon will be highlighted. 

durations:  If the above is highlighted, the data will be converted from seconds to minutes (rounded) and displayed. 

exercise preparation text (if any): No modification of the data will be necessary.

location: No modification of the data will be necessary.  In fact, I only went to two gyms during the collection period.  I will likely use the zip to map between Planet Fitness' locations.

### Default View
The default view will be a desktop interface as you can see above.

### Assumptions about user
I am assuming this information would only be interesting to me.  Honestly I haven't been too motivated lately.  When this happens I tend to repeat core exercises without much change.  This interface will allow me to quickly identify if I focus on certain categories of muscles too much.

## Sensors
![alt text](https://raw.githubusercontent.com/wolfm2/data-structures/master/week_11/sensor.png)
### Interactivity
None.  You just get to experience my daily grind.

### Data Mapping
There is not much difference in accelerometer values between instances when I close the door.  There are however time differences.

As a preface, I have been very boring lately.  Since I have started sampling, I have been in one of five locations at all times with no variations I can remember. Therefore I will take the duration between door closings to visualize what my life is like.

If the delta between door closings is 91min-10hrs I will assume I was at school

If the delta between door closings is < 45min I will assume I was at Foodtown

If the delta between door closings is > 10hrs I will assume I was in CT for break

If the delta between door closings is 45-90min I will assume I was at Gym

### Data Mapping Methods

Since the sensor data proved not useful, I will only be subtracting epoch time values to get duration in seconds.

### Default View
See above.  Icons representing destinations will be arrayed around my apartment, I will animate myself running to and from each location.
A running day, hour, and minutes will be displayed on top.

### Assumptions about user
Except for Thanksgiving, I assume I always start the day at home. 
I can't imagine it will be too interesting to others if it carries on too long so I am focusing on a short term, light, novel visualization.
