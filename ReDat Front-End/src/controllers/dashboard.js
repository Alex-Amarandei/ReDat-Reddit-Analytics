function deleteNotification(element) {
    element.parentNode.remove();
}



function expandCard(element) {
    if (element.classList.contains("post")) {
        if (element.classList.contains("expand-card")) {
            element.classList.remove("expand-card");
            element.childNodes[7].classList.remove("expand-card");
        } else {
            element.classList.add("expand-card");
            element.childNodes[7].classList.add("expand-card");
        }
    } else {
        if (element.classList.contains("expand-card")) {
            element.classList.remove("expand-card");
            element.childNodes[1].childNodes[3].classList.remove("expand-card");
        } else {
            element.classList.add("expand-card");
            element.childNodes[1].childNodes[3].classList.add("expand-card");
        }
    }
}

function switchMode() {
    const statsButton = document.getElementById("statistics-button");
    const postsButton = document.getElementById("post-button");
    const postToolbarLeft = document.getElementById("post-toolbar-left");
    const postToolbarRight = document.getElementById("post-toolbar-right");
    const statsToolbarLeft = document.getElementById("stats-toolbar-left");
    const statsToolbarRight = document.getElementById("stats-toolbar-right");
    const postWrapper = document.getElementById("post-wrapper");
    const statsWrapper = document.getElementById("stats-wrapper");

    if (statsButton.style.display != "none") {
        statsButton.style.display = "none";
        postsButton.style.display = "flex";

        postToolbarLeft.style.display = "none";
        postToolbarRight.style.display = "none";

        statsToolbarLeft.style.display = "flex";
        statsToolbarRight.style.display = "flex";

        postWrapper.style.display = "none";
        statsWrapper.style.display = "flex";
    } else {
        statsButton.style.display = "flex";
        postsButton.style.display = "none";

        postToolbarLeft.style.display = "flex";
        postToolbarRight.style.display = "flex";

        statsToolbarLeft.style.display = "none";
        statsToolbarRight.style.display = "none";

        postWrapper.style.display = "flex";
        statsWrapper.style.display = "none";
    }
}

function barChartSelected() {
    const barChart = document.getElementById("bar-chart");
    const columnChart = document.getElementById("column-chart");
    const lineChart = document.getElementById("line-chart");

    barChart.style.display = "flex";
    columnChart.style.display = "none";
    lineChart.style.display = "none";

}

function columnChartSelected() {
    const barChart = document.getElementById("bar-chart");
    const columnChart = document.getElementById("column-chart");
    const lineChart = document.getElementById("line-chart");

    barChart.style.display = "none";
    columnChart.style.display = "flex";
    lineChart.style.display = "none";
}

function lineChartSelected() {
    const barChart = document.getElementById("bar-chart");
    const columnChart = document.getElementById("column-chart");
    const lineChart = document.getElementById("line-chart");

    barChart.style.display = "none";
    columnChart.style.display = "none";
    lineChart.style.display = "flex";
}

function addToChartData(element) {
    if (element.style.backgroundColor == "rgba(255, 255, 255, 0.3)") {
        element.style.backgroundColor = "unset";
    } else {
        element.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    }
}

function allCommunities() {

    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
    var theUrl = "http://localhost:3030/communities/all";
    xmlhttp.open("GET", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send();
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                const res = JSON.parse(xmlhttp.response);

                // set local storage
                localStorage.setItem('token', res.token);
                localStorage.setItem('redditToken', res.redditToken);

                // RERUTARE in alta parte
                var str = window.location.href;
                var lastIndex = str.lastIndexOf("/");
                var path = str.substring(0, lastIndex);
                var new_path = path + "/dashboard.html";
                window.location.assign(new_path);


            }
            console.log(xmlhttp.responseText);
            // console.log('success', JSON.parse(xmlhttp.responseText));
        } else {
            // What to do when the request has failed
            console.log('error', xmlhttp);
        }

    }
}

(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
        var str = window.location.href;
        var lastIndex = str.lastIndexOf("/");
        var path = str.substring(0, lastIndex);
        var new_path = path + "/login.html";
        window.location.assign(new_path);
    } else {
        console.log('are token');
    }
})();