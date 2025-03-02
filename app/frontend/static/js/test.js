document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.querySelector(".logout-btn")?.addEventListener("click", showLogoutConfirmation);
    document.getElementById("passwordForm")?.addEventListener("submit", validatePasswordForm);
}

// Toggle Side Menu
function toggleMenu() {
    const sideMenu = document.getElementById("sideMenu");
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const mainContainer = document.querySelector(".main-container");

    sideMenu.classList.toggle("active");
    mainContainer.classList.toggle("shifted");
    hamburgerBtn.querySelector(".hamburger-icon").style.display = sideMenu.classList.contains("active") ? "none" : "block";
    hamburgerBtn.querySelector(".close-icon").style.display = sideMenu.classList.contains("active") ? "block" : "none";
}

// Open Profile Details Popup
function openProfileDetails() {
    document.getElementById("profileDetails").classList.add("active");
}

// Close Profile Details Popup
function closeProfileDetails() {
    document.getElementById("profileDetails").classList.remove("active");
}

// Show Logout Confirmation Popup
function showLogoutConfirmation() {
    document.getElementById("logoutPopup").classList.add("active");
}

// Close Logout Confirmation Popup
function closeLogoutPopup() {
    document.getElementById("logoutPopup").classList.remove("active");
}

// Logout Function
function logout() {
    closeLogoutPopup();
    const ajax = new XMLHttpRequest();
    ajax.open("POST", "/auth/logout", true);
    ajax.withCredentials = true;

    ajax.onload = function () {
        if (ajax.status === 200) {
            window.location.href = "/login";
        } else {
            alert("Error in logging out");
        }
    };

    ajax.onerror = function () {
        alert("Error in logging out");
    };

    ajax.send();
}

// File upload popup
function showDetectionPopup() {
    document.getElementById("detectionPopup").style.display = "flex";
    document.getElementById("apiFrame").src = "";
}

function closeDetectionPopup() {
    document.getElementById("detectionPopup").style.display = "none";
    document.getElementById("apiFrame").src = ""; // Stop API call
}