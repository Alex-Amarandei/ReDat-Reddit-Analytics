function deleteNotification(element) {
    element.parentNode.remove();
}



function expandCard(element) {
    console.log(element);
    element.scroll = (e) => { element.stopPropagation() }
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
    } else {
        statsButton.style.display = "flex";
        postsButton.style.display = "none";

        postToolbarLeft.style.display = "flex";
        postToolbarRight.style.display = "flex";

        statsToolbarLeft.style.display = "none";
        statsToolbarRight.style.display = "none";

        postWrapper.style.display = "flex";
        statsWrapper.style.display = "none";
    }
}

function barChartSelected() {
    const barChart = document.getElementById("bar-chart");
    const columnChart = document.getElementById("column-chart");
    const lineChart = document.getElementById("line-chart");

    barChart.style.display = "flex";
    columnChart.style.display = "none";
    lineChart.style.display = "none";

}

function columnChartSelected() {
    const barChart = document.getElementById("bar-chart");
    const columnChart = document.getElementById("column-chart");
    const lineChart = document.getElementById("line-chart");

    barChart.style.display = "none";
    columnChart.style.display = "flex";
    lineChart.style.display = "none";
}

function lineChartSelected() {
    const barChart = document.getElementById("bar-chart");
    const columnChart = document.getElementById("column-chart");
    const lineChart = document.getElementById("line-chart");

    barChart.style.display = "none";
    columnChart.style.display = "none";
    lineChart.style.display = "flex";
}

function addToChartData(element) {
    if (element.style.backgroundColor == "rgba(255, 255, 255, 0.3)") {
        element.style.backgroundColor = "unset";
    } else {
        element.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    }

}

function loadPostsByFilters(selectedCommunities, filterType) {
    localStorage.setItem('communities', selectedCommunities);
    localStorage.setItem('filter', filterType);
    switch (selectedCommunities) {

        case "all":
            var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
            var theUrl = `https://oauth.reddit.com/${filterType}.json?limit=100`;
            xmlhttp.open("GET", theUrl);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader('Authorization', `bearer ${localStorage.getItem('redditToken')}`)
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

                        const postWrapper = document.getElementById('post-wrapper')
                        postWrapper.innerHTML = ' ';
                        retrievedCommunities.forEach((community) => {
                            postWrapper.insertAdjacentHTML('afterbegin', `
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
                            `)
                        });

                        var elements = document.getElementsByClassName('post');
                        console.log(elements.length)
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].addEventListener('click', function() {
                                expandCard(this);
                            })
                        }

                    }

                } else {

                    console.log('error', xmlhttp);
                }
            }
            break;

        case "your":
            var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
            var theUrl = `http://localhost:3031/communities?id=${localStorage.getItem("token")}&redditToken=${localStorage.getItem("redditToken")}&filterType=${filterType}`;
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
                            res = res.sort((obj1, obj2) => obj1.createdAt < obj2.createdAt)
                        else
                            res = res.sort((obj1, obj2) => obj1.score < obj2.score)

                        const postWrapper = document.getElementById('post-wrapper')
                        postWrapper.innerHTML = ' ';
                        res.forEach((post) => {
                            postWrapper.insertAdjacentHTML('afterbegin', `
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
                            `)
                        });

                        var elements = document.getElementsByClassName('post');
                        console.log(elements.length)
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].addEventListener('click', function() {
                                expandCard(this);
                            })
                        }
                        // console.log('success', JSON.parse(xmlhttp.responseText));
                    } else {
                        // What to do when the request has failed
                        console.log('error', xmlhttp);
                    }
                }


            }
        default:
            return;
    }
}

function logoutUser() {
    localStorage.clear();
    location.href = 'login.html';
}

(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
        var str = window.location.href;
        var lastIndex = str.lastIndexOf("/");
        var path = str.substring(0, lastIndex);
        var new_path = path + "/login.html";
        window.location.assign(new_path);
    } else {
        console.log('are token');
        return loadPostsByFilters(localStorage.getItem('communities'), localStorage.getItem('filter'))
    }
})();