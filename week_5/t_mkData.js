var diaryEntries = [];

class DiaryEntry {
	
  constructor(begin, duration, prep, bagel, exercises, exerDuration, location) {
    this.startEpochPK = {};
    this.startEpochPK.N = String(begin);
    
    this.duration = {};
    this.duration.N = String(duration);
    
    if (prep != null) {
			this.prep = {};
			this.prep.SS = prep;
		}
    
	  if (bagel != null) {
			this.bagel = {};
	    this.bagel.SS = bagel;
		}
    
    this.exercises = {};
    this.exercises.SS = exercises;
    
    this.exerDuration = {};
    for (var idx = 0; idx < exerDuration.length; idx++)
      exerDuration[idx] = String(exerDuration[idx]);
    this.exerDuration.NS = exerDuration;
    
    this.address = {};
    this.address.S = location.address;
    this.city = {};
    this.city.S = location.city;
    this.state = {};
    this.state.S = location.state;
    this.zip = {};
    this.zip.N = location.zip
   
  }
}

curEpoch = 1539204661; 
sd = 60 * 60 * 24 // sec in day
// Exercises - these would in reality have somewhat variable duration/reps

// Good idea but RDS can't do nested objects - redo as key/value pair. 
// actually, the feature was added a couple years back.  looking for reference.

//~ russianTwist = {'name':'russian twist', 'reps', '80'} 
//~ legLift = {'name':'leg lifts', 'reps', '40'}
//~ skullcrushers =  {'name':'skullcrushers', 'reps', '60'}
//~ eliptical = {'name':'eliptical', 'duration', '45'}

// locations
bedstuy = {'address':'1245 Fulton St.', 'city':'Brooklyn', 'state':'NY', 'zip':'11216'}
newschool ={'address':'22 E 14th St.', 'city':'New York', 'state':'NY', 'zip':'10003'}

diaryEntries.push(new DiaryEntry(curEpoch, 60, ['drank water', 'reviewed russian twist'], ['everything'], ['legLift', 'russianTwist', 'skullcrushers'], [23,21,11],  bedstuy));
diaryEntries.push(new DiaryEntry(curEpoch + sd, 45, null, null, ['legLift', 'skullcrushers'], [21,11], bedstuy));
diaryEntries.push(new DiaryEntry(curEpoch + sd*3, 80, ['drank water'], ['plain'], ['russianTwist', 'eliptical'], [23, 60], bedstuy));
diaryEntries.push(new DiaryEntry(curEpoch + sd*5, 50, ['stretched', 'drank water'], null, ['russianTwist', 'skullcrushers'], [21, 11], newschool));
diaryEntries.push(new DiaryEntry(curEpoch + sd*6, 60, ['protein shake', 'ate tofu'], null, ['eliptical', 'skullcrushers'], [45, 12], bedstuy));

console.log(JSON.stringify(diaryEntries));
