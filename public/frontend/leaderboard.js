import config from './config.js'

document.getElementById('show-leaderboard')
    const token = localStorage.getItem("token")

    async function show() {
        try {
    const response = await fetch(`${config.BACKEND_URL}/premium/leaderboard`, {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
    const data = await response.json();

    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = ''; // Clear previous data

    data.forEach((user) => {
        const row = `<tr><td>${user.username}</td><td>${user.totalAmount}</td></tr>`;
        leaderboardBody.insertAdjacentHTML('beforeend', row);
    });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
  }
    }

    show()

  const home = document.getElementById('home').addEventListener('click', () => window.location.href = 'index.html')
