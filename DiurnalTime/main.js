// var longi, lati, re, date, daytime, nighttime, sunrise, sunset
// const longi = document.getElementById("longi");
// const lati = document.getElementById("lati");
// const re = document.getElementById("re");
// const date = document.getElementById("date");
var r = document.querySelector(':root')

var day = document.getElementById("daytime");
var night = document.getElementById("nighttime");
var sunrise = document.getElementById("sunrise");
var sunset = document.getElementById("sunset");


function clongi() { longi.value = ""; }
function clati() { lati.value = ""; }
function cdate() {
    date.value = "";  // console.log("nodate")
    document.getElementById('re').setAttribute("placeholder",'')
}
function cre() {
    re.value = "";  //  console.log("nore")
    document.getElementById('date').setAttribute("placeholder",'')
}
function reminder(text) {
    Toastify({
        text: `${text}`,
        duration: 3000,
        newWindow: true,
        close: true,
    }).showToast();
}


function radians(jd) { return Math.PI / 180 * jd }
function degrees(hd) { return 180 / Math.PI * hd }

// calculate
function half_day_hour(ta, le) {
    var ta, le, result
    ta = radians(ta);
    le = radians(le);
    result = degrees(Math.acos(-Math.tan(ta) * Math.tan(le))) / 15;
    // console.log(result)
    return result  //半昼长
}

// last
function dot_to_colon(time, change) {
    var hour, rest, minute
    var result, longi

    if (change == 1) {
        longi = window.longitude();
        // console.log(longi);
        time -= longi;
        if (time < 0) time += 24;
        if (time > 24) time -= 24;
    }
    

    rest = time % 1;
    hour = time - rest;
    minute = Math.round(rest * 60);
    if (minute == 60) {
        hour += 1;
        minute = 0
    }
    if (hour < 10) {
        hour = `&nbsp;&nbsp;${hour}`;
    }
    if (minute < 10) {
        minute = `0${minute}`;
    }
    result = `${hour}:${minute}`
    // console.log(result)
    return result  // 时分值

}

function longitude() {
    var longi = document.getElementById("longi").value;

    if (longi != '') {
        longi = window.degrees_to_dot(longi);
        if (longi < -180 || longi > 180) {
            window.clongi();
            window.reminder("经度范围不正确!\n Incorrect longitude !\t")
            longi = 120;
        }
    } else longi = 120;
    return (longi - 120) / 15
}

// xx xx => xx.xx
function degrees_to_dot(degree) {
    var split_list, split_int, split_float

    split_list = degree.split(/\s+/);
    if (!isNaN(+split_list[0])) {
        split_int = +split_list[0];
    } else split_int = 0;

    if (split_list[1] != undefined) {
        split_float = +split_list[1] / 60;
        // console.log("fi2")
    } else {
        split_float = 0;
        // console.log("er2")
    }

    if (split_int < 0) {
        var result = split_int - split_float;
    } else {
        var result = split_int + split_float;
    }
    return result  // 小数值
}

// xx.xx => xx xx
function dot_to_degrees(dot) {
    var result
    var rest, degree, minute

    rest = dot % 1;
    degree = dot - rest;
    minute = Math.round(rest * 60);

    result = `${degree}° ${Math.abs(minute)}'`
    return result
}

