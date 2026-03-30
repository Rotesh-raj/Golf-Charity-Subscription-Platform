import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import subscriptionRoutes from "./routes/subscription.js";
import webhookRoutes from "./routes/webhook.js";

dotenv.config();

const app = express();

// 🔥 CORS FIRST
app.use(cors());


// 🔥 IMPORTANT: STRIPE WEBHOOK (RAW BODY ONLY HERE)
app.use("/api/webhook", express.raw({ type: "application/json" }));


// 🔥 NORMAL JSON FOR OTHER ROUTES
app.use(express.json());


// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);

// 🔥 WEBHOOK ROUTE (NO PREFIX CHANGE)
app.use("/api/webhook", webhookRoutes);


// 🔥 TEST
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


// 🔥 SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});