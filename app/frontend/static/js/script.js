document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
});

// Scroll to target section
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    targetSection?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    alert("Logging out...");
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
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 800, height: 600 } })
        .then(stream => document.getElementById("liveVideo").srcObject = stream)
        .catch(() => { alert("Camera access denied."); videoContainer.remove(); });
}
function stopLiveCam() {
    const video = document.getElementById("liveVideo");
    video?.srcObject?.getTracks().forEach(track => track.stop());
    document.querySelector(".video-container")?.remove();
}

// File upload popup
function showUploadPopup() { document.getElementById("uploadPopup").style.display = "flex"; }
function closeUploadPopup() { document.getElementById("uploadPopup").style.display = "none"; }
function triggerFileSelect() { document.getElementById("fileInput").click(); }
function handleFileUpload(event) {
    let file = event.target.files?.[0] || event.dataTransfer?.files[0];
    if (!file) return;

    document.getElementById("uploadOptions").style.display = "none";
    document.getElementById("filePreview").style.display = "block";
    document.getElementById("fileName").textContent = `File: ${file.name}`;

    let previewContainer = document.getElementById("previewContainer");
    previewContainer.innerHTML = "";

    if (file.type.startsWith("image")) {
        let img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        previewContainer.appendChild(img);
    } else if (file.type.startsWith("video")) {
        let video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.controls = true;
        previewContainer.appendChild(video);
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById("personalDetailsBtn")?.addEventListener("click", openPersonalDetails);
    document.getElementById("passwordForm")?.addEventListener("submit", validatePasswordForm);
    document.querySelector(".logout-btn")?.addEventListener("click", showLogoutConfirmation);
    document.getElementById("dragDropArea")?.addEventListener("dragover", event => event.preventDefault());
    document.getElementById("dragDropArea")?.addEventListener("drop", handleFileUpload);
}
