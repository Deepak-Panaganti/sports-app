# **Sports Facility Booking System (Court, Coach & Equipment Booking)**  
### _NxtWave – Acorn Globus Internship Assignment_  
**Author:** Deepak Panaganti  

---
<br>

## 🚀 **Tech Stack**
- **Frontend:** React.js (TailwindCSS, HeadlessUI)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** (Optional – JWT Ready)  

---
<br>

## 📌 **Project Overview**
A full-stack **Sports Court Booking Platform** where users can:

- Book badminton courts  
- Add optional equipment (rackets, shoes)  
- Add optional coaches  
- View and choose available time slots  
- Receive price calculations based on configurable rules  

The system also supports **admin-level configurations** such as pricing rules, court settings, and availability.

---
<br>

# ✅ **1. Frontend (React.js)**  

## ✔ **Included Screens**
- Court Booking Page  
- Slot Selection  
- Equipment Selection  
- Coach Selection  
- Price Calculator  
- Booking Confirmation  
- Dark/Light Mode Toggle  

<br>

## ⭐ **Frontend Features**
- Fully responsive UI  
- Dark + light theme support  
- TailwindCSS + custom CSS variables  
- Interactive components (slot selector, dropdowns)  
- Axios API integration  
- Live price updates based on selection  
- Glassmorphism modern UI  

---
<br>

# ✅ **2. Backend (Node.js + Express)**  

## ⭐ **Backend Features**
- Courts, Coaches, Equipment CRUD  
- Booking API with atomic validation  
- Dynamic pricing engine with:  
  - Peak hour rules  
  - Weekend surcharge  
  - Indoor premium  
  - Stackable pricing rules  
- MongoDB models for resources  
- Auto-seeding support  

---
<br>

# 📘 **API Endpoints**

## 🏸 Courts  
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/courts` | Fetch all courts |

<br>

## 🧑‍🏫 Coaches  
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/coaches` | Fetch coaches list |

<br>

## 🎒 Equipment  
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/equipment` | Fetch equipment list |

<br>

## 📅 Bookings  
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/bookings` | Create a booking (court + coach + equipment) |

<br>

## ⚙️ Pricing Rules (Admin)  
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/pricing` | Fetch pricing rules |
| **POST** | `/api/pricing` | Add pricing rule |

---

<br>

# ✅ **3. MongoDB Database**

## ENTITY–RELATIONSHIP DIAGRAM (ERD)**

┌───────────────┐
│ courts │
├───────────────┤
│ id (PK) │
│ name │
│ type │ (indoor/outdoor)
│ basePrice │
│ enabled │
└─────┬─────────┘
│
│ 1-to-many bookings
▼
┌───────────────┐
│ bookings │
├───────────────┤
│ id (PK) │
│ court_id (FK) │ → courts.id
│ coach_id (FK) │ → coaches.id
│ equipment[] │ → equipment.id
│ start_time │
│ end_time │
│ totalPrice │
└───────────────┘

───────────────────────────────

┌───────────────┐
│ coaches │
├───────────────┤
│ id (PK) │
│ name │
│ hourlyFee │
└───────────────┘

───────────────────────────────

┌───────────────┐
│ equipment │
├───────────────┤
│ id (PK) │
│ name │
│ rentalPrice │
│ totalStock │
└───────────────┘

───────────────────────────────

┌─────────────────────┐
│ pricing_rules │
├─────────────────────┤
│ id (PK) │
│ name │
│ condition │ (peak/weekend/indoor)
│ type │ (multiplier/fixed)
│ value │
│ enabled │
└─────────────────────┘

yaml
Copy code

<br>

## ✔ **Sample Data Included**
- Courts (Indoor + Outdoor)  
- Equipment (Rackets, Shoes)  
- Coaches  
- Pricing rules  
- Demo user (optional)  

---
<br>

# ✅ **4. Documentation (As Required)**  

## 🚀 **Setup Guide**

## 🔧 Backend Setup

```bash
cd backend
npm install
npm start
Backend runs at:
👉 http://localhost:5000

<br>
🌱 Seed Database
bash
Copy code
node seed.js
This inserts:

Courts

Equipment

Coaches

Pricing rules

Demo user

<br>
🧩 Environment Variables
Create a .env inside backend:

bash
Copy code
PORT=5000
MONGO_URI=your_mongo_connection_string
<br>
💻 Frontend Setup
bash
Copy code
cd frontend
npm install
npm start
Frontend runs at:
👉 http://localhost:3000

<br>
🌟 Feature Summary
🏸 Courts & Scheduling
Indoor / Outdoor courts

Availability by hour

Dynamic slot selection

🎒 Equipment Rental
Limited inventory

Auto-blocked when unavailable

🧑‍🏫 Coach Booking
Hourly rates

Availability logic

💸 Dynamic Pricing
Peak hour multiplier

Weekend surcharge

Indoor premium

Stackable pricing rules

<br>
🏁 Conclusion
This Sports Facility Booking System demonstrates:

Full-stack system implementation

Dynamic booking algorithm

Extendable pricing engine

Modern UI/UX using TailwindCSS

Clean separation of backend modules

Real-time slot selection experience

<br>
🙏 Thank You
Sports Facility Booking System 

Developed by Deepak Panaganti