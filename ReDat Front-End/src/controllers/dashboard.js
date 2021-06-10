function deleteNotification(element) {
    element.parentNode.remove();
}

function expandCard(element) {
    console.log(element);
    element.scroll = (e) => {
        element.stopPropagation();
    };
    if (element.classList.contains("post")) {
        if (element.classList.contains("expand-card")) {
            element.classList.remove("expand-card");
            element.childNodes[7].classList.remove("expand-card");
        } else {
            element.classList.add("expand-card");
            element.childNodes[7].classList.add("expand-card");
        }
    } else {
        if (element.classList.contains("expand-card")) {
            element.classList.remove("expand-card");
            element.childNodes[1].childNodes[3].classList.remove("expand-card");
        } else {
            element.classList.add("expand-card");
            element.childNodes[1].childNodes[3].classList.add("expand-card");
        }
    }
}

function switchMode() {
    const statsButton = document.getElementById("statistics-button");
    const postsButton = document.getElementById("post-button");
    const postToolbarLeft = document.getElementById("post-toolbar-left");
    const postToolbarRight = document.getElementById("post-toolbar-right");
    const statsToolbarLeft = document.getElementById("stats-toolbar-left");
    const statsToolbarRight = document.getElementById("stats-toolbar-right");
    const postWrapper = document.getElementById("post-wrapper");
    const statsWrapper = document.getElementById("stats-wrapper");

    if (statsButton.style.display != "none") {
        statsButton.style.display = "none";
        postsButton.style.display = "flex";

        postToolbarLeft.style.display = "none";
        postToolbarRight.style.display = "none";

        statsToolbarLeft.style.display = "flex";
        statsToolbarRight.style.display = "flex";

        postWrapper.style.display = "none";
        statsWrapper.style.display = "flex";

        /////
        if (document.getElementById("allReddit").checked == true)
            document.getElementById("allReddit").checked = false;
        if (document.getElementById("yourCommunities").checked == true)
            document.getElementById("yourCommunities").checked = false;

        localStorage.setItem("communitiesToShow", JSON.stringify([]));
        localStorage.setItem("subjectsToShow", JSON.stringify([]));

        var elements = document.getElementsByClassName("item-community");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "unset";
        }

        var elements = document.getElementsByClassName("item-subject");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "unset";
            elements[i].style.cursor = "default";
        }

        localStorage.setItem("pageAction", "stats");
    } else {
        statsButton.style.display = "flex";
        postsButton.style.display = "none";

        postToolbarLeft.style.display = "flex";
        postToolbarRight.style.display = "flex";

        statsToolbarLeft.style.display = "none";
        statsToolbarRight.style.display = "none";

        postWrapper.style.display = "flex";
        statsWrapper.style.display = "none";

        localStorage.setItem("pageAction", "explore");
        localStorage.setItem("intervalStats", "");
        localStorage.setItem("actionStats", "");
        localStorage.setItem("subreddit", "");
        localStorage.setItem("valuesForStats", "");
        const myCommunities = document.getElementById("communities-list");
        for (let i = 0; i < myCommunities.children.length; i++) {
            myCommunities.children[i].style.backgroundColor = "unset";
        }
        //////// du te la all communities
        location.reload();
    }
}

