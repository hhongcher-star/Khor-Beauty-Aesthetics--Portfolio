import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import bookingRoutes from "./routes/booking.routes";
import enquiryRoutes from "./routes/enquiry.routes";
import serviceRoutes from "./routes/service.routes";
import authRoutes from "./routes/auth.routes";
import paymentRoutes from "./routes/payment.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: "Too many requests, please try again later.",
    },
  })
);

app.use(express.json());

app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Khor Beauty Backend API is running");
});

app.use(errorHandler);

export default app;