document.getElementById('submit').addEventListener('click', function (e) {
        e.preventDefault();

        const originalName = "{{ data.name }}";
        const originalEmail = "{{ data.email }}";

        const name = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('newPassword').value.trim();
        const reTypePassword = document.getElementById('reTypePassword').value.trim();
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{6,}$/;

        if (originalName === name && originalEmail === email) {
            alert("No changes detected!")
            return;
        }

        if (newPassword && reTypePassword) {
            if (!passwordRegex.test(newPassword)) {
                alert("Password must have at least 6 characters with one uppercase, numbers, and !$@%.");
                return;
            }
            if (newPassword !== reTypePassword) {
                alert("Passwords do not match.");
                return;
            }

        }

        const ajax = new XMLHttpRequest();

        ajax.open('PUT', "/dashboard/profile/edit/{{ data.user_id }}", true);
        ajax.setRequestHeader('Content-Type', 'application/json');

        ajax.onload = function () {
            if (ajax.status === 200) {
                window.location.href = '/dashboard/home';
            } else if (ajax.status === 400) {
                alert("Please provide details")
            } else {
                alert("User already exists");
            }
        };

        const userData = {
            name: name,
            email: email,
            newPassword: newPassword
        };

        ajax.send(JSON.stringify(userData));

    });