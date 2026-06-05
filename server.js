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

// GET REIMBURSED EXPENSES
app.get('/expenses/reimbursed', (req, res) => {
  const reimbursedExpenses = expenses.filter(
    expense => expense.reimbursed
  );

  res.status(200).json(reimbursedExpenses);
});

// GET UNREIMBURSED EXPENSES
app.get('/expenses/unreimbursed', (req, res) => {
  const unreimbursedExpenses = expenses.filter(
    expense => !expense.reimbursed
  );

  res.status(200).json(unreimbursedExpenses);
});

// GET TOTAL EXPENSES
app.get('/expenses-total', (req, res) => {
  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  res.status(200).json({
    totalExpenses: total
  });
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

// GET SINGLE EXPENSE
app.get('/expenses/:id', (req, res) => {
  const id = Number(req.params.id);

  const expense = expenses.find(
    expense => expense.id === id
  );

  if (!expense) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Expense not found.'
    });
  }

  res.status(200).json(expense);
});

// CREATE EXPENSE
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

// PATCH EXPENSE
app.patch('/expenses/:id', (req, res) => {
  const id = Number(req.params.id);
  const expense = expenses.find(
    expense => expense.id === id
  );

  if (!expense) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Expense not found.'
    });
  }

  const { title, amount, category, date, reimbursed } = req.body;

  if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: "Validation Error: 'amount' must be a positive number greater than 0."
    });
  }

  if (title !== undefined) expense.title = title;
  if (amount !== undefined) expense.amount = amount;
  if (category !== undefined) expense.category = category;
  if (date !== undefined) expense.date = date;
  if (reimbursed !== undefined) expense.reimbursed = reimbursed;

  res.status(200).json({
    message: 'Expense updated successfully!',
    data: expense
  });
});

// PUT EXPENSE (Full Update)
app.put('/expenses/:id', (req, res) => {
  const expense = expenses.find(
    expense => expense.id === parseInt(req.params.id)
  );

  if (!expense) {
    return res.status(404).json({
      error: "Not Found",
      message: "Expense not found"
    });
  }

  const {
    title,
    amount,
    category,
    date,
    reimbursed
  } = req.body;

  // Required fields validation
  if (!title || !category || !date) {
    return res.status(400).json({
      error: "Bad Request",
      message:
        "title, category and date are required"
    });
  }

  // Amount validation
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      error: "Bad Request",
      message:
        "amount must be a positive number"
    });
  }

  // Full replacement
  expense.title = title;
  expense.amount = amount;
  expense.category = category;
  expense.date = date;
  expense.reimbursed = reimbursed ?? false;

  res.status(200).json({
    message: "Expense updated successfully",
    data: expense
  });
});

// DELETE EXPENSE
app.delete('/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const initialLength = expenses.length;

  expenses = expenses.filter(
    expense => expense.id !== id
  );

  if (expenses.length === initialLength) {
    return res.status(404).json({
      message: 'Expense not found'
    });
  }

  res.status(204).send();
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
