import express from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { idParamSchema } from '../schemas/common.schema';
import { createServiceSchema, updateServiceSchema } from '../schemas/service.schema';

const router = express.Router();

type SerializedService = {
  price: { toString: () => string } | number | string;
};

router.get('/', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(
      services.map((service: SerializedService) => ({
        ...service,
        price: Number(service.price),
      }))
    );
  } catch (error) {
    console.error('GET /services error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/:id', validate(idParamSchema, 'params'), async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id: String(id) },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      ...service,
      price: Number(service.price),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', authMiddleware, validate(createServiceSchema), async (req, res) => {
  try {
    const service = await prisma.service.create({
      data: req.body,
    });

    res.status(201).json({
      message: 'Service created successfully',
      data: {
        ...service,
        price: Number(service.price),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put(
  '/:id',
  authMiddleware,
  validate(idParamSchema, 'params'),
  validate(updateServiceSchema),
  async (req, res) => {
    try {
      const id = req.params.id as string;

      const existingService = await prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        return res.status(404).json({ message: 'Service not found' });
      }

      const service = await prisma.service.update({
        where: { id },
        data: req.body,
      });

      res.json({
        message: 'Service updated successfully',
        data: {
          ...service,
          price: Number(service.price),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.delete('/:id', authMiddleware, validate(idParamSchema, 'params'), async (req, res) => {
  try {
    const id = req.params.id as string;

    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await prisma.service.delete({
      where: { id },
    });

    res.json({
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
