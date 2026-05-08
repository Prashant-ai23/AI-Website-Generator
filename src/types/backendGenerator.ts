export type DBType = 'mongodb' | 'postgresql';
export type ValidationLibrary = 'joi' | 'zod' | 'class-validator';

export interface APIField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'enum' | 'reference';
  required?: boolean;
  unique?: boolean;
  indexed?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: string[];
  reference?: string;
  description?: string;
  default?: any;
}

export interface APIResourceConfig {
  name: string;
  pluralName: string;
  fields: APIField[];
  timestamps?: boolean;
  softDelete?: boolean;
  validation?: 'joi' | 'zod' | 'class-validator';
  database?: 'mongodb' | 'postgresql';
  description?: string;
}

export interface APIGenerationOptions {
  includePagination?: boolean;
  includeSearch?: boolean;
  includeFiltering?: boolean;
  includeValidation?: boolean;
  includeSorting?: boolean;
  routes?: Array<'create' | 'read' | 'update' | 'delete' | 'list'>;
}

export interface GeneratedAPICode {
  model?: string;
  service?: string;
  controller?: string;
  routes?: string;
  validation?: string;
  language: 'typescript' | 'javascript';
  type: 'model' | 'service' | 'controller' | 'routes' | 'validation' | 'complete';
  framework: string;
  features?: string[];
}
