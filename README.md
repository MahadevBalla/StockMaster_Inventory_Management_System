# 📦 StockMaster – Smart Inventory Management for SMBs

StockMaster is a modular, real-time, multi-warehouse Inventory Management System built for businesses that want to replace spreadsheets, manual registers, and disconnected workflows with a centralized, intelligent platform.

Designed for Inventory Managers, Warehouse Staff, and Operations Teams, StockMaster ensures complete visibility, accuracy, and efficiency across all stock-related operations.

---

## 🧩 Problem Statement

- Businesses often struggle with:

- Disorganized inventory records across multiple locations

- No real-time updates on stock movement

- Manual errors in receipts, deliveries, and adjustments

- Poor visibility into low stock or overstocks

- No unified dashboard for decision-making

- Legacy systems that are rigid, expensive, or outdated

**StockMaster** solves these challenges through:

- A centralized real-time dashboard

- Multi-warehouse inventory management

- Unified stock movement tracking

- Dynamic reporting & analytics

- AI-powered insights using Gemini API

---

## 🚀 Features

### 🔐 Role-Based Access Control

- **Admins**: Full access and user management  
- **Managers**: Strategic control over stock  
- **Staff**: Daily operations (add/edit/view stock)  
- Secured via JWT or session-based authentication

### 📊 Dynamic Inventory Dashboard

- Real-time stock updates  
- Visual activity feed for stock movements  
- Alerts for low inventory & expiry  

### 📚 Full Stock Movement History

- Timestamped logs of every transaction  
- Track purchases, returns, transfers  
- Reversible actions with full traceability  

### 📈 Advanced Reports & Analytics

- Visualize trends: fast-moving, slow-moving, and idle items  
- Inventory valuation over time  
- Export reports in CSV or PDF  

### 🏢 Multi-Warehouse Management

- Assign and move products between warehouses  
- View individual or global stock stats  

### ⚠️ Low Stock & Expiry Notifications

- Customizable thresholds and expiry dates  
- Optional email and push alerts for proactive restocking  

### 📥 Bulk Import/Export

- Upload/download inventory via CSV  
- Perfect for large datasets and migrations  

### 🧠 AI-Powered Summarization with Gemini API

- Generate natural-language summaries of inventory logs, stock health, and warehouse status  
- Use Gemini API to help managers get actionable insights instantly  

---

## 💻 Tech Stack

| Layer        | Tech                      |
|--------------|---------------------------|
| Frontend     | React.js, Tailwind CSS    |
| Backend      | Node.js, Express.js       |
| Database     | MongoDB                   |
| AI Integration | Gemini API              |
| Auth         | JWT / Session-based       |
| Reporting    | CSV & PDF Export          |

---

## 📂 Project Structure

```
StockMaster_Inventory_Management_System/
├── frontend/              # React + Tailwind frontend
│   ├── components/
│   ├── pages/
│   └── ...
├── backend/              # Node + Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── utils/
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- MongoDB instance (local or Atlas)
- Gemini API Key

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/MahadevBalla/StockMaster_Inventory_Management_System
   cd StockMaster_Inventory_Management_System
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   In `backend/.env`:

   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Run the app**
   ```bash
   # From root
   npm run dev
   ```

---

## 📬 Future Enhancements

- Mobile app support  
- Barcode/QR scanning  
- Supplier integrations  
- AI demand forecasting  
- Inventory snapshots and versioning  

---

## 🙌 Acknowledgements

- Google's Gemini API for powering intelligent summaries  
- MongoDB & Express for scalable backend  
- React & Tailwind for modern, responsive UI
