import logger from '../utils/logger.js';
import generateReactPage from '../generators/reactPageGenerator.js';
import generateExpressAPI from '../generators/expressAPIGenerator.js';
import generateMongoSchema from '../generators/mongoSchemaGenerator.js';
import generateSidebarMenu from '../generators/sidebarMenuGenerator.js';
import generateDocumentation from '../generators/documentationGenerator.js';

/**
 * MCP Tool: Generate React Page
 */
export async function toolGenerateReactPage(args: {
  pageName: string;
  componentType?: 'functional' | 'class';
  useHooks?: boolean;
  withTypeScript?: boolean;
  withStyles?: boolean;
  imports?: string[];
}): Promise<{ success: boolean; code: string; fileName: string; message: string }> {
  try {
    logger.info('Tool called: generateReactPage', { pageName: args.pageName });

    const code = await generateReactPage(args);

    const fileName = `${args.pageName.charAt(0).toUpperCase() + args.pageName.slice(1)}.tsx`;

    return {
      success: true,
      code,
      fileName,
      message: `React ${args.componentType || 'functional'} component "${args.pageName}" generated successfully`,
    };
  } catch (error) {
    logger.error('Error in toolGenerateReactPage', { error });
    throw error;
  }
}

/**
 * MCP Tool: Generate Express API
 */
export async function toolGenerateExpressAPI(args: {
  routeName: string;
  methods?: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')[];
  withValidation?: boolean;
  withErrorHandling?: boolean;
  withAuth?: boolean;
}): Promise<{ success: boolean; code: string; fileName: string; message: string }> {
  try {
    logger.info('Tool called: generateExpressAPI', { routeName: args.routeName });

    const code = await generateExpressAPI(args);

    const fileName = `${args.routeName.toLowerCase()}.routes.ts`;

    return {
      success: true,
      code,
      fileName,
      message: `Express API routes for "${args.routeName}" generated successfully`,
    };
  } catch (error) {
    logger.error('Error in toolGenerateExpressAPI', { error });
    throw error;
  }
}

/**
 * MCP Tool: Generate MongoDB Schema
 */
export async function toolGenerateMongoSchema(args: {
  modelName: string;
  fields: Array<{
    name: string;
    type: 'String' | 'Number' | 'Boolean' | 'Date' | 'ObjectId' | 'Array' | 'Mixed';
    required?: boolean;
    unique?: boolean;
    index?: boolean;
    default?: any;
    ref?: string;
    description?: string;
  }>;
  withTimestamps?: boolean;
  withVirtuals?: boolean;
  withMethods?: boolean;
  withIndexes?: boolean;
}): Promise<{ success: boolean; code: string; fileName: string; message: string }> {
  try {
    logger.info('Tool called: generateMongoSchema', { modelName: args.modelName });

    const code = await generateMongoSchema(args);

    const fileName = `${args.modelName.charAt(0).toUpperCase() + args.modelName.slice(1)}.ts`;

    return {
      success: true,
      code,
      fileName,
      message: `MongoDB schema for "${args.modelName}" model generated successfully`,
    };
  } catch (error) {
    logger.error('Error in toolGenerateMongoSchema', { error });
    throw error;
  }
}

/**
 * MCP Tool: Generate Sidebar Menu
 */
export async function toolGenerateSidebarMenu(args: {
  menuItems: Array<{
    id: string;
    label: string;
    path?: string;
    icon?: string;
    children?: any[];
    badge?: string | number;
  }>;
  style?: 'vertical' | 'horizontal';
  withCollapse?: boolean;
  withIcons?: boolean;
  theme?: 'light' | 'dark';
  componentName?: string;
}): Promise<{ success: boolean; code: string; fileName: string; message: string }> {
  try {
    logger.info('Tool called: generateSidebarMenu', { itemCount: args.menuItems.length });

    const code = await generateSidebarMenu(args);

    const componentName = args.componentName || 'Sidebar';
    const fileName = `${componentName}.tsx`;

    return {
      success: true,
      code,
      fileName,
      message: `Sidebar menu component with ${args.menuItems.length} items generated successfully`,
    };
  } catch (error) {
    logger.error('Error in toolGenerateSidebarMenu', { error });
    throw error;
  }
}

/**
 * MCP Tool: Generate Documentation
 */
export async function toolGenerateDocumentation(args: {
  projectName: string;
  sections: Array<{
    title: string;
    content: string;
    subsections?: any[];
    codeExamples?: string[];
  }>;
  includeTableOfContents?: boolean;
  includeInstallation?: boolean;
  includeUsage?: boolean;
  includeLicense?: boolean;
}): Promise<{ success: boolean; documentation: string; fileName: string; message: string }> {
  try {
    logger.info('Tool called: generateDocumentation', { projectName: args.projectName });

    const documentation = await generateDocumentation(args);

    const fileName = `${args.projectName.toLowerCase().replace(/\s+/g, '-')}-docs.md`;

    return {
      success: true,
      documentation,
      fileName,
      message: `Documentation for "${args.projectName}" generated successfully`,
    };
  } catch (error) {
    logger.error('Error in toolGenerateDocumentation', { error });
    throw error;
  }
}

export default {
  toolGenerateReactPage,
  toolGenerateExpressAPI,
  toolGenerateMongoSchema,
  toolGenerateSidebarMenu,
  toolGenerateDocumentation,
};
