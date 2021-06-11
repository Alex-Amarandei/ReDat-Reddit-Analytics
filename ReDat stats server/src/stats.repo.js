var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

async function getSingleData(dataType, queryParams) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        var url = `https://api.pushshift.io/reddit/${dataType}/search/?fields=created_utc${queryParams}&sortType=created_utc`;

        xmlhttp.open("GET", url);
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xmlhttp.send(null);

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                if (xmlhttp.responseText) {
                    const response = JSON.parse(xmlhttp.responseText);
                    if (response.data.length) {
                        resolve(response.data[0].created_utc);
                    } else resolve(0);
                }
            } else {
                reject(xmlhttp);
            }
        };
    });
}

async function getNumberOfData(dataType, queryParams, utc) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        var url = `https://api.pushshift.io/reddit/${dataType}/search/?fields=created_utc${queryParams}&sortType=created_utc`;

        xmlhttp.open("GET", url);
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xmlhttp.send(null);

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                if (xmlhttp.responseText) {
                    const response = JSON.parse(xmlhttp.responseText);
                    resolve({
                        number: response.data.length,
                        lastComment: response.data[response.data.length - 1].created_utc,
                        index: response.data.indexOf(utc),
                    });
                }
            } else {
                reject(xmlhttp);
            }
        };
    });
}

const Stats = function() {};

Stats.prototype.getSingleData = getSingleData;
Stats.prototype.getNumberOfData = getNumberOfData;

module.exports = new Stats();