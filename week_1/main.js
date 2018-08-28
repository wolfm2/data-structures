// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

var url_base = 'https://parsons.nyc/aa/m';

function my_req(url_base, idx) {
  
  var sidx = String(idx);
  if (sidx.length < 2)
    sidx = '0' + sidx;
   
  var url = url_base + `${sidx}.html`
  request(url, function(error, response, body){
    
    if (!error && response.statusCode == 200) {
        fs.writeFileSync(`data/out_${sidx}.txt`, body);
    }
    else {console.log(`Request failed for ${url}!`);}
  });

}

for (var idx = 10; idx > 0; idx--) {
  my_req(url_base, idx);
}
