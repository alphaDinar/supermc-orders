interface Trip extends Record<string, any> { }
export const sortByTime =(a : Trip, b : Trip)=>{
  const timeA = a.timestamp
  const timeB = b.timestamp
  return timeB - timeA
}

export const getTimeSince = (date : number) => {
  const currentDate = new Date();
  const timeElapsed = currentDate.valueOf() - new Date(date).valueOf();
  const seconds = Math.floor(timeElapsed / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const inputYear = new Date(date).getFullYear();
  const inputMonth = new Date(date).getMonth();
  const yearDifference = currentYear - inputYear;
  const monthDifference = currentMonth - inputMonth;
  if (yearDifference === 0) {
    if (monthDifference === 1) {
      return '1 month ago';
    } else {
      return `${monthDifference} months ago`;
    }
  } else if (yearDifference === 1 && monthDifference < 0) {
    return '11 months ago';
  } else {
    if (yearDifference === 1) {
      return '1 year ago';
    } else {
      return `${yearDifference} years ago`;
    }
  }
}