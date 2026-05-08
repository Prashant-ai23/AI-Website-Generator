/**
 * MCP SDK Stub/Mock for Development
 * This provides the types and interfaces needed for MCP server development
 * In production, this would be replaced with the actual @modelcontextprotocol/sdk
 */

// Types
export interface ServerOptions {
  name: string;
  version: string;
}

export interface RequestHandlerOptions {
  type: string;
}

export interface ResourceDefinition {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface ResourceContent {
  uri: string;
  mimeType: string;
  text: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
}

export type Tool = ToolDefinition;

export interface ToolInput {
  name: string;
  arguments: Record<string, any>;
}

export interface TextContent {
  type: 'text';
  text: string;
}

export interface ToolResult {
  content: TextContent[];
  isError?: boolean;
}

// Schemas
export const ListResourcesRequestSchema = { type: 'ListResourcesRequest' };
export const ReadResourceRequestSchema = { type: 'ReadResourceRequest' };
export const ListToolsRequestSchema = { type: 'ListToolsRequest' };
export const CallToolRequestSchema = { type: 'CallToolRequest' };

// Server class
export class Server {
  name: string;
  version: string;
  private handlers: Map<any, Function> = new Map();

  constructor(options: ServerOptions) {
    this.name = options.name;
    this.version = options.version;
  }

  setRequestHandler(schema: any, handler: Function): void {
    this.handlers.set(schema.type, handler);
  }

  async connect(transport: any): Promise<void> {
    console.log(`Server ${this.name} v${this.version} connected`);
  }

  getHandler(schema: any): Function | undefined {
    return this.handlers.get(schema.type);
  }
}

// Transport
export class StdioServerTransport {
  async connect(): Promise<void> {
    console.log('Stdio transport initialized');
  }
}

export default {
  Server,
  StdioServerTransport,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
};
