/**
 * React Code Generator
 * Generates React components with support for Tailwind CSS and MUI
 */

export type StylingLibrary = 'tailwind' | 'mui';

export interface ComponentConfig {
  name: string;
  styling: StylingLibrary;
  description?: string;
}

export interface PageConfig extends ComponentConfig {
  title: string;
  layout?: 'default' | 'sidebar' | 'tabs';
  sections?: string[];
}

export interface FormConfig extends ComponentConfig {
  fields: FormField[];
  submitButton?: boolean;
  cancelButton?: boolean;
  layout?: 'vertical' | 'horizontal' | 'grid';
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: string;
}

export interface TableConfig extends ComponentConfig {
  columns: TableColumn[];
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  rowsPerPage?: number;
  actions?: Array<'view' | 'edit' | 'delete'>;
}

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'actions';
  sortable?: boolean;
  width?: string;
}

export interface LayoutConfig extends ComponentConfig {
  type: 'header-footer' | 'sidebar' | 'two-column' | 'three-column';
  headerHeight?: string;
  sidebarWidth?: string;
  hasNavigation?: boolean;
  navigationItems?: NavigationItem[];
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
}

export interface RoutingConfig {
  styling: StylingLibrary;
  routes: RouteDefinition[];
  defaultLayout?: 'header-footer' | 'sidebar';
  protectedRoutes?: string[];
}

export interface RouteDefinition {
  path: string;
  name: string;
  component: string;
  layout?: 'default' | 'sidebar';
  protected?: boolean;
  children?: RouteDefinition[];
}

export class ReactCodeGenerator {
  /**
   * Generate a React Page component
   */
  static generatePage(config: PageConfig): string {
    if (config.styling === 'tailwind') {
      return this.generatePageTailwind(config);
    } else {
      return this.generatePageMUI(config);
    }
  }

  /**
   * Generate a React Form component
   */
  static generateForm(config: FormConfig): string {
    if (config.styling === 'tailwind') {
      return this.generateFormTailwind(config);
    } else {
      return this.generateFormMUI(config);
    }
  }

  /**
   * Generate a React Table component
   */
  static generateTable(config: TableConfig): string {
    if (config.styling === 'tailwind') {
      return this.generateTableTailwind(config);
    } else {
      return this.generateTableMUI(config);
    }
  }

  /**
   * Generate Layout component
   */
  static generateLayout(config: LayoutConfig): string {
    if (config.styling === 'tailwind') {
      return this.generateLayoutTailwind(config);
    } else {
      return this.generateLayoutMUI(config);
    }
  }

  /**
   * Generate React Router configuration
   */
  static generateRouting(config: RoutingConfig): string {
    const imports = this.getRoutingImports();
    const routeDefinitions = this.generateRouteDefinitions(config.routes);
    const routerSetup = this.getRouterSetup(config);

    return `${imports}

${routeDefinitions}

${routerSetup}`;
  }

  // ==================== TAILWIND IMPLEMENTATIONS ====================

  private static generatePageTailwind(config: PageConfig): string {
    const sections = config.sections?.map(s => this.getTailwindSection(s)).join('\n\n') || '';

    return `import React from 'react';

export interface ${config.name}Props {}

const ${config.name}: React.FC<${config.name}Props> = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">${config.title}</h1>
          {config.description && <p className="mt-2 text-gray-600">${config.description}</p>}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          ${sections || '<div className="text-gray-600">Page content here</div>'}
        </div>
      </main>
    </div>
  );
};

export default ${config.name};
`;
  }

  private static generateFormTailwind(config: FormConfig): string {
    const fields = config.fields.map(f => this.getTailwindFormField(f)).join('\n        ');
    const buttons = this.getTailwindFormButtons(config.submitButton, config.cancelButton);

    return `import React, { useState } from 'react';

export interface ${config.name}Props {
  onSubmit?: (data: any) => void;
}

const ${config.name}: React.FC<${config.name}Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    ${config.fields.map(f => `${f.name}: ''`).join(',\n    ')}
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">${config.name}</h2>

      <div className="space-y-4">
        ${fields}
      </div>

      <div className="flex gap-3 mt-6">
        ${buttons}
      </div>
    </form>
  );
};

export default ${config.name};
`;
  }

