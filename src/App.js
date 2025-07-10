import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit');
  const [transactions, setTransactions] = useState([]);

  // ✅ Set your backend base URL from environment
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user) {
      axios
        .get(`${BASE_URL}/api/transactions/${user._id}`)
        .then((res) => setTransactions(res.data))
        .catch((err) => console.error('Error fetching transactions:', err.message));
    }
  }, [user]);

  const handleTransaction = async () => {
    try {
      await axios.post(`${BASE_URL}/api/transactions`, {
        userId: user._id,
        amount: Number(amount),
        type,
      });

      // Refresh balance and transactions
      const res = await axios.get(`${BASE_URL}/api/transactions/${user._id}`);
      setTransactions(res.data);

      const updatedUser = await axios.post(`${BASE_URL}/api/users/login`, {
        email,
        password,
      });
      setUser(updatedUser.data);
      setAmount('');
    } catch (err) {
      console.error('Transaction failed:', err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/users/login`, {
        email,
        password,
      });
      setUser(res.data);
    } catch (err) {
      alert('Login failed');
      console.error(err.message);
    }
  };

  return (
    <div className="App">
      {!user ? (
        <div className="login-container">
          <h2>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div className="dashboard-container">
          <h2>Welcome {user.name}</h2>
          <h3>Balance: ${user.balance}</h3>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
          <button onClick={handleTransaction}>Submit</button>

          <h4>Transaction History</h4>
          <ul>
            {transactions.map((t, i) => (
              <li key={i}>
                {t.type} - ${t.amount} on {new Date(t.date).toLocaleDateString()}
              </li>
            ))}
          </ul>

          <footer style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
            Designed by <strong>Vamshi Sindhe</strong>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
