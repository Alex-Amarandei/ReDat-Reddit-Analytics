var con = require('./db');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;


async function getCommunityPosts(filterType, redditToken, communityName) {
    return new Promise((resolve, reject) => {
        console.log(filterType, redditToken, communityName);
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
        var theUrl = `https://oauth.reddit.com/r/${communityName}/${filterType}.json?limit=50`;
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader('Authorization', `bearer ${redditToken}`)
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body
                    const response = JSON.parse(xmlhttp.responseText);
                    resolve(response.data.children)

                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                reject(xmlhttp);
            }
        }

    })
}


async function getSubjectPosts(filterType, redditToken, subjectName) {
    return new Promise((resolve, reject) => {

        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
        var theUrl = `https://oauth.reddit.com/search?q=${subjectName}/${filterType}`; ////${filterType}
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader('Authorization', `bearer ${redditToken}`)
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body
                    const response = JSON.parse(xmlhttp.responseText);
                    resolve(response.data.children)

                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                reject(xmlhttp);
            }
        }

    })
}

async function getCommunitiesByUser(userId) {
    return new Promise((resolve, reject) => {
        const retrieveUserSql = "SELECT community_name from users_communities where user_id = ?";

        con.query(retrieveUserSql, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })

    })

}


const RedditData = function() {}

RedditData.prototype.getCommunitiesByUser = getCommunitiesByUser
RedditData.prototype.getCommunityPosts = getCommunityPosts
RedditData.prototype.getSubjectPosts = getSubjectPosts



module.exports = new RedditData()