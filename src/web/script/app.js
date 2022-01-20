console.log("loading app.js");

$(function () {

    let elDateDayName = $(".date-dayName");
    let elDateDayNumber = $(".date-dayNumber");

    //set a timer to update the time
    window.setInterval(() => {
        let now = moment();
        //elTime.text(now.format("HH:mm:ss"));
        //elDate.text(now.format("ddd Do MMM"));
        elDateDayName.text(now.format("ddd"));
        elDateDayNumber.text(now.format("Do"));
    }, 1000);

});