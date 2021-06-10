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

                const values = String(res)
                    .split(",")
                    .map((res) => {
                        return Number(res);
                    });

                chartSelected(values, timeframe, chartType);
                exportToCSV(values, community, dataType, timeframe);
                console.log(values, timeframe, chartType);
            } else {
                console.log("error", xmlhttp);
            }
        }
    };
}

function chartSelected(values, timeframe, chartType) {
    let svgCanvas = document.getElementById("canvas");
    svgCanvas.innerHTML = "";
    try {
        svgCanvas.setAttribute("viewbox", "0 0 100% 100%");
    } catch (err) {
        //ignore
    }
    const maximum = Math.max(...values);

    drawCanvas();
    drawAxis();
    drawLabels(timeframe, chartType, maximum);

    if (chartType == "bar-chart") plotBar(values, maximum);
    else if (chartType == "line-chart") plotLine(values, maximum);
    else plotColumn(values, maximum);
}

function drawCanvas() {
    let svgCanvas = document.getElementById("canvas");

    svgCanvas.innerHTML += "<g>";
    svgCanvas.innerHTML += `
        <defs>
            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#0B486B"/>
                <stop offset="100%" stop-color="#F56217"/>
            </linearGradient>
         </defs>
    `;
    svgCanvas.innerHTML += "</g>";

    svgCanvas.innerHTML += "<g>";
    for (i = 0; i <= 20; i++) {
        svgCanvas.innerHTML += `
            <line class="grid-line" x1="0" y1="${i * 5}%" x2="100%" y2="${
      i * 5
    }%"/>`;
        svgCanvas.innerHTML += `
            <line class="grid-line" x1="${i * 5}%" y1="0" x2="${
      i * 5
    }%" y2="100%"/>`;
    }
    svgCanvas.innerHTML += "</g>";
}

function drawAxis() {
    let svgCanvas = document.getElementById("canvas");
    svgCanvas.innerHTML += "<g>";

    svgCanvas.innerHTML += `<line class="axis" x1="5%" y1 ="5%" x2="5%" y2="95%"/>`;
    svgCanvas.innerHTML += `<line class="axis" x1="5%" y1 ="95%" x2="95%" y2="95%"/>`;

    svgCanvas.innerHTML += "</g>";
}

function drawLabels(timeframe, chartType, maximum) {
    let svgCanvas = document.getElementById("canvas");
    svgCanvas.innerHTML += "<g>";

    svgCanvas.innerHTML += `
          <text class="labels" x="1%" y="99%">0</text>`;

    if (chartType == "bar-chart") {
        for (i = 1; i <= 6; i++) {
            svgCanvas.innerHTML += `
          <text class="labels" x="${i * 15 + 5}%" y="99%">
          ${((maximum / 6) * i) | 0}</text>
          `;

            if (timeframe == "minutes") text = i * 10;
            else if (timeframe == "hours") text = i;
            else if (timeframe == "day") text = i * 2;

            svgCanvas.innerHTML += `
              <text class="labels" x="1%" y="${100 - i * 15}%">
              ${text}</text>
              `;
        }
    } else if (chartType == "line-chart") {
        for (i = 1; i <= 6; i++) {
            svgCanvas.innerHTML += `
          <text class="labels" x="1%" y="${95 - i * 15}%">
          ${((maximum / 6) * i) | 0}</text>
          `;

            if (timeframe == "minutes") text = i * 10;
            else if (timeframe == "hours") text = i;
            else if (timeframe == "day") text = i * 2;

            svgCanvas.innerHTML += `
              <text class="labels" x="${i * 15 + 5}%" y="99%">
              ${text}</text>
              `;
        }
    } else {
        for (i = 1; i <= 6; i++) {
            svgCanvas.innerHTML += `
          <text class="labels" x="1%" y="${95 - i * 15}%">
          ${((maximum / 6) * i) | 0}</text>
          `;

            if (timeframe == "minutes") text = i * 10;
            else if (timeframe == "hours") text = i;
            else if (timeframe == "day") text = i * 2;

            svgCanvas.innerHTML += `
              <text class="labels" x="${i * 15}%" y="99%">
              ${text}</text>
              `;
        }
    }

    svgCanvas.innerHTML += "</g>";
}

function plotLine(values, maximum) {
    let svgCanvas = document.getElementById("canvas");
    svgCanvas.innerHTML += "<g>";

    let previousValue = 95;
    let currentValue = 95;
    let stroke = "url(#linear)";

    for (i = 0; i < 6; i++) {
        currentValue = 95 - Math.round((90 * values[i]) / maximum);

        if (previousValue == currentValue) {
            stroke = "#0B486B";
        }

        svgCanvas.innerHTML += `
        <line class="chart-line" stroke="${stroke}"
        x1="${i * 15 + 5}%"
        y1="${previousValue}%"
        x2="${(i + 1) * 15 + 5}%"
        y2="${currentValue}%"/>
    `;
        previousValue = currentValue;
        stroke = "url(#linear)";
    }

    svgCanvas.innerHTML += "</g>";
}

function plotColumn(values, maximum) {
    let svgCanvas = document.getElementById("canvas");
    svgCanvas.innerHTML += "<g>";

    for (i = 0; i < 6; i++) {
        svgCanvas.innerHTML += `
        <rect fill="url(#linear)" rx="15px"
        x="${i * 15 + 10}%"
        y="${95 - Math.round((90 * values[i]) / maximum)}%"
        width="10%"
        height="${Math.round((90 * values[i]) / maximum)}%"/>
    `;
    }

    svgCanvas.innerHTML += "</g>";
}

function plotBar(values, maximum) {
    let svgCanvas = document.getElementById("canvas");
    svgCanvas.innerHTML += "<g>";

    for (i = 0; i < 6; i++) {
        svgCanvas.innerHTML += `
        <rect fill="url(#linear)" rx="15px"
        x="5%"
        y="${i * 15 + 5}%"
        width="${Math.round((90 * values[i]) / maximum)}%"
        height="10%"/>
    `;
    }

    svgCanvas.innerHTML += "</g>";
}

function exportSVG() {
    let canvas = document.getElementById("canvas");
    canvas.style.height = "560";
    canvas.style.width = "560";
    svgExport.downloadSvg(document.getElementById("canvas"), "Line Chart", {
        width: 560,
        height: 560,
        scale: 1,
        useCSS: true,
    });

    canvas.style.height = "80%";
    canvas.style.width = "80%";
}

function exportToCSV(values, community, dataType, timeframe) {
    let text = "subreddit,dataType,timeFrame,value\n";
    let interval = "";
    for (i = 0; i < 6; i++) {
        text += community + "," + dataType + ",";
        if (timeframe == "minutes") text += i * 10 + "-" + (i + 1) * 10 + ",";
        else if (timeframe == "hours") text += i + "-" + (i + 1) + ",";
        else text += i * 2 + "-" + (i + 1) * 2 + ",";
        text += values[i] + "\n";
    }

    console.log(text);

    if (timeframe == "minutes") interval = "last hour";
    else if (timeframe == "hours") interval = "last six hours";
    else interval = "last twelve hours";

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(text);
    hiddenElement.target = "_blank";
    hiddenElement.download = `${dataType} in the ${community} subreddit in the ${interval}.csv`;
    hiddenElement.click();
}