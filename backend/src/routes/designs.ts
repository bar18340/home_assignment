import { Router, Request, Response } from 'express';
import { Design } from '../models/Design';
import { upload } from '../middleware/upload';
import { SVGProcessor } from '../services/svgProcessor';
import { DesignStatus } from '../types';
import fs from 'fs/promises';

const router = Router();

// Upload endpoint
router.post('/upload', upload.single('svg'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Create initial design record
    const design = new Design({
      filename: req.file.originalname,
      status: DesignStatus.UPLOADED,
      filePath: req.file.path
    });

    await design.save();

    // Process the SVG file asynchronously
    try {
      design.status = DesignStatus.PROCESSING;
      await design.save();

      const svgContent = await fs.readFile(req.file.path, 'utf-8');
      const processedData = SVGProcessor.processSVG(svgContent);

      // Update design with processed data
      design.svgWidth = processedData.svgWidth;
      design.svgHeight = processedData.svgHeight;
      design.items = processedData.items;
      design.itemsCount = processedData.itemsCount;
      design.coverageRatio = processedData.coverageRatio;
      design.issues = processedData.issues;
      design.status = DesignStatus.PROCESSED;

      await design.save();
    } catch (error) {
      design.status = DesignStatus.ERROR;
      await design.save();
      console.error('Error processing SVG:', error);
    }

    res.status(201).json({
      id: design._id,
      filename: design.filename,
      status: design.status,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Get all designs
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const designs = await Design.find()
      .select('filename status itemsCount createdAt coverageRatio issues')
      .sort({ createdAt: -1 });

    res.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
});

// Get single design with full details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const design = await Design.findById(req.params.id);

    if (!design) {
      res.status(404).json({ error: 'Design not found' });
      return;
    }

    res.json(design);
  } catch (error) {
    console.error('Error fetching design:', error);
    res.status(500).json({ error: 'Failed to fetch design' });
  }
});

export default router;