  private static generateTableTailwind(config: TableConfig): string {
    const headers = config.columns.map(c => `<th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">${c.label}</th>`).join('\n          ');
    const rows = `<tr className="hover:bg-gray-50 border-b border-gray-200">
            ${config.columns.map(c => `<td className="px-6 py-4 text-sm text-gray-900">{item.${c.key}}</td>`).join('\n            ')}
            ${config.actions ? `<td className="px-6 py-4 text-sm space-x-2">
              ${config.actions.map(a => `<button className="px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200">${a}</button>`).join('\n              ')}
            </td>` : ''}
          </tr>`;

    return `import React, { useState } from 'react';

export interface ${config.name}Props {
  data?: any[];
}

const ${config.name}: React.FC<${config.name}Props> = ({ data = [] }) => {
  const [page, setPage] = useState(0);

  return (
    <div className="w-full overflow-x-auto shadow-md rounded-lg">
      <table className="w-full border-collapse bg-white">
        <thead className="bg-gray-100 border-b-2 border-gray-300">
          <tr>
            ${headers}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            ${rows}
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ${config.name};
`;
  }

  private static generateLayoutTailwind(config: LayoutConfig): string {
    const navItems = config.navigationItems?.map(n => `<a href="${n.path}" className="text-gray-600 hover:text-gray-900 px-3 py-2">${n.label}</a>`).join('\n        ') || '';

    if (config.type === 'header-footer') {
      return `import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">${config.name}</h1>
            ${config.hasNavigation ? `<nav className="flex space-x-1">
              ${navItems}
            </nav>` : ''}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 ${config.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
`;
    } else if (config.type === 'sidebar') {
      return `import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 shadow-lg">
        <h1 className="text-xl font-bold mb-8">${config.name}</h1>
        <nav className="space-y-2">
          ${config.navigationItems?.map(n => `<a href="${n.path}" className="block px-4 py-2 rounded hover:bg-gray-800">${n.label}</a>`).join('\n          ') || ''}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
`;
    }

    return '';
  }

  // ==================== MUI IMPLEMENTATIONS ====================

  private static generatePageMUI(config: PageConfig): string {
    const sections = config.sections?.map(s => this.getMUISection(s)).join('\n          ') || '';

    return `import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';

export interface ${config.name}Props {}

const ${config.name}: React.FC<${config.name}Props> = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          ${config.title}
        </Typography>
        ${config.description ? `<Typography variant="body1" color="textSecondary">${config.description}</Typography>` : ''}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        ${sections || '<Paper sx={{ p: 2 }}><Typography>Page content here</Typography></Paper>'}
      </Box>
    </Container>
  );
};

export default ${config.name};
`;
  }

  private static generateFormMUI(config: FormConfig): string {
    const fields = config.fields.map(f => this.getMUIFormField(f)).join('\n        ');
    const buttons = this.getMUIFormButtons(config.submitButton, config.cancelButton);

    return `import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Stack } from '@mui/material';

export interface ${config.name}Props {
  onSubmit?: (data: any) => void;
}

const ${config.name}: React.FC<${config.name}Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    ${config.fields.map(f => `${f.name}: ''`).join(',\n    ')}
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        ${config.name}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        ${fields}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          ${buttons}
        </Stack>
      </Box>
    </Paper>
  );
};

export default ${config.name};
`;
  }

  private static generateTableMUI(config: TableConfig): string {
    return `import React, { useState } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Button, Stack } from '@mui/material';

export interface ${config.name}Props {
  data?: any[];
}

const ${config.name}: React.FC<${config.name}Props> = ({ data = [] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            ${config.columns.map(c => `<TableCell sx={{ fontWeight: 'bold' }}>${c.label}</TableCell>`).join('\n            ')}
            ${config.actions ? '<TableCell sx={{ fontWeight: \'bold\' }}>Actions</TableCell>' : ''}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, idx) => (
            <TableRow key={idx} hover>
              ${config.columns.map(c => `<TableCell>{item.${c.key}}</TableCell>`).join('\n              ')}
              ${config.actions ? `<TableCell>
                <Stack direction="row" spacing={1}>
                  ${config.actions.map(a => `<Button size="small" variant="outlined">${a}</Button>`).join('\n                  ')}
                </Stack>
              </TableCell>` : ''}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ${config.name};
`;
  }

