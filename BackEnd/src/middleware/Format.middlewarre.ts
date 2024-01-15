
function FormatDate(date: Date) {
    var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();
    var time = FormatTime(date);


    var formattedDay = (day < 10 ? "0" : "") + day;
    var formattedMonth = (month < 10 ? "0" : "") + month;
    var formattedYear = year.toString();

    return formattedDay + "/" + formattedMonth + "/" + formattedYear + 
    "-" + time

};

function FormatTime(date: Date) {
    var hours = date.getHours();
    var minutes =  date.getMinutes();
    var seconds = date.getSeconds();
    
    var formattedHours = (hours < 10 ? "0" : "") + hours;
    var formattedMinutes = (minutes < 10 ? "0": "") + minutes;
    var formattedSeconds = (seconds < 10 ? "0": "") + seconds;

    return formattedHours +":" + formattedMinutes + ":" + formattedSeconds; 
}



export function FormatAllDate(date: Date) {
    let allDate = FormatDate(date);
    return allDate;
}

export function FormatDateOrderId (date: Date) {
    let dateOder = FormatTime(date);
    return dateOder;
}


module.exports