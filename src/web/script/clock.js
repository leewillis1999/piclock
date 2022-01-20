//console.log("Clock.js");


let htmlclock = (function clock(window, document) {

    let htmlclock = this;

    //set up some properties
    this.elementId = "";    //document.body;

    //this is the container element. We'll add a canvas to it
    let container = null;
    let canvas = null;
    let ctx = null;

    let width = 0;
    let height = 0;
    let size = 0;       // this will be the smallest of the width / height
    let padding = 20;   // this is how far "inside" the element we draw
    let radius = 0;     //this will be set in the initialise
    let lineThickness = 10;

    let minuteHandColour = "#ddd";
    let hourHandColour = "#ddd";
    let secondHandColour = "red";
    let centerFillColour = "#aaa";
    let centerStrokeStyle = "#000";
    let hourColour = "#ccc";
    let tickColour = "#ddd";
    let faceFont = "30px 'Mountains of Christmas', cursive";

    let sintable = {};
    let costable = {};

    console.log("started dd Clock.js");

    window.addEventListener("resize", (ev) => {
        console.log("resize");
        this.onResize();
    })

    //storm.events.add(window, 'load', doStart, false);
    window.addEventListener("load", (ev) => {

        //this.makeTables();

        console.log("Page is loaded. ElementId = " + this.elementId);
        if (this.elementId == "") {
            this.container = document.body;
        } else {
            this.container = document.getElementById(this.elementId);
        }

        //create a canvas over the top of the element
        this.canvas = document.createElement("canvas");
        this.container.appendChild(this.canvas);
        //this.canvas.style.backgroundColor = this.container.style.backgroundColor;
        this.canvas.style.position = "absolute";
        //this.canvas.style.filter = "blur(8px)";
        this.onResize();

        this.ctx = this.canvas.getContext("2d");

        this.drawClockFace();

        //window.setInterval(this.drawTime, 1000);
        //window
        requestAnimationFrame(this.drawTime);
    });

    this.onResize = function () {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.canvas.setAttribute("width", this.width + "px");
        this.canvas.setAttribute("Height", this.height + "px");
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";

        if (this.container.offsetWidth < this.container.offsetHeight) {
            this.size = this.container.offsetWidth;
        } else {
            this.size = this.container.offsetHeight;
        }

        this.radius = (this.size / 2) - padding;
    }

    let ph = 0;
    let pm = 0;
    let ps = 0;

    //todo create sin and cos tables...
    this.drawTime = function () {

        let now = new Date();

        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();

        if (ph == hour && pm == minute && ps == second) {
            requestAnimationFrame(this.drawTime);
            return;
        }

        // console.log("animating");
        ph = hour;
        pm = minute;
        ps = second;

        //this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawClockFace();

        this.ctx.lineWidth = lineThickness;

        //minute and hour hands are grey
        this.ctx.strokeStyle = hourHandColour;

        //draw the hour hand - todo add the minute offset part
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetx(0), this.offsety(0));
        let hr = this.radius - 35;
        let hp = (hour * 30) + (minute * 0.5);
        let hd = this.deg2rad(180.0 - (hp));
        let hx = this.offsetx(this.sin(hd) * hr);
        let hy = this.offsety(this.cos(hd) * hr);
        this.ctx.lineTo(hx, hy);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.fillStyle = hourHandColour;
        this.ctx.arc(hx, hy, lineThickness / 2, 0, 2 * Math.PI);
        this.ctx.fill();

        //draw the minute hand (second offset??)
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetx(0), this.offsety(0));
        let mr = this.radius - 15;
        let mp = (minute * 6) + (second * 0.1);
        let md = this.deg2rad(180.0 - mp);
        let mx = this.offsetx(this.sin(md) * mr);
        let my = this.offsety(this.cos(md) * mr);
        this.ctx.lineTo(mx, my);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.fillStyle = minuteHandColour;
        this.ctx.arc(mx, my, lineThickness / 2, 0, 2 * Math.PI);
        this.ctx.fill();

        //draw the second hand - red.
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetx(0), this.offsety(0));
        let sr = this.radius - 10;
        let sp = (second * 6);
        let sd = this.deg2rad(180.0 - sp);
        let sx = this.offsetx(this.sin(sd) * sr);
        let sy = this.offsety(this.cos(sd) * sr);
        this.ctx.lineTo(sx, sy);
        this.ctx.strokeStyle = secondHandColour;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.fillStyle = secondHandColour;
        this.ctx.arc(sx, sy, lineThickness / 2, 0, 2 * Math.PI);
        this.ctx.fill();

        //draw the center circle
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(this.offsetx(0), this.offsety(0), 6, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = centerFillColour;
        this.ctx.fill();
        this.ctx.strokeStyle = centerStrokeStyle;
        this.ctx.stroke();

        requestAnimationFrame(this.drawTime);
    }

    //this caches the sin / cos lazily as it is calculated. 
    this.sin = function (v) {
        if (!sintable[v]) {
            sintable[v] = Math.sin(v);
        }
        return sintable[v];
    }

    this.cos = function (v) {
        if (!costable[v]) {
            costable[v] = Math.cos(v);
        }
        return costable[v];
    }

    this.drawClockFace = function () {

        this.ctx.font = faceFont;
        for (let m = 1; m <= 60; m++) {
            //if we';'re on an hour bit, draw the number, else draw a tick
            if (m % 5 == 0) {
                let h = m / 5;
                let deg = this.deg2rad(180.0 - (h * 30));
                let x = this.offsetx(this.sin(deg) * this.radius);
                let y = this.offsety(this.cos(deg) * this.radius);
                this.ctx.fillStyle = hourColour;
                this.ctx.fillText(h, x - 6.0, y + 6.0);
            } else {
                let h = m;
                let deg = this.deg2rad(180.0 - (h * 6));
                let x = this.offsetx(this.sin(deg) * this.radius);
                let y = this.offsety(this.cos(deg) * this.radius);

                this.ctx.beginPath();
                this.ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
                this.ctx.fillStyle = tickColour;
                this.ctx.fill();
            }
        }
    }

    this.deg2rad = function (deg) {
        return (Math.PI / 180.0) * deg;
    }

    this.offsetdeg = function (val) {
        return val - 180.0;
    }

    this.offsetx = function (val) {
        // offset the value so it appears in the center
        //console.log(val, this.container.offsetWidth / 2)
        return val + (this.container.offsetWidth / 2);
    }

    this.offsety = function (val) {
        //console.log(val, this.container.offsetHeight / 2)
        return val + (this.container.offsetHeight / 2);
    }

    return this;

}(window, document));

//console.log(htmlclock)