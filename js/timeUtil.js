module.exports = {
  formatDateYYYYMMDD: formatDateYYYYMMDD,
  getMidnight: getMidnight,
  getNow: getNow,
  todayLocalString: todayLocalString
};

const LOCAL_OFFSET_FROM_UTC = -5;

function formatDateYYYYMMDD(date)
{
  return date.getFullYear() + "-" + 
    ("0" + (date.getMonth() + 1)).slice(-2) + "-" + 
    ("0" + date.getDate()).slice(-2);
}

function getMidnight()
{
  return new Date(todayLocalString());
}

function getNow()
{
  var now = new Date();
  now.setHours(now.getHours() + LOCAL_OFFSET_FROM_UTC);
  return now;
}

function todayLocalString()
{
  return formatDateYYYYMMDD(getNow());
}

