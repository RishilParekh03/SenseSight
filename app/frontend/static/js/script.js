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

// Open/Close personal details
function openPersonalDetails() {
    closePassword();
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

// File upload popup
function showDetectionPopup() {
    document.getElementById("detectionPopup").style.display = "flex";
    document.getElementById("apiFrame").src = "";
}

function closeDetectionPopup() {
    document.getElementById("detectionPopup").style.display = "none";
    document.getElementById("apiFrame").src = ""; // Stop API call
}