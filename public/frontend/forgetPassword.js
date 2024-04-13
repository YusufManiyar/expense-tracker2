import config from './config.js'

document.getElementById('forgetPassword').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const url = `${config.BACKEND_URL}/password/forgetpassword`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert('Password reset instructions sent successfully!');
        } else {
            alert('Failed to send password reset instructions. Please try again later.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
});
