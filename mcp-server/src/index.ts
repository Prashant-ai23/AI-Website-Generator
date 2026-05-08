import { Server } from './sdk/index.js';
import type {
  Tool,
  ToolInput,
  ToolResult,
  ResourceDefinition,
} from './sdk/index.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from './sdk/index.js';
import { StdioServerTransport } from './sdk/index.js';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import {
  toolGenerateReactPage,
  toolGenerateExpressAPI,
  toolGenerateMongoSchema,
  toolGenerateSidebarMenu,
  toolGenerateDocumentation,
} from './tools/codeGenerationTools.js';

dotenv.config();

const server = new Server({
  name: 'ai-website-generator-mcp',
  version: '1.0.0',
});

logger.info('MCP Server initializing...');

// Register resource handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  logger.info('ListResources request received');
  
  return {
    resources: [
      {
        uri: 'website://templates',
        name: 'Website Templates',
        description: 'Available website templates',
        mimeType: 'application/json',
      },
      {
        uri: 'website://components',
        name: 'UI Components',
        description: 'Available UI components',
        mimeType: 'application/json',
      },
      {
        uri: 'website://generators',
        name: 'Code Generators',
        description: 'Available code generators',
        mimeType: 'application/json',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request: any) => {
  const uri = request.params.uri;
  logger.info('ReadResource request', { uri });

  if (uri === 'website://templates') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            templates: [
              { id: 'landing', name: 'Landing Page' },
              { id: 'blog', name: 'Blog' },
              { id: 'portfolio', name: 'Portfolio' },
              { id: 'ecommerce', name: 'E-commerce' },
            ],
          }),
        },
      ],
    };
  }

  if (uri === 'website://components') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            components: [
              { id: 'hero', name: 'Hero Section' },
              { id: 'features', name: 'Features' },
              { id: 'testimonials', name: 'Testimonials' },
              { id: 'cta', name: 'Call to Action' },
            ],
          }),
        },
      ],
    };
  }

  if (uri === 'website://generators') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            generators: [
              { id: 'react-page', name: 'React Page Generator' },
              { id: 'express-api', name: 'Express API Generator' },
              { id: 'mongo-schema', name: 'MongoDB Schema Generator' },
              { id: 'sidebar', name: 'Sidebar Menu Generator' },
              { id: 'documentation', name: 'Documentation Generator' },
            ],
          }),
        },
      ],
    };
  }

  logger.error('Unknown resource requested', { uri });
  throw new Error(`Unknown resource: ${uri}`);
});

