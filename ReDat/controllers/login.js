const circle = document.getElementById("circle-shape");
const signupText = document.getElementById("signup-text");
const loginText = document.getElementById("login-text");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const signupLogo = document.getElementById("signup-logo");
const loginLogo = document.getElementById("login-logo");

function changeToSignup() {
    circle.classList.add("forward-transition");
    signupText.classList.add("signup-page");
    loginForm.classList.add("signup-page");
    loginLogo.classList.add("signup-page");

    circle.classList.remove("reverse-transition");
    loginText.classList.remove("signup-page");
    signupForm.classList.remove("signup-page");
    signupLogo.classList.remove("signup-page");

    signupText.classList.remove("login-page");
    loginForm.classList.remove("login-page");
    loginLogo.classList.remove("login-page");

    loginText.classList.add("login-page");
    signupForm.classList.add("login-page");
    signupLogo.classList.add("login-page");
}

function changeToLogin() {
    circle.classList.remove("forward-transition");
    signupText.classList.remove("signup-page");
    loginForm.classList.remove("signup-page");
    loginLogo.classList.remove("signup-page");

    circle.classList.add("reverse-transition");
    loginText.classList.add("signup-page");
    signupForm.classList.add("signup-page");
    signupLogo.classList.add("signup-page");

    signupText.classList.add("login-page");
    loginForm.classList.add("login-page");
    loginLogo.classList.add("login-page");

    loginText.classList.remove("login-page");
    signupForm.classList.remove("login-page");
    signupLogo.classList.remove("login-page");
}

function isValid() {
    const firstName = document.forms["signup-form"]["first-name"];
    const lastName = document.forms["signup-form"]["last-name"];
    const userName = document.forms["signup-form"]["user-name"];
    const password = document.forms["signup-form"]["password"];
    const confirm = document.forms["signup-form"]["confirm"];

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
}