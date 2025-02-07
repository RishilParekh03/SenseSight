// Scroll to the target section when the button is clicked
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: "smooth", // Smooth scroll effect
            block: "start",
        });
    }
}

// Toggle the visibility of the profile menu with a smooth transition
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    profileMenu.classList.toggle('active');
}

// Close the profile menu with a fade-out effect
function closeProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    profileMenu.classList.remove('active');
}



// Open the personal details section with a smooth fade-in effect
function openPersonalDetails() {

    closePassword();

    const personalDetailsSection = document.getElementById('personalDetails');
    if (personalDetailsSection) {
        personalDetailsSection.style.opacity = '0';
        personalDetailsSection.classList.add('active');// Adds the 'active' class to display
        setTimeout(() => {
            personalDetailsSection.style.opacity = '1';
            personalDetailsSection.style.transition = 'opacity 0.3s ease-in-out';
        }, 0); // Starts the fade-in after being displayed
    }
}

// Close the personal details section with a smooth fade-out effect
function closePersonalDetails() {
    const personalDetailsSection = document.getElementById('personalDetails');
    if (personalDetailsSection) {
        personalDetailsSection.style.opacity = '1';
        personalDetailsSection.style.transition = 'opacity 0.3s ease-in-out';
        personalDetailsSection.style.opacity = '0';
        setTimeout(() => {
            personalDetailsSection.classList.remove('active'); // Hides after the fade-out
        }, 300); // Matches the transition duration
    }
}

// Event listener for closing the personal details modal on clicking outside of it
window.addEventListener('click', (event) => {
    const personalDetailsSection = document.getElementById('personalDetails');
    if (personalDetailsSection && event.target === personalDetailsSection) {
        closePersonalDetails(); // Smoothly close when clicking outside
    }
});

// Event listener to open the personal details section when the "Personal Details" button is clicked
const personalDetailsBtn = document.getElementById("personalDetailsBtn");
if (personalDetailsBtn) {
    personalDetailsBtn.addEventListener("click", openPersonalDetails);
}

/* -------------------------*/

// Open the password modal with a smooth fade-in effect
function openPassword() {

    closePersonalDetails();

    const passwordSection = document.getElementById('password');
    if (passwordSection && !passwordSection.classList.contains('active')) {
        passwordSection.style.opacity = '0';
        passwordSection.classList.add('active'); // Adds the 'active' class to display the modal
        setTimeout(() => {
            passwordSection.style.opacity = '1';
            passwordSection.style.transition = 'opacity 0.3s ease-in-out';
        }, 0); // Starts the fade-in after being displayed
    }
}

// Close the password modal with a smooth fade-out effect
function closePassword() {
    const passwordSection = document.getElementById('password');
    if (passwordSection && passwordSection.classList.contains('active')) {
        passwordSection.style.opacity = '1';
        passwordSection.style.transition = 'opacity 0.3s ease-in-out';
        passwordSection.style.opacity = '0';
        setTimeout(() => {
            passwordSection.classList.remove('active'); // Hides the modal after the fade-out
        }, 300); // Matches the transition duration
    }
}

// Prevent the form from submitting and add an alert for testing
/*document.getElementById('passwordForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    alert('Password changed successfully!'); // Add your own logic here
});
*/

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const toggleIcon = input.nextElementSibling;

    if (input.type === "password") {
        input.type = "text";
        toggleIcon.textContent = "🙈"; // Change icon to hide
    } else {
        input.type = "password";
        toggleIcon.textContent = "👁️"; // Change icon to show
    }
}

/*--------------------------------------------------------------------------------*/

document.getElementById('passwordForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get input values
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const retypePassword = document.getElementById('retypePassword').value.trim();

    // Regular expression to check password requirements
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{6,}$/;

    // Check if new password meets the criteria
    if (!passwordRegex.test(newPassword)) {
        alert("Your password must be at least 6 characters and include a combination of numbers, letters, and special characters (!$@%).");
        return;
    }

    // Check if new password matches the re-typed password
    if (newPassword !== retypePassword) {
        alert("New password and Re-type new password do not match.");
        return;
    }

    // If all checks pass
    alert("Password changed successfully!");
});


/*---------------------------------------------------------------------------------------*/

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

// Function to close the logout popup
function closeLogoutPopup() {
    const popup = document.querySelector(".logout-popup");
    if (popup) {
        popup.remove();
    }
}

// Function to handle logout logic
function logout() {
    closeLogoutPopup();
    alert("Logging out..."); // Replace this with actual logout logic
}

// Attach event listener to logout button
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", showLogoutConfirmation);
    }
});

// Function to handle image upload
// function handleImageUpload() {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.onchange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             alert('Selected file: ${file.name}'); // Replace with actual image processing
//         }
//     };
//     input.click();
// }

// const liveCamButton = document.querySelector(".action_1-button");
// if (liveCamButton) {
//     liveCamButton.addEventListener("click", handleLiveCamImageUpload);
// }

// Function to start live camera feed using laptop's front camera
function startLiveCam() {
    const videoContainer = document.createElement("div");
    videoContainer.classList.add("video-container");

    videoContainer.innerHTML = `
        <video id="liveVideo" autoplay></video>
        <button class="close-video-btn" onclick="stopLiveCam()">×</button>
    `;

    document.body.appendChild(videoContainer);

    const video = document.getElementById("liveVideo");

    // Prioritize the laptop's built-in camera
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 800, height: 600 }
    })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            alert("Unable to access the camera. Please check your permissions.");
            videoContainer.remove();
        });
}

// Function to stop the live camera feed
function stopLiveCam() {
    const video = document.getElementById("liveVideo");
    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    document.querySelector(".video-container").remove();
}

// Attach event listeners to buttons
document.addEventListener("DOMContentLoaded", () => {
    const uploadBtn = document.querySelector(".action-button:nth-child(1)");
    const liveCamBtn = document.querySelector(".action_1-button:nth-child(2)");

    if (uploadBtn) uploadBtn.addEventListener("click", handleImageUpload);
    if (liveCamBtn) liveCamBtn.addEventListener("click", startLiveCam);
});



function showUploadPopup() {
    document.getElementById("uploadPopup").style.display = "flex";
}
function closeUploadPopup() {
    document.getElementById("uploadPopup").style.display = "none";
}
function triggerFileSelect() {
    document.getElementById("fileInput").click();
}
document.getElementById("dragDropArea").addEventListener("dragover", (event) => {
    event.preventDefault();
});
document.getElementById("dragDropArea").addEventListener("drop", (event) => {
    event.preventDefault();
    handleFileUpload(event);
});
function handleFileUpload(event) {
    let file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
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

