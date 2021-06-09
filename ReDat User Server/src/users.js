var con = require('./db');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

async function getRedditToken() {
    return new Promise((resolve, reject) => {;

        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
        var theUrl = "https://www.reddit.com/api/v1/access_token";
        xmlhttp.open("POST", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader("Authorization", "Basic b0lSQ21tOHJUTExpYlE6RkdaNmJVWi1MVGpiS0pnYlMzZzAycUUyejJzaEZB")
        xmlhttp.send('grant_type=password&username=ioanapelinn&password=parola');
        // grant_type: 'password',
        // username: 'ioanapelinn',
        // password: 'parola'
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                resolve(xmlhttp.responseText)

                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                reject(xmlhttp);
                console.log('error', xmlhttp);
            }
        }

    })
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
            console.log(result)
            resolve(result);
        })

    })

}


async function deleteUser(userId) {
    return new Promise((resolve, reject) => {
        const retrieveUserSql = "DELETE FROM users WHERE id = ?";

        con.query(retrieveUserSql, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })

    })

}


async function getUserById(userId) {
    return new Promise((resolve, reject) => {
        const retrieveUserSql = "SELECT * FROM users WHERE id = ?";

        con.query(retrieveUserSql, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })

    })

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
        })

    })
}

async function checkIfEmailAlreadyExists(email) {
    return new Promise((resolve, reject) => {
        const sqlToCheckIfEmailExists = "SELECT id from users where email = ?";

        con.query(sqlToCheckIfEmailExists, [email], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })

    })
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
        })
    })
}


// function deleteUser(id) {
//     const numberOfUsers = users.length
//     users = users.filter(user => user.id != id);
//     return users.length !== numberOfUsers
// }

// function replaceUser(id, user) {
//     const foundUser = users.filter(usr => usr.id == id);
//     if (foundUser.length === 0) return false
//     users = users.map(usr => {
//         if (id == usr.id) {
//             usr = { id: usr.id, ...user };
//         }
//         return usr
//     })
//     return true
// }

const Users = function() {}

Users.prototype.deleteUser = deleteUser
Users.prototype.getUserByEmail = getUserByEmail
Users.prototype.editUser = editUser
Users.prototype.getUserById = getUserById
Users.prototype.saveUser = saveUser
Users.prototype.leftShifting = leftShifting
Users.prototype.rightShifting = rightShifting
Users.prototype.checkIfEmailAlreadyExists = checkIfEmailAlreadyExists
Users.prototype.getRedditToken = getRedditToken


module.exports = new Users()