import express from "express";
import prisma from "../utils/prisma";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
const categoryOptions = [
  "Skin Booster",
  "Facial Treatment",
  "Anti-Aging",
  "Brightening",
  "Hydration",
  "Body Treatment",
  "Other",
];

// GET all services
router.get("/", async (req, res) => {
  const services = await prisma.service.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(services);
});

// GET single service
// GET single service
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST create service
// POST create service
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, active } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (Number(price) > 100000) {
      return res.status(400).json({ message: "Price is too high" });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({ message: "Service name is too long" });
    }

    if (description.trim().length > 500) {
      return res.status(400).json({ message: "Description is too long" });
    }

    if (!categoryOptions.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        active: Boolean(active),
      },
    });

    res.json({
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// PUT update service
// PUT update service
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { name, description, price, category, active } = req.body;

    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (Number(price) > 100000) {
      return res.status(400).json({ message: "Price is too high" });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({ message: "Service name is too long" });
    }

    if (description.trim().length > 500) {
      return res.status(400).json({ message: "Description is too long" });
    }

    if (!categoryOptions.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        active: Boolean(active),
      },
    });

    res.json({
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// DELETE service
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;

    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }

    await prisma.service.delete({
      where: { id },
    });

    res.json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;