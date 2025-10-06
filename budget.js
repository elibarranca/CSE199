
    <script>
        // Data storage object
        let users = {};
        let currentUser = null;

        // Get elements
        const loginScreen = document.getElementById('loginScreen');
        const registerScreen = document.getElementById('registerScreen');
        const dashboardScreen = document.getElementById('dashboardScreen');

        // Show/hide screens
        document.getElementById('showRegister').addEventListener('click', function(e) {
            e.preventDefault();
            loginScreen.classList.add('hidden');
            registerScreen.classList.remove('hidden');
        });

        document.getElementById('showLogin').addEventListener('click', function(e) {
            e.preventDefault();
            registerScreen.classList.add('hidden');
            loginScreen.classList.remove('hidden');
        });

        // Register form
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            if (users[email]) {
                alert('This email is already registered!');
                return;
            }

            users[email] = {
                password: password,
                transactions: []
            };

            alert('Account created successfully! Please login.');
            registerScreen.classList.add('hidden');
            loginScreen.classList.remove('hidden');
            
            document.getElementById('registerForm').reset();
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!users[email]) {
                alert('No account found with this email!');
                return;
            }

            if (users[email].password !== password) {
                alert('Incorrect password!');
                return;
            }

            currentUser = email;
            document.getElementById('userEmail').textContent = email;
            
            loginScreen.classList.add('hidden');
            dashboardScreen.classList.remove('hidden');
            
            updateDashboard();
            document.getElementById('loginForm').reset();
        });

        // Add transaction
        document.getElementById('transactionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const type = document.getElementById('type').value;

            const transaction = {
                description: description,
                amount: amount,
                type: type,
                date: new Date().toLocaleDateString()
            };

            users[currentUser].transactions.push(transaction);
            
            updateDashboard();
            document.getElementById('transactionForm').reset();
        });

        // Update dashboard
        function updateDashboard() {
            const transactions = users[currentUser].transactions;
            
            let totalIncome = 0;
            let totalExpenses = 0;

            transactions.forEach(function(transaction) {
                if (transaction.type === 'income') {
                    totalIncome += transaction.amount;
                } else {
                    totalExpenses += transaction.amount;
                }
            });

            const balance = totalIncome - totalExpenses;

            document.getElementById('totalBalance').textContent = '$' + balance.toFixed(2);
            document.getElementById('totalIncome').textContent = '$' + totalIncome.toFixed(2);
            document.getElementById('totalExpenses').textContent = '$' + totalExpenses.toFixed(2);

            const transactionsList = document.getElementById('transactionsList');
            
            if (transactions.length === 0) {
                transactionsList.innerHTML = '<div class="no-transactions">No transactions yet. Add your first transaction above!</div>';
                return;
            }

            transactionsList.innerHTML = '';
            
            transactions.slice().reverse().forEach(function(transaction) {
                const item = document.createElement('div');
                item.className = 'transaction-item';
                
                const amountSign = transaction.type === 'income' ? '+' : '-';
                const amountClass = transaction.type === 'income' ? 'income' : 'expense';
                
                item.innerHTML = `
                    <div class="transaction-info">
                        <div><strong>${transaction.description}</strong></div>
                        <div class="transaction-category">${transaction.date}</div>
                    </div>
                    <div class="transaction-amount ${amountClass}">${amountSign}$${transaction.amount.toFixed(2)}</div>
                `;
                
                transactionsList.appendChild(item);
            });
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', function() {
            currentUser = null;
            dashboardScreen.classList.add('hidden');
            loginScreen.classList.remove('hidden');
        });
    </script>