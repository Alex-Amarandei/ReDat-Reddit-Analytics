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
        xmlhttp.send(
            JSON.stringify({
                id: `${localStorage.getItem("token")}`,
            })
        );
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                if (xmlhttp.responseText) {
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
                    alert("Your account couldn't be deleted!");
                }
            }
        };
    }
}
let copyEmail = "";

function enable(element) {
    const parent = element.parentElement;

    if (parent.childNodes[1].id != "old-password") {
        if (parent.childNodes[1].id === "email")
            copyEmail = parent.childNodes[1].value;
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
            if (isValid(elementId)) {
                updateInformation(elementId, parent.childNodes[1].value);
                setInvisible(elementId, root);
            }
            break;
        case "email":
            if (await emailNotUsed(parent.childNodes[1].value)) {
                if (isValid(elementId)) {
                    updateInformation(elementId, parent.childNodes[1].value);
                    setInvisible(elementId, root);
                }
            } else {
                document.getElementById(elementId).value = "Email already exists!";
                setTimeout(() => {
                    document.getElementById(elementId).value = copyEmail;
                }, 2000);
                setInvisible(elementId, root);
            }

            break;
        case "old-password":
            if (await oldPasswordIsCorrect(parent.childNodes[1].value)) {
                if (isValid("new-password")) {
                    updateInformation("new-password", parent.childNodes[3].value);
                    setInvisible(elementId, root);
                } else {
                    document.getElementById("new-password").type = "Text";
                    document.getElementById("new-password").value = "Invalid Password";
                    setTimeout(() => {
                        document.getElementById("new-password").type = "password";
                        document.getElementById("new-password").value = "";
                        document.getElementById("new-password").placeholder =
                            "New Password";
                        document.getElementById(elementId).value = "";
                        document.getElementById(elementId).placeholder = "Old Password";
                    }, 2000);
                    setInvisible(elementId, root);
                }
            } else {
                document.getElementById(elementId).type = "Text";
                document.getElementById(elementId).value = "Wrong Password";
                setTimeout(() => {
                    document.getElementById(elementId).type = "password";
                    document.getElementById(elementId).value = "";
                    document.getElementById(elementId).placeholder = "Old Password";
                    document.getElementById("new-password").value = "";
                    document.getElementById("new-password").placeholder = "New Password";
                }, 2000);
                setInvisible(elementId, root);
            }

            break;
    }
}

function emailNotUsed(email) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        var theUrl = `http://localhost:3030/verify/email/unique?id=${localStorage.getItem(
      "token"
    )}&info=${email}`;
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                if (xmlhttp.responseText) {
                    let res = JSON.parse(xmlhttp.responseText);
                    if (res.message !== "Email already exists!") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            } else {
                reject(false);
            }
        };
    });
}

function oldPasswordIsCorrect(password) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        var theUrl = `http://localhost:3030/verify/password?id=${localStorage.getItem(
      "token"
    )}&info=${password}`;
        xmlhttp.open("GET", theUrl);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState !== 4) return;

            if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                if (xmlhttp.responseText) {
                    let res = JSON.parse(xmlhttp.responseText);
                    if (res.message === "Same password") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            } else {
                reject(false);
            }
        };
    });
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
    xmlhttp.send(
        JSON.stringify({
            id: `${localStorage.getItem("token")}`,
            field: dbField,
            newValue: value,
        })
    );
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            if (xmlhttp.responseText) {
                const res = JSON.parse(xmlhttp.response);
                if (res.editingMessage.length) {
                    alert(`Your ${dbField} was succesfully updated!`);
                }
            } else {
                console.log("error", xmlhttp);
            }
        }
    };
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
    var theUrl = `http://localhost:3030/my/information?id=${localStorage.getItem(
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

                let firstName = document.getElementById("first-name");
                let lastName = document.getElementById("last-name");
                let userName = document.getElementById("user-name");
                let email = document.getElementById("email");
                console.log(firstName);
                firstName.value = res.first_name;
                lastName.value = res.last_name;
                userName.value = res.username;
                email.value = res.email;
            }
        } else {
            console.log("error", xmlhttp);
        }
    };
})();

(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        var str = window.location.href;
        var lastIndex = str.lastIndexOf("/");
        var path = str.substring(0, lastIndex);
        var new_path = path + "/login.html";
        window.location.assign(new_path);
    }
})();