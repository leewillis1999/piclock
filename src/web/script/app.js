console.log("loading app.js");

$(function () {

    let elDate = $(".date");
    let elTime = $(".time");

    //set a timer to update the time
    window.setInterval(() => {
        let now = moment();
        elTime.text(now.format("HH:mm:ss"));
        elDate.text(now.format("ddd Do MMM"));
    }, 1000);

});