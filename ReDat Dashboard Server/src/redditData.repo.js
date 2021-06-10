var con = require("./db");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

async function getCommunityPosts(
    filterType,
    redditToken,
    communityName,
    limit
) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
        var theUrl = `https://oauth.reddit.com/r/${communityName}/${filterType}.json?limit=${limit}`;
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xmlhttp.setRequestHeader("Authorization", `bearer ${redditToken}`);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body
                    const response = JSON.parse(xmlhttp.responseText);
                    resolve(response.data.children);
                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed

                reject(xmlhttp);
            }
        };
    });
}

async function getSubjectPosts(filterType, redditToken, subjectName) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
        var theUrl = `https://oauth.reddit.com/search?q=${subjectName}/${filterType}`; ////${filterType}
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xmlhttp.setRequestHeader("Authorization", `bearer ${redditToken}`);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body
                    const response = JSON.parse(xmlhttp.responseText);
                    resolve(response.data.children);
                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                reject(xmlhttp);
            }
        };
    });
}

async function getCommunitiesByUser(userId) {
    return new Promise((resolve, reject) => {
        const retrieveUserSql =
            "SELECT community_name from users_communities where user_id = ?";

        con.query(retrieveUserSql, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

async function addCommunityToUser(userId, community) {
    return new Promise((resolve, reject) => {
        const insertCommunityToUser =
            "INSERT INTO users_communities(user_id, community_name) VALUES (?, ?)";
        console.log(insertCommunityToUser, userId, community);
        con.query(insertCommunityToUser, [userId, community], (err, result) => {
            if (err) {
                console.log("aici4");
                reject(err);
            }
            console.log("aici5");
            console.log(result + "da");
            resolve("Succes");
        });
    });
}

async function removeCommunityForUser(userId, community) {
    return new Promise((resolve, reject) => {
        const retrieveUserSql =
            "DELETE FROM users_communities WHERE user_id = ? AND community_name = ?";

        con.query(retrieveUserSql, [userId, community], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

async function getSubscribedCommunities(redditToken) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
        var theUrl = "https://oauth.reddit.com/subreddits/mine/subscriber"; ////${filterType}
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xmlhttp.setRequestHeader("Authorization", `bearer ${redditToken}`);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body
                    const response = JSON.parse(xmlhttp.responseText);
                    resolve(response.data.children);
                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                reject(xmlhttp);
            }
        };
    });
}
async function subscribeAdminAtCommunity(redditToken, community) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
        var theUrl = "https://oauth.reddit.com/api/subscribe"; ////${filterType}
        xmlhttp.open("POST", theUrl);
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xmlhttp.setRequestHeader("Authorization", `bearer ${redditToken}`);
        xmlhttp.send(`action=sub&sr_name=${community}`);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body

                    const response = "Successfully!";
                    resolve(response);
                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                reject(xmlhttp);
            }
        };
    });
}

async function getCommunitiesByName(redditToken, searchInput) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
        var theUrl = `https://oauth.reddit.com/subreddits/search?q=${searchInput}&limit=100`; ////${filterType}
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        xmlhttp.setRequestHeader("Authorization", `bearer ${redditToken}`);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body
                    const response = JSON.parse(xmlhttp.responseText);
                    resolve(response.data.children);
                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                reject(xmlhttp);
            }
        };
    });
}

const RedditData = function() {};

RedditData.prototype.getCommunitiesByUser = getCommunitiesByUser;
RedditData.prototype.getCommunityPosts = getCommunityPosts;
RedditData.prototype.getSubjectPosts = getSubjectPosts;
RedditData.prototype.getCommunitiesByName = getCommunitiesByName;
RedditData.prototype.removeCommunityForUser = removeCommunityForUser;
RedditData.prototype.getSubscribedCommunities = getSubscribedCommunities;
RedditData.prototype.subscribeAdminAtCommunity = subscribeAdminAtCommunity;
RedditData.prototype.addCommunityToUser = addCommunityToUser;

module.exports = new RedditData();