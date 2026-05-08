import GeneratedProject from '../models/GeneratedProject.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Service for tracking and reporting generation progress
 */
export class GenerationProgressService {
  /**
   * Update generation progress
   */
  static async updateProgress(
    projectId: string,
    phase: string,
    progress: number,
    message?: string,
    details?: any
  ): Promise<any> {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      if (!project.metadata) project.metadata = {};

      project.metadata.currentPhase = phase;
      project.metadata.progress = Math.min(progress, 100);
      project.metadata.lastUpdated = new Date();

      if (message) {
        project.metadata.progressMessage = message;
      }

      if (details) {
        project.metadata.phaseDetails = {
          ...project.metadata.phaseDetails,
          [phase]: details,
        };
      }

      await project.save();

      return {
        projectId,
        phase,
        progress: project.metadata.progress,
        message: project.metadata.progressMessage || '',
        timestamp: project.metadata.lastUpdated,
      };
    } catch (error: any) {
      throw new ApiError(500, `Failed to update progress: ${error.message}`);
    }
  }

  /**
   * Get current progress
   */
  static async getProgress(projectId: string): Promise<any> {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      return {
        projectId,
        projectName: project.projectName,
        status: project.status,
        progress: project.metadata?.progress || 0,
        currentPhase: project.metadata?.currentPhase || 'initializing',
        message: project.metadata?.progressMessage || '',
        phaseDetails: project.metadata?.phaseDetails || {},
        filesGenerated: project.filesCount || 0,
        totalSize: project.totalSize || 0,
        startedAt: project.createdAt,
        lastUpdated: project.metadata?.lastUpdated,
        estimatedCompletion: this.estimateCompletion(project),
      };
    } catch (error: any) {
      throw new ApiError(500, `Failed to get progress: ${error.message}`);
    }
  }

  /**
   * Get progress history (all phases)
   */
  static async getProgressHistory(projectId: string): Promise<any[]> {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      const phases = ['initializing', 'requirements', 'frontend', 'backend', 'database', 'authentication', 'documentation', 'deployment'];
      const phaseDetails = project.metadata?.phaseDetails || {};

      return phases.map((phase) => ({
        phase,
        status: phaseDetails[phase]?.status || 'pending',
        filesGenerated: phaseDetails[phase]?.filesGenerated || 0,
        duration: phaseDetails[phase]?.duration || 0,
        message: phaseDetails[phase]?.message || '',
      }));
    } catch (error: any) {
      throw new ApiError(500, `Failed to get progress history: ${error.message}`);
    }
  }

  /**
   * Estimate completion time
   */
  private static estimateCompletion(project: any): string {
    const currentProgress = project.metadata?.progress || 0;
    const startTime = new Date(project.createdAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000; // in seconds

    if (currentProgress === 0 || elapsedTime === 0) {
      return 'Calculating...';
    }

    const totalEstimatedTime = (elapsedTime / currentProgress) * 100;
    const remainingTime = totalEstimatedTime - elapsedTime;
    const completionTime = new Date(currentTime + remainingTime * 1000);

    return completionTime.toLocaleTimeString();
  }

  /**
   * Mark phase as completed
   */
  static async completePhase(
    projectId: string,
    phase: string,
    filesGenerated: number,
    duration: number
  ): Promise<any> {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      if (!project.metadata) project.metadata = {};
      if (!project.metadata.phaseDetails) project.metadata.phaseDetails = {};

      project.metadata.phaseDetails[phase] = {
        status: 'completed',
        filesGenerated,
        duration,
        completedAt: new Date(),
      };

      // Calculate overall progress
      const phaseProgressMap = {
        initializing: 5,
        requirements: 10,
        frontend: 35,
        backend: 50,
        database: 65,
        authentication: 80,
        documentation: 90,
        deployment: 100,
      };

      const phaseProgress = phaseProgressMap[phase as keyof typeof phaseProgressMap] || 0;
      project.metadata.progress = phaseProgress;
      project.metadata.lastUpdated = new Date();

      await project.save();

      return {
        phase,
        status: 'completed',
        filesGenerated,
        duration,
        overallProgress: project.metadata.progress,
      };
    } catch (error: any) {
      throw new ApiError(500, `Failed to complete phase: ${error.message}`);
    }
  }

  /**
   * Handle generation error
   */
  static async recordError(
    projectId: string,
    phase: string,
    error: string
  ): Promise<any> {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      if (!project.metadata) project.metadata = {};
      if (!project.metadata.errors) project.metadata.errors = [];

      project.metadata.errors.push({
        phase,
        message: error,
        timestamp: new Date(),
      });

      project.status = 'partial';
      project.metadata.lastUpdated = new Date();

      await project.save();

      return {
        projectId,
        phase,
        error,
        status: 'error',
        totalErrors: project.metadata.errors.length,
      };
    } catch (error: any) {
      throw new ApiError(500, `Failed to record error: ${error.message}`);
    }
  }

  /**
   * Get all errors for a project
   */
  static async getErrors(projectId: string): Promise<any[]> {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      return project.metadata?.errors || [];
    } catch (error: any) {
      throw new ApiError(500, `Failed to get errors: ${error.message}`);
    }
  }
}
