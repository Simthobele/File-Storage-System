document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log(data);
        alert('Registration successful');
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        alert('Registration failed');
    }
});

document.getElementById('signinForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const username = document.getElementById('signinUsername').value;
    const password = document.getElementById('signinPassword').value;
    
    try {
        const response = await fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log(data);
        alert('Sign in successful');
        // Save the token in localStorage for authenticated requests
        localStorage.setItem('token', data.token);
        // Redirect to the upload page
        window.location.href = 'upload.html';
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        alert('Sign in failed');
    }
});
