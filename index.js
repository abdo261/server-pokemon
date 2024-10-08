const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { getDiskInfo } = require('node-disk-info');
const os = require('os');
require("dotenv").config();
const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");
const imageRouter = require("./router/imageRouter");
const paymentRouter = require("./router/paymentRouter");
const dayRouter = require("./router/dayRouter");
const offerRouter = require("./router/offerRouter");
const paymentOfferRouter = require("./router/paymentOfferRouter");
const paymentStatusRouter = require("./router/paymentCounts");
// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", "default-src 'self'; img-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:5000;");
//   next();
// });
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];
  console.log(allowedOrigins)
app.use(express.json());
app.use(cors({origin:allowedOrigins}));

app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/images", imageRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/payment/status", paymentStatusRouter);
app.use("/api/paymentsOffer", paymentOfferRouter);
app.use("/api/days", dayRouter);
app.use("/api/offers", offerRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected with id:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
app.get('/storage', async (req, res) => {
  try {
    // Get the disk information
    const disks = await getDiskInfo();
    const osName = os.type();
    if (!disks || disks.length === 0) {
      return res.status(404).json({ error: 'No disk information found' });
    }

    // Select the first disk, e.g., the C: drive
    const diskInfo = disks[0];

    // Correctly access the fields with underscores
    const total = diskInfo._blocks ? (diskInfo._blocks / (1024 * 1024 * 1024)).toFixed(2) : 'Unknown'; // Convert to GB
    const available = diskInfo._available ? (diskInfo._available / (1024 * 1024 * 1024)).toFixed(2) : 'Unknown'; // Convert to GB
    const used = diskInfo._used ? (diskInfo._used / (1024 * 1024 * 1024)).toFixed(2) : 'Unknown'; // Convert to GB
    const capacity = diskInfo._capacity || 'Unknown'; // Capacity as a percentage

    // Create the response object
    const diskUsage = { os: osName, 
      filesystem: diskInfo._filesystem || 'Unknown filesystem',
      available: available,
      used: used,
      total: total,
      capacity: capacity,
      mounted: diskInfo._mounted || 'Unknown mounted path'
    };

    // Send the disk usage info as a response
    res.json(diskUsage);
  } catch (err) {
    console.error('Error retrieving disk info:', err);
    res.status(500).send('Error retrieving disk usage information.');
  }
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
