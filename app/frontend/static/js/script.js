// Select the sidebar and toggle button
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');
const mainContent = document.querySelector('.main-content');

// Select the search input
const searchInput = document.querySelector('header input[type="text"]');

// Add event listener to the toggle button
toggleBtn.addEventListener('click', () => {
    // Toggle the sidebar visibility
    sidebar.classList.toggle('hidden');
    // Adjust main content margin
    mainContent.classList.toggle('collapsed');
});

// Add event listener for search input
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    // Simple example: log the query to the console
    console.log('Search query:', query);

    // Optional: Implement a basic filter or search functionality
    // For example, filtering menu items based on the query
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});


function permittedGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

if (permittedGetUserMedia()) {
    const video = document.querySelector('video');
    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);

    navigator.mediaDevices.getUserMedia({
        video: true
    }).then((stream) => processStream(stream, mediaSource));
}