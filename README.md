# Personal Finance Visualizer (PFV)

A modern, full-stack personal finance management app to track your income, expenses, budgets, and analytics with beautiful charts and a seamless user experience.

---

## 🌐 Live Demo
- **Frontend (Vercel):** https://personal-finance-visualizer-snowy-ten.vercel.app/
- **Backend (Render):** https://personal-finance-visualizer-buc9.onrender.com

---

## 🚀 Features

- **Dashboard:**
  - Overview of your finances with summary cards (Total Income, Expenses, Net Balance, Budget)
  - Monthly Overview bar chart (income vs expenses)
  - Spending by Category pie chart
  - Recent Transactions list
  - Year and multi-month selection with custom dropdown

- **Transactions:**
  - Add, edit, delete transactions
  - Filter by type, category, date range, amount range
  - Category auto-matching and custom categories support
  - Transactions sorted by creation date (latest first)
  - Edit/delete buttons appear on row hover

- **Budget Management:**
  - Add, edit, delete budgets for any category and month
  - Multi-month selection with custom dropdown
  - Budget vs Actual horizontal bar chart
  - Only current month budgets are editable; past months are view-only
  - Custom categories supported

- **Analytics:**
  - Savings Rate, Total Transactions, Avg. Monthly Expenses (all update with year/month selection)
  - Multi-month selection with custom dropdown
  - Income vs Expenses and Spending by Category charts

- **General:**
  - Responsive, modern UI with smooth transitions
  - All data visualizations update live with filters and selections
  - Works with any number of custom or default categories

---

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Deployment:** Vercel (frontend), Render (backend)

---

## ⚙️ Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=https://your-backend-on-render.com/api
```

### Backend (`.env`)
```
MONGODB_URI=your-mongodb-uri
PORT=3001
```

---

## 🚦 Deployment Instructions

### Backend (Render)
1. Push your backend code to GitHub.
2. Create a new Web Service on [Render](https://render.com/):
   - Connect your repo, set build/start commands (`npm install`, `npm run build`, `npm start` or `npm run dev`).
   - Add your environment variables (MongoDB URI, PORT).
   - Deploy and note your backend URL.

### Frontend (Vercel)
1. Push your frontend code to GitHub.
2. Import your repo into [Vercel](https://vercel.com/).
3. Set the `VITE_API_URL` environment variable to your Render backend URL (ending with `/api`).
4. Deploy and get your live frontend URL.

---

## 📝 Functionality Overview

- **Multi-Month Selection:**
  - All main pages (Dashboard, Analytics, Budget) support selecting multiple months via a custom dropdown with checkboxes.
  - All charts, summary cards, and lists update to reflect the selected months and year.

- **Custom Categories:**
  - Add budgets and transactions with any category name.
  - Backend supports any string for category (not just a fixed list).

- **Budget Logic:**
  - Budgets are managed per category per month.
  - Only current month budgets are editable; past months are view-only.
  - Budget vs Actual chart aggregates across selected months.

- **Transactions:**
  - Add, edit, delete, and filter transactions.
  - Transactions are always shown with the latest first.
  - Category names are matched and displayed correctly, including custom categories.

- **Analytics:**
  - All metrics and charts update live with year/month selection.
  - Multi-month selection supported for all analytics.

- **UI/UX:**
  - Modern, responsive design with smooth transitions and animations.
  - Custom dropdowns for month selection with popover and checkboxes.
  - Consistent look and feel across all pages.

---

## 📦 Project Structure

```
PFV/
  backend/
    src/
      models/
      routes/
      ...
  frontend/
    src/
      components/
      views/
      charts/
      ...
```

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE) 
