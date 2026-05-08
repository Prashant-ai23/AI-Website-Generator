import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import projectRoutes from './projects.js';
import templateRoutes from './templates.js';
import aiRoutes from './ai.js';
import aiGeneratorRoutes from './aiGenerator.js';
import analyzerRoutes from './analyzer.js';
import codegenRoutes from './codegen.js';
import apigenRoutes from './apigen.js';
import docsRoutes from './docs.js';
import filegenRoutes from './filegen.js';
import chatRoutes from './chat.js';
import previewRoutes from './preview.js';
import exportRoutes from './export.js';

const router = express.Router();

/**
 * API v1 Routes
 * Base: /api/v1
 */

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Project routes
router.use('/projects', projectRoutes);

// Template routes
router.use('/templates', templateRoutes);

// AI Generation routes
router.use('/ai', aiRoutes);

// AI Generator (Full-stack) routes
router.use('/ai-generator', aiGeneratorRoutes);

// Analyzer routes
router.use('/analyzer', analyzerRoutes);

// Code Generator routes
router.use('/codegen', codegenRoutes);

// API Generator routes
router.use('/apigen', apigenRoutes);

// Documentation routes
router.use('/docs', docsRoutes);

// File Generation routes
router.use('/filegen', filegenRoutes);

// Chat routes
router.use('/chat', chatRoutes);

// Preview routes
router.use('/preview', previewRoutes);

// Export routes
router.use('/export', exportRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

export default router;
