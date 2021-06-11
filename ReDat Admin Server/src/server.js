const http = require("http");
const qs = require("querystring");
const url = require("url");

const Admin = require("./src/admin.repo");

const port = 3032;

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
        return handlePostReq(req, res);
    } else if (req.method === "DELETE") {
        return res.end("DELETE");
    } else if (req.method === "PUT") {
        return handlePutReq(req, res);
    } else if (req.method === "OPTIONS") {
        return res.end("OPTIONS");
    }
});

async function handleGetReq(req, res) {
    const { pathname } = url.parse(req.url);

    if (pathname !== "/users/information") {
        return handleError(res, 404);
    }
    try {
        const usersInformation = await Admin.getUsers();
        let finalInformation = [];
        usersInformation.forEach((user) => {
            finalInformation = finalInformation.concat({
                id: user.id,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                banned: user.is_banned,
            });
        });
        res.write(JSON.stringify(finalInformation));
        res.statusCode = 200;
        return res.end();
    } catch (err) {
        if (!Object.keys(http.STATUS_CODES).includes(err.statusCode)) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: "Internal server error" }));
        } else {
            res.statusCode = err.statusCode;
            res.end(JSON.stringify({ message: err.message }));
        }
    }
}

function handlePostReq(req, res) {
    const size = parseInt(req.headers["content-length"], 10);
    const buffer = Buffer.allocUnsafe(size);
    var pos = 0;

    const { pathname } = url.parse(req.url);
    if (pathname !== "/delete/user" && pathname !== "/grant/user") {
        return handleError(res, 404);
    }

    req
        .on("data", (chunk) => {
            const offset = pos + chunk.length;
            if (offset > size) {
                reject(413, "Too Large", res);
                return;
            }
            chunk.copy(buffer, pos);
            pos = offset;
        })
        .on("end", async() => {
            if (pos !== size) {
                reject(400, "Bad Request", res);
                return;
            }
            const data = JSON.parse(buffer.toString());

            try {
                let userId = data.id.trim();
                switch (pathname) {
                    case "/delete/user":
                        let responseBanned = await Admin.banUser(userId);
                        if (responseBanned) {
                            res.statusCode = 200;
                            res.end(
                                JSON.stringify({ bannedMessage: "User successfully banned" })
                            );
                        } else {
                            throw { statusCode: 500, message: "Internal server error" };
                        }
                        break;

                    case "/grant/user":
                        let responseGranted = await Admin.grantUser(userId);
                        if (responseGranted) {
                            res.statusCode = 200;
                            res.end(
                                JSON.stringify({
                                    grantedMessage: "User successfully granted",
                                })
                            );
                        } else {
                            throw {
                                statusCode: 500,
                                message: "Internal server error",
                            };
                        }
                        break;
                }
            } catch (err) {
                if (!Object.keys(http.STATUS_CODES).includes(err.statusCode)) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ message: "Internal server error" }));
                } else {
                    res.statusCode = err.statusCode;
                    res.end(JSON.stringify(err.message));
                }
            }
        });
}

function handlePutReq(req, res) {
    const { pathname } = url.parse(req.url);
    if (pathname !== "/user") {
        return handleError(res, 404);
    }

    const size = parseInt(req.headers["content-length"], 10);
    const buffer = Buffer.allocUnsafe(size);
    var pos = 0;
    req
        .on("data", (chunk) => {
            const offset = pos + chunk.length;
            if (offset > size) {
                reject(413, "Too Large", res);
                return;
            }
            chunk.copy(buffer, pos);
            pos = offset;
        })
        .on("end", async() => {
            if (pos !== size) {
                reject(400, "Bad Request", res);
                return;
            }

            try {
                const responseObj = {};
                const data = JSON.parse(buffer.toString());
                const email = data.userName;
                const password = data.password;

                const user = await Users.getUserByEmail(email)
                    .then((result) => {
                        if (result) {
                            return result || [];
                        }
                    })
                    .catch((err) =>
                        setImmediate(() => {
                            throw err;
                        })
                    );

                if (!user.length) {
                    throw { statusCode: 404, message: "User not found!" };
                }

                if (user.is_banned) {
                    throw { status: 403, message: "You are banned" };
                }

                const foundUser = user[0];

                if (Users.rightShifting(foundUser.password, 5) === password) {
                    const token = `${foundUser.id}_${foundUser.username}`;
                    responseObj.token = token;
                } else {
                    throw { statusCode: 403, meesage: "Forbidden access" };
                }

                const response = await Users.getRedditToken();
                const parsedRes = JSON.parse(response);
                responseObj.redditToken = parsedRes["access_token"];
                responseObj.isAdmin = foundUser.is_admin;

                res.write(JSON.stringify(responseObj));
                res.statusCode = 200;
                res.end();
            } catch (err) {
                if (!Object.keys(http.STATUS_CODES).includes(err.statusCode)) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ message: "Internal server error" }));
                } else {
                    res.statusCode = err.statusCode;
                    res.end(JSON.stringify({ errMessage: err.message }));
                }
            }
        });
}

function handleError(res, code) {
    res.statusCode = code;
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`);
    return;
}

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});