function manageClickOnCommunity(element, communityName) {
    var pageAction = localStorage.getItem("pageAction");
    if (pageAction === "stats") {
        if (element.style.backgroundColor == "rgba(255, 255, 255, 0.3)")
            element.style.backgroundColor = "unset";
        else {
            const myCommunities = document.getElementById("communities-list");
            for (let i = 0; i < myCommunities.children.length; i++) {
                myCommunities.children[i].style.backgroundColor = "unset";
            }
            element.style.backgroundColor = "#ffffff4D";
        }

        localStorage.setItem("subreddit", communityName);
        /////////bagam stats
    } else {
        if (document.getElementById("allReddit").checked == true)
            document.getElementById("allReddit").checked = false;
        if (document.getElementById("yourCommunities").checked == true)
            document.getElementById("yourCommunities").checked = false;

        localStorage.setItem("subjectsToShow", JSON.stringify([]));
        const doc = document.getElementById("loader");
        doc.style.opacity = 10;
        doc.style.zIndex = 10;
        document.getElementById("post-wrapper").style.opacity = -10;

        var elements = document.getElementsByClassName("item-subject");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "unset";
        }

        var communitiesToShow = localStorage.getItem("communitiesToShow");
        communitiesToShow = communitiesToShow.replace(/[\[\]\"]/g, "");
        communitiesToShow = communitiesToShow.split(",");

        if (communitiesToShow.includes(communityName)) {
            element.style.backgroundColor = "unset";
            let index = communitiesToShow.indexOf(communityName);
            communitiesToShow.splice(index, 1);
            localStorage.setItem(
                "communitiesToShow",
                JSON.stringify(communitiesToShow)
            );
        } else {
            let size;
            element.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            if (communitiesToShow[0] === "") size = 0;
            else size = communitiesToShow.length;
            communitiesToShow[size] = communityName;
            localStorage.setItem(
                "communitiesToShow",
                JSON.stringify(communitiesToShow)
            );
        }

        var filterType = localStorage.getItem("filter");
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
        var theUrl = `http://localhost:3031/selected/your/communities?id=${localStorage.getItem(
      "token"
    )}&redditToken=${localStorage.getItem(
      "redditToken"
    )}&filterType=${filterType}&toShow=${localStorage.getItem(
      "communitiesToShow"
    )}`;
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body
                    let res = JSON.parse(xmlhttp.responseText);
                    console.log(res);

                    if (filterType === "new")
                        res = res.sort((obj1, obj2) => obj1.createdAt < obj2.createdAt);
                    else res = res.sort((obj1, obj2) => obj1.score < obj2.score);

                    const postWrapper = document.getElementById("post-wrapper");
                    postWrapper.innerHTML = " ";
                    res.forEach((post) => {
                        postWrapper.insertAdjacentHTML(
                            "afterbegin",
                            `
                    <div class="post">
                    <div class="post-header">
                        <span class="material-icons-outlined">flutter_dash</span>
                        <h1>${post.community}</h1>
                    </div>

                    <h2>${post.author}</h2>

                    <h3>${post.title}</h3>

                    <div class="post-content">
                        ${post.content}
                    </div>
                     </div>
                    `
                        );
                    });

                    var elements = document.getElementsByClassName("post");
                    console.log(elements.length);
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].addEventListener("click", function() {
                            expandCard(this);
                        });
                    }
                    const doc = document.getElementById("loader");
                    doc.style.opacity = -10;
                    doc.style.zIndex = -10;
                    document.getElementById("post-wrapper").style.opacity = 10;
                    // console.log('success', JSON.parse(xmlhttp.responseText));
                } else {
                    const doc = document.getElementById("loader");
                    doc.style.opacity = -10;
                    doc.style.zIndex = -10;
                    document.getElementById("post-wrapper").style.opacity = 10;
                    // What to do when the request has failed
                    console.log("error", xmlhttp);
                }
            }
        };
    }
}

