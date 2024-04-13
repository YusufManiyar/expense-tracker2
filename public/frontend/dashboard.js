// Sample data for demonstration purposes
import config from './config.js'

if(localStorage.getItem('token') !== null){
    
    document.getElementsByClassName('close').addEventListener('click', closePopup)

    document.getElementById('home-btn').addEventListener('click', (e) => window.location.href = 'index.html')

    const premiumActive = localStorage.getItem('premiumActive')
    if (premiumActive === 'false') {
        document.getElementById('download-btn').setAttribute('disabled', 'true')
        document.getElementById('download-btn').style.padding = '10px 20px';
        document.getElementById('download-btn').style.backgroundColor = '#ccc';
        document.getElementById('download-btn').style.color = '#666';
        document.getElementById('download-btn').style.border = 'none';
        document.getElementById('download-btn').style.borderRadius = '5px';
        document.getElementById('download-btn').style.cursor = 'not-allowed';
        document.getElementById('download-btn').title = 'Buy premium to unlock';


    }

    document.getElementById('rowsPerPage').value = localStorage.getItem('rowsPerPage') || 10
    document.getElementById('rowsPerPage').addEventListener('change', (e) => {
        e.preventDefault()
        localStorage.setItem('rowsPerPage', e.target.value)
        handlePagination(1)
    })

    let expenses = []

    let downloadBtn = document.getElementById('download-btn')

    downloadBtn.addEventListener("click", downloadCSV)

    document.getElementById('filter-btn').addEventListener('click', async (e) => {
        e.preventDefault()

        const startDate = document.getElementById('start-date').value
        const endDate = document.getElementById('end-date').value
        await handleFilter({startDate, endDate})
    })

    // Function to calculate and display stats
    function calculateStats() {
        const totalExpense = expenses.reduce((acc, item) => item.category === 'Expense' ? acc + item.amount : acc, 0);
        const totalIncome = expenses.reduce((acc, item) => item.category === 'Income' ? acc + item.amount : acc, 0);
        const netSavings = totalIncome - totalExpense;

        document.getElementById('total-expense').textContent = totalExpense.toFixed(2);
        document.getElementById('total-income').textContent = totalIncome.toFixed(2);
        document.getElementById('net-savings').textContent = netSavings.toFixed(2);
    }

    // Function to handle filtering
    async function handleFilter(filter) {
        let query = '', startQuery, endQuery
        if(filter.startDate) {
            startQuery = `startDate=${filter.startDate}`
        }

        if(filter.endDate) {
            endQuery = `endDate=${filter.endDate}`
        }
        
        if(startQuery) {
            query = startQuery
        }

        if(endQuery) {
            query = endQuery
        }

        if(startQuery && endQuery) {
            query = startQuery + '&&' + endQuery
        }


        `s&&endDate=${filter.endDate}`
        const resp = await fetch(`${config.BACKEND_URL}/expense?${query}`, {method: 'GET', headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        })

        const data = await resp.json()
        expenses = data.expenses

        calculateStats();
        handlePagination(1); // Reset pagination to first page
    }

    // Function to handle pagination
    function handlePagination(pageNumber) {
        const rowsPerPage = Number(localStorage.getItem('rowsPerPage')) || 10;
        const startIndex = (pageNumber - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const totalPages = Math.ceil(expenses.length / rowsPerPage);

        if(pageNumber > totalPages || pageNumber < 1) {
            return
        }

        const tableBody = document.getElementById('expense-table-body');
        tableBody.innerHTML = ''; // Clear existing table data

        for (let i = startIndex; i < endIndex && i < expenses.length; i++) {
            const item = expenses[i];
            const row = `<tr><td>${item.description}</td><td>${item.category === 'Income' ? item.amount: ''}</td><td>${item.category === 'Expense' ? item.amount: ''}</td></tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        }

        document.getElementById('current-page').textContent = pageNumber;
        document.getElementById('total-pages').textContent = totalPages;
    }

        document.getElementById('prev-page-btn').addEventListener('click', function(e) {
            e.preventDefault()
            const pageNumber = Number(document.getElementById('current-page').textContent)

            handlePagination(pageNumber-1)


        })

        document.getElementById('next-page-btn').addEventListener('click', function(e) {
            e.preventDefault()
            const pageNumber = Number(document.getElementById('current-page').textContent)

            handlePagination(pageNumber+1)

        })

        document.getElementById('go-btn').addEventListener('click', function(e) {
            e.preventDefault()
            const pageNumber = Number(document.getElementById('go-to-page').value)
            handlePagination(pageNumber)

        })

        document.getElementById('first-page-btn').addEventListener('click', function(e) {
            e.preventDefault()
            handlePagination(1)
        })

        document.getElementById('last-page-btn').addEventListener('click', function(e) {
            e.preventDefault()
            const pageNumber = Number(document.getElementById('total-pages').textContent)
            handlePagination(pageNumber)

        })

    // Function to download CSV
    async function downloadCSV() {
        let startDate = document.getElementById('start-date').value
        let endDate = document.getElementById('end-date').value
        let query = '', startQuery, endQuery
        if(startDate) {
            startQuery = `startDate=${startDate}`
        }

        if(endDate) {
            endQuery = `endDate=${endDate}`
        }
        
        if(startQuery) {
            query = startQuery
        }

        if(endQuery) {
            query = endQuery
        }

        if(startQuery && endQuery) {
            query = startQuery + '&&' + endQuery
        }

        const resp = await fetch(`${config.BACKEND_URL}/expense/download?${query}`, {method: 'GET', headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        })

        const data = await resp.json()
        // Create a link element
        var link = document.createElement("a");
        link.setAttribute("href", data.file);
        link.setAttribute("download", "expenses.csv");

        // Append the link to the body and click it programmatically
        document.body.appendChild(link);
        link.click();

    }

    handleFilter({})

    const showPopupBtn = document.getElementById('showPopupBtn');
const downloadPopup = document.getElementById('downloadPopup');
const downloadList = document.getElementById('downloadList');

// Function to open the popup
function openPopup() {
    downloadPopup.style.display = 'block';
}

// Function to close the popup
function closePopup() {
    downloadPopup.style.display = 'none';
}

// Function to show downloaded files in the popup
function showDownloadedFiles(files) {
    downloadList.innerHTML = '';
    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${file.fileUrl}" target="_blank">${file.name}</a> (Downloaded on ${new Date(file.createdAt).toDateString()})`;
        downloadList.appendChild(listItem);
    });
}

// Event listener for the button to show the popup
showPopupBtn.addEventListener('click', async () => {
    const resp = await fetch(`${config.BACKEND_URL}/showdownloadedfiles`, { method: 'GET', headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }})

    if(!resp.ok) {
        const error = await resp.json()
        throw error.message
    }

    const files = await resp.json()

    showDownloadedFiles(files);
    openPopup();
});


}
else {
    alert('user not found please login.')
    window.location.href = 'login.html'
}