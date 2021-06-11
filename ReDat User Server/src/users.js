var con = require("./db");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

async function getRedditToken() {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        var theUrl = "https://www.reddit.com/api/v1/access_token";
        xmlhttp.open("POST", theUrl);
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xmlhttp.setRequestHeader(
            "Authorization",
            "Basic b0lSQ21tOHJUTExpYlE6RkdaNmJVWi1MVGpiS0pnYlMzZzAycUUyejJzaEZB"
        );
        xmlhttp.send("grant_type=password&username=ioanapelinn&password=parola");

        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                resolve(xmlhttp.responseText);
            } else {
                reject(xmlhttp);
            }
        };
    });
}

function leftShifting(s, leftShifts) {
    return s.substring(leftShifts) + s.substring(0, leftShifts);
}

function rightShifting(s, rightShifts) {
    let l = s.length - rightShifts;
    return leftShifting(s, l);
}

async function getUserByEmail(userName) {
    return new Promise((resolve, reject) => {
        const retrieveUserSql = "SELECT * from users where email = ?";

        con.query(retrieveUserSql, [userName], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

async function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        const retrieveUserSql = "DELETE FROM users WHERE id = ?";

        con.query(retrieveUserSql, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

function generateID(username) {
    let i = 0;
    while (username.length < 20) {
        username += username.charAt(i);
        i++;
    }

    let code = "";

    for (i = 0; i < 20; i++) {
        let charToAdd =
            username.charAt(i).charCodeAt() +
            ((Math.floor(Math.random() * 100) * i) % 21);
        if (charToAdd < 33 || charToAdd > 126) {
            code += "_";
        } else {
            code += String.fromCharCode(charToAdd);
        }
    }

    return code;
}

async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        const retrieveUserSql = "SELECT * FROM users WHERE id = ?";

        con.query(retrieveUserSql, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

async function editUser(userId, field, value) {
    return new Promise((resolve, reject) => {
        const updateUserSql = `UPDATE users SET ${field} = ? WHERE id = ?`;
        if (field === "password") {
            value = Users.leftShifting(value, 5);
        }

        con.query(updateUserSql, [value, userId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

async function checkIfEmailAlreadyExists(email) {
    return new Promise((resolve, reject) => {
        const sqlToCheckIfEmailExists = "SELECT id from users where email = ?";

        con.query(sqlToCheckIfEmailExists, [email], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

async function saveUser(data) {
    return new Promise((resolve, reject) => {
        var sqlToInsert = "INSERT INTO USERS VALUES ?";
        con.query(sqlToInsert, [data], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const Users = function() {};

Users.prototype.deleteUser = deleteUser;
Users.prototype.getUserByEmail = getUserByEmail;
Users.prototype.editUser = editUser;
Users.prototype.getUserById = getUserById;
Users.prototype.saveUser = saveUser;
Users.prototype.leftShifting = leftShifting;
Users.prototype.rightShifting = rightShifting;
Users.prototype.checkIfEmailAlreadyExists = checkIfEmailAlreadyExists;
Users.prototype.getRedditToken = getRedditToken;
Users.prototype.generateID = generateID;

module.exports = new Users();