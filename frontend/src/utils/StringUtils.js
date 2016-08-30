import moment from "../../vendor/moment-timezone";

export const toTitleCase = function (origStr) {
  let str = origStr.replace(/([^\W_]+[^\s-\/]*) */g, (txt) => {
    const firstCharPos = 0;
    const substCharPos = 1;
    return txt.charAt(firstCharPos).toUpperCase() + txt.substr(substCharPos).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  const lowers = ["A", "An", "The", "And", "But", "Or", "For", "Nor", "As", "At",
  "By", "For", "From", "In", "Into", "Near", "Of", "On", "Onto", "To", "With"];
  for (let i = 0, j = lowers.length; i < j; i++) {
    str = str.replace(new RegExp(`\\s${lowers[i]}\\s`, "g"),
      (txt) => {
        return txt.toLowerCase();
      });
  }

  // Certain words such as initials or acronyms should be left uppercase
  const uppers = ["Id", "Tv", "Rvh"];
  for (let i = 0, j = uppers.length; i < j; i++) {
    str = str.replace(new RegExp(`\\b"${uppers[i]}\\b`, "g"),
      uppers[i].toUpperCase());
  }
  return str;
};

export const toMinutesFromNow = (futureDate) => {
  const currentTime = moment.tz("America/Toronto");
  const millisPerSecond = 1000;
  const secondsPerHour = 3600;
  const secondsPerMinute = 60;

  const timeDiffSeconds = Math.floor(futureDate.diff(currentTime) / millisPerSecond);
  const timeDiffHours = Math.floor(timeDiffSeconds / secondsPerHour);
  //floor because we already account for extra minutes
  //probably ok to just round here and avoid seconds check elsewhere
  //but write tests to verify
  const timeDiffMinutes = Math.floor(
      (timeDiffSeconds - (secondsPerHour * timeDiffHours)) / secondsPerMinute);

  const minimumDiffHours = 1;
  const diffString = `${timeDiffHours >= minimumDiffHours ? `${timeDiffHours}h ` : ""}` +
      `${timeDiffMinutes} min`;
  return diffString;
};

export const timeToLocalDate = (timeString, delay) => {
  const defaultDelay = 0;
  const timeSplit = timeString.split(":");

  const hourPosition = 0;
  const minutePosition = 1;
  const secondsPosition = 2;
  const tz = moment.tz("America/Toronto").hours(timeSplit[hourPosition])
      .minutes(timeSplit[minutePosition])
      .add(delay || defaultDelay, "seconds");

  const timeCountWithoutSeconds = 2;
  if (timeSplit.length > timeCountWithoutSeconds) {
    tz.seconds(timeSplit[secondsPosition]);
  }

  return tz;
};

export const pluralize = (count, singular, plural) => {
  const singlarCount = 1;
  if (count === singlarCount) {
    return singular;
  }
  return plural;
};