  private static generateLayoutMUI(config: LayoutConfig): string {
    const navItems = config.navigationItems?.map(n => `<Button color="inherit" href="${n.path}">${n.label}</Button>`).join('\n          ') || '';

    if (config.type === 'header-footer') {
      return `import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Footer } from '@mui/material';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ${config.name}
          </Typography>
          ${config.hasNavigation ? `<Box>${navItems}</Box>` : ''}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ backgroundColor: '#1a1a1a', color: 'white', py: 4, mt: 4 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography>&copy; 2026 ${config.name}. All rights reserved.</Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
`;
    } else if (config.type === 'sidebar') {
      return `import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemText, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerContent = (
    <List>
      ${config.navigationItems?.map(n => `<ListItem disablePadding>
        <ListItemButton href="${n.path}">
          <ListItemText primary="${n.label}" />
        </ListItemButton>
      </ListItem>`).join('\n      ') || ''}
    </List>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ${config.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant={isMobile ? 'temporary' : 'permanent'} sx={{ width: 256 }}>
        <Toolbar />
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
`;
    }

    return '';
  }

  // ==================== HELPER METHODS ====================

  private static getTailwindSection(name: string): string {
    return `<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">${name}</h3>
  <p className="text-gray-600">Add your ${name} content here</p>
</div>`;
  }

  private static getMUISection(name: string): string {
    return `<Paper sx={{ p: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>${name}</Typography>
  <Typography>Add your ${name} content here</Typography>
</Paper>`;
  }

  private static getTailwindFormField(field: FormField): string {
    const label = `<label className="block text-sm font-medium text-gray-700 mb-1">${field.label}</label>`;
    let input = '';

    if (field.type === 'textarea') {
      input = `<textarea
        name="${field.name}"
        placeholder="${field.placeholder || ''}"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={${field.required || false}}
      />`;
    } else if (field.type === 'select') {
      const options = field.options?.map(o => `<option value="${o.value}">${o.label}</option>`).join('\n        ') || '';
      input = `<select
        name="${field.name}"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={${field.required || false}}
      >
        <option value="">Select...</option>
        ${options}
      </select>`;
    } else {
      input = `<input
        type="${field.type}"
        name="${field.name}"
        placeholder="${field.placeholder || ''}"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={${field.required || false}}
      />`;
    }

    return `<div>
      ${label}
      ${input}
    </div>`;
  }

  private static getMUIFormField(field: FormField): string {
    if (field.type === 'textarea') {
      return `<TextField
  fullWidth
  multiline
  rows={4}
  name="${field.name}"
  label="${field.label}"
  placeholder="${field.placeholder || ''}"
  required={${field.required || false}}
  onChange={handleChange}
/>`;
    } else if (field.type === 'select') {
      const options = field.options?.map(o => `<option value="${o.value}">${o.label}</option>`).join('\n      ') || '';
      return `<TextField
  fullWidth
  select
  name="${field.name}"
  label="${field.label}"
  required={${field.required || false}}
  onChange={handleChange}
>
  ${options}
</TextField>`;
    } else {
      return `<TextField
  fullWidth
  type="${field.type}"
  name="${field.name}"
  label="${field.label}"
  placeholder="${field.placeholder || ''}"
  required={${field.required || false}}
  onChange={handleChange}
/>`;
    }
  }

  private static getTailwindFormButtons(submit?: boolean, cancel?: boolean): string {
    let buttons = '';
    if (submit !== false) {
      buttons += '<button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Submit</button>';
    }
    if (cancel) {
      buttons += '\n        <button type="button" className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">Cancel</button>';
    }
    return buttons;
  }

  private static getMUIFormButtons(submit?: boolean, cancel?: boolean): string {
    let buttons = '';
    if (submit !== false) {
      buttons += '<Button type="submit" variant="contained" color="primary">Submit</Button>';
    }
    if (cancel) {
      buttons += '\n          <Button type="button" variant="outlined">Cancel</Button>';
    }
    return buttons;
  }

  private static getRoutingImports(): string {
    return `import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load pages for code splitting
const getComponent = (path: string) => lazy(() => import(path));`;
  }

  private static generateRouteDefinitions(routes: RouteDefinition[]): string {
    const routeDefs = routes
      .map(r => {
        const protectedPrefix = r.protected ? '// Protected route\n  ' : '';
        return `${protectedPrefix}{ path: '${r.path}', element: getComponent('../${r.component}'), protected: ${r.protected || false} }`;
      })
      .join(',\n  ');

    return `const routeConfig = [
  ${routeDefs}
];`;
  }

  private static getRouterSetup(config: RoutingConfig): string {
    const protectedRoutes = config.protectedRoutes?.map(r => `'${r}'`).join(', ') || '';

    return `export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routeConfig.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute>{<route.element />}</ProtectedRoute>
                ) : (
                  <route.element />
                )
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;`;
  }
}
