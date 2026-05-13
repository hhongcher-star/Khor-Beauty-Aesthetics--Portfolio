import express from "express";

const router = express.Router();

// GET all enquiries
router.get("/", (req, res) => {
  res.json({
    message: "Get all enquiries",
  });
});

// POST enquiry
router.post("/", (req, res) => {
  const enquiryData = req.body;

  res.json({
    message: "Enquiry submitted successfully",
    data: enquiryData,
  });
});

export default router;