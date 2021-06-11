function deleteNotification(element) {
    element.parentNode.remove();
}

function expandCard(element) {
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

        localStorage.setItem("communities", "your");
        localStorage.setItem("pageAction", "explore");
        localStorage.setItem("intervalStats", "");
        localStorage.setItem("actionStats", "");
        localStorage.setItem("subreddit", "");
        localStorage.setItem("valuesForStats", "");
        const myCommunities = document.getElementById("communities-list");
        for (let i = 0; i < myCommunities.children.length; i++) {
            myCommunities.children[i].style.backgroundColor = "unset";
        }
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
    } else {
        localStorage.setItem("communities", "");

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
        var xmlhttp = new XMLHttpRequest();
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

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                if (xmlhttp.responseText) {
                    let res = JSON.parse(xmlhttp.responseText);

                    if (filterType == "new") {
                        res = res.sort((obj1, obj2) =>
                            new Date(obj1.createdAt) < new Date(obj2.createdAt) ? 1 : -1
                        );
                    } else
                        res = res.sort(
                            (obj1, obj2) => parseFloat(obj1.score) > parseFloat(obj2.score)
                        );
                    const postWrapper = document.getElementById("post-wrapper");
                    postWrapper.innerHTML = " ";
                    res.forEach((post) => {
                        postWrapper.insertAdjacentHTML(
                            "beforeEnd",
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
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].addEventListener("click", function() {
                            expandCard(this);
                        });
                    }
                    const doc = document.getElementById("loader");
                    doc.style.opacity = -10;
                    doc.style.zIndex = -10;
                    document.getElementById("post-wrapper").style.opacity = 10;
                } else {
                    const doc = document.getElementById("loader");
                    doc.style.opacity = -10;
                    doc.style.zIndex = -10;
                    document.getElementById("post-wrapper").style.opacity = 10;
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
    localStorage.setItem("communities", "");

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
    var xmlhttp = new XMLHttpRequest();
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

        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            if (xmlhttp.responseText) {
                let res = JSON.parse(xmlhttp.responseText);

                if (filterType == "new")
                    res = res.sort((obj1, obj2) =>
                        new Date(obj1.createdAt) < new Date(obj2.createdAt) ? 1 : -1
                    );
                else
                    res = res.sort(
                        (obj1, obj2) => parseFloat(obj1.score) > parseFloat(obj2.score)
                    );
                const postWrapper = document.getElementById("post-wrapper");
                postWrapper.innerHTML = " ";
                res.forEach((post) => {
                    postWrapper.insertAdjacentHTML(
                        "beforeEnd",
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
                for (var i = 0; i < elements.length; i++) {
                    elements[i].addEventListener("click", function() {
                        expandCard(this);
                    });
                }
                const doc = document.getElementById("loader");
                doc.style.opacity = -10;
                doc.style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
            } else {
                const doc = document.getElementById("loader");
                doc.style.opacity = -10;
                doc.style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
                console.log("error", xmlhttp);
            }
        }
    };
}

function loadPostsByFilters(selectedCommunities, filterType) {
    localStorage.setItem("communitiesToShow", JSON.stringify([]));
    localStorage.setItem("subjectsToShow", JSON.stringify([]));
    setTimeout(() => {
        const doc = document.getElementById("loader");
        doc.style.opacity = 10;
        doc.style.zIndex = 10;
        document.getElementById("post-wrapper").style.opacity = -10;
    });

    localStorage.setItem("communities", selectedCommunities);
    localStorage.setItem("filter", filterType);

    if (localStorage.getItem("communities")) {
        var elements = document.getElementsByClassName("item-subject");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "unset";
        }
        var elements = document.getElementsByClassName("item-community");
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = "unset";
        }
    }

    switch (selectedCommunities) {
        case "all":
            var xmlhttp = new XMLHttpRequest();
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

                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    if (xmlhttp.responseText) {
                        const res = JSON.parse(xmlhttp.response);
                        const retrievedCommunities = res.data.children;

                        const postWrapper = document.getElementById("post-wrapper");
                        postWrapper.innerHTML = " ";
                        retrievedCommunities.forEach((community) => {
                            postWrapper.insertAdjacentHTML(
                                "beforeEnd",
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
                }
            };
            break;

        case "your":
            var xmlhttp = new XMLHttpRequest();
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

                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    if (xmlhttp.responseText) {
                        let res = JSON.parse(xmlhttp.responseText);

                        res = res.sort((obj1, obj2) =>
                            new Date(obj1.createdAt) < new Date(obj2.createdAt) ? 1 : -1
                        );
                        if (res[0]) {
                            localStorage.setItem("lastUtc", res[0].createdAt.toString());
                        } else {
                            localStorage.setItem("lastUtc", "0");
                        }

                        if (filterType == "hot") {
                            res = res.sort(
                                (obj1, obj2) => parseFloat(obj1.score) > parseFloat(obj2.score)
                            );
                        }
                        const postWrapper = document.getElementById("post-wrapper");
                        postWrapper.innerHTML = " ";
                        res.forEach((post) => {
                            postWrapper.insertAdjacentHTML(
                                "beforeEnd",
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
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].addEventListener("click", function() {
                                expandCard(this);
                            });
                        }
                        const doc = document.getElementById("loader");
                        doc.style.opacity = -10;
                        doc.style.zIndex = -10;
                        document.getElementById("post-wrapper").style.opacity = 10;
                    } else {
                        const doc = document.getElementById("loader");
                        doc.style.opacity = -10;
                        doc.style.zIndex = -10;
                        document.getElementById("post-wrapper").style.opacity = 10;
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

        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            if (xmlhttp.responseText) {
                const res = JSON.parse(xmlhttp.response);
                if (res.message === "Subscription was successfully made!") {
                    alert(`Your subscription was succesfully made!`);
                }
            } else {
                console.log("error", xmlhttp);
            }
        }
    };
}

async function adminIsSubscribedAtCommunity(communityName) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
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

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                if (xmlhttp.responseText) {
                    let res = JSON.parse(xmlhttp.responseText);
                    if (res.message === "Already subscribed") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            } else {
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

        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            if (xmlhttp.responseText) {
                const res = JSON.parse(xmlhttp.response);
                if (res.message === "Community was successfully added!") {}
            } else {
                console.log("error", xmlhttp);
            }
        }
    };
}

async function manageCommunity(element) {
    let label = element.innerHTML;
    const communityName =
        element.parentElement.parentElement.children[0].children[1].innerHTML;
    switch (label) {
        case "Join":
            let alreadySubscribed = await adminIsSubscribedAtCommunity(communityName);
            if (!alreadySubscribed) subscribeAdminAtCommunity(communityName);
            addCommunityToUser(communityName);
            element.innerHTML = "Remove";
            refreshMyCommunities();
            break;

        case "Remove":
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

                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    if (xmlhttp.responseText) {
                        const res = JSON.parse(xmlhttp.response);
                        if (res.removingMessage.length) {
                            alert(`Your community was successfully removed!`);
                            element.innerHTML = "Join";
                            refreshMyCommunities();
                        }
                    } else {
                        console.log("error", xmlhttp);
                    }
                }
            };
            break;
    }
}

