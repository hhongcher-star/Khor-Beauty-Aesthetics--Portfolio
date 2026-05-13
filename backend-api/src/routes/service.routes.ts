import express from "express";
import prisma from "../utils/prisma";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

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
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const service = await prisma.service.findUnique({
    where: { id },
  });

  res.json(service);
});

// POST create service
router.post("/", authMiddleware, async (req, res) => {
  const { name, description, price, active } = req.body;

  const service = await prisma.service.create({
    data: {
      name,
      description,
      price,
      active,
    },
  });

  res.json({
    message: "Service created successfully",
    data: service,
  });
});

// Prouter.put("/:id", authMiddleware, async (req, res) => {UT update service
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, active } = req.body;

  const service = await prisma.service.update({
    where: { id },
    data: {
      name,
      description,
      price,
      active,
    },
  });

  res.json({
    message: "Service updated successfully",
    data: service,
  });
});

// DELETE service
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  await prisma.service.delete({
    where: { id },
  });

  res.json({
    message: "Service deleted successfully",
  });
});

export default router;