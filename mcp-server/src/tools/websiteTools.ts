import axios from 'axios';

const backendAPI = axios.create({
  baseURL: process.env.BACKEND_API_URL || 'http://localhost:3000',
});

export async function generateWebsite(params: {
  title: string;
  description: string;
  template: string;
  content?: Record<string, unknown>;
}) {
  try {
    // Call backend API to generate website
    const response = await backendAPI.post('/api/websites', {
      title: params.title,
      description: params.description,
      theme: params.template,
      content: params.content || {},
    });

    return {
      success: true,
      website: response.data,
      message: 'Website generated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate website',
    };
  }
}

export async function analyzeContent(params: { websiteId: string; content?: Record<string, unknown> }) {
  // Simulate content analysis
  return {
    websiteId: params.websiteId,
    analysis: {
      seo: {
        score: 85,
        issues: [
          'Missing meta descriptions on some pages',
          'Image alt text could be improved',
        ],
      },
      accessibility: {
        score: 78,
        issues: ['Some buttons lack proper ARIA labels'],
      },
      performance: {
        score: 92,
        suggestions: ['Consider lazy loading images'],
      },
    },
  };
}

export async function optimizePerformance(params: {
  websiteId: string;
  optimization?: string;
}) {
  // Simulate performance optimization
  return {
    websiteId: params.websiteId,
    optimization: params.optimization || 'general',
    results: {
      bytesReduced: 2048000,
      timeImprovement: '23%',
      recommendations: [
        'Enable gzip compression',
        'Minify CSS and JavaScript',
        'Optimize images',
        'Enable browser caching',
      ],
    },
  };
}