function showPostsBySubject(element, subject) {
    var pageAction = localStorage.getItem("pageAction");
    if (pageAction === "stats") {
        return;
    }

    if (document.getElementById("allReddit").checked == true)
        document.getElementById("allReddit").checked = false;
    if (document.getElementById("yourCommunities").checked == true)
        document.getElementById("yourCommunities").checked = false;
    localStorage.setItem("communitiesToShow", JSON.stringify([]));

    const doc = document.getElementById("loader");
    doc.style.opacity = 10;
    doc.style.zIndex = 10;
    document.getElementById("post-wrapper").style.opacity = -10;
    var elements = document.getElementsByClassName("item-community");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "unset";
    }

    var subjectsToShow = localStorage.getItem("subjectsToShow");
    subjectsToShow = subjectsToShow.replace(/[\[\]\"]/g, "");
    subjectsToShow = subjectsToShow.split(",");

    if (subjectsToShow.includes(subject)) {
        element.style.backgroundColor = "unset";
        let index = subjectsToShow.indexOf(subject);
        subjectsToShow.splice(index, 1);
        localStorage.setItem("subjectsToShow", JSON.stringify(subjectsToShow));
    } else {
        let size;
        element.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
        if (subjectsToShow[0] === "") size = 0;
        else size = subjectsToShow.length;
        subjectsToShow[size] = subject;
        localStorage.setItem("subjectsToShow", JSON.stringify(subjectsToShow));
    }

    var filterType = localStorage.getItem("filter");
    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
    var theUrl = `http://localhost:3031/selected/your/subjects?id=${localStorage.getItem(
    "token"
  )}&redditToken=${localStorage.getItem(
    "redditToken"
  )}&filterType=${filterType}&toShow=${localStorage.getItem("subjectsToShow")}`;
    xmlhttp.open("GET", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                let res = JSON.parse(xmlhttp.responseText);
                console.log(res);

                if (filterType === "new")
                    res = res.sort((obj1, obj2) => obj1.createdAt < obj2.createdAt);
                else res = res.sort((obj1, obj2) => obj1.score < obj2.score);

                const postWrapper = document.getElementById("post-wrapper");
                postWrapper.innerHTML = " ";
                res.forEach((post) => {
                    postWrapper.insertAdjacentHTML(
                        "afterbegin",
                        `
                    <div class="post">
                    <div class="post-header">
                        <span class="material-icons-outlined">flutter_dash</span>
                        <h1>${post.community}</h1>
                    </div>

                    <h2>${post.author}</h2>

                    <h3>${post.title}</h3>

                    <div class="post-content">
                        ${post.content}
                    </div>
                     </div>
                    `
                    );
                });

                var elements = document.getElementsByClassName("post");
                console.log(elements.length);
                for (var i = 0; i < elements.length; i++) {
                    elements[i].addEventListener("click", function() {
                        expandCard(this);
                    });
                }
                const doc = document.getElementById("loader");
                doc.style.opacity = -10;
                doc.style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                const doc = document.getElementById("loader");
                doc.style.opacity = -10;
                doc.style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
                // What to do when the request has failed
                console.log("error", xmlhttp);
            }
        }
    };
}

