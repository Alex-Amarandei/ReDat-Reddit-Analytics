const http = require("http");
const qs = require("querystring");
const url = require("url");

const Users = require("./src/users");
const port = 3030;

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
    const { pathname, query } = url.parse(req.url);

    if (
        pathname !== "/my/information" &&
        pathname !== "/verify/password" &&
        pathname !== "/verify/email/unique" &&
        pathname !== "/refresh-reddit-token"
    ) {
        return handleError(res, 404);
    }
    let { id, info } = qs.parse(query);
    let userId = "";
    if (id) {
        userId = id.split("_")[0];
    }

    if (!id) {
        throw { statusCode: 404, message: "User not found!" };
    }

    try {
        const userInformation = await Users.getUserById(userId);

        switch (pathname) {
            case "/refresh-reddit-token":
                const response = await Users.getRedditToken();
                const parsedRes = JSON.parse(response);
                res.write(JSON.stringify({ redditToken: parsedRes.access_token }));
                break;
            case "/my/information":
                res.write(
                    JSON.stringify({
                        first_name: userInformation[0].first_name,
                        last_name: userInformation[0].last_name,
                        username: userInformation[0].username,
                        email: userInformation[0].email,
                    })
                );
                break;

            case "/verify/password":
                userInformation[0].password = Users.rightShifting(
                    userInformation[0].password,
                    5
                );
                if (userInformation[0].password === info)
                    res.write(JSON.stringify({ message: "Same password" }));
                else res.write(JSON.stringify({ message: "Wrong password" }));
                break;

            case "/verify/email/unique":
                const checkIfUserExists = await Users.checkIfEmailAlreadyExists(info);
                if (checkIfUserExists.length !== 0) {
                    if (checkIfUserExists[0].id !== userId)
                        res.write(JSON.stringify({ message: "Email already exists!" }));
                    else res.write(JSON.stringify({ message: "Email is valid!" }));
                } else res.write(JSON.stringify({ message: "Email is valid!" }));
                break;
            default:
                break;
        }

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

async function handlePostReq(req, res) {
    const size = parseInt(req.headers["content-length"], 10);
    const buffer = Buffer.allocUnsafe(size);
    var pos = 0;

    const { pathname } = url.parse(req.url);
    if (
        pathname !== "/user" &&
        pathname !== "/edit/user" &&
        pathname !== "/delete/user"
    ) {
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
                if (pathname === "/user") {
                    if (!data.userName ||
                        !data.firstName ||
                        !data.email ||
                        !data.lastName ||
                        !data.password ||
                        !data.confirm
                    ) {
                        throw { statusCode: 400, message: "Bad Request" };
                    }

                    if (data.password !== data.confirm) {
                        throw { statusCode: 400, message: "Bad Request" };
                    }

                    const checkIfUserExists = await Users.checkIfEmailAlreadyExists(
                            data.email
                        )
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

                    if (checkIfUserExists.length) {
                        throw { statusCode: 400, message: "Email already exists" };
                    }

                    const newPassword = Users.leftShifting(data.password, 5);
                    const userId = Users.generateID(data.userName);

                    const valuesToInsert = [
                        [
                            userId,
                            data.userName,
                            data.firstName,
                            data.lastName,
                            data.email,
                            0,
                            0,
                            newPassword,
                        ],
                    ];

                    const registerRes = await Users.saveUser(valuesToInsert);
                    if (registerRes) {
                        res.setHeader("Content-Type", "*/*");
                        res.statusCode = 200;
                        res.end(
                            JSON.stringify({
                                registerMessage: "User successfully created",
                            })
                        );
                    } else {
                        throw { statusCode: 500, message: "Internal server error" };
                    }
                } else if (pathname === "/edit/user") {
                    const userId = data.id.split("_")[0];
                    if (!data.id) {
                        throw { statusCode: 404, message: "User not found!" };
                    }
                    let responseUpdate = await Users.editUser(
                        userId,
                        data.field,
                        data.newValue
                    );
                    if (responseUpdate) {
                        res.setHeader("Content-Type", "*/*");
                        res.statusCode = 200;
                        res.end(
                            JSON.stringify({
                                editingMessage: "User successfully updated",
                            })
                        );
                    } else {
                        throw { statusCode: 500, message: "Internal server error" };
                    }
                } else if (pathname === "/delete/user") {
                    const userId = data.id.split("_")[0];
                    if (!data.id) {
                        throw { statusCode: 404, message: "User not found!" };
                    }
                    let responseDelete = await Users.deleteUser(userId);
                    if (responseDelete) {
                        res.setHeader("Content-Type", "*/*");
                        res.statusCode = 200;
                        res.end(
                            JSON.stringify({
                                deletingMessage: "User successfully deleted",
                            })
                        );
                    } else {
                        throw { statusCode: 500, message: "Internal server error" };
                    }
                }
            } catch (err) {
                if (!Object.keys(http.STATUS_CODES).includes(err.statusCode)) {
                    res.statusCode = 500;
                    res.end(JSON.stringify("Internal server error"));
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
                    throw { statusCode: 404, errMessage: "User not found!" };
                }

                const foundUser = user[0];

                if (foundUser.is_banned) {
                    throw {
                        statusCode: 403,
                        errMessage: "You are banned",
                    };
                }

                if (Users.rightShifting(foundUser.password, 5) === password) {
                    const token = `${foundUser.id}_${foundUser.username}`;
                    responseObj.token = token;
                } else {
                    throw { statusCode: 403, errMessage: "Forbidden access" };
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
                    res.statusCode = err.statusCode;
                    res.end(JSON.stringify({ errMessage: err.errMessage }));
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