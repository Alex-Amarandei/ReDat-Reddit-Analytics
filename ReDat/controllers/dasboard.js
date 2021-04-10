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