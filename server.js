// server.js
// where your node app starts

// init project
const bodyparser = require('simple-bodyparser');
var express = require('express');
var app = express();
app.set('view engine', 'pug');
app.use(bodyparser());

const pug = require('pug');
var fs = require('fs');
var request = require("request");

var timeUtil = require('./js/timeUtil');
var functions = require('./js/functions');

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


// TEST
//////////
app.get('/test', function(req, res) {
	
  console.log(timeUtil.getNow());

  res.render("error");
	
});


app.get('/', function(req, res) {

  var addPoints = 0;
  if (req.query.completedQuestion) {
    addPoints = 0.5;
  }
  
  functions.getPoints(1, addPoints, function(userPoints){ 

    var todaysQuestionNumber = functions.getTodaysRandomNumber();
    
    functions.getQuestion(todaysQuestionNumber, req.query.random_question, function(questionText){
      var chapterTitlesFile = "data/chapterTitles.txt";
      fs.readFile(chapterTitlesFile ,'utf8', function (err,data) {

        var sections = functions.parseChapters(data);

        res.render('index', {
          "questionText": questionText,
          "sections": sections,
          "userPoints": userPoints
        });

      });

    }); 
    
  });

});


app.get('/chapter/:id', function(req, res) {
  
  var url = 'http://www.sefaria.org/api/texts/Shulchan_Arukh,_Orach_Chayim.' + req.params.id;

  console.log(url);

  request(url, function (error, response, body) {

    body = JSON.parse(body);
    var heSectionRef = body["heSectionRef"]
    var hebrewText = body["he"];

    var commentary = functions.getCommentary(body, "Mishnah Berurah", function(commentaryList) {

      var hebrewTextFormatted = functions.formatHtmlHebrew(hebrewText);
      var hebrewTextData = functions.addCommentaryToVerses(hebrewTextFormatted, commentaryList);

      res.render('chapter', {
       "hebrewText": hebrewTextData
      });

    });

  });
	
});


app.post('/translate', function(req, res) {
  var body = req.body;
  var params = body.split("&");
  var wordParam = params[0];
  var keyVal = wordParam.split("=");
  var word = keyVal[1];
  var translateUrl = "http://www.morfix.co.il/en/" + word;
  res.redirect(translateUrl);
});