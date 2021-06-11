const refreshToken = () => {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = `http://localhost:3030/refresh-reddit-token?id=${localStorage.getItem(
    "token"
  )}`;
    xmlhttp.open("GET", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            if (xmlhttp.responseText) {
                const res = JSON.parse(xmlhttp.response);
                localStorage.setItem("redditToken", res.redditToken);
            }
        } else {
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

        if (timeSpentOnSite / 1000 >= 2400 && !!localStorage.getItem("token")) {
            localStorage.setItem("timeSpentOnSite", 0);
            refreshToken();
        } else if (timeSpentOnSite / 1000 >= 2400) {
            localStorage.setItem("timeSpentOnSite", 0);
        }
    }, 1000);
}
startCounting();

var notificationTimer;
var notificationTimerStart;
var timeSpentFromLastNotification = getTimeSpentFromLastNotification();

function getTimeSpentFromLastNotification() {
    timeSpentFromLastNotification = parseInt(
        localStorage.getItem("lastNotificationTime")
    );
    timeSpentFromLastNotification = isNaN(timeSpentFromLastNotification) ?
        0 :
        timeSpentFromLastNotification;
    return timeSpentFromLastNotification;
}

function startCountingForNotification() {
    notificationTimerStart = Date.now();
    notificationTimer = setInterval(function() {
        timeSpentFromLastNotification =
            getTimeSpentFromLastNotification() +
            (Date.now() - notificationTimerStart);
        localStorage.setItem("lastNotificationTime", timeSpentFromLastNotification);
        notificationTimerStart = parseInt(Date.now());

        if (
            timeSpentFromLastNotification / 1000 >= 20 &&
            !!localStorage.getItem("token")
        ) {
            localStorage.setItem("lastNotificationTime", 0);
            if (localStorage.getItem("token")) {
                manageNotifications();
            }
        } else if (timeSpentFromLastNotification / 1000 >= 20) {
            localStorage.setItem("lastNotificationTime", 0);
        }
    }, 1000);
}
startCountingForNotification();

async function manageNotifications() {
    let newPosts = await getNotifications();
    if (newPosts !== false && newPosts.max_utc != 0) {
        localStorage.setItem("lastUtc", newPosts.max_utc.toString());

        let keys = Object.keys(newPosts);
        let finalNotification = "";
        let notificationsFromOneCommunity = "";

        for (i = 0; i < keys.length; i++) {
            if (keys[i] != "max_utc") {
                notificationsFromOneCommunity = "";
                notificationsFromOneCommunity = `${keys[i]}:\n`;
                newPosts[keys[i]].forEach((title) => {
                    notificationsFromOneCommunity = notificationsFromOneCommunity.concat(
                        title + "\n"
                    );
                });

                notificationsFromOneCommunity =
                    notificationsFromOneCommunity.concat("\n");
                finalNotification = finalNotification.concat(
                    notificationsFromOneCommunity
                );
            }
        }
        displayNotification("Check out the new posts!", finalNotification);
    }
}

function getNotifications() {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        var theUrl = `http://localhost:3031/get/notifications?id=${localStorage.getItem(
      "token"
    )}&redditToken=${localStorage.getItem(
      "redditToken"
    )}&lastUtc=${localStorage.getItem("lastUtc")}`;
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                if (xmlhttp.responseText) {
                    let res = JSON.parse(xmlhttp.responseText);
                    resolve(res);
                } else {
                    reject(false);
                }
            }
        };
    });
}

async function displayNotification(title, body) {
    const showNotification = () => {
        const notification = new Notification(title, {
            body: body,
            icon: "../images/logo.png",
        });

        setTimeout(() => {
            notification.close();
        }, 10000);

        notification.addEventListener("click", () => {
            var str = window.location.href;
            var lastIndex = str.lastIndexOf("/");
            var path = str.substring(0, lastIndex);
            var new_path = path + "/dashboard.html";
            window.location.assign(new_path);
            return loadPostsByFilters("your", "new");
        });
    };

    const rejectNotification = () => {
        return;
    };

    let granted = false;

    if (Notification.permission === "granted") {
        granted = true;
    } else if (Notification.permission !== "denied") {
        let permission = await Notification.requestPermission();
        granted = permission === "granted" ? true : false;
    }

    granted ? showNotification() : rejectNotification();
}