import logger from '../utils/logger.js';

interface DocSection {
  title: string;
  content: string;
  subsections?: DocSection[];
  codeExamples?: string[];
}

interface DocumentationOptions {
  projectName: string;
  sections: DocSection[];
  includeTableOfContents?: boolean;
  includeInstallation?: boolean;
  includeUsage?: boolean;
  includeLicense?: boolean;
}

/**
 * Generate project documentation in Markdown format
 */
export async function generateDocumentation(options: DocumentationOptions): Promise<string> {
  logger.info('Generating documentation', { projectName: options.projectName });

  const {
    projectName,
    sections,
    includeTableOfContents = true,
    includeInstallation = true,
    includeUsage = true,
    includeLicense = true,
  } = options;

  let doc = `# ${projectName}\n\n`;

  // Add description
  doc += `${projectName} is a modern web application project.\n\n`;

  // Table of Contents
  if (includeTableOfContents) {
    doc += buildTableOfContents(sections);
  }

  // Installation section
  if (includeInstallation) {
    doc += buildInstallationSection();
  }

  // Usage section
  if (includeUsage) {
    doc += buildUsageSection();
  }

  // Custom sections
  doc += buildSections(sections);

  // API Documentation
  doc += buildAPIDocumentation();

  // Contributing
  doc += buildContributingSection();

  // License
  if (includeLicense) {
    doc += buildLicenseSection();
  }

  logger.info('Documentation generated successfully', {
    projectName: options.projectName,
    sections: sections.length,
    lines: doc.split('\n').length,
  });

  return doc;
}

function buildTableOfContents(sections: DocSection[]): string {
  let toc = `## Table of Contents\n\n`;

  toc += `- [Installation](#installation)\n`;
  toc += `- [Usage](#usage)\n`;

  for (const section of sections) {
    const sectionLink = section.title.toLowerCase().replace(/\s+/g, '-');
    toc += `- [${section.title}](#${sectionLink})\n`;
  }

  toc += `- [API Documentation](#api-documentation)\n`;
  toc += `- [Contributing](#contributing)\n`;
  toc += `- [License](#license)\n\n`;

  return toc;
}

function buildInstallationSection(): string {
  let section = `## Installation\n\n`;
  section += `\`\`\`bash\n`;
  section += `# Clone the repository\n`;
  section += `git clone https://github.com/yourusername/project.git\n\n`;
  section += `# Navigate to project directory\n`;
  section += `cd project\n\n`;
  section += `# Install dependencies\n`;
  section += `npm install\n`;
  section += `\`\`\`\n\n`;
  return section;
}

function buildUsageSection(): string {
  let section = `## Usage\n\n`;
  section += `\`\`\`bash\n`;
  section += `# Start development server\n`;
  section += `npm run dev\n\n`;
  section += `# Build for production\n`;
  section += `npm run build\n\n`;
  section += `# Run tests\n`;
  section += `npm test\n`;
  section += `\`\`\`\n\n`;
  return section;
}

function buildSections(sections: DocSection[]): string {
  let content = '';

  for (const section of sections) {
    content += `## ${section.title}\n\n`;
    content += `${section.content}\n\n`;

    if (section.codeExamples && section.codeExamples.length > 0) {
      for (const example of section.codeExamples) {
        content += `\`\`\`\n${example}\n\`\`\`\n\n`;
      }
    }

    if (section.subsections) {
      for (const subsection of section.subsections) {
        content += buildSubsection(subsection);
      }
    }
  }

  return content;
}

function buildSubsection(section: DocSection, level: number = 3): string {
  let content = `${'#'.repeat(level)} ${section.title}\n\n`;
  content += `${section.content}\n\n`;

  if (section.codeExamples) {
    for (const example of section.codeExamples) {
      content += `\`\`\`\n${example}\n\`\`\`\n\n`;
    }
  }

  return content;
}

function buildAPIDocumentation(): string {
  let api = `## API Documentation\n\n`;
  api += `### Overview\n\n`;
  api += `This section documents the main API endpoints and methods.\n\n`;
  api += `### Base URL\n\n`;
  api += `\`\`\`\n`;
  api += `http://localhost:3000/api/v1\n`;
  api += `\`\`\`\n\n`;
  api += `### Authentication\n\n`;
  api += `All protected endpoints require a JWT token in the Authorization header:\n\n`;
  api += `\`\`\`\n`;
  api += `Authorization: Bearer <token>\n`;
  api += `\`\`\`\n\n`;
  api += `### Error Handling\n\n`;
  api += `| Code | Description |\n`;
  api += `|------|-------------|\n`;
  api += `| 400 | Bad Request |\n`;
  api += `| 401 | Unauthorized |\n`;
  api += `| 403 | Forbidden |\n`;
  api += `| 404 | Not Found |\n`;
  api += `| 500 | Internal Server Error |\n\n`;
  return api;
}

function buildContributingSection(): string {
  let section = `## Contributing\n\n`;
  section += `1. Fork the repository\n`;
  section += `2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)\n`;
  section += `3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)\n`;
  section += `4. Push to the branch (\`git push origin feature/AmazingFeature\`)\n`;
  section += `5. Open a Pull Request\n\n`;
  return section;
}

function buildLicenseSection(): string {
  let section = `## License\n\n`;
  section += `This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.\n\n`;
  return section;
}

export default generateDocumentation;
