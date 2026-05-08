import { Router, Response } from 'express';
import { Website } from '../models/Website.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';

const router = Router();

// Get all websites for user
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const websites = await Website.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json(websites);
  } catch (error) {
    console.error('Get websites error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single website
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const website = await Website.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    res.json(website);
  } catch (error) {
    console.error('Get website error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create website
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, theme } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const website = new Website({
      title,
      description: description || '',
      theme: theme || 'default',
      userId: req.user?.id,
    });

    await website.save();
    res.status(201).json(website);
  } catch (error) {
    console.error('Create website error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update website
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const website = await Website.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      req.body,
      { new: true }
    );

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    res.json(website);
  } catch (error) {
    console.error('Update website error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete website
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const website = await Website.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    res.json({ message: 'Website deleted' });
  } catch (error) {
    console.error('Delete website error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
