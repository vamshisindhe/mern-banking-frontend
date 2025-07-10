import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState('deposit');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_BASE = 'https://mern-banking-backend.onrender.com';

  useEffect(() => {
    if (user) {
      axios
        .get(`${API_BASE}/api/transactions/${user._id}`)
        .then((res) => {
          setTransactions(res.data);
        })
        .catch((err) => {
          console.error('Error fetching transactions:', err.message);
        });
    }
  }, [user]);

  const handleTransaction = async () => {
    try {
      await axios.post(`${API_BASE}/api/transactions`, {
        userId: user._id,
        amount: Number(amount),
        type,
      });

      const res = await axios.get(`${API_BASE}/api/transactions/${user._id}`);
      setTransactions(res.data);

      const updatedUser = await axios.post(`${API_BASE}/api/users/login`, {
        email,
        password,
      });
      setUser(updatedUser.data);
    } catch (err) {
      console.error('Transaction failed:', err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/users/login`, {
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
    <div className="app-container">
      <div className="animated-heading">
        <h1>🏦 Banking Dashboard</h1>
      </div>

      <div className="App">
        {!user ? (
          <div>
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
          <div>
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
          </div>
        )}
      </div>

      <footer className="footer">
        Designed by <strong>Vamshi Sindhe</strong>
      </footer>
    </div>
  );
}

export default App;
