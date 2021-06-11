const http = require("http");
const qs = require("querystring");
const url = require("url");
const Stats = require("./src/stats.repo");

const port = 3033;

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    if (req.method === "GET") {
        return handleGetReq(req, res);
    } else if (req.method === "POST") {
        return res.end("POST");
    } else if (req.method === "DELETE") {
        return res.end("DELETE");
    } else if (req.method === "PUT") {
        return res.end("PUT");
    } else if (req.method === "OPTIONS") {
        return res.end("OPTIONS");
    }
});

async function handleGetReq(req, res) {
    const { pathname, query } = url.parse(req.url);
    let dataType = pathname.split("/")[1];
    dataType = dataType.substring(0, dataType.length - 1);
    const interval = pathname.split("/")[2];
    const subreddit = qs.parse(query).id;

    if (
        pathname !== "/comments/minutes/" &&
        pathname !== "/comments/hours/" &&
        pathname !== "/comments/day/" &&
        pathname !== "/submissions/minutes/" &&
        pathname !== "/submissions/hours/" &&
        pathname !== "/submissions/day/"
    ) {
        return handleError(res, 404);
    }

    try {
        let response = "";
        let timekeeper = {
            timeframe: 6000,
            multiplier: 10,
            unit: "m",
        };

        if (interval == "minutes") {
            timekeeper.multiplier = 10;
            timekeeper.timeframe = 6000;
            timekeeper.unit = "m";
        } else if (interval == "hours") {
            timekeeper.multiplier = 1;
            timekeeper.timeframe = 120;
            timekeeper.unit = "h";
        } else if (interval == "day") {
            timekeeper.multiplier = 2;
            timekeeper.timeframe = 200;
            timekeeper.unit = "h";
        }

        for (i = 0; i < 6; i++) {
            let total = 0;
            let newestComment = await Stats.getSingleData(
                dataType,
                `&subreddit=${subreddit}&before=${
          timekeeper.timeframe - (i + 1) * timekeeper.multiplier
        }${timekeeper.unit}&after=${
          timekeeper.timeframe - i * timekeeper.multiplier
        }${timekeeper.unit}&limit=1&sort=desc`
            );

            while (newestComment == 0) {
                timekeeper.timeframe += 24 * timekeeper.multiplier;
                newestComment = await Stats.getSingleData(
                    dataType,
                    `&subreddit=${subreddit}&before=${
            timekeeper.timeframe - (i + 1) * timekeeper.multiplier
          }${timekeeper.unit}&after=${
            timekeeper.timeframe - i * timekeeper.multiplier
          }${timekeeper.unit}&limit=1&sort=desc`
                );
            }

            let oldestComment = await Stats.getSingleData(
                dataType,
                `&subreddit=${subreddit}&before=${
          timekeeper.timeframe - (i + 1) * timekeeper.multiplier
        }${timekeeper.unit}&after=${
          timekeeper.timeframe - i * timekeeper.multiplier
        }${timekeeper.unit}&limit=1&sort=asc`
            );

            let data = await Stats.getNumberOfData(
                dataType,
                `&subreddit=${subreddit}&before=${
          timekeeper.timeframe - (i + 1) * timekeeper.multiplier
        }${timekeeper.unit}&after=${oldestComment - 1}&limit=100&sort=asc`
            );

            total += data.number;

            while (data.lastComment < newestComment) {
                data = await Stats.getNumberOfData(
                    dataType,
                    `&subreddit=${subreddit}&before=${
            timekeeper.timeframe - (i + 1) * timekeeper.multiplier
          }${timekeeper.unit}&after=${data.lastComment - 1}&limit=100&sort=asc`,
                    data.lastComment
                );

                total += data.number;
            }

            if (data.index != -1) {
                total -= data.number - data.index;
            }

            response += total + ",";
        }

        response = response.substring(0, response.length - 1);
        res.statusCode = 200;
        res.write(JSON.stringify(response));
        return res.end();
    } catch (err) {
        if (!Object.keys(http.STATUS_CODES).includes(err.statusCode)) {
            res.statusCode = 503;
            res.end(JSON.stringify({ message: "Server unavailable" }));
        } else {
            res.statusCode = err.statusCode;
            res.end(JSON.stringify(err.message));
        }
    }
}

function handleError(res, code) {
    res.statusCode = code;
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`);
    return;
}

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});