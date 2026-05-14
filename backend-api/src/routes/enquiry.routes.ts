import express from "express";
import prisma from "../utils/prisma";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

const enquiryStatusOptions = ["New", "Contacted", "Closed"];
const sourceOptions = ["Website Form", "WhatsApp", "Instagram", "Manual"];

// GET all enquiries - admin only
router.get("/", authMiddleware, async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(enquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST enquiry - public customer form
router.post("/", async (req, res) => {
  try {
    const { customerName, email, phone, message, source } = req.body;

    if (!customerName || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (customerName.trim().length > 100) {
      return res.status(400).json({ message: "Customer name is too long" });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({ message: "Message is too long" });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        source: source || "Website Form",
        status: "New",
      },
    });

    res.json({
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// PUT update enquiry status
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!["new", "contacted", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: { status },
    });

    res.json({
      message: "Enquiry status updated successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;