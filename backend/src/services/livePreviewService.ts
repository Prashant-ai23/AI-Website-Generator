/**
 * Live Preview Service
 * Compiles and generates HTML preview for React/Vue/HTML projects
 */

import { PreviewFile, PreviewProject, PreviewError } from '../types/preview.js';

class LivePreviewService {
  /**
   * Generate HTML preview from project files
   */
  static generatePreview(project: PreviewProject): { html: string; errors: PreviewError[]; warnings: string[] } {
    const errors: PreviewError[] = [];
    const warnings: string[] = [];

    try {
      // Find entry point file
      const entryFile = project.files.find((f) => f.filename === project.entryPoint);
      if (!entryFile) {
        errors.push({
          type: 'compilation',
          message: `Entry point file not found: ${project.entryPoint}`,
          file: project.entryPoint,
        });
        return { html: this.generateErrorHtml(errors), errors, warnings };
      }

      // Detect project type from files
      const isReact = project.files.some((f: PreviewFile) => f.content.includes('React') || f.content.includes('jsx'));
      const isVue = project.files.some((f: PreviewFile) => f.content.includes('Vue') || f.content.includes('.vue'));
      const isHtml = project.files.some((f: PreviewFile) => f.filename.endsWith('.html'));

      let html = '';

      if (isReact) {
        html = this.generateReactPreview(project, errors, warnings);
      } else if (isVue) {
        html = this.generateVuePreview(project, errors, warnings);
      } else if (isHtml) {
        html = this.generateHtmlPreview(project, errors, warnings);
      } else {
        html = this.generateGenericPreview(project, errors, warnings);
      }

      if (errors.length === 0) {
        return { html, errors: [], warnings };
      }

      return { html: this.generateErrorHtml(errors), errors, warnings };
    } catch (error: any) {
      errors.push({
        type: 'runtime',
        message: error.message || 'Unknown error occurred',
        file: project.entryPoint,
      });

      return { html: this.generateErrorHtml(errors), errors, warnings };
    }
  }

  /**
   * Generate React preview HTML
   */
  private static generateReactPreview(
    project: PreviewProject,
    errors: PreviewError[],
    warnings: string[]
  ): string {
    const cssFiles = project.files.filter((f: PreviewFile) => f.filename.endsWith('.css'));
    const styles = cssFiles.map((f: PreviewFile) => `<style>${f.content}</style>`).join('\n');

    const script = `
      <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
      
      ${styles}
      
      <div id="root"></div>
      
      <script type="text/babel">
        try {
          ${this.transpileCode(project)}
        } catch (err) {
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = 'padding: 20px; background: #fee; color: #c00; font-family: monospace; white-space: pre-wrap;';
          errorDiv.textContent = 'Error: ' + (err.message || err);
          document.getElementById('root').appendChild(errorDiv);
        }
      <\/script>
    `;

    return this.wrapHtml(script, cssFiles);
  }

  /**
   * Generate Vue preview HTML
   */
  private static generateVuePreview(
    project: PreviewProject,
    errors: PreviewError[],
    warnings: string[]
  ): string {
    const script = `
      <script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>
      
      <div id="app"></div>
      
      <script type="module">
        const { createApp } = Vue;
        
        try {
          ${this.transpileCode(project)}
        } catch (err) {
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = 'padding: 20px; background: #fee; color: #c00; font-family: monospace;';
          errorDiv.textContent = 'Error: ' + err.message;
          document.getElementById('app').appendChild(errorDiv);
        }
      <\/script>
    `;

    return this.wrapHtml(script, []);
  }

