export function convertDate(dateString) {

  if(dateString === null){ return { date: '-', time: '-' } ;}
  
  const dateParts = dateString.split(" ")[0].split("/");
  const year = parseInt(dateParts[2], 10) - 543; // Convert to Buddhist era (BE)
  const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based
  const day = parseInt(dateParts[0], 10);
  const date = new Date(year, month, day);

  if (isNaN(date)) { return { date: '-', time: '-' }; }

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Bangkok"
  };

  const formattedDate = date.toLocaleDateString('th-TH', options);

  const timeString = dateString.split(" ")[1];
  const time_2 = new Date(`2000-01-01T${timeString}`);
  const options2 = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok"
  };

  const formattedTime = time_2.toLocaleTimeString('th-TH', options2);

  return {
    date: formattedDate,
    time: formattedTime
  };
}

export function convertDate_s(dateString) {

if(dateString === null){ return '-' ;}
const dateParts = dateString.split(" ")[0].split("/");
const year = parseInt(dateParts[2], 10) - 543; // Convert to Buddhist era (BE)
const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based
const day = parseInt(dateParts[0], 10);
const date = new Date(year, month, day);

if (isNaN(date)) { return '-'; }

const options = {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "Asia/Bangkok"
};
const formattedDate = date.toLocaleDateString('th-TH', options);
return formattedDate;
}

export function convertTimeAppoint(timeString) {

    if(timeString == null){
          return timeString;
    }
  
      if( timeString.toString().includes(".") ){
        let myTime = timeString.toString().split(".");
          if(myTime[0].length <= 1){
              myTime[0] = '0'+myTime[0] ;
          }
          if(myTime[1].length <= 1){
              myTime[1] = myTime[1]+'0' ;
          }
          return myTime[0]+'.'+myTime[1]+' น. ';
        } else {
          let myTime = timeString.toString();
          if(myTime.length <= 1){
              myTime = '0'+myTime ;
          }
          return myTime+'.00 น. ';
      }
  
}

export function convertMoney(x) {
  if(x){return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
   else{ return x;}
}

export function convertYMD(days) {
  let years = Math.floor(days / 365);
  let remainingDays = days % 365;
  let months = Math.floor(remainingDays / 30);
  let daysLeft = remainingDays % 30;
  if(remainingDays >= 360 && remainingDays <= 364){
    months = 11;
    daysLeft = 30 - (365 - remainingDays);
  }


  if(years === 0){ 
    if( months === 0 ) { return `${daysLeft} วัน`; }else{ return `${months} เดือน ${daysLeft} วัน`; } 
    } else {
    return `${years} ปี ${months} เดือน ${daysLeft} วัน`;
    }
}