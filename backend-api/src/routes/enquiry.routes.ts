import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// GET all enquiries - admin only
router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: "Get all enquiries",
  });
});

// POST enquiry - public customer form
router.post("/", (req, res) => {
  const enquiryData = req.body;

  res.json({
    message: "Enquiry submitted successfully",
    data: enquiryData,
  });
});

export default router;