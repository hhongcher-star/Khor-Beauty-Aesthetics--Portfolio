import express from "express";
import cors from "cors";
import bookingRoutes from './routes/booking.routes';
import enquiryRoutes from './routes/enquiry.routes';
import serviceRoutes from "./routes/service.routes";
import authRoutes from "./routes/auth.routes";



const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/bookings', bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/enquiries', enquiryRoutes);

app.get("/", (req, res) => {
  res.send("Khor Beauty Backend API is running");
});

export default app;