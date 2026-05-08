import logger from '../utils/logger.js';

interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  badge?: string | number;
}

interface SidebarOptions {
  menuItems: MenuItem[];
  style?: 'vertical' | 'horizontal';
  withCollapse?: boolean;
  withIcons?: boolean;
  theme?: 'light' | 'dark';
  componentName?: string;
}

/**
 * Generate a React sidebar menu component
 */
export async function generateSidebarMenu(options: SidebarOptions): Promise<string> {
  logger.info('Generating sidebar menu component', {
    itemCount: options.menuItems.length,
  });

  const {
    menuItems,
    style = 'vertical',
    withCollapse = true,
    withIcons = true,
    theme = 'light',
    componentName = 'Sidebar',
  } = options;

  let code = "import React, { useState } from 'react';\n";
  code += "import './Sidebar.css';\n\n";

  // Build types/interfaces
  code += buildMenuInterfaces();
  code += '\n';

  // Build component
  code += `interface ${componentName}Props {\n`;
  code += `  items: MenuItem[];\n`;
  code += `  onItemClick?: (path: string) => void;\n`;
  code += `}\n\n`;

  code += `const ${componentName}: React.FC<${componentName}Props> = ({ items, onItemClick }) => {\n`;
  code += `  const [expanded, setExpanded] = useState<string[]>([]);\n\n`;

  code += `  const toggleItem = (id: string) => {\n`;
  code += `    setExpanded(prev => \n`;
  code += `      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]\n`;
  code += `    );\n`;
  code += `  };\n\n`;

  code += `  const handleItemClick = (item: MenuItem) => {\n`;
  code += `    if (item.children && item.children.length > 0) {\n`;
  code += `      toggleItem(item.id);\n`;
  code += `    } else if (item.path) {\n`;
  code += `      onItemClick?.(item.path);\n`;
  code += `    }\n`;
  code += `  };\n\n`;

  code += buildMenuRenderer(withIcons);

  code += `  return (\n`;
  code += `    <aside className="sidebar sidebar--${style} sidebar--${theme}">\n`;
  code += `      <nav className="sidebar__nav">\n`;
  code += `        {renderMenuItems(items)}\n`;
  code += `      </nav>\n`;
  code += `    </aside>\n`;
  code += `  );\n`;
  code += `};\n\n`;

  code += `export default ${componentName};`;

  logger.info('Sidebar menu generated successfully', {
    style,
    itemCount: options.menuItems.length,
    lines: code.split('\n').length,
  });

  return code;
}

function buildMenuInterfaces(): string {
  return `// Types\ninterface MenuItem {\n  id: string;\n  label: string;\n  path?: string;\n  icon?: string;\n  children?: MenuItem[];\n  badge?: string | number;\n}`;
}

function buildMenuRenderer(withIcons: boolean): string {
  let renderer = `  const renderMenuItems = (items: MenuItem[]): React.ReactNode => {\n`;
  renderer += `    return items.map(item => (\n`;
  renderer += `      <div key={item.id} className="menu-item">\n`;
  renderer += `        <button\n`;
  renderer += `          className="menu-item__button"\n`;
  renderer += `          onClick={() => handleItemClick(item)}\n`;
  renderer += `        >\n`;
  if (withIcons) {
    renderer += `          {item.icon && <span className="menu-item__icon">{item.icon}</span>}\n`;
  }
  renderer += `          <span className="menu-item__label">{item.label}</span>\n`;
  renderer += `          {item.badge && <span className="menu-item__badge">{item.badge}</span>}\n`;
  renderer += `          {item.children && (\n`;
  renderer += `            <span className={expanded.includes(item.id) ? 'menu-item__chevron menu-item__chevron--open' : 'menu-item__chevron'}>\n`;
  renderer += `              ▼\n`;
  renderer += `            </span>\n`;
  renderer += `          )}\n`;
  renderer += `        </button>\n`;
  renderer += `        {item.children && expanded.includes(item.id) && (\n`;
  renderer += `          <div className="menu-item__submenu">\n`;
  renderer += `            {renderMenuItems(item.children)}\n`;
  renderer += `          </div>\n`;
  renderer += `        )}\n`;
  renderer += `      </div>\n`;
  renderer += `    ));\n`;
  renderer += `  };\n\n`;
  return renderer;
}

export default generateSidebarMenu;
