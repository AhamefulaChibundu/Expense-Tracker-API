const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
const PORT = process.env.PORT || 3000;


let expenses = [
  {
    id: 1,
    title: "Lunch",
    amount: 50000,
    category: 'Food',
    date: '2026-06-01',
    reimbursed: false
  },
  {
    id: 2,
    title: "Cab Fare",
    amount: 3000,
    category: 'Transport',
    date: '2026-06-02',
    reimbursed: true
  },
  {
    id: 3,
    title: "Dave's Rent",
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

// GET HIGH EXPENSES
app.get('/expenses/high', (req, res) => {
  const highExpenses = expenses.filter(
    expense => expense.amount > 5000
  );

  res.status(200).json(highExpenses);
});

// GET EXPENSES BY CATEGORY
app.get('/expenses/category/:category', (req, res) => {
  const category = req.params.category;

  const filteredExpenses = expenses.filter(
    expense =>
      expense.category.toLowerCase() ===
      category.toLowerCase()
  );

  res.status(200).json(filteredExpenses);
});

// GET EXPENSES BY DATE
app.get('/expenses/date/:date', (req, res) => {
  const date = req.params.date;

  const expensesByDate = expenses.filter(
    expense => expense.date === date
  );

  res.status(200).json(expensesByDate);
});

app.post('/expenses', (req, res) => {
    const { title, amount, category, date, reimbursed } = req.body;

    // --- TASK 3: VALIDATION LOGIC ---
    // Check if the required fields are completely missing
    if (!title || !amount || !category || !date) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Missing data: 'title', 'amount', 'category', and 'date' fields are all required."
        });
    }

    // Additional data type validation to prevent bad data types
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Validation Error: 'amount' must be a positive number greater than 0."
        });
    }

    // --- TASK 2: LOGIC TO CREATE EXPENSE ---
    // Formulate the new expense object layout
    const newExpense = {
        id: expenses.length + 1, // Simple dynamic ID creation string
        title,
        amount,
        category,
        date,
        reimbursed: reimbursed ?? false // Default setting to false if not explicitly provided
    };

    // Save the newly generated object into our records array tracker
    expenses.push(newExpense);

    // Respond back to client with success code 211 Created and the raw object layout
    res.status(201).json({
        message: "Expense created successfully!",
        data: newExpense
    });
});


// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: 'Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});