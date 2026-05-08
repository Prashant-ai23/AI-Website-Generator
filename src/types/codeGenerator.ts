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
