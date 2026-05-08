import logger from '../utils/logger.js';

interface SchemaField {
  name: string;
  type: 'String' | 'Number' | 'Boolean' | 'Date' | 'ObjectId' | 'Array' | 'Mixed';
  required?: boolean;
  unique?: boolean;
  index?: boolean;
  default?: any;
  ref?: string;
  description?: string;
}

interface MongoSchemaOptions {
  modelName: string;
  fields: SchemaField[];
  withTimestamps?: boolean;
  withVirtuals?: boolean;
  withMethods?: boolean;
  withIndexes?: boolean;
}

/**
 * Generate a MongoDB/Mongoose schema
 */
export async function generateMongoSchema(options: MongoSchemaOptions): Promise<string> {
  logger.info('Generating MongoDB schema', { modelName: options.modelName });

  const {
    modelName,
    fields,
    withTimestamps = true,
    withVirtuals = false,
    withMethods = true,
    withIndexes = true,
  } = options;

  const schemaName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  // Build imports
  let importSection = "import { Schema, model } from 'mongoose';\n\n";

  // Build schema definition
  let schemaCode = `// Schema definition\n`;
  schemaCode += `const ${modelName}Schema = new Schema(\n`;
  schemaCode += `  {\n`;

  // Add fields
  for (const field of fields) {
    schemaCode += buildSchemaField(field);
  }

  schemaCode += `  },\n`;
  schemaCode += `  {\n`;
  if (withTimestamps) schemaCode += `    timestamps: true,\n`;
  schemaCode += `  }\n`;
  schemaCode += `);\n\n`;

  // Add indexes
  if (withIndexes) {
    schemaCode += buildIndexes(fields);
  }

  // Add virtuals
  if (withVirtuals) {
    schemaCode += buildVirtuals(modelName);
  }

  // Add methods
  if (withMethods) {
    schemaCode += buildMethods(modelName);
  }

  // Add pre/post hooks
  schemaCode += buildHooks(modelName);

  // Add model creation
  schemaCode += `\n// Create and export model\n`;
  schemaCode += `const ${schemaName} = model('${schemaName}', ${modelName}Schema);\n`;
  schemaCode += `export default ${schemaName};`;

  const finalCode = importSection + schemaCode;

  logger.info('MongoDB schema generated successfully', {
    modelName: options.modelName,
    fieldCount: fields.length,
    lines: finalCode.split('\n').length,
  });

  return finalCode;
}

function buildSchemaField(field: SchemaField): string {
  let fieldDef = `    ${field.name}: {\n`;
  fieldDef += `      type: ${field.type},\n`;

  if (field.required) fieldDef += `      required: true,\n`;
  if (field.unique) fieldDef += `      unique: true,\n`;
  if (field.index) fieldDef += `      index: true,\n`;
  if (field.default !== undefined) {
    if (typeof field.default === 'string') {
      fieldDef += `      default: '${field.default}',\n`;
    } else {
      fieldDef += `      default: ${field.default},\n`;
    }
  }
  if (field.ref) fieldDef += `      ref: '${field.ref}',\n`;
  if (field.description) fieldDef += `      description: '${field.description}',\n`;

  fieldDef += `    },\n`;
  return fieldDef;
}

function buildIndexes(fields: SchemaField[]): string {
  let indexes = `// Indexes\n`;

  // Add single field indexes
  for (const field of fields) {
    if (field.index) {
      indexes += `${field.name}Schema.index({ ${field.name}: 1 });\n`;
    }
  }

  // Add compound index example
  const refFields = fields.filter(f => f.ref);
  if (refFields.length > 0) {
    indexes += `// Compound index example\n`;
    indexes += `// ${refFields[0].name}Schema.index({ ${refFields[0].name}: 1, createdAt: -1 });\n`;
  }

  indexes += `\n`;
  return indexes;
}

function buildVirtuals(modelName: string): string {
  let virtuals = `// Virtual fields\n`;
  virtuals += `${modelName}Schema.virtual('fullInfo').get(function() {\n`;
  virtuals += `  return 'Virtual field implementation';\n`;
  virtuals += `});\n\n`;
  return virtuals;
}

function buildMethods(modelName: string): string {
  let methods = `// Schema methods\n`;
  methods += `${modelName}Schema.methods.toJSON = function() {\n`;
  methods += `  const obj = this.toObject();\n`;
  methods += `  // Custom serialization logic\n`;
  methods += `  return obj;\n`;
  methods += `};\n\n`;
  return methods;
}

function buildHooks(modelName: string): string {
  let hooks = `// Pre/post hooks\n`;
  hooks += `${modelName}Schema.pre('save', async function(next) {\n`;
  hooks += `  // Pre-save logic (e.g., password hashing, validation)\n`;
  hooks += `  next();\n`;
  hooks += `});\n\n`;
  hooks += `${modelName}Schema.post('save', function(doc) {\n`;
  hooks += `  // Post-save logic\n`;
  hooks += `});\n\n`;
  return hooks;
}

export default generateMongoSchema;
