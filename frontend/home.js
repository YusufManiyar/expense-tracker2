const logout = document.getElementById('logout-button');
logout.addEventListener('click', function(){
    window.location.href = 'login.html'
    localStorage.clear()
    // localStorage.removeItem('token')
    // localStorage.removeItem('premiumActive')
})

if(localStorage.getItem('token') !== null){
    

    function ispremium() {
        const premiumActive = localStorage.getItem('premiumActive');
    
        if (premiumActive === 'true') {
            // Log the value of 'premiumActive'
            toggleElementDisplay('premium', 'none');
            toggleElementDisplay('premium-account', 'flex');
            toggleElementDisplay('leaderboard', 'block')
        } else {
            toggleElementDisplay('leaderboard', 'none')
            toggleElementDisplay('premium', 'block');
            toggleElementDisplay('premium-account', 'none');
        }
    }
    
    function toggleElementDisplay(elementId, displayValue) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = displayValue;
        } else {
            console.error(`Element with ID '${elementId}' not found.`);
        }
    }
    
    
    document.addEventListener("DOMContentLoaded", function() {

        const expenseForm = document.getElementById('expenseForm');
        const expenseList = document.getElementById('expenseList');
        const purchase = document.getElementById('purchase-button')
        const leaderboard = document.getElementById('leaderboard')

        leaderboard.addEventListener('click', () =>  window.location.href= 'leaderboard.html')

        purchase.addEventListener('click', async function(event) {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:4000/purchase/premiummembership', {headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            })
            const data = await response.json()
            var options = {
                key_id: data.key_id,
                order_id: data.order.id,
                handler: async function(response) {
                    const resp = await fetch('http://localhost:4000/purchase/updatetransationstatus', {method:'POST', headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(
                        {
                            order_id: options.order_id,
                            payment_id: response.razorpay_payment_id
                        }
                        )
                    })
                    const data = await resp.json()
                    localStorage.setItem('premiumActive', data.isPremiumActive)
                    ispremium()
                    document.getElementsByClassName('razorpay-payment-form-container')[0].style.display = 'none'
                }
            }

            let rzp = new Razorpay(options)
            rzp.open()

            event.preventDefault();
            
            rzp.on('payment.failed', (response)=> {
                alert('Payment failed! Please try again')
            })

        })
    
        expenseForm.addEventListener('submit', async function(event) {
            event.preventDefault();
    
            const description = document.getElementById('description').value;
            const category = document.getElementById('category').value;
            const amount = parseFloat(document.getElementById('amount').value);
    
            if (description.trim() && category && amount) {
                // addExpense(description, amount);
                await saveExpense(description, category, amount);
                document.getElementById('description').value = '';
                document.getElementById('category').value = '';
                document.getElementById('amount').value = '';
            } else {
                alert('Please enter both description and amount.');
            }
        });
    
        function addExpense(expense) {
            const li = document.createElement('li');
            li.id = expense.id
            li.innerHTML = `
                <span>${expense.description}</span>
                <span>${expense.category}</span>
                <span id='amountValue'>&#8377;${expense.amount}</span>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;
            expenseList.appendChild(li);
        }

        async function saveExpense(description, category, amount) {
            const mode = expenseForm.getAttribute('mode')
            let token = localStorage.getItem('token')
            const transaction = {
                description: description,
                category: category,
                amount: amount
            }

            let data
            if(mode == 'add') {
                const response = await fetch('http://localhost:4000/expense', {method: 'POST', headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(transaction),
                })
                data = await response.json()
            }
            else {
                transaction.id = expenseForm.getAttribute('transactionId')

                expenseForm.removeAttribute('transactionId')
                expenseForm.setAttribute('mode', 'add')

                const response = await fetch('http://localhost:4000/expense', {method: 'PUT', headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(transaction),
                })
                data = await response.json()
            }

            addExpense(data)

        }
        function loadExpenses() {

            fetch(`http://localhost:4000/expense`, {method: 'GET', headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
            }).then(resp => resp.json())
            .then((data) => {
                data && data.expenses.forEach(expense => {
                addExpense({id: expense.id, description: expense.description,category: expense.category, amount: expense.amount});
                localStorage.setItem('premiumActive', data.isPremiumActive)
            })})
        }
    
        ispremium()
        loadExpenses();
    
        expenseList.addEventListener('click', function(event) {
            if (event.target.classList.contains('delete-btn')) {
                const item = event.target.parentElement;
                // const description = item.querySelector('span:first-child').textContent;
                const amount = parseFloat(item.querySelector('span:nth-child(3)').textContent.slice(1));
                deleteExpense(item.id);
                item.remove();
            } else if (event.target.classList.contains('edit-btn')) {
                const item = event.target.parentElement;
                const description = item.querySelector('span:first-child').textContent;
                const category = item.querySelector('span:nth-child(2)').textContent;
                const amount = parseFloat(item.querySelector('span:nth-child(3)').textContent.slice(1));
                document.getElementById('description').value = description;
                document.getElementById('category').value = category;
                document.getElementById('amount').value = amount;
                expenseForm.setAttribute('transactionId', item.id)
                expenseForm.setAttribute('mode', 'update')

            //     const list = {
            //         userid: userid,
            //         id: item.id,
            //         description: item.description,
            //         amount: item.amount
            //     }
            //     fetch('http://localhost:4000/expense', {method: 'PUT', headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify(list),
            // }).then(resp => console.log(resp.json()))
                item.remove();
            }
        });
    
        function deleteExpense(id) {
            let token = localStorage.getItem('token');
            const idObj = {
                id: id,
            }
            // let amount = parseFloat(document.getElementById('amountValue').textContent.slice(1))
    
            fetch(`http://localhost:4000/expense`, {method: 'DELETE', headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(idObj),
            })
        }

    });

}else{
    alert('user not found please logIn.')
    window.location.href = 'login.html'
}
