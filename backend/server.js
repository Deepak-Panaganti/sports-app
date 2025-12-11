const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/courts', require('./routes/courts'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/coaches', require('./routes/coaches'));
app.use('/api/pricing-rules', require('./routes/pricingRules'));

// optional seed route for convenience (not in production)
app.get("/__seed", async (req, res) => {
  try {
    const seed = require("./seed");
    await seed();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
