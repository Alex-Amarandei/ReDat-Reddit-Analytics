function deleteAccount() {
    if (
        confirm(
            "Are you sure you want to delete your account?\nThis can't be undone."
        )
    ) {

        var xmlhttp = new XMLHttpRequest();
        var theUrl = `http://localhost:3030/delete/user`;
        xmlhttp.open("POST", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({
            id: `${localStorage.getItem("token")}`
        }));
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            // Process our return data
            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                // What do when the request is successful
                if (xmlhttp.responseText) {
                    // parse res body
                    const res = JSON.parse(xmlhttp.response);
                    if (res.deletingMessage === "User successfully deleted") {
                        localStorage.clear();
                        var str = window.location.href;
                        var lastIndex = str.lastIndexOf("/");
                        var path = str.substring(0, lastIndex);
                        var new_path = path + "/login.html";
                        window.location.assign(new_path);
                    }
                } else {
                    // What to do when the request has failed
                    alert("Your account couldn't be deleted!")
                }

            }
        }

    }
}

function enable(element) {
    const parent = element.parentElement;

    if (parent.childNodes[1].id != "old-password") {
        parent.childNodes[1].disabled = false;
        parent.childNodes[3].setAttribute("aria-disabled", false);
        parent.childNodes[3].style.opacity = 1;
        parent.childNodes[3].style.cursor = "pointer";
        parent.childNodes[5].setAttribute("aria-disabled", true);
        parent.childNodes[5].style.opacity = 0;
        parent.childNodes[5].style.cursor = "default";
    } else {
        parent.childNodes[1].disabled = false;
        parent.childNodes[3].disabled = false;
        parent.childNodes[5].setAttribute("aria-disabled", false);
        parent.childNodes[5].style.opacity = 1;
        parent.childNodes[5].style.cursor = "pointer";
        parent.childNodes[7].setAttribute("aria-disabled", true);
        parent.childNodes[7].style.opacity = 0;
        parent.childNodes[7].style.cursor = "default";
    }
}

async function disable(element) {
    const parent = element.parentElement;
    const elementId = parent.childNodes[1].id;
    const root = parent.childNodes;


    switch (elementId) {
        case "first-name":
        case "last-name":
        case "user-name":
        case "email":
            if (isValid(elementId)) {
                updateInformation(elementId, parent.childNodes[1].value);
                setInvisible(elementId, root);
            }
            break;
        case "old-password":
            if (await oldPasswordIsCorrect(parent.childNodes[1].value)) {
                console.log('here');
                if (isValid("new-password")) {
                    console.log(parent.childNodes[1].value);
                    updateInformation("new-password", parent.childNodes[3].value);
                    setInvisible(elementId, root);
                }
            } else {
                document.getElementById(elementId).value = "Invalid Password";
                setInvisible(elementId, root);
            }

            break;
    }

}

function oldPasswordIsCorrect(password) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
        var theUrl = `http://localhost:3030/verify/password?id=${localStorage.getItem("token")}&password=${password}`;
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
                    if (res.message === "Same password") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }

            } else {
                // What to do when the request has failed
                console.log('error', xmlhttp);
                reject(false);
            }
        }
    })
}



function updateInformation(id, value) {
    let dbField = "";
    switch (id) {
        case "first-name":
            dbField = "first_name";
            break;

        case "last-name":
            dbField = "last_name";
            break;

        case "user-name":
            dbField = "username";
            break;

        case "email":
            dbField = "email";
            break;

        case "new-password":
            dbField = "password";
            break;

    }


    var xmlhttp = new XMLHttpRequest();
    var theUrl = `http://localhost:3030/edit/user`;
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({
        id: `${localStorage.getItem("token")}`,
        field: dbField,
        newValue: value
    }));
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                const res = JSON.parse(xmlhttp.response);
                if (res.editingMessage.length) {
                    alert(`Your ${dbField} was succesfully updated!`);
                }
                // console.log('success', JSON.parse(xmlhttp.responseText));
            } else {
                // What to do when the request has failed
                console.log('error', xmlhttp);
            }

        }
    }
}

function setInvisible(elementId, root) {
    switch (elementId) {
        case "first-name":
        case "last-name":
        case "user-name":
        case "email":
            root[1].disabled = true;
            root[3].setAttribute("aria-disabled", true);
            root[3].style.opacity = 0;
            root[3].style.cursor = "default";
            root[5].setAttribute("aria-disabled", false);
            root[5].style.opacity = 1;
            root[5].style.cursor = "pointer";
            break;

        case "old-password":
            root[1].disabled = true;
            root[3].disabled = true;
            root[5].setAttribute("aria-disabled", true);
            root[5].style.opacity = 0;
            root[5].style.cursor = "default";
            root[7].setAttribute("aria-disabled", false);
            root[7].style.opacity = 1;
            root[7].style.cursor = "pointer";
            break;
    }
}



function isValid(elementId) {
    const field = document.getElementById(elementId);
    switch (elementId) {
        case "first-name":
        case "last-name":
            if (/[^a-zA-Z]/.test(field.value)) {
                alert("Names should only contain letters.");
                return false;
            }
            break;

        case "user-name":
            if (/[^a-zA-Z0-9-_]/.test(field.value)) {
                alert(
                    "Your username should only contain alphanumerical or line characters."
                );
                return false;
            }
            if (field.value.length < 4) {
                alert("Your username should be at least 4 characters long.");
                return false;
            }
            break;

        case "email":
            break;

        case "new-password":
            if (field.value.length < 4) {
                alert("Your password should be at least 4 characters long.");
                return false;
            }

            if (!/[a-z]/.test(field.value)) {
                alert("Your password should contain at least one lowercase letter.");
                return false;
            }

            if (!/[A-Z]/.test(field.value)) {
                alert("Your password should contain at least one uppercase letter.");
                return false;
            }

            if (!/[0-9]/.test(field.value)) {
                alert("Your password should contain at least one number.");
                return false;
            }

            if (!/[!@#$%^&*]/.test(field.value)) {
                alert("Your password should contain at least one special character.");
            }
            break;
    }

    return true;
}

// if (field.value != confirm.value) {
//     alert("The passwords do not match.");
//     return false;
// }




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
    var theUrl = `http://localhost:3030/my/information?id=${localStorage.getItem("token")}`;
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
                console.log("here" + res);

                let firstName = document.getElementById("first-name");
                let lastName = document.getElementById("last-name");
                let userName = document.getElementById("user-name");
                let email = document.getElementById("email");

                firstName.value = res.first_name;
                lastName.value = res.last_name;
                userName.value = res.username;
                email.value = res.email;

            }

        } else {
            // What to do when the request has failed
            console.log('error', xmlhttp);
        }
    }

})();

(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        var str = window.location.href;
        var lastIndex = str.lastIndexOf("/");
        var path = str.substring(0, lastIndex);
        var new_path = path + "/login.html";
        window.location.assign(new_path);
    } else {
        console.log('are token');
    }
})();