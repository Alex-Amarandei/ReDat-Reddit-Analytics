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

function deleteAccount(element) {
    var topContainer = element.parentElement.parentElement;
    var confirmationField = topContainer.parentElement.children[1];
    topContainer.style.display = "none";
    confirmationField.style.display = "flex";
}
//////////////////////////////
function confirmDeleteAccount(element) {
    var accountBox =
        element.parentElement.parentElement.parentElement.parentElement;
    var accountsWrapper = accountBox.parentElement;
    accountsWrapper.removeChild(accountBox);

    console.log(element.parentElement.parentElement.parentElement.children[0].children[0].children[1].innerHTML);
    var xmlhttp = new XMLHttpRequest();
    var theUrl = `http://localhost:3032/delete/user`;
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({
        id: element.parentElement.parentElement.parentElement.children[0].children[0].children[1].innerHTML
    }));
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                const res = JSON.parse(xmlhttp.response);
                if (res.bannedMessage.length) {
                    alert(`User was succesfully banned!`);
                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                console.log(xmlhttp)
                console.log('error', xmlhttp);
            }

        } else {
            ////////////////////////////////////
            alert(JSON.parse(xmlhttp.responseText).message)
        }
    }
}

function infirmDeleteAccount(element) {
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

    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
    var theUrl = "http://localhost:3032/users/information";
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
                const accountsWrapper = document.getElementById('accounts-wrapper')
                accountsWrapper.innerHTML = ' ';
                res.forEach((user) => {
                    accountsWrapper.insertAdjacentHTML('afterbegin', `
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
                                <span class="material-icons-outlined" onclick="event.stopPropagation(); deleteAccount(this)">delete</span>
                            </div>
    
                        </div>
    
    
                        <div class="confirmation" style="display:none">
                            <div class="question">
                                Are you sure you want to delete this account?
                            </div>
    
                            <div class="button-wrapper">
                                <div class="button-yes" onclick="event.stopPropagation(); 
                                confirmDeleteAccount(this)">
                                    Yes
                                </div>
    
                                <div class="button-no" onclick="event.stopPropagation(); 
                                infirmDeleteAccount(this)">
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
    
    
                    </div>
                </div>
                    `)
                });

            }

        } else {
            // What to do when the request has failed
            console.log('error', xmlhttp);
        }
    }

})();