function loadPostsByFilters(selectedCommunities, filterType) {
    localStorage.setItem("communitiesToShow", JSON.stringify([]));
    localStorage.setItem("subjectsToShow", JSON.stringify([]));

    const doc = document.getElementById("loader");
    doc.style.opacity = 10;
    doc.style.zIndex = 10;
    document.getElementById("post-wrapper").style.opacity = -10;

    var elements = document.getElementsByClassName("item-subject");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "unset";
    }
    var elements = document.getElementsByClassName("item-community");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "unset";
    }

    localStorage.setItem("communities", selectedCommunities);
    localStorage.setItem("filter", filterType);
    switch (selectedCommunities) {
        case "all":
            var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
            var theUrl = `https://oauth.reddit.com/${filterType}.json?limit=100`;
            xmlhttp.open("GET", theUrl);
            xmlhttp.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
            );
            xmlhttp.setRequestHeader(
                "Authorization",
                `bearer ${localStorage.getItem("redditToken")}`
            );
            xmlhttp.send(null);
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState !== 4) return;

                // Process our return data
                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    // What do when the request is successful
                    if (xmlhttp.responseText) {
                        // parse res body
                        const res = JSON.parse(xmlhttp.response);
                        const retrievedCommunities = res.data.children;
                        console.log(retrievedCommunities);
                        var posts = [];

                        const postWrapper = document.getElementById("post-wrapper");
                        postWrapper.innerHTML = " ";
                        retrievedCommunities.forEach((community) => {
                            postWrapper.insertAdjacentHTML(
                                "afterbegin",
                                `
                            <div class="post">
                            <div class="post-header">
                                <span class="material-icons-outlined">flutter_dash</span>
                                <h1>${community.data.subreddit_name_prefixed}</h1>
                            </div>

                            <h2>${community.data.author}</h2>

                            <h3>${community.data.title}</h3>

                            <div class="post-content">
                                ${community.data.selftext}
                            </div>
                             </div>
                            `
                            );
                        });

                        var elements = document.getElementsByClassName("post");
                        console.log(elements.length);
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].addEventListener("click", function() {
                                expandCard(this);
                            });
                        }
                        const doc = document.getElementById("loader");
                        doc.style.opacity = -10;
                        doc.style.zIndex = -10;
                        document.getElementById("post-wrapper").style.opacity = 10;
                    }
                } else {
                    const doc = document.getElementById("loader");
                    doc.style.opacity = -10;
                    doc.style.zIndex = -10;
                    document.getElementById("post-wrapper").style.opacity = 10;
                    console.log("error", xmlhttp);
                }
            };
            break;

        case "your":
            var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
            var theUrl = `http://localhost:3031/all/your/communities?id=${localStorage.getItem(
        "token"
      )}&redditToken=${localStorage.getItem(
        "redditToken"
      )}&filterType=${filterType}`;
            xmlhttp.open("GET", theUrl);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(null);
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState !== 4) return;

                // Process our return data
                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    // What do when the request is successful
                    if (xmlhttp.responseText) {
                        // parse res body
                        let res = JSON.parse(xmlhttp.responseText);

                        if (filterType === "new")
                            res = res.sort((obj1, obj2) => obj1.createdAt < obj2.createdAt);
                        else res = res.sort((obj1, obj2) => obj1.score < obj2.score);

                        const postWrapper = document.getElementById("post-wrapper");
                        postWrapper.innerHTML = " ";
                        res.forEach((post) => {
                            postWrapper.insertAdjacentHTML(
                                "afterbegin",
                                `
                            <div class="post">
                            <div class="post-header">
                                <span class="material-icons-outlined">flutter_dash</span>
                                <h1>${post.community}</h1>
                            </div>

                            <h2>${post.author}</h2>

                            <h3>${post.title}</h3>

                            <div class="post-content">
                                ${post.content}
                            </div>
                             </div>
                            `
                            );
                        });

                        var elements = document.getElementsByClassName("post");
                        console.log(elements.length);
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].addEventListener("click", function() {
                                expandCard(this);
                            });
                        }
                        const doc = document.getElementById("loader");
                        doc.style.opacity = -10;
                        doc.style.zIndex = -10;
                        document.getElementById("post-wrapper").style.opacity = 10;
                        // console.log('success', JSON.parse(xmlhttp.responseText));
                    } else {
                        const doc = document.getElementById("loader");
                        doc.style.opacity = -10;
                        doc.style.zIndex = -10;
                        document.getElementById("post-wrapper").style.opacity = 10;
                        // What to do when the request has failed
                        console.log("error", xmlhttp);
                    }
                }
            };
        default:
            return;
    }
}

function subscribeAdminAtCommunity(communityName) {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = `http://localhost:3031/subscribe/admin/at/community`;
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(
        JSON.stringify({
            redditToken: localStorage.getItem("redditToken"),
            community: communityName,
        })
    );
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                const res = JSON.parse(xmlhttp.response);
                if (res.message === "Subscription was successfully made!") {
                    alert(`Your subscription was succesfully made!`);
                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                console.log("error", xmlhttp);
            }
        }
    };
}

