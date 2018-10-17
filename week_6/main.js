// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('out_05.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

data = [];

// look for td element with unique style attribute
$('td[style="border-bottom:1px solid #e3e3e3; width:260px"]').each(function(i, elem) {
	$(elem).find('h4,b,br,div,span,img').remove();  // remove non-address elements
	// del tabs/nl, del multiple spaces, del padding spaces
	var text = $(elem).text().replace(/[\t\n]+/g, '').replace(/ +/g, " ").trim();
	data.push({'location':text});
    // console.log("'" + text + "'");
});

fs.writeFileSync('data.json', JSON.stringify(data));
