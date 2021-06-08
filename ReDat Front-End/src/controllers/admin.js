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
    console.log(topContainer);
    var confirmationField = topContainer.parentElement.children[1];
    topContainer.style.display = "none";
    confirmationField.style.display = "flex";
}

function confirmDeleteAccount(element) {
    var accountBox =
        element.parentElement.parentElement.parentElement.parentElement;
    var accountsWrapper = accountBox.parentElement;
    accountsWrapper.removeChild(accountBox);
}

function infirmDeleteAccount(element) {
    var accountBox =
        element.parentElement.parentElement.parentElement.parentElement;
    var topContainer = accountBox.children[1].children[0];
    var confirmationField = accountBox.children[1].children[1];
    topContainer.style.display = "flex";
    confirmationField.style.display = "none";
}