async function adminIsSubscribedAtCommunity(communityName) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
        var theUrl = `http://localhost:3031/admin/subscribed/at/community?id=${localStorage.getItem(
      "token"
    )}&redditToken=${localStorage.getItem(
      "redditToken"
    )}&communityName=${communityName}`;
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body
                    let res = JSON.parse(xmlhttp.responseText);
                    if (res.message === "Already subscribed") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            } else {
                // What to do when the request has failed
                console.log("error", xmlhttp);
                reject(false);
            }
        };
    });
}

async function addCommunityToUser(communityName) {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = `http://localhost:3031/add/community/to/user`;
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(
        JSON.stringify({
            community: communityName,
            userId: localStorage.getItem("token"),
        })
    );
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                const res = JSON.parse(xmlhttp.response);
                if (res.message === "Community was successfully added!") {}
                console.log("success");
            } else {
                // What to do when the request has failed
                console.log("error", xmlhttp);
            }
        }
    };
}

async function manageCommunity(element) {
    let label = element.innerHTML;
    const communityName =
        element.parentElement.parentElement.children[0].children[1].innerHTML;
    console.log(label, "Asta e label");
    switch (label) {
        case "Join":
            console.log("Am intrat in join");
            let alreadySubscribed = await adminIsSubscribedAtCommunity(communityName);
            if (!alreadySubscribed) subscribeAdminAtCommunity(communityName);
            addCommunityToUser(communityName);
            element.innerHTML = "Remove";
            refreshMyCommunities();
            break;

        case "Remove":
            console.log("Am intrat in remove");
            var xmlhttp = new XMLHttpRequest();
            var theUrl = `http://localhost:3031/remove/community`;
            xmlhttp.open("POST", theUrl);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(
                JSON.stringify({
                    id: `${localStorage.getItem("token")}`,
                    community: communityName,
                })
            );
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState !== 4) return;

                // Process our return data
                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    // What do when the request is successful
                    if (xmlhttp.responseText) {
                        // parse res body
                        const res = JSON.parse(xmlhttp.response);
                        if (res.removingMessage.length) {
                            console.log(res.removingMessage);
                            alert(`Your community was successfully removed!`);
                            element.innerHTML = "Join";
                            refreshMyCommunities();
                        }
                        // console.log('success', JSON.parse(xmlhttp.responseText));
                    } else {
                        // What to do when the request has failed
                        console.log("error", xmlhttp);
                    }
                }
            };
            break;
    }
}

function searchOnReddit() {
    const searchInput = document.forms["search-form"]["search"].value;
    console.log(searchInput);
    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
    var theUrl = `http://localhost:3031/search/communities?id=${localStorage.getItem(
    "token"
  )}&redditToken=${localStorage.getItem(
    "redditToken"
  )}&searchInput=${searchInput}`;
    xmlhttp.open("GET", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                let res = JSON.parse(xmlhttp.responseText);

                res = res.sort();
                let myCommunitiesNames = [];
                const myCommunities = document.getElementById("communities-list");

                for (let i = 0; i < myCommunities.children.length; i++) {
                    myCommunitiesNames = myCommunitiesNames.concat(
                        myCommunities.children[i].children[1].innerHTML
                    );
                }

                const communitiesWrapper = document.getElementById("post-wrapper");
                communitiesWrapper.innerHTML = " ";
                res.forEach((community) => {
                    if (myCommunitiesNames.includes(community.name)) {
                        communitiesWrapper.insertAdjacentHTML(
                            "beforeEnd",
                            `
                        <div class="post">
                        <div class="post-header" style="display: flex; flex-direction: row; justify-content: space-around; padding-left: 0px;">
                            <div class="post-header" style="padding-left:10px;">
                                <span>
                                <img src=${
                                  !!community.icon
                                    ? community.icon
                                    : "../images/logo.png"
                                } class="icon" >
                                </span>
                                <h1>${community.name}</h1>
                            </div>
    
                            <div style="padding-right: 15px;">
                                 <button class="join-remove-community" onclick="event.stopPropagation(); return manageCommunity(this);">Remove</button>
                            </div>
    
                        </div>
    
                        <h2>Subscribers: ${community.subscribers}</h2>
    
                        <h3>${community.title}</h3>
    
                        <div class="post-content">
                            ${community.description}
                        </div>
    
                         </div>
                        `
                        );
                    } else {
                        communitiesWrapper.insertAdjacentHTML(
                            "beforeEnd",
                            `
                        <div class="post">
                        <div class="post-header" style="display: flex; flex-direction: row; justify-content: space-around; padding-left: 0px;">
                            <div class="post-header" style="padding-left:10px;">
                                <span>
                                <img src=${
                                  !!community.icon
                                    ? community.icon
                                    : "../images/logo.png"
                                } class="icon" >
                                </span>
                                <h1>${community.name}</h1>
                            </div>
    
                            <div style="padding-right: 15px;">
                                 <button class="join-remove-community" onclick="event.stopPropagation(); return manageCommunity(this);">Join</button>
                            </div>
    
                        </div>
    
                        <h2>Subscribers: ${community.subscribers}</h2>
    
                        <h3>${community.title}</h3>
    
                        <div class="post-content">
                            ${community.description}
                        </div>
    
                         </div>
                        `
                        );
                    }
                });

                var elements = document.getElementsByClassName("post");
                console.log(elements.length);
                for (var i = 0; i < elements.length; i++) {
                    elements[i].addEventListener("click", function() {
                        expandCard(this);
                    });
                }
                const doc = document.getElementById("loader");
                doc.style.opacity = -10;
                doc.style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                const doc = document.getElementById("loader");
                doc.style.opacity = -10;
                doc.style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
                // What to do when the request has failed
                console.log("error", xmlhttp);
            }
        }
    };
}

