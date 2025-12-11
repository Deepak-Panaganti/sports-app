// backend/seed.js
require("dotenv").config();
const connectDB = require("./config/db");
const Court = require("./models/Court");
const Equipment = require("./models/Equipment");
const Coach = require("./models/Coach");
const PricingRule = require("./models/PricingRule");
const User = require("./models/User");

async function seed() {
  await connectDB();

  console.log("Seeding database...");

  await Court.deleteMany({});
  await Equipment.deleteMany({});
  await Coach.deleteMany({});
  await PricingRule.deleteMany({});
  await User.deleteMany({});

  const courts = await Court.create([
    { name: "Court 1 (indoor)", type: "indoor", basePrice: 10, enabled: true },
    { name: "Court 2 (indoor)", type: "indoor", basePrice: 8, enabled: true },
    { name: "Court 3 (outdoor)", type: "outdoor", basePrice: 8, enabled: true },
    { name: "Court 4 (outdoor)", type: "outdoor", basePrice: 7, enabled: true },
  ]);

  const equipment = await Equipment.create([
    { name: "Racket", totalStock: 10, rentalPrice: 5 },
    { name: "Shoes", totalStock: 10, rentalPrice: 10 },
  ]);

  const coaches = await Coach.create([
    { name: "Coach A", hourlyFee: 20, blockedSlots: [] },
    { name: "Coach B", hourlyFee: 25, blockedSlots: [] },
    { name: "Coach C", hourlyFee: 30, blockedSlots: [] },
  ]);

  const rules = await PricingRule.create([
    {
      name: "Evening Peak",
      condition: "peak",
      type: "multiplier",
      value: 1.5,
      metadata: { start: 18, end: 21 },
      enabled: true,
    },
    {
      name: "Weekend Surcharge",
      condition: "weekend",
      type: "fixed",
      value: 2,
      enabled: true,
    },
    {
      name: "Indoor Premium",
      condition: "indoor",
      type: "multiplier",
      value: 1.2,
      enabled: true,
    },
  ]);

  const user = await User.create({
    name: "Demo User",
    email: "demo@example.com",
  });

  console.log("\n🌱 Seed complete!");
  console.log("Demo User ID:", user._id.toString());
  console.log("------------------------------------");

  return { courts, equipment, coaches, rules, user };
}

module.exports = seed;

if (require.main === module) {
  seed()
    .then(() => {
      console.log("Finished CLI seed — exiting.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
