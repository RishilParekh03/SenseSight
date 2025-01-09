document.querySelector('.login-btn').addEventListener('click', (e) => {
    e.preventDefault();

    // Get the username and password input fields
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    // Check if both fields are empty
    if (username.value === '' || password.value === '') {
        // Show an alert if either field is empty
        alert('Both username and password are required!');
    } else {
        // If both fields are filled, simulate the login action
        alert('Login button clicked!');
    }
});