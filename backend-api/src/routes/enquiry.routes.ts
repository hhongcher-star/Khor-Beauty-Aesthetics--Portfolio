import express from 'express';
import prisma from '../utils/prisma';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { idParamSchema } from '../schemas/common.schema';
import { createEnquirySchema, updateEnquiryStatusSchema } from '../schemas/enquiry.schema';

const router = express.Router();

const normalizeEnquiryStatus = (status: string) => {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'contacted') return 'Contacted';
  if (normalized === 'closed') return 'Closed';
  return 'New';
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(enquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', validate(createEnquirySchema), async (req, res) => {
  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        ...req.body,
        source: req.body.source || 'Website Form',
        status: 'New',
      },
    });

    res.status(201).json({
      message: 'Enquiry submitted successfully',
      data: enquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put(
  '/:id/status',
  authMiddleware,
  validate(idParamSchema, 'params'),
  validate(updateEnquiryStatusSchema),
  async (req, res) => {
    try {
      const enquiry = await prisma.enquiry.update({
        where: { id: String(req.params.id) },
        data: { status: normalizeEnquiryStatus(req.body.status) },
      });

      res.json({
        message: 'Enquiry status updated successfully',
        data: enquiry,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
