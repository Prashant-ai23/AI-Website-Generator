import logger from '../utils/logger.js';

interface ReactPageOptions {
  pageName: string;
  componentType?: 'functional' | 'class';
  useHooks?: boolean;
  withTypeScript?: boolean;
  withStyles?: boolean;
  imports?: string[];
}

/**
 * Generate a React component/page
 */
export async function generateReactPage(options: ReactPageOptions): Promise<string> {
  logger.info('Generating React page', { pageName: options.pageName });

  const {
    pageName,
    componentType = 'functional',
    useHooks = true,
    withTypeScript = true,
    withStyles = true,
    imports = [],
  } = options;

  const componentClassName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // Build imports
  let importSection = "import React";
  if (useHooks) importSection += ", { useState, useEffect }";
  importSection += " from 'react';\n";

  // Add custom imports
  if (imports.length > 0) {
    importSection += imports.map(imp => `import ${imp}\n`).join('');
  }

  if (withStyles) {
    importSection += `import './${componentClassName}.css';\n`;
  }

  // Build component
  let componentCode = '';

  if (componentType === 'functional') {
    componentCode = buildFunctionalComponent(componentClassName, useHooks, withTypeScript);
  } else {
    componentCode = buildClassComponent(componentClassName);
  }

  // Build exports
  let exportSection = `\nexport default ${componentClassName};`;

  // Combine all parts
  const finalCode = importSection + '\n' + componentCode + exportSection;

  logger.info('React page generated successfully', { pageName: options.pageName, lines: finalCode.split('\n').length });

  return finalCode;
}

function buildFunctionalComponent(name: string, useHooks: boolean, withTypeScript: boolean): string {
  const typePrefix = withTypeScript ? ': React.FC' : '';

  let component = `const ${name}${typePrefix} = () => {\n`;

  if (useHooks) {
    component += `  const [state, setState] = useState<any>(null);\n\n`;
    component += `  useEffect(() => {\n`;
    component += `    // Component initialization\n`;
    component += `  }, []);\n\n`;
  }

  component += `  return (\n`;
  component += `    <div className="${name.toLowerCase()}">\n`;
  component += `      <h1>${name}</h1>\n`;
  component += `      <p>Welcome to ${name} component</p>\n`;
  component += `    </div>\n`;
  component += `  );\n`;
  component += `};`;

  return component;
}

function buildClassComponent(name: string): string {
  let component = `class ${name} extends React.Component {\n`;
  component += `  constructor(props) {\n`;
  component += `    super(props);\n`;
  component += `    this.state = {};\n`;
  component += `  }\n\n`;
  component += `  componentDidMount() {\n`;
  component += `    // Component initialization\n`;
  component += `  }\n\n`;
  component += `  render() {\n`;
  component += `    return (\n`;
  component += `      <div className="${name.toLowerCase()}">\n`;
  component += `        <h1>${name}</h1>\n`;
  component += `        <p>Welcome to ${name} component</p>\n`;
  component += `      </div>\n`;
  component += `    );\n`;
  component += `  }\n`;
  component += `}`;

  return component;
}

export default generateReactPage;
