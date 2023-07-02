
export function convertDate(dateString) {

    if(dateString === '1970-01-01T00:00:00Z' || dateString === '1899-11-29T17:17:56.000Z'){
      return {
        date: null,
        time: null
      };
    }
  
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
  
    const formattedDate = date.toLocaleDateString('th-TH', options);
  
    const options2 = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
  
    const formattedTime = date.toLocaleTimeString('th-TH', options2);

    const options3 = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
  
    const formattedweekDate = date.toLocaleDateString('th-TH', options3);

    return {
      date: formattedDate,
      week: formattedweekDate,
      time: formattedTime
    };
}

export function convertDate_s(dateString) {

  if(dateString === '1970-01-01T00:00:00Z' || dateString === '1899-11-29T17:17:56.000Z'|| dateString === '0000-00-00'){
    return {
      date: null,
      time: null
    };
  }

  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  const formattedDate = date.toLocaleDateString('th-TH', options);

  const options2 = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  const formattedTime = date.toLocaleTimeString('th-TH', options2);

  return {
    date: formattedDate,
    time: formattedTime
  };
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