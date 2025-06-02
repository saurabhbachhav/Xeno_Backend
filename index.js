require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const customerRoutes = require("./routes/customer");
const orderRoutes = require("./routes/order");
const campaignRoutes = require("./routes/campaigns");
const aiRoutes = require("./routes/ai");
const segmentRoutes = require("./routes/segmentRoutes.js");
const vendorRoutes = require("./routes/vendor");
const receiptRoutes = require("./routes/receipt");
const bodyParser = require("body-parser");
const nlToRulesRouter = require("./routes/nlToRules");

const app = express();
app.use(bodyParser.json());
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://xeno-frontend-lyart.vercel.app"],
    credentials: true,
  })
);


// DB connection
connectDB();

// Sample route
app.get("/", (req, res) => {
  res.send("Xeno CRM Backend Running");
});

app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/segments", segmentRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/nl-to-rule", nlToRulesRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
