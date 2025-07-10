import React from 'react';

const TransactionList = ({ transactions }) => {
  if (!transactions.length) {
    return <p>No transactions found.</p>;
  }

  return (
    <ul>
      {transactions.map((t, i) => (
        <li key={i}>
          <strong>{t.type.toUpperCase()}</strong> — ${t.amount} on {new Date(t.date).toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
