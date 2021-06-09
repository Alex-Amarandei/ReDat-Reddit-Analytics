(() => {
    localStorage.clear();
})()



function changeToSignup() {
    const circle = document.getElementById("circle-shape");
    const signupText = document.getElementById("signup-text");
    const loginText = document.getElementById("login-text");
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const signupLogo = document.getElementById("signup-logo");
    const loginLogo = document.getElementById("login-logo");

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
    const circle = document.getElementById("circle-shape");
    const signupText = document.getElementById("signup-text");
    const loginText = document.getElementById("login-text");
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const signupLogo = document.getElementById("signup-logo");
    const loginLogo = document.getElementById("login-logo");
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

async function isValidLogin() {

    const userName = document.forms["login-form"]["user"];
    const password = document.forms["login-form"]["login-password"];

    // ========== XML HTTP REQUEST MODEL ======== 
    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
    var theUrl = "http://localhost:3030/user";
    xmlhttp.open("PUT", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({
        userName: userName.value,
        password: password.value
    }));
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                const res = JSON.parse(xmlhttp.response);

                // set local storage
                localStorage.setItem('token', res.token);
                localStorage.setItem('redditToken', res.redditToken);
                localStorage.setItem('communities', 'all');
                localStorage.setItem('filter', 'new');
                localStorage.setItem('pageAction', 'explore');
                var communitiesToShow = [];
                localStorage.setItem('communitiesToShow', JSON.stringify(communitiesToShow));
                var subjectsToShow = [];
                localStorage.setItem('subjectsToShow', JSON.stringify(subjectsToShow));

                // RERUTARE in alta parte
                console.log(res);

                if (!res.isAdmin) {
                    localStorage.setItem('isAdmin', false)
                    var str = window.location.href;
                    var lastIndex = str.lastIndexOf("/");
                    var path = str.substring(0, lastIndex);
                    var new_path = path + "/dashboard.html";
                    window.location.assign(new_path);
                } else {
                    localStorage.setItem('isAdmin', true)
                    var str = window.location.href;
                    var lastIndex = str.lastIndexOf("/");
                    var path = str.substring(0, lastIndex);
                    var new_path = path + "/admin.html";
                    window.location.assign(new_path);
                }
            }
        } else {
            document.getElementById("submit-button-login").innerHTML = "Wrong email or password!";
            setTimeout(() => {
                document.getElementById("submit-button-login")
                document.forms["login-form"]["user"].value = "";
                document.forms["login-form"]["user"].placeholder = "Email";
                document.forms["login-form"]["login-password"].value = "";
                document.forms["login-form"]["login-password"].placeholder = "Password";
                document.getElementById("submit-button-login").innerHTML = "Log In";
            }, 2000);

        }

    }


}

async function isValidRegister() {
    const firstName = document.forms["signup-form"]["first-name"];
    const lastName = document.forms["signup-form"]["last-name"];
    const userName = document.forms["signup-form"]["user-name"];
    const password = document.forms["signup-form"]["password"];
    const confirm = document.forms["signup-form"]["confirm"];
    const email = document.forms["signup-form"]["email"];
    let isValid = true;
    if (/[^a-zA-Z]/.test(firstName.value) || /[^a-zA-Z]/.test(lastName.value)) {
        alert("Names should only contain letters.");
        isValid = false;
    }

    if (/[^a-zA-Z0-9-_]/.test(userName.value)) {
        alert(
            "Your username should only contain alphanumerical or line characters."
        );
        isValid = false;
    }

    if (userName.value.length < 4) {
        alert("Your username should be at least 4 characters long.");
        isValid = false;
    }

    if (password.value.length < 4) {
        alert("Your password should be at least 4 characters long.");
        isValid = false;
    }

    if (!/[a-z]/.test(password.value)) {
        alert("Your password should contain at least one lowercase letter.");
        isValid = false;
    }

    if (!/[A-Z]/.test(password.value)) {
        alert("Your password should contain at least one uppercase letter.");
        isValid = false;
    }

    if (!/[0-9]/.test(password.value)) {
        alert("Your password should contain at least one number.");
        isValid = false;
    }

    if (!/[!@#$%^&*]/.test(password.value)) {
        alert("Your password should contain at least one special character.");
        isValid = false;
    }

    if (password.value != confirm.value) {
        alert("The passwords do not match.");
        isValid = false;
    }


    if (!isValid) {
        return;
    }

    var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
    var theUrl = "http://localhost:3030/user";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({
        userName: userName.value,
        password: password.value,
        email: email.value,
        confirm: confirm.value,
        firstName: firstName.value,
        lastName: lastName.value,
    }));
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState !== 4) return;

        // Process our return data
        if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
            // What do when the request is successful
            if (xmlhttp.responseText) {
                // parse res body
                const res = JSON.parse(xmlhttp.response);
                if (!!res.registerMessage.length) {
                    alert('Your account was succesfully created!')
                    setTimeout(() => {
                        document.getElementById('login-button').click();
                    }, 1000)
                }

            }
            // console.log('success', JSON.parse(xmlhttp.responseText));
        } else {
            // What to do when the request has failed
            console.log('error', xmlhttp);
        }

    }
}