// Register tool handlers
const tools: Tool[] = [
  {
    name: 'generateReactPage',
    description: 'Generate a React component/page with TypeScript support, hooks, and CSS styling options',
    inputSchema: {
      type: 'object',
      properties: {
        pageName: {
          type: 'string',
          description: 'Name of the page/component to generate (e.g., "Dashboard", "Profile")',
        },
        componentType: {
          type: 'string',
          enum: ['functional', 'class'],
          description: 'Type of component: functional or class component',
        },
        useHooks: {
          type: 'boolean',
          description: 'Whether to use React hooks (useState, useEffect, etc.)',
        },
        withTypeScript: {
          type: 'boolean',
          description: 'Whether to generate TypeScript code',
        },
        withStyles: {
          type: 'boolean',
          description: 'Whether to include CSS file import',
        },
        imports: {
          type: 'array',
          items: { type: 'string' },
          description: 'Additional imports to include',
        },
      },
      required: ['pageName'],
    },
  },
  {
    name: 'generateExpressAPI',
    description: 'Generate Express.js API routes with controller methods, validation, and error handling',
    inputSchema: {
      type: 'object',
      properties: {
        routeName: {
          type: 'string',
          description: 'Name of the route/resource (e.g., "users", "products")',
        },
        methods: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          },
          description: 'HTTP methods to generate',
        },
        withValidation: {
          type: 'boolean',
          description: 'Include input validation middleware',
        },
        withErrorHandling: {
          type: 'boolean',
          description: 'Include error handling middleware',
        },
        withAuth: {
          type: 'boolean',
          description: 'Include authentication middleware',
        },
      },
      required: ['routeName'],
    },
  },
  {
    name: 'generateMongoSchema',
    description: 'Generate MongoDB/Mongoose schema with validation, indexes, hooks, and methods',
    inputSchema: {
      type: 'object',
      properties: {
        modelName: {
          type: 'string',
          description: 'Name of the model (e.g., "user", "product")',
        },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: {
                type: 'string',
                enum: ['String', 'Number', 'Boolean', 'Date', 'ObjectId', 'Array', 'Mixed'],
              },
              required: { type: 'boolean' },
              unique: { type: 'boolean' },
              index: { type: 'boolean' },
              default: {},
              ref: { type: 'string' },
              description: { type: 'string' },
            },
            required: ['name', 'type'],
          },
          description: 'Schema fields definition',
        },
        withTimestamps: {
          type: 'boolean',
          description: 'Include createdAt and updatedAt timestamps',
        },
        withVirtuals: {
          type: 'boolean',
          description: 'Include virtual fields example',
        },
        withMethods: {
          type: 'boolean',
          description: 'Include schema methods',
        },
        withIndexes: {
          type: 'boolean',
          description: 'Include database indexes',
        },
      },
      required: ['modelName', 'fields'],
    },
  },
  {
    name: 'generateSidebarMenu',
    description: 'Generate a React sidebar menu component with nested items, icons, and collapse functionality',
    inputSchema: {
      type: 'object',
      properties: {
        menuItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              path: { type: 'string' },
              icon: { type: 'string' },
              children: { type: 'array' },
              badge: { type: ['string', 'number'] },
            },
            required: ['id', 'label'],
          },
          description: 'Menu items structure',
        },
        style: {
          type: 'string',
          enum: ['vertical', 'horizontal'],
          description: 'Menu layout style',
        },
        withCollapse: {
          type: 'boolean',
          description: 'Enable collapsible submenus',
        },
        withIcons: {
          type: 'boolean',
          description: 'Include icons in menu items',
        },
        theme: {
          type: 'string',
          enum: ['light', 'dark'],
          description: 'Menu theme',
        },
        componentName: {
          type: 'string',
          description: 'Name of the component to generate',
        },
      },
      required: ['menuItems'],
    },
  },
  {
    name: 'generateDocumentation',
    description: 'Generate comprehensive project documentation in Markdown format with API docs, usage, and examples',
    inputSchema: {
      type: 'object',
      properties: {
        projectName: {
          type: 'string',
          description: 'Name of the project',
        },
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              content: { type: 'string' },
              subsections: { type: 'array' },
              codeExamples: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: ['title', 'content'],
          },
          description: 'Documentation sections to include',
        },
        includeTableOfContents: {
          type: 'boolean',
          description: 'Include table of contents',
        },
        includeInstallation: {
          type: 'boolean',
          description: 'Include installation instructions',
        },
        includeUsage: {
          type: 'boolean',
          description: 'Include usage examples',
        },
        includeLicense: {
          type: 'boolean',
          description: 'Include license section',
        },
      },
      required: ['projectName'],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.info('ListTools request received');
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;

  logger.info('CallTool request', { toolName: name });

  try {
    let result;

    if (name === 'generateReactPage') {
      result = await toolGenerateReactPage(args as any);
    } else if (name === 'generateExpressAPI') {
      result = await toolGenerateExpressAPI(args as any);
    } else if (name === 'generateMongoSchema') {
      result = await toolGenerateMongoSchema(args as any);
    } else if (name === 'generateSidebarMenu') {
      result = await toolGenerateSidebarMenu(args as any);
    } else if (name === 'generateDocumentation') {
      result = await toolGenerateDocumentation(args as any);
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    logger.info('Tool executed successfully', { toolName: name });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error('Tool execution failed', { toolName: name, error });

    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool "${name}": ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('✅ MCP Server connected and running on stdio');
  } catch (error) {
    logger.error('Failed to start MCP Server', { error });
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Fatal error', { error });
  process.exit(1);
});
