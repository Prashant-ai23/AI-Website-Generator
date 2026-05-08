/**
 * Prompt Analyzer Service
 * Analyzes user app prompts and detects required modules
 */

export interface Module {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
  suggestedTechnologies?: string[];
  dependencies?: string[];
  features?: string[];
}

export interface AnalysisResult {
  appName: string;
  appType: string;
  appDescription: string;
  modules: Module[];
  estimatedScope: 'small' | 'medium' | 'large';
  estimatedDuration: string;
  keyTechnologies: string[];
  confidence: number;
}

interface ModulePattern {
  keywords: RegExp | RegExp[];
  module: Omit<Module, 'name'>;
}

class PromptAnalyzer {
  private modulePatterns: Map<string, ModulePattern> = new Map([
    // Authentication
    ['auth', {
      keywords: [/auth/, /login/, /register/, /signin/, /signup/, /password/, /token/, /jwt/, /oauth/, /2fa/, /mfa/],
      module: {
        description: 'User authentication and authorization system',
        priority: 'high',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['JWT', 'bcrypt', 'OAuth2', 'Sessions'],
        features: ['Login', 'Register', 'Password reset', 'Role-based access', '2FA'],
      },
    }],

    // User Management
    ['users', {
      keywords: [/user|profile|account|member|person/, /manage.*user/, /user.*role/, /permission/],
      module: {
        description: 'User profile and account management',
        priority: 'high',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['MongoDB', 'Redis', 'Elasticsearch'],
        features: ['Profile management', 'User roles', 'Permissions', 'Profile pictures'],
      },
    }],

    // Products/Inventory
    ['products', {
      keywords: [/product|item|inventory|catalog|SKU|goods|merchandise/, /product.*list/, /shop/, /store/],
      module: {
        description: 'Product catalog and inventory management',
        priority: 'high',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['MongoDB', 'Elasticsearch', 'Redis', 'CloudStorage'],
        features: ['Product CRUD', 'Categories', 'Search', 'Filtering', 'Reviews', 'Ratings'],
      },
    }],

    // Shopping Cart
    ['cart', {
      keywords: [/cart|shopping.*cart|basket|add.*to.*cart/, /checkout/],
      module: {
        description: 'Shopping cart and checkout functionality',
        priority: 'high',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['Redis', 'Session storage', 'Payment Gateway'],
        features: ['Add/remove items', 'Quantity management', 'Price calculation', 'Coupon support'],
      },
    }],

    // Orders
    ['orders', {
      keywords: [/order|purchase|transaction|payment|invoice|receipt|shipping/],
      module: {
        description: 'Order management and fulfillment',
        priority: 'high',
        estimatedComplexity: 'complex',
        suggestedTechnologies: ['MongoDB', 'Payment API', 'Email service', 'Shipping API'],
        dependencies: ['products', 'auth', 'payments'],
        features: ['Order creation', 'Order tracking', 'Status updates', 'Notifications'],
      },
    }],

    // Payments
    ['payments', {
      keywords: [/payment|payment.*gateway|stripe|paypal|credit.*card|billing|invoice/],
      module: {
        description: 'Payment processing and billing',
        priority: 'high',
        estimatedComplexity: 'complex',
        suggestedTechnologies: ['Stripe', 'PayPal', 'Square', 'Razorpay'],
        features: ['Payment processing', 'Recurring payments', 'Invoicing', 'Refunds'],
      },
    }],

    // Dashboard
    ['dashboard', {
      keywords: [/dashboard|analytics|analytics|statistics|stats|report|metrics|insights/],
      module: {
        description: 'Admin dashboard and analytics',
        priority: 'medium',
        estimatedComplexity: 'complex',
        suggestedTechnologies: ['Charts.js', 'D3.js', 'Grafana', 'Tableau'],
        features: ['Sales charts', 'User analytics', 'Reports', 'KPI tracking'],
      },
    }],

    // Notifications
    ['notifications', {
      keywords: [/notification|email|sms|push.*notification|alert|message/],
      module: {
        description: 'Notification system',
        priority: 'medium',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['SendGrid', 'Twilio', 'Firebase', 'WebSockets'],
        features: ['Email notifications', 'SMS alerts', 'Push notifications', 'In-app messages'],
      },
    }],

    // Search
    ['search', {
      keywords: [/search|filter|query|find.*item/, /advanced.*search/, /full.*text.*search/],
      module: {
        description: 'Advanced search and filtering',
        priority: 'medium',
        estimatedComplexity: 'complex',
        suggestedTechnologies: ['Elasticsearch', 'Algolia', 'Solr'],
        features: ['Full-text search', 'Filters', 'Facets', 'Auto-complete'],
      },
    }],

    // Reviews & Ratings
    ['reviews', {
      keywords: [/review|rating|comment|feedback|star.*rating/, /user.*review/],
      module: {
        description: 'Reviews and ratings system',
        priority: 'medium',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['MongoDB', 'Redis', 'Moderation API'],
        features: ['Rating system', 'Reviews', 'Comments', 'Moderation'],
      },
    }],

    // Recommendations
    ['recommendations', {
      keywords: [/recommend|suggestion|personali[sz]|similar.*item/, /machine.*learning/],
      module: {
        description: 'Product recommendations engine',
        priority: 'low',
        estimatedComplexity: 'complex',
        suggestedTechnologies: ['ML.NET', 'TensorFlow', 'Recommendation API'],
        features: ['Collaborative filtering', 'Content-based recommendations'],
      },
    }],

    // Admin Panel
    ['admin', {
      keywords: [/admin|manage.*content|moderator|admin.*panel/, /content.*management/],
      module: {
        description: 'Admin panel and content management',
        priority: 'medium',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['React Admin', 'Vue Admin', 'Django Admin'],
        features: ['User management', 'Content moderation', 'System settings'],
      },
    }],

    // Blog/Content
    ['blog', {
      keywords: [/blog|article|post|content|news|cms|knowledge.*base/],
      module: {
        description: 'Blog and content management',
        priority: 'medium',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['Markdown', 'CMS', 'SEO'],
        features: ['Post creation', 'Categories', 'Tags', 'Comments', 'SEO'],
      },
    }],

    // Social Features
    ['social', {
      keywords: [/social|follow|like|share|friend|network|community/],
      module: {
        description: 'Social features and community',
        priority: 'low',
        estimatedComplexity: 'complex',
        suggestedTechnologies: ['WebSockets', 'Redis', 'GraphQL'],
        features: ['Follow system', 'Likes', 'Comments', 'Messaging'],
      },
    }],

    // Real-time Features
    ['realtime', {
      keywords: [/real.*time|live|websocket|socket|chat|instant/, /notification.*real.*time/],
      module: {
        description: 'Real-time features',
        priority: 'medium',
        estimatedComplexity: 'complex',
        suggestedTechnologies: ['WebSocket', 'Socket.io', 'Firebase Realtime'],
        features: ['Live updates', 'Chat', 'Notifications', 'Collaboration'],
      },
    }],

    // API
    ['api', {
      keywords: [/api|rest|graphql|webhook|third.*party.*integr/],
      module: {
        description: 'Public API and integrations',
        priority: 'low',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['REST', 'GraphQL', 'OpenAPI'],
        features: ['API documentation', 'Rate limiting', 'Authentication'],
      },
    }],

    // Mobile
    ['mobile', {
      keywords: [/mobile|app|ios|android|react.*native|flutter/],
      module: {
        description: 'Mobile application',
        priority: 'medium',
        estimatedComplexity: 'complex',
        suggestedTechnologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
        features: ['Mobile UI', 'Push notifications', 'Offline support'],
      },
    }],

    // Analytics
    ['analytics', {
      keywords: [/analytic|tracking|google.*analytics|mixpanel|segment/, /user.*behavior/],
      module: {
        description: 'Analytics and tracking',
        priority: 'low',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['Google Analytics', 'Mixpanel', 'Segment'],
        features: ['Event tracking', 'User behavior', 'Reports'],
      },
    }],

    // Multi-language
    ['i18n', {
      keywords: [/multilingual|multi.*language|internationali[sz]e?|translate|i18n/, /language.*support/],
      module: {
        description: 'Multi-language and localization',
        priority: 'low',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['i18next', 'Transifex', 'Crowdin'],
        features: ['Multi-language support', 'Currency conversion', 'Regional settings'],
      },
    }],

    // SEO
    ['seo', {
      keywords: [/seo|search.*engine.*optim|sitemap|robots\.txt/, /meta.*tag/],
      module: {
        description: 'SEO optimization',
        priority: 'low',
        estimatedComplexity: 'simple',
        suggestedTechnologies: ['Next.js', 'Gatsby', 'SEO tools'],
        features: ['Meta tags', 'Sitemap', 'Open Graph', 'Schema markup'],
      },
    }],
  ]);