// xxxx xx xx => xxth
function which_day(year, month, date) {
    var second = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ? 29 : 28;
    var arr = [31, second, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (var i = 0, sum = 0; i < month - 1; i++) { sum += arr[i] };
    return sum + date;
}
function date_to_day(date_) {
    var split_list, split_year, split_month, split_day, result

    split_list = date_.split(/\s+/);
    if (+split_list[0] == 0) { split_list.shift(); }
    if (+split_list[0] < 13) {  // input 2 number
        split_year = 2023;
        split_month = +split_list[0];
        (+split_list[1] == 0 || split_list[1] == undefined) ?
            split_day = 1 : split_day = +split_list[1];
    } else {  // input 3 number
        split_year = +split_list[0];
        (+split_list[1] == 0 || split_list[1] == undefined) ?
            split_month = 1 : split_month = +split_list[1];
        (+split_list[2] == 0 || split_list[2] == undefined) ?
            split_day = 1 : split_day = +split_list[2];
    }

    if (split_day > 31 || split_month > 12) {
        window.reminder("日期不在范围内!\n The date is not in the range!");
        window.cdate();
        result = false
    } else {
        result = which_day(split_year, split_month, split_day);
    }
    return result
}


function main() {
    var longi = document.getElementById("longi");
    var lati = document.getElementById("lati");
    var re = document.getElementById("re");
    var date = document.getElementById("date");

    var longi = longi.value;
    var lati = lati.value;
    var re = re.value;
    var date = date.value;

    //new

    var nlati, nre, ndate;  // nlongi, 

    window.longitude();
    // if (longi != '') {
    //     nlongi = 1;
    // } else {
    //     nlongi = 0
    // }

    if (lati != '') {
        var lati = degrees_to_dot(lati);
        if (lati > 90 || lati < -90) {
            window.reminder("纬度范围不正确!\n Incorrect latitude !\t");

            nlati = 0;
            lati = false;
            window.clati();
        } else {
            nlati = 1;
        };
    } else nlati = 0;

    if (re != '') {
        var theta = degrees_to_dot(re);
        if (theta <= -23.45 || theta >= 23.45) {
            window.reminder("赤经范围不正确!\n Incorrect right ascension !\t");

            nre = 0;
            // re = false;
            theta = undefined;
            window.cre();
        } else {
            nre = 1;
        }

        // 转换为日期
        //pass

    } else {
        nre = 0;
        document.getElementById('date').setAttribute("placeholder",'');
    }

    if (date != '') {
        var theta, rq, solstice, thetap
        var sEquinox, sSolstice, aEquinox, wSolstice

        rq = date_to_day(date);
        solstice = degrees_to_dot('23 26')  // 23°26‘ => 23.433…

        sEquinox = date_to_day('2023 3 21');
        sSolstice = date_to_day('2023 6 22');
        aEquinox = date_to_day('2023 9 23');
        wSolstice = date_to_day('2023 12 22');

        // console.log(rq)
        if (rq != false) {
            rq < sEquinox ?  // 1.1 - 3.21
                theta = 0 - (sEquinox - rq) / (9 + sEquinox) * solstice :
                rq < sSolstice ?  // 3.21 - 6.22
                    theta = (rq - sEquinox) / (sSolstice - sEquinox) * solstice :
                    rq < aEquinox ?  // 6.22 - 9.23
                        theta = (aEquinox - rq) / (aEquinox - sSolstice) * solstice :
                        rq < wSolstice ? // 9.23 - 12.22
                            theta = 0 - (rq - aEquinox) / (wSolstice - aEquinox) * solstice :
                            // 12.22 - 12.30
                            theta = - solstice + (rq - wSolstice) / (9 + sEquinox) * solstice;
            // theta = degrees(23.4333*Math.sin(2*Math.PI*(284+rq)/365)*Math.PI/180)
            ndate = 1;

            thetap = dot_to_degrees(theta);
            document.getElementById('re').setAttribute("placeholder",`${thetap}  |  ${theta.toFixed(3)}°`);

        } else {
            ndate = 0;
            document.getElementById('re').setAttribute("placeholder",'');
        }
    } else {
        ndate = 0;
        document.getElementById('re').setAttribute("placeholder",'');
    }
    


    var half_hour, wday, wnight, wsunrise, wsunset
    var count = nlati + nre + ndate;  // nlongi + 
    // console.log(count);
    if (count == 2) {   // main
        if (nre == 1) window.cdate();
        if (ndate == 1) window.cre();
    
        half_hour = half_day_hour(theta, lati);

        wday = dot_to_colon(half_hour * 2, 0);
        wnight = dot_to_colon(24 - half_hour * 2, 0);
        wsunrise = dot_to_colon(12 - half_hour, 1);
        wsunset = dot_to_colon(12 + half_hour, 1);

        if (isNaN(half_hour)) {
            reminder("该地为极昼或极夜区!\n It's polar day/night here!");
            wday = "- - : - -";
            wnight = "- - : - -";
            wsunrise = "- - : - -";
            wsunset = "- - : - -";
        }
    } else {
        wday = "- - : - -";
        wnight = "- - : - -";
        wsunrise = "- - : - -";
        wsunset = "- - : - -";
    }

    day.innerHTML = wday;
    night.innerHTML = wnight;
    sunrise.innerHTML = wsunrise;
    sunset.innerHTML = wsunset;

    if (theta == undefined) theta = 0;
    r.style.setProperty('--axis-rotate',`${90 + theta}deg`);
    r.style.setProperty('--ecliptic-rotate',`${theta}deg`);
    r.style.setProperty('--mylati1-rotate',`${lati}deg`);
    r.style.setProperty('--mylati2-rotate',`${-lati}deg`);
}
