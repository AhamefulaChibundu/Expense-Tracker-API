const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
const PORT = process.env.PORT || 3000;


let expenses = [
  {
    id: 1,
    amount: 50000,
    category: 'Food',
    date: '2026-06-01',
    reimbursed: false
  },
  {
    id: 2,
    amount: 3000,
    category: 'Transport',
    date: '2026-06-02',
    reimbursed: true
  },
  {
    id: 3,
    amount: 330000,
    category: 'Rent',
    date: '2026-06-03',
    reimbursed: false
  }
];

// GET ALL EXPENSES
app.get('/expenses', (req, res) => {
  res.status(200).json(expenses);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});