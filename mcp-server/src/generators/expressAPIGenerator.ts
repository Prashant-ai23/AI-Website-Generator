import logger from '../utils/logger.js';

interface ExpressAPIOptions {
  routeName: string;
  methods?: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')[];
  withValidation?: boolean;
  withErrorHandling?: boolean;
  withAuth?: boolean;
}

/**
 * Generate an Express API route/controller
 */
export async function generateExpressAPI(options: ExpressAPIOptions): Promise<string> {
  logger.info('Generating Express API', { routeName: options.routeName });

  const {
    routeName,
    methods = ['GET', 'POST'],
    withValidation = true,
    withErrorHandling = true,
    withAuth = true,
  } = options;

  const routerName = routeName.toLowerCase();
  const controllerName = routeName.charAt(0).toUpperCase() + routeName.slice(1) + 'Controller';

  // Build imports
  let importSection = "import express from 'express';\n";
  if (withAuth) importSection += "import { authenticate } from '../middleware/auth.js';\n";
  if (withValidation) importSection += "import { validate } from '../middleware/validate.js';\n";
  importSection += "import { asyncHandler } from '../utils/asyncHandler.js';\n";

  // Build router
  let routerCode = `\nconst router = express.Router();\n\n`;

  // Build controller object
  routerCode += `// ${controllerName}\n`;
  routerCode += `const controller = {\n`;

  // Add methods
  for (const method of methods) {
    const methodName = getMethodName(method);
    routerCode += buildControllerMethod(methodName, method, withErrorHandling);
  }

  routerCode += `};\n\n`;

  // Build routes
  routerCode += `// Routes\n`;
  for (const method of methods) {
    const methodName = getMethodName(method);
    routerCode += buildRoute(method, routerName, methodName, withAuth);
  }

  routerCode += `\nexport default router;`;

  const finalCode = importSection + routerCode;

  logger.info('Express API generated successfully', {
    routeName: options.routeName,
    methods: methods,
    lines: finalCode.split('\n').length,
  });

  return finalCode;
}

function getMethodName(method: string): string {
  const methodMap: { [key: string]: string } = {
    GET: 'getAll',
    POST: 'create',
    PUT: 'update',
    DELETE: 'delete',
    PATCH: 'patch',
  };
  return methodMap[method] || 'handle';
}

function buildControllerMethod(methodName: string, httpMethod: string, withErrorHandling: boolean): string {
  let method = `  ${methodName}: asyncHandler(async (req, res) => {\n`;

  if (httpMethod === 'GET') {
    method += `    // GET logic\n`;
    method += `    const items = [];\n`;
    method += `    res.json({ success: true, data: items });\n`;
  } else if (httpMethod === 'POST') {
    method += `    // POST logic - Create new resource\n`;
    method += `    const data = req.body;\n`;
    method += `    res.status(201).json({ success: true, data });\n`;
  } else if (httpMethod === 'PUT') {
    method += `    // PUT logic - Update resource\n`;
    method += `    const { id } = req.params;\n`;
    method += `    const data = req.body;\n`;
    method += `    res.json({ success: true, data });\n`;
  } else if (httpMethod === 'DELETE') {
    method += `    // DELETE logic\n`;
    method += `    const { id } = req.params;\n`;
    method += `    res.json({ success: true, message: 'Deleted' });\n`;
  } else if (httpMethod === 'PATCH') {
    method += `    // PATCH logic - Partial update\n`;
    method += `    const { id } = req.params;\n`;
    method += `    const data = req.body;\n`;
    method += `    res.json({ success: true, data });\n`;
  }

  method += `  }),\n`;
  return method;
}

function buildRoute(method: string, routeName: string, methodName: string, withAuth: boolean): string {
  const httpMethod = method.toLowerCase();
  const path = method === 'GET' || method === 'POST' ? '/' : '/:id';
  let auth = withAuth ? ', authenticate' : '';

  return `router.${httpMethod}('${path}'${auth}, controller.${methodName});\n`;
}

export default generateExpressAPI;