  /**
   * Analyze user prompt and detect modules
   */
  analyzePrompt(prompt: string): AnalysisResult {
    const lowerPrompt = prompt.toLowerCase();

    // Detect app name and type
    const appName = this.extractAppName(prompt);
    const appType = this.detectAppType(lowerPrompt);
    const appDescription = this.generateDescription(appType, prompt);

    // Detect modules
    const detectedModules = this.detectModules(lowerPrompt);

    // Sort by priority
    const sortedModules = this.sortModules(detectedModules);

    // Calculate scope
    const scope = this.calculateScope(sortedModules);

    // Get key technologies
    const technologies = this.extractTechnologies(sortedModules);

    // Calculate confidence
    const confidence = this.calculateConfidence(detectedModules, prompt);

    return {
      appName,
      appType,
      appDescription,
      modules: sortedModules,
      estimatedScope: scope,
      estimatedDuration: this.estimateDuration(scope),
      keyTechnologies: [...new Set(technologies)],
      confidence,
    };
  }

  private extractAppName(prompt: string): string {
    // Try to extract app name from common patterns
    const patterns = [
      /create\s+(?:an?\s+)?(?:app\s+)?(?:called\s+)?["']?([^"'\n.]+)["']?/i,
      /(?:build|make)\s+(?:an?\s+)?(?:app\s+)?(?:called\s+)?["']?([^"'\n.]+)["']?/i,
      /^([^.?]+?)(?:\s+app|\s+application|:)?/i,
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/^(a|an|the)\s+/i, '').slice(0, 50);
      }
    }

    return 'Custom Application';
  }

  private detectAppType(prompt: string): string {
    const types = [
      { keywords: /ecommerce|e-commerce|shop|store|marketplace/, type: 'E-Commerce Platform' },
      { keywords: /social|network|community/, type: 'Social Network' },
      { keywords: /saas|software.*service/, type: 'SaaS Platform' },
      { keywords: /cms|blog|content/, type: 'Content Management System' },
      { keywords: /lms|learning/, type: 'Learning Management System' },
      { keywords: /crm|customer.*relation/, type: 'CRM System' },
      { keywords: /erp|enterprise/, type: 'Enterprise Resource Planning' },
      { keywords: /project.*manag/, type: 'Project Management Tool' },
      { keywords: /analytics|dashboard|report/, type: 'Analytics Platform' },
      { keywords: /booking|reservation/, type: 'Booking Platform' },
      { keywords: /forum|discussion/, type: 'Discussion Forum' },
      { keywords: /video|streaming|media/, type: 'Media Streaming Platform' },
      { keywords: /fitness|health|wellness/, type: 'Health & Wellness App' },
      { keywords: /real.*estate|property/, type: 'Real Estate Platform' },
      { keywords: /dating|match|social/, type: 'Dating App' },
    ];

    for (const type of types) {
      if (type.keywords.test(prompt)) {
        return type.type;
      }
    }

    return 'Web Application';
  }

  private generateDescription(appType: string, prompt: string): string {
    const descriptions: Record<string, string> = {
      'E-Commerce Platform': 'A comprehensive online marketplace with product listings, shopping cart, checkout, and order management.',
      'Social Network': 'A social platform enabling users to connect, share content, and interact with their network.',
      'SaaS Platform': 'A cloud-based software service providing specialized business functionality.',
      'Content Management System': 'A platform for creating, managing, and publishing digital content.',
      'Learning Management System': 'An educational platform for course delivery and student management.',
      'CRM System': 'A customer relationship management system for managing client interactions.',
      'Enterprise Resource Planning': 'An integrated business management system for enterprise operations.',
      'Project Management Tool': 'A collaborative platform for planning and tracking projects.',
      'Analytics Platform': 'A data analytics and business intelligence platform.',
      'Booking Platform': 'A system for reservations and appointment scheduling.',
      'Discussion Forum': 'A community platform for discussions and knowledge sharing.',
      'Media Streaming Platform': 'A video/media streaming service with content delivery.',
      'Health & Wellness App': 'An application focused on health tracking and wellness features.',
      'Real Estate Platform': 'A marketplace for real estate listings and property management.',
      'Dating App': 'A platform for connecting people based on shared interests.',
      'Web Application': 'A web-based application with custom features.',
    };

    return descriptions[appType] || `A ${appType.toLowerCase()} application: ${prompt.slice(0, 100)}...`;
  }

  private detectModules(prompt: string): Module[] {
    const detectedModules: Module[] = [];
    const detectedNames = new Set<string>();

    for (const [moduleName, pattern] of this.modulePatterns) {
      const keywords = Array.isArray(pattern.keywords) ? pattern.keywords : [pattern.keywords];

      const isMatched = keywords.some(keyword => {
        if (keyword instanceof RegExp) {
          return keyword.test(prompt);
        }
        return false;
      });

      if (isMatched && !detectedNames.has(moduleName)) {
        detectedModules.push({
          name: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
          ...pattern.module,
        });
        detectedNames.add(moduleName);
      }
    }

    // Always add Authentication for any app
    if (!detectedNames.has('auth')) {
      detectedModules.push({
        name: 'Authentication',
        description: 'User authentication and authorization system',
        priority: 'high',
        estimatedComplexity: 'moderate',
        suggestedTechnologies: ['JWT', 'bcrypt', 'OAuth2'],
        features: ['Login', 'Register', 'Role-based access'],
      });
    }

    return detectedModules;
  }

  private sortModules(modules: Module[]): Module[] {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const complexityOrder = { simple: 0, moderate: 1, complex: 2 };

    return [...modules].sort((a, b) => {
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      return complexityOrder[a.estimatedComplexity] - complexityOrder[b.estimatedComplexity];
    });
  }

  private calculateScope(modules: Module[]): 'small' | 'medium' | 'large' {
    const moduleCount = modules.length;
    const complexityScore = modules.reduce((sum, m) => {
      const complexityValue = {
        simple: 1,
        moderate: 2,
        complex: 3,
      };
      return sum + complexityValue[m.estimatedComplexity];
    }, 0);

    if (moduleCount <= 3 && complexityScore <= 5) return 'small';
    if (moduleCount <= 8 && complexityScore <= 15) return 'medium';
    return 'large';
  }

  private extractTechnologies(modules: Module[]): string[] {
    const technologies: string[] = [];

    modules.forEach(module => {
      if (module.suggestedTechnologies) {
        technologies.push(...module.suggestedTechnologies);
      }
    });

    return [...new Set(technologies)];
  }

  private calculateConfidence(modules: Module[], prompt: string): number {
    // Base confidence on number of matches and prompt length
    const baseConfidence = Math.min(modules.length * 0.15, 0.7);
    const lengthBonus = Math.min(prompt.length / 100, 0.2);
    const confidence = Math.min(baseConfidence + lengthBonus, 0.95);

    return Math.round(confidence * 100) / 100;
  }

  private estimateDuration(scope: 'small' | 'medium' | 'large'): string {
    const durations = {
      small: '2-4 weeks',
      medium: '4-12 weeks',
      large: '12+ weeks',
    };

    return durations[scope];
  }
}

export default new PromptAnalyzer();
