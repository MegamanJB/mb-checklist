module.exports = {
  parseChapters: parseChapters,
  getTodaysRandomNumber: getTodaysRandomNumber,
  getChapterText: getChapterText,
  getQuestion: getQuestion,
  getCommentary: getCommentary,
  formatHtmlHebrew: formatHtmlHebrew,
  addCommentaryToVerses: addCommentaryToVerses,
  updatePointsBasedOnLastLoggedIn: updatePointsBasedOnLastLoggedIn,
  getPoints: getPoints,
  writeData: writeData
};

const USER_DATA_FILE = 'data/userInfo.json';

var timeUtil = require('./timeUtil');

var fs = require('fs');


function parseChapters(data)
{
  var sections = [];
  var sectionChapters = [];
  var sectionName = "";
  var sectionNum = 1;
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
        newSection = false;
      }
      else if (numNewLines == 1) {   
        // console.log("chapter " + chapterNum);
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
          "sectionNum": sectionNum,
          "sectionChapters": sectionChapters
        });

        newSection = true;
        sectionNum += 1;
        sectionName = "";
        sectionChapters = [];
      }
    }
  }
  return sections;
}

function getTodaysRandomNumber(maxRandomNum)
{
  var midnight = timeUtil.getMidnight();
  var midnightTime = midnight.getTime();
  
  var todaysRandomNumber = 1;
  while (midnight > 1) {
    var firstDigit = midnight % 10;
    if (firstDigit > 0) {
      todaysRandomNumber = ((todaysRandomNumber + firstDigit) * firstDigit);
    } 
    midnight = Math.floor(midnight / 10);
  }
  
  return todaysRandomNumber;
}


function getChapterText(chapterNum)
{
  return "chapter text " + chapterNum;
}


function getQuestion(todaysQuestionNumber, isRandom, callback)
{
  var questionsFile = 'data/mbChelek1Questions.csv';
  var chapterTitles = fs.readFile(questionsFile ,'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    // console.log(data);
    
    var questions = data.split('\n');
    var numQuestions = questions.length;
    
    if (todaysQuestionNumber > numQuestions) {
      todaysQuestionNumber = todaysQuestionNumber % numQuestions;
    }
    
    if (isRandom) {
      todaysQuestionNumber = Math.floor(Math.random() * numQuestions) + 1;
    }
    
    var questionLine = questions[todaysQuestionNumber];
    var question = todaysQuestionNumber + ": " + questionLine.substr(questionLine.indexOf(',') + 1)
    
    callback(question);
    
  });
}

function getCommentary(response, getBookTitle, callback)
{
  var allCommentary = response["commentary"];
  var matchingCommentary = [];
  
  for (var i = 0; i  < allCommentary.length; i++) {
    var commentary = allCommentary[i];
    if (commentary["index_title"] == getBookTitle) {
      matchingCommentary.push({
        title: commentary["ref"],
        text: commentary["he"],
        splitText: commentary["he"].split(' '),
        referenceVerse: commentary["anchorVerse"]
      });
    }
  }

  callback(matchingCommentary);
}

function formatHtmlHebrew(hebrewText)
{
  var hebrewTextFormatted = [];
  for (var i = 0; i  < hebrewText.length; i++) {
     var line = hebrewText[i];
     var line = line.replace(/small/g, "i");
     hebrewTextFormatted.push({
       "text": line,
       "verseNum": i + 1
     });
  }
  return hebrewTextFormatted;
}

function addCommentaryToVerses(hebrewText, commentaryList)
{
  var commentaryVerseMap = {};
  for (var i = 0; i  < commentaryList.length; i++) 
  {
    var comment = commentaryList[i];
    var commentVerse = comment.referenceVerse;
    if (!(commentVerse in commentaryVerseMap)) {
      commentaryVerseMap[commentVerse] = [];
    }
    commentaryVerseMap[commentVerse].push(comment);
  }
  
  
  for (var i = 0; i  < hebrewText.length; i++) 
  {
    var verseData = hebrewText[i];
    var verseNum = verseData.verseNum;
    if (verseNum in commentaryVerseMap) {
      hebrewText[i].commentary = commentaryVerseMap[verseNum];
    }
    else {
      hebrewText[i].commentary = [];
    }
  }
  
  return hebrewText;
}

function updatePointsBasedOnLastLoggedIn(points, lastLoggedIn)
{
  const MS_PER_DAY = 86400000;
  
  var today = timeUtil.getMidnight();
  
  var loggedInDate = new Date(lastLoggedIn);
  
  var dateDiff = (today - loggedInDate) / MS_PER_DAY;
  
  if (dateDiff == 1) {
    points += 1;
  }
  else if (dateDiff > 1) {
    points -= (dateDiff - 2);
  }
  
  return points || 1;
}

function getPoints(userId, addPoints, callback)
{
  fs.readFile(USER_DATA_FILE ,'utf8', function (err,data) {
    data = JSON.parse(data);

    if (!(userId in data)) {
      data[userId] = {
        "lastLoggedIn": null,
        "points": 0
      };
    }
    
    var userData = data[userId];
    var lastLoggedIn = userData["lastLoggedIn"];
    var points = userData["points"];
    
    points = updatePointsBasedOnLastLoggedIn(points, lastLoggedIn);
    
    if (addPoints) {
      points += addPoints;
    }
    
    callback(points);
    
    data[userId] = {
      "lastLoggedIn": timeUtil.todayLocalString(),
      "points": points
    };
    
    writeData(data);
    
  });
}

function writeData(fileData)
{
  fileData = JSON.stringify(fileData);
  
  fs.writeFile(USER_DATA_FILE, fileData, function (err) {
    console.log("wrote: " + fileData);
      if (err) {
        return console.log(err);
      }
  });
  
}