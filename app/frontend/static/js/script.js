document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById("personalDetailsBtn")?.addEventListener("click", openPersonalDetails);
    document.getElementById("passwordForm")?.addEventListener("submit", validatePasswordForm);
    document.querySelector(".logout-btn")?.addEventListener("click", showLogoutConfirmation);
    document.getElementById("dragDropArea")?.addEventListener("dragover", event => event.preventDefault());
}

// Toggle profile menu
function toggleProfileMenu() {
    document.getElementById("profile-menu")?.classList.toggle("active");
}

// Close profile menu
function closeProfileMenu() {
    document.getElementById("profile-menu")?.classList.remove("active");
}

// Toggle visibility of modals
function toggleModal(sectionId, state) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.style.transition = "opacity 0.3s ease-in-out";
    if (state) {
        section.style.opacity = "0";
        section.classList.add("active");
        setTimeout(() => (section.style.opacity = "1"), 0);
    } else {
        section.style.opacity = "0";
        setTimeout(() => section.classList.remove("active"), 300);
    }
}

// let userData = window.userData || {};
// console.log("User Data in js:", userData);

// Open/Close personal details
function openPersonalDetails() {
    closePassword();
    console.log("Opening personal details...");
    if (window.userData) {
        console.log("Filling form with:", window.userData);
        document.getElementById("name").value = userData.name || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("created_on").value = userData.created_on || "";
    } else {
        console.warn("User data is missing!");
    }

    toggleModal("personalDetails", true);
}

function closePersonalDetails() {
    toggleModal("personalDetails", false);
}

// Open/Close password modal
function openPassword() {
    closePersonalDetails();
    toggleModal("password", true);
}

function closePassword() {
    toggleModal("password", false);
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.type = input.type === "password" ? "text" : "password";
    input.nextElementSibling.textContent = input.type === "password" ? "👁️" : "🙈";
}

// Validate password form
function validatePasswordForm(event) {
    event.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const retypePassword = document.getElementById("retypePassword").value.trim();
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{6,}$/;

    if (!passwordRegex.test(newPassword)) {
        alert("Password must be at least 6 characters with letters, numbers, and !$@%.");
        return;
    }
    if (newPassword !== retypePassword) {
        alert("Passwords do not match.");
        return;
    }
    alert("Password changed successfully!");
}

// Logout confirmation popup
function showLogoutConfirmation() {
    const popup = document.createElement("div");
    popup.classList.add("logout-popup");
    popup.innerHTML = `
        <div class="popup-content">
            <p>Are you sure you want to log out?</p>
            <div class="popup-buttons">
                <button class="popup-btn yes-btn" onclick="logout()">Yes</button>
                <button class="popup-btn no-btn" onclick="closeLogoutPopup()">No</button>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function closeLogoutPopup() {
    document.querySelector(".logout-popup")?.remove();
}

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

// Start and stop live camera
function startLiveCam() {
    const videoContainer = document.createElement("div");
    videoContainer.classList.add("video-container");
    videoContainer.innerHTML = `
        <video id="liveVideo" autoplay></video>
        <button class="close-video-btn" onclick="stopLiveCam()">×</button>
    `;
    document.body.appendChild(videoContainer);
    navigator.mediaDevices.getUserMedia({video: {facingMode: "user", width: 800, height: 600}})
        .then(stream => document.getElementById("liveVideo").srcObject = stream)
        .catch(() => {
            alert("Camera access denied.");
            videoContainer.remove();
        });
}

function stopLiveCam() {
    const video = document.getElementById("liveVideo");
    video?.srcObject?.getTracks().forEach(track => track.stop());
    document.querySelector(".video-container")?.remove();
}

// // File upload popup
function showUploadPopup() {
    document.getElementById("uploadPopup").style.display = "flex";
    document.getElementById("apiFrame").src = "https://marten-wondrous-llama.ngrok-free.app/";
}

function closeUploadPopup() {
    document.getElementById("uploadPopup").style.display = "none";
    document.getElementById("apiFrame").src = ""; // Stop API call 
}
