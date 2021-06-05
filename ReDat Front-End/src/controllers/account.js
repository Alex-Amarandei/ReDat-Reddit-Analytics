function deleteAccount() {
    if (
        confirm(
            "Are you sure you want to delete your account?\nThis can't be undone."
        )
    ) {
        location.href = "login.html";
    }
}

function enable(element) {
    const parent = element.parentElement;

    if (parent.childNodes[1].id != "password") {
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

function disable(element) {
    const parent = element.parentElement;
    if (isValid()) {
        if (parent.childNodes[1].id != "password") {
            parent.childNodes[1].disabled = true;
            parent.childNodes[3].setAttribute("aria-disabled", true);
            parent.childNodes[3].style.opacity = 0;
            parent.childNodes[3].style.cursor = "default";
            parent.childNodes[5].setAttribute("aria-disabled", false);
            parent.childNodes[5].style.opacity = 1;
            parent.childNodes[5].style.cursor = "pointer";
        } else {
            parent.childNodes[1].disabled = true;
            parent.childNodes[3].disabled = true;
            parent.childNodes[5].setAttribute("aria-disabled", true);
            parent.childNodes[5].style.opacity = 0;
            parent.childNodes[5].style.cursor = "default";
            parent.childNodes[7].setAttribute("aria-disabled", false);
            parent.childNodes[7].style.opacity = 1;
            parent.childNodes[7].style.cursor = "pointer";
        }
    }
}

function isValid() {
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const userName = document.getElementById("user-name");
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirm");

    if (/[^a-zA-Z]/.test(firstName.value) || /[^a-zA-Z]/.test(lastName.value)) {
        alert("Names should only contain letters.");
        return false;
    }

    if (/[^a-zA-Z0-9-_]/.test(userName.value)) {
        alert(
            "Your username should only contain alphanumerical or line characters."
        );
        return false;
    }

    if (userName.value.length < 4) {
        alert("Your username should be at least 4 characters long.");
        return false;
    }

    if (password.value.length < 4) {
        alert("Your password should be at least 4 characters long.");
        return false;
    }

    if (!/[a-z]/.test(password.value)) {
        alert("Your password should contain at least one lowercase letter.");
        return false;
    }

    if (!/[A-Z]/.test(password.value)) {
        alert("Your password should contain at least one uppercase letter.");
        return false;
    }

    if (!/[0-9]/.test(password.value)) {
        alert("Your password should contain at least one number.");
        return false;
    }

    if (!/[!@#$%^&*]/.test(password.value)) {
        alert("Your password should contain at least one special character.");
    }

    if (password.value != confirm.value) {
        alert("The passwords do not match.");
        return false;
    }

    return true;
}

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