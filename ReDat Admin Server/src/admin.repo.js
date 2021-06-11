var con = require("./db");

async function getUsers() {
    return new Promise((resolve, reject) => {
        const retrieveUsersSql = "SELECT * FROM users WHERE is_admin = 0";

        con.query(retrieveUsersSql, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

async function banUser(userId) {
    return new Promise((resolve, reject) => {
        const retrieveUsersSql = "UPDATE users SET is_banned = 1 WHERE id = ?";

        con.query(retrieveUsersSql, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

async function grantUser(userId) {
    return new Promise((resolve, reject) => {
        const retrieveUsersSql = "UPDATE users SET is_banned = 0 WHERE id = ?";

        con.query(retrieveUsersSql, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

const Admin = function() {};

Admin.prototype.grantUser = grantUser;
Admin.prototype.getUsers = getUsers;
Admin.prototype.banUser = banUser;

module.exports = new Admin();