# Expense Tracker REST API

A RESTful API built with **Node.js** and **Express.js** for tracking, filtering, and managing expenses. Supports full CRUD operations with input validation and error handling.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Request & Response Examples](#request--response-examples)
- [Error Handling](#error-handling)

---

## Features

- Get all expenses or a single expense by ID
- Filter expenses by category, date, reimbursement status, or high value
- Get the total sum of all expenses
- Create, update (full & partial), and delete expenses
- Input validation with descriptive error messages
- Global error handling middleware

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Config:** dotenv

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org) installed.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AhamefulaChibundu/Expense-Tracker-API.git
cd expense-tracker-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory (see [Environment Variables](#environment-variables)).

4. Start the server:

```bash
node index.js
```

The server will run on `http://localhost:3000` by default.

---

## Environment Variables

Create a `.env` file in the root of the project and add the following:

```
PORT=3000
```

---

## API Endpoints

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | Get all expenses |
| GET | `/expenses/reimbursed` | Get reimbursed expenses only |
| GET | `/expenses/unreimbursed` | Get unreimbursed expenses only |
| GET | `/expenses/high` | Get expenses with amount > 5000 |
| GET | `/expenses/category/:category` | Get expenses by category |
| GET | `/expenses/date/:date` | Get expenses by date (YYYY-MM-DD) |
| GET | `/expenses-total` | Get the total sum of all expenses |
| GET | `/expenses/:id` | Get a single expense by ID |
| POST | `/expenses` | Create a new expense |
| PATCH | `/expenses/:id` | Partially update an expense |
| PUT | `/expenses/:id` | Fully replace an expense |
| DELETE | `/expenses/:id` | Delete an expense |

---

## Request & Response Examples

### GET /expenses

**Response 200:**
```json
[
  {
    "id": 1,
    "title": "Lunch",
    "amount": 50000,
    "category": "Food",
    "date": "2026-06-01",
    "reimbursed": false
  }
]
```

---

### POST /expenses

**Request Body:**
```json
{
  "title": "Team Lunch",
  "amount": 75000,
  "category": "Food",
  "date": "2026-06-05",
  "reimbursed": false
}
```

**Response 201:**
```json
{
  "message": "Expense created successfully",
  "data": {
    "id": 4,
    "title": "Team Lunch",
    "amount": 75000,
    "category": "Food",
    "date": "2026-06-05",
    "reimbursed": false
  }
}
```

---

### PATCH /expenses/:id

Send only the fields you want to update.

**Request Body:**
```json
{
  "amount": 60000,
  "reimbursed": true
}
```

**Response 200:**
```json
{
  "message": "Expense updated successfully!",
  "data": {
    "id": 1,
    "title": "Lunch",
    "amount": 60000,
    "category": "Food",
    "date": "2026-06-01",
    "reimbursed": true
  }
}
```

---

### PUT /expenses/:id

All fields are required for a full replacement.

**Request Body:**
```json
{
  "title": "Dinner",
  "amount": 45000,
  "category": "Food",
  "date": "2026-06-06",
  "reimbursed": false
}
```

**Response 200:**
```json
{
  "message": "Expense updated successfully",
  "data": {
    "id": 1,
    "title": "Dinner",
    "amount": 45000,
    "category": "Food",
    "date": "2026-06-06",
    "reimbursed": false
  }
}
```

---

### DELETE /expenses/:id

**Response:** `204 No Content`

---

## Error Handling

| Status Code | Meaning |
|-------------|---------|
| 200 | OK — successful GET, PATCH, or PUT |
| 201 | Created — new expense successfully created |
| 204 | No Content — expense successfully deleted |
| 400 | Bad Request — missing required fields or invalid data type |
| 404 | Not Found — no expense matches the given ID |
| 500 | Server Error — caught by global error handler middleware |

**Example 400 response:**
```json
{
  "error": "Bad Request",
  "message": "title, category and date are required"
}
```

**Example 404 response:**
```json
{
  "error": "Not Found",
  "message": "Expense not found"
}
```

---

## Notes

- Data is stored **in-memory** (a JavaScript array) and resets every time the server restarts.
- The `/expenses/reimbursed`, `/expenses/unreimbursed`, and `/expenses/high` routes must be defined **before** `/expenses/:id` in the code to avoid route conflicts.