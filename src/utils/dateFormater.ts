export function abuseDateFormat(date:Date){
    
   date=new Date(date)
   const formated=`${date.getHours()}-${date.getMinutes()}-${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    return formated

} 