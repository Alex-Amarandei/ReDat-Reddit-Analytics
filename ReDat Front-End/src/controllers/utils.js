const refreshToken = () => {
    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
    var theUrl = `http://localhost:3030/refresh-reddit-token?id=${localStorage.getItem(
    "token"
  )}`;
    xmlhttp.open("GET", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                console.log("here");
                const res = JSON.parse(xmlhttp.response);
                localStorage.setItem("redditToken", res.redditToken);
            }
        } else {
            // What to do when the request has failed
            console.log("error", xmlhttp);
        }
    };
};

var timer;
var timerStart;
var timeSpentOnSite = getTimeSpentOnSite();

function getTimeSpentOnSite() {
    timeSpentOnSite = parseInt(localStorage.getItem("timeSpentOnSite"));
    timeSpentOnSite = isNaN(timeSpentOnSite) ? 0 : timeSpentOnSite;
    return timeSpentOnSite;
}

function startCounting() {
    timerStart = Date.now();
    timer = setInterval(function() {
        timeSpentOnSite = getTimeSpentOnSite() + (Date.now() - timerStart);
        localStorage.setItem("timeSpentOnSite", timeSpentOnSite);
        timerStart = parseInt(Date.now());
        // Convert to seconds

        if (
            timeSpentOnSite / 1000 >= 3540 &&
            !!localStorage.getItem("token").length
        ) {
            localStorage.setItem("timeSpentOnSite", 0);
            refreshToken();
        } else if (timeSpentOnSite / 1000 >= 3540) {
            localStorage.setItem("timeSpentOnSite", 0);
        }
    }, 1000);
}
startCounting();