function changeAccountView(element) {
    var children = element.children;
    var preview = children[0];
    var all = children[1];

    if (preview.style.display === "none") {
        preview.style.display = "flex";
        all.style.display = "none";
    } else {
        preview.style.display = "none";
        all.style.display = "flex";
    }
}

function manageAccount(element) {
    var topContainer = element.parentElement.parentElement;
    var confirmationField = topContainer.parentElement.children[1];

    topContainer.style.display = "none";
    confirmationField.style.display = "flex";
}

function confirmManageAccount(element) {
    var topContainer = element.parentElement.parentElement;
    var action =
        topContainer.parentElement.children[6].children[1].innerHTML.trim();

    switch (action) {
        case "0":
            var xmlhttp = new XMLHttpRequest();
            var theUrl = `http://localhost:3032/delete/user`;
            xmlhttp.open("POST", theUrl);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(
                JSON.stringify({
                    id: element.parentElement.parentElement.parentElement.children[0]
                        .children[0].children[1].innerHTML,
                })
            );
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState !== 4) return;

                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    if (xmlhttp.responseText) {
                        const res = JSON.parse(xmlhttp.response);
                        if (res.bannedMessage.length) {
                            alert(`User was succesfully banned!`);
                        }
                    } else {
                        console.log("error", xmlhttp);
                    }
                } else {
                    alert(JSON.parse(xmlhttp.responseText).message);
                }
            };

            break;

        case "1":
            var xmlhttp = new XMLHttpRequest();
            var theUrl = `http://localhost:3032/grant/user`;
            xmlhttp.open("POST", theUrl);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(
                JSON.stringify({
                    id: element.parentElement.parentElement.parentElement.children[0]
                        .children[0].children[1].innerHTML,
                })
            );
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState !== 4) return;

                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    if (xmlhttp.responseText) {
                        const res = JSON.parse(xmlhttp.response);
                        if (res.grantedMessage.length) {
                            alert(`User was succesfully granted!`);
                        }
                    } else {
                        console.log("error", xmlhttp);
                    }
                } else {
                    alert(JSON.parse(xmlhttp.responseText).message);
                }
            };

            break;
    }
    location.reload();
}

function infirmManageAccount(element) {
    var accountBox =
        element.parentElement.parentElement.parentElement.parentElement;
    var topContainer = accountBox.children[1].children[0];
    var confirmationField = accountBox.children[1].children[1];
    topContainer.style.display = "flex";
    confirmationField.style.display = "none";
}

function logoutUser() {
    localStorage.clear();
    var str = window.location.href;
    var lastIndex = str.lastIndexOf("/");
    var path = str.substring(0, lastIndex);
    var new_path = path + "/login.html";
    window.location.assign(new_path);
}

(() => {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:3032/users/information";
    xmlhttp.open("GET", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            if (xmlhttp.responseText) {
                let res = JSON.parse(xmlhttp.responseText);
                const accountsWrapper = document.getElementById("accounts-wrapper");
                accountsWrapper.innerHTML = " ";

                res.forEach((user) => {
                    if (user.banned == 0) {
                        accountsWrapper.insertAdjacentHTML(
                            "afterbegin",
                            `
                    <div class="account-box" onclick="changeAccountView(this)">
                    <div class="info-preview">
                        <div class="names">
                            ${user.firstName + " " + user.lastName}
                        </div>
                        <div class="email ">
                            ${user.email}
                        </div>
                    </div>
    
    
    
                    <div class="all-info" style="display:none">
    
    
                        <div class="top">
    
                            <div class="field">
                                <div class="label">
                                    User ID:
                                </div>
                                <div class="value">
                                ${user.id}
                                </div>
                            </div>
    
                            <div class="delete-button">
                                <span class="material-icons-outlined" onclick="event.stopPropagation(); manageAccount(this)">delete</span>
                            </div>
    
                        </div>
    
    
                        <div class="confirmation" style="display:none">
                            <div class="question">
                                Are you sure you want to ban this account?
                            </div>
    
                            <div class="button-wrapper">
                                <div class="button-yes" onclick="event.stopPropagation(); 
                                confirmManageAccount(this)">
                                    Yes
                                </div>
    
                                <div class="button-no" onclick="event.stopPropagation(); 
                                infirmManageAccount(this)">
                                    No
                                </div>
                            </div>
                        </div>
    
    
                        <div class="field">
                            <div class="label">
                                First Name:
                            </div>
                            <div class="value">
                            ${user.firstName}
                            </div>
                        </div>
    
                        <div class="field">
                            <div class="label">
                                Last Name:
                            </div>
                            <div class="value">
                            ${user.lastName}
                            </div>
                        </div>
    
                        <div class="field">
                            <div class="label">
                                Username:
                            </div>
                            <div class="value">
                            ${user.username}
                            </div>
                        </div>
    
                        <div class="field">
                            <div class="label">
                                Email:
                            </div>
                            <div class="value">
                            ${user.email}
                            </div>
                        </div>


                        <div class="field">
                            <div class="label">
                                Banned:
                            </div>
                            <div class="value">
                            ${user.banned}
                            </div>
                        </div>

    
    
                    </div>
                </div>
                    `
                        );
                    } else {
                        accountsWrapper.insertAdjacentHTML(
                            "afterbegin",
                            `
                    <div class="account-box" onclick="changeAccountView(this)">
                    <div class="info-preview">
                        <div class="names">
                            ${user.firstName + " " + user.lastName}
                        </div>
                        <div class="email ">
                            ${user.email}
                        </div>
                    </div>
    
    
    
                    <div class="all-info" style="display:none">
    
    
                        <div class="top">
    
                            <div class="field">
                                <div class="label">
                                    User ID:
                                </div>
                                <div class="value">
                                ${user.id}
                                </div>
                            </div>
    
                            <div class="delete-button">
                               
                           <span class="material-icons-outlined" onclick="event.stopPropagation(); manageAccount(this)">forward</span>
                                </div>
    
                        </div>
    
    
                        <div class="confirmation" style="display:none">
                            <div class="question">
                                Do you want to grant this user access to the website?
                            </div>
    
                            <div class="button-wrapper">
                                <div class="button-yes" onclick="event.stopPropagation(); 
                                confirmManageAccount(this)">
                                    Yes
                                </div>
    
                                <div class="button-no" onclick="event.stopPropagation(); 
                                infirmManageAccount(this)">
                                    No
                                </div>
                            </div>
                        </div>
    
    
                        <div class="field">
                            <div class="label">
                                First Name:
                            </div>
                            <div class="value">
                            ${user.firstName}
                            </div>
                        </div>
    
                        <div class="field">
                            <div class="label">
                                Last Name:
                            </div>
                            <div class="value">
                            ${user.lastName}
                            </div>
                        </div>
    
                        <div class="field">
                            <div class="label">
                                Username:
                            </div>
                            <div class="value">
                            ${user.username}
                            </div>
                        </div>
    
                        <div class="field">
                            <div class="label">
                                Email:
                            </div>
                            <div class="value">
                            ${user.email}
                            </div>
                        </div>

                        <div class="field">
                            <div class="label">
                                Banned:
                            </div>
                            <div class="value">
                            ${user.banned}
                            </div>
                        </div>
    
    
                    </div>
                </div>
                    `
                        );
                    }
                });
            }
        } else {
            console.log("error", xmlhttp);
        }
    };
})();