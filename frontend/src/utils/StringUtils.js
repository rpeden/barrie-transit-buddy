import moment from '../../vendor/moment-timezone';

export let toTitleCase = function(origStr) {
  var i, j, str, lowers, uppers;
  str = origStr.replace(/([^\W_]+[^\s-\/]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
  'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
      function(txt) {
        return txt.toLowerCase();
      });

  // Certain words such as initials or acronyms should be left uppercase
  uppers = ['Id', 'Tv', 'Rvh'];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
      uppers[i].toUpperCase());

  return str;
}

export const toMinutesFromNow = (futureDate) => {
  const currentTime = moment.tz('America/Toronto');
  let timeDiffSeconds = Math.floor(futureDate.diff(currentTime) / 1000);
  const timeDiffHours   = Math.floor(timeDiffSeconds / 3600);
  //floor because we already account for extra minutes
  //probably ok to just round here and avoid seconds check elsewhere
  //but write tests to verify
  const timeDiffMinutes = Math.floor((timeDiffSeconds - (3600*timeDiffHours))/ 60);


  const diffString = `${timeDiffHours > 0 ? `${timeDiffHours}h ` : ''}` +
      `${timeDiffMinutes} min`;
  return diffString;
}

export const timeToLocalDate = (timeString, delay=0) => {
  const timeSplit = timeString.split(':');

  let tz = moment.tz('America/Toronto').hours(timeSplit[0])
      .minutes(timeSplit[1])
      .add(delay, 'seconds');

  if(timeSplit.length > 2) {
    tz.seconds(timeSplit[2]);
  }

  return tz;
}

export const pluralize = (count, singular, plural) => {
  if(count == 1) {
    return singular;
  }
  return plural;
}
