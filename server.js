// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
app.set('view engine', 'pug');


const pug = require('pug');
var requestify = require('requestify');
var fs = require('fs');




// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/oldIndex", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


app.get('/test', function(req, res) {
	
  var personList = [];
  for (var i = 0; i  < 5; i++) {
    var person = {
		  			'name':"name",
		  			'address':"address",
		  			'phone':"rphone",
		  			'id':"rid"
		  		}
    personList.push(person);
  }
  console.log(personList);
	res.render('list', {"personList": personList});

	
});


function parseChapters(data)
{
  var sections = [];
  var sectionChapters = [];
  var sectionName = "";
  var newSection = true;
  var chapterNum = 1;
  var numNewLines = 0;
  var line = "";
  for (var i = 0; i < data.length; i++) {
    var letter = data[i];
    
    if (letter != '\n') {
      numNewLines = 0;
      
      if (newSection){
        sectionName += letter;
      }
      else {
        line += letter;
      }
    }
    else {
      numNewLines += 1;
      if (newSection) {
        console.log("creating section " + sectionName);
        /*linesArr.push({
          "line": sectionName,
          "lineNum": ""
        });*/
        newSection = false;
      }
      else if (numNewLines == 1) {   
        console.log("chapter " + chapterNum);
        sectionChapters.push({
          "name": line,
          "chapterNum": chapterNum
        });
        chapterNum += 1;
        line = "";
      }
      else if (numNewLines > 2) {
        sections.push({
          "sectionName": sectionName,
          "sectionChapters": sectionChapters
        });
        console.log("new section");
        newSection = true;
        sectionName = "";
        sectionChapters = [];
      }
    }
  }
  return sections;
}


app.get('/', function(req, res) {
  
  var chapterTitlesFile = ".data/chapterTitles.txt";

  var chapterTitles = fs.readFile(chapterTitlesFile ,'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    //console.log(data);
    
    var sections = parseChapters(data);
    res.render('chapter-list', {"sections": sections});
  });
  
  /*var chapterList = [];
  for (var i = 0; i  < 100; i++) {
    chapterList.push(i+1);
  }
	  res.render('chapter-list', {"chapterList": chapterList});
   */
});


app.get('/chapter/:id', function(req, res) {
  
  var url = 'http://www.sefaria.org/api/texts/Shulchan_Arukh,_Orach_Chayim.' + req.params.id;
 requestify.get(url).then(function(response) {
    // Get the response body
   var response = response.getBody();
   var heSectionRef = response["heSectionRef"]
   var hebrewText = response["he"];
   var hebrewTextFormatted = [];
   for (var i = 0; i  < hebrewText.length; i++) {
     var line = hebrewText[i];
     //var line = line.replace(/<[^>]*>/g, "");
     //var line = line.replace(/</g, "&lt;");
     //var line = line.replace(/>/g, "&gt;");
     var line = line.replace(/small/g, "i");
     hebrewTextFormatted.push({
       "text": line,
       "lineNum": i + 1
     });
   }
   
	 res.render('hebrew-list', {"hebrewText": hebrewTextFormatted});
   
   
});


	
});