  /**
   * Generate HTML preview
   */
  private static generateHtmlPreview(
    project: PreviewProject,
    errors: PreviewError[],
    warnings: string[]
  ): string {
    const htmlFile = project.files.find((f) => f.filename.endsWith('.html'));
    if (!htmlFile) {
      errors.push({
        type: 'compilation',
        message: 'No HTML file found',
        file: project.entryPoint,
      });
      return this.generateErrorHtml(errors);
    }

    const cssFiles = project.files.filter((f: PreviewFile) => f.filename.endsWith('.css'));
    const jsFiles = project.files.filter((f: PreviewFile) => f.filename.endsWith('.js'));

    let html = htmlFile.content;

    // Inject CSS
    const styles = cssFiles.map((f: PreviewFile) => `<style>${f.content}</style>`).join('\n');
    html = html.replace('</head>', `${styles}</head>`);

    // Inject JS
    const scripts = jsFiles.map((f: PreviewFile) => `<script>${f.content}<\/script>`).join('\n');
    html = html.replace('</body>', `${scripts}</body>`);

    return html;
  }

  /**
   * Generate generic preview
   */
  private static generateGenericPreview(
    project: PreviewProject,
    errors: PreviewError[],
    warnings: string[]
  ): string {
    warnings.push('Project type not recognized, generating basic preview');

    const cssFiles = project.files.filter((f: PreviewFile) => f.filename.endsWith('.css'));
    const styles = cssFiles.map((f: PreviewFile) => `<style>${f.content}</style>`).join('\n');

    const filesList = project.files
      .map(
        (f: PreviewFile) => `
        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd;">
          <h3>${f.filename}</h3>
          <pre style="background: #f5f5f5; padding: 10px; overflow-x: auto;">${this.escapeHtml(f.content.substring(0, 500))}</pre>
        </div>
      `
      )
      .join('\n');

    return this.wrapHtml(
      `
      ${styles}
      <h2>${project.projectName}</h2>
      ${filesList}
    `,
      cssFiles
    );
  }

  /**
   * Transpile code for preview
   */
  private static transpileCode(project: PreviewProject): string {
    const entryFile = project.files.find((f) => f.filename === project.entryPoint);
    if (!entryFile) return '';

    // Create exports for all components
    let code = '';

    // Include all component files
    project.files
      .filter((f: PreviewFile) => f.type === 'component')
      .forEach((f: PreviewFile) => {
        code += `${f.content}\n`;
      });

    // Include entry point
    code += entryFile.content;

    // Ensure App is rendered
    if (!code.includes('ReactDOM.render') && !code.includes('createRoot')) {
      code += `
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      `;
    }

    return code;
  }

  /**
   * Generate error HTML
   */
  private static generateErrorHtml(errors: any[]): string {
    const errorHtml = errors
      .map(
        (e: any) => `
      <div style="margin-bottom: 10px;">
        <strong>${e.type.toUpperCase()}</strong> in ${e.file}${e.line ? ` (line ${e.line})` : ''}<br/>
        ${this.escapeHtml(e.message)}
      </div>
    `
      )
      .join('\n');

    return this.wrapHtml(
      `
      <div style="padding: 20px; background: #fee; border-left: 4px solid #c00;">
        <h2 style="color: #c00; margin-top: 0;">Compilation Errors</h2>
        ${errorHtml}
      </div>
    `,
      []
    );
  }

  /**
   * Wrap content in HTML boilerplate
   */
  private static wrapHtml(content: string, cssFiles: PreviewFile[]): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #fff;
    }
    
    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
    }
    
    #root, #app {
      min-height: 100vh;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
    `.trim();
  }

  /**
   * Escape HTML special characters
   */
  private static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Validate files
   */
  static validateFiles(files: PreviewFile[]): PreviewError[] {
    const errors: PreviewError[] = [];

    files.forEach((file) => {
      // Check for syntax errors
      if (file.language === 'javascript' || file.language === 'typescript') {
        try {
          new Function(file.content);
        } catch (e: any) {
          errors.push({
            type: 'syntax',
            message: e.message,
            file: file.filename,
          });
        }
      }

      // Check file size
      if (file.content.length > 1000000) {
        errors.push({
          type: 'compilation',
          message: 'File is too large (> 1MB)',
          file: file.filename,
        });
      }
    });

    return errors;
  }
}

export default LivePreviewService;