function logoutUser() {
    localStorage.clear();
    var str = window.location.href;
    var lastIndex = str.lastIndexOf("/");
    var path = str.substring(0, lastIndex);
    var new_path = path + "/login.html";
    window.location.assign(new_path);
}

(() => {})();

window.onload = () => {
    console.log("here");
    console.log("are token");

    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
        var str = window.location.href;
        var lastIndex = str.lastIndexOf("/");
        var path = str.substring(0, lastIndex);
        var new_path = path + "/login.html";
        window.location.assign(new_path);
    } else {
        return loadPostsByFilters(
            localStorage.getItem("communities"),
            localStorage.getItem("filter")
        );
    }
};

function refreshMyCommunities() {
    console.log("apel");
    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
    var theUrl = `http://localhost:3031/my-communities?id=${localStorage.getItem(
    "token"
  )}`;
    xmlhttp.open("GET", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                let res = JSON.parse(xmlhttp.responseText);
                console.log(res);

                const communityWrapper = document.getElementById("communities-list");
                communityWrapper.innerHTML = " ";
                res.forEach((community) => {
                    communityWrapper.insertAdjacentHTML(
                        "afterbegin",
                        `
                    <div class="item-community" >
                    <span class="material-icons-outlined">flutter_dash</span>
                    <h1>${community.community_name}</h1>
                </div>
                    `
                    );
                });

                var elements = document.getElementsByClassName("item-community");

                for (var i = 0; i < elements.length; i++) {
                    let communityName = elements[i].textContent.replace(
                        "flutter_dash",
                        ""
                    );
                    communityName = communityName.trim();
                    elements[i].addEventListener("click", function() {
                        return manageClickOnCommunity(this, communityName);
                    });
                }
                document.getElementById("loader").style.opacity = -10;
                document.getElementById("loader").style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
            } else {
                // What to do when the request has failed
                document.getElementById("loader").style.opacity = -10;
                document.getElementById("loader").style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
                console.log("error", xmlhttp);
            }
        }
    };
}

(() => {
    localStorage.setItem("pageAction", "explore");
    localStorage.setItem("chartType", "line-chart");
    localStorage.setItem("subreddit", "");
    localStorage.setItem("actionStats", "");
    localStorage.setItem("intervalStats", "");
    refreshMyCommunities();
})();