function searchOnReddit() {
    var elements = document.getElementsByClassName("item-subject");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "unset";
    }

    elements = document.getElementsByClassName("item-community");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "unset";
    }

    if (document.getElementById("allReddit").checked == true)
        document.getElementById("allReddit").checked = false;
    if (document.getElementById("yourCommunities").checked == true)
        document.getElementById("yourCommunities").checked = false;

    const doc = document.getElementById("loader");
    doc.style.opacity = 10;
    doc.style.zIndex = 10;
    document.getElementById("post-wrapper").style.opacity = -10;

    const searchInput = document.forms["search-form"]["search"].value;
    var xmlhttp = new XMLHttpRequest();
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

        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            if (xmlhttp.responseText) {
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
                for (var i = 0; i < elements.length; i++) {
                    elements[i].addEventListener("click", function() {
                        expandCard(this);
                    });
                }
                const doc = document.getElementById("loader");
                doc.style.opacity = -10;
                doc.style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
            } else {
                const doc = document.getElementById("loader");
                doc.style.opacity = -10;
                doc.style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
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

window.onload = () => {
    const token = localStorage.getItem("token");
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
    var xmlhttp = new XMLHttpRequest();
    var theUrl = `http://localhost:3031/my-communities?id=${localStorage.getItem(
    "token"
  )}`;
    xmlhttp.open("GET", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            if (xmlhttp.responseText) {
                let res = JSON.parse(xmlhttp.responseText);

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
                document.getElementById("loader").style.opacity = -10;
                document.getElementById("loader").style.zIndex = -10;
                document.getElementById("post-wrapper").style.opacity = 10;
                console.log("error", xmlhttp);
            }
        }
    };
}

(() => {
    localStorage.setItem("communities", "your");
    localStorage.setItem("pageAction", "explore");
    localStorage.setItem("chartType", "line-chart");
    localStorage.setItem("subreddit", "");
    localStorage.setItem("actionStats", "");
    localStorage.setItem("intervalStats", "");
    refreshMyCommunities();
})();