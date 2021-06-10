function generateStats() {
    let community = localStorage.getItem("subreddit");
    let dataType = localStorage.getItem("actionStats");
    let timeframe = localStorage.getItem("intervalStats");
    let chartType = localStorage.getItem("chartType");

    if (!community || !dataType || !timeframe || !chartType) {
        alert("Please select A community/A chart type/An action/An interval");
        return;
    } else {
        const el = document.getElementById("generate-button");
        el.style.display = "none";
        getStats(community, dataType, timeframe, chartType);
    }
}

function getStats(community, dataType, timeframe, chartType) {
    var xmlhttp = new XMLHttpRequest();
    var url = `http://localhost:3033/${dataType}/${timeframe}/?id=${community}`;

    xmlhttp.open("GET", url);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            if (xmlhttp.responseText) {
                let res = JSON.parse(xmlhttp.responseText);
                localStorage.setItem("valuesForStats", res);

                chartSelected(timeframe, chartType);
                console.log(values, timeframe, chartType);
            } else {
                console.log("error", xmlhttp);
            }
        }

        const el = document.getElementById("generate-button");
        el.style.display = "flex";
    };
}

// statistics below

function chartSelected(timeframe, chartType) {
    const canvas = document.getElementById(chartType);

    document.getElementById("bar-chart").style.display = "none";
    document.getElementById("line-chart").style.display = "none";
    document.getElementById("column-chart").style.display = "none";

    canvas.style.display = "block";

    console.log(document);
    console.log(chartType);
    console.log(document.getElementById(chartType));

    canvas.width = 560;
    canvas.height = 560;
    const context = canvas.getContext("2d");

    let res = localStorage.getItem("valuesForStats");

    const values = String(res)
        .split(",")
        .map((res) => {
            return Number(res);
        });

    const maximum = Math.max(...values);

    drawCanvas(context, canvas, 20, 20, 20);
    drawAxis(context, canvas);
    drawLabels(context, canvas, timeframe, chartType, maximum);

    if (chartType == "bar-chart") plotBar(context, canvas, values, maximum);
    else if (chartType == "line-chart")
        plotLine(context, canvas, values, maximum);
    else plotColumn(context, canvas, values, maximum);
}

function drawCanvas(context, canvas, xGrid, yGrid, cellSize) {
    context.beginPath();
    context.strokeStyle = "#cccccc";

    while (xGrid < canvas.width) {
        context.moveTo(xGrid, 0);
        context.lineTo(xGrid, canvas.height);
        xGrid += cellSize;
    }

    while (yGrid < canvas.height) {
        context.moveTo(0, yGrid);
        context.lineTo(canvas.width, yGrid);
        yGrid += cellSize;
    }

    context.stroke();
}

function drawAxis(context, canvas) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 5;

    context.moveTo(40, 0);
    context.lineTo(40, canvas.height - 40);
    context.lineTo(canvas.width, canvas.height - 40);

    context.stroke();
    context.closePath();
}

function drawLabels(context, canvas, timeframe, chartType, maximum) {
    context.beginPath();
    context.font = "15px Arial";
    context.lineWidth = 1;
    context.strokeText(0, 20, canvas.height - 20);
    let text = 0;

    if (chartType == "bar-chart") {
        for (i = 1; i <= 6; i++) {
            context.strokeText(
                ((maximum / 6) * i) | 0,
                30 + i * 80,
                canvas.height - 20
            ); // Y-Axis

            if (timeframe == "minutes") text = i * 10;
            else if (timeframe == "hours") text = i;
            else if (timeframe == "day") text = i * 2;

            context.strokeText(text, 20, canvas.height - 35 - i * 80);
        }
    } else {
        for (i = 1; i <= 6; i++) {
            context.strokeText(
                ((maximum / 6) * i) | 0,
                10,
                canvas.height - 35 - i * 80
            ); // Y-Axis

            if (timeframe == "minutes") text = i * 10;
            else if (timeframe == "hours") text = i;
            else if (timeframe == "day") text = i * 2;

            context.strokeText(text, 30 + i * 80, canvas.height - 20);
        }
    }

    context.stroke();
    context.closePath();
}

function plotLine(context, canvas, values, maximum) {
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = "blue";
    context.moveTo(42.5, canvas.height - 42.5);
    let unit = maximum / 6;

    for (i = 1; i <= 6; i++) {
        context.lineTo(
            40 + i * 80,
            canvas.height - 40 - 80 * Math.round(values[i - 1] / unit)
        );
    }

    context.stroke();
    context.closePath();
}

function plotColumn(context, canvas, values, maximum) {
    const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    let unit = maximum / 6;

    for (i = 1; i <= 6; i++) {
        context.beginPath();
        context.fillStyle = colors[i - 1];
        context.fillRect(
            10 + i * 80,
            canvas.height - 42.5 - 80 * Math.round(values[i - 1] / unit),
            60,
            80 * Math.round(values[i - 1] / unit)
        );
        context.closePath();
    }
}

function plotBar(context, canvas, values, maximum) {
    const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
    let unit = maximum / 6;

    for (i = 1; i <= 6; i++) {
        context.beginPath();
        context.fillStyle = colors[i - 1];
        context.fillRect(
            42.5,
            canvas.height - 70 - 80 * i,
            80 * Math.round(values[i - 1] / unit),
            60
        );
        context.closePath();
    }
}

function downloadCanvasAsImage() {
    const canvas = document.getElementById(localStorage.getItem("chartType"));

    let downloadLink = document.createElement("a");
    downloadLink.setAttribute("download", `${id}.png`);
    let dataURL = canvas.toDataURL("image/png");
    let url = dataURL.replace(
        /^data:image\/png/,
        "data:application/octet-stream"
    );
    downloadLink.setAttribute("href", url);
    downloadLink.click();
}

function selectAction(id) {
    localStorage.setItem("actionStats", id);
}

function selectInterval(id) {
    localStorage.setItem("intervalStats", id);
}

function selectChart(id) {
    localStorage.setItem("chartType", id);
    chartSelected(localStorage.getItem("intervalStats"), id);
}