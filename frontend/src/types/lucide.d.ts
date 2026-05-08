// Lucide React type augmentation to fix React 18 JSX compatibility
declare module 'lucide-react' {
  import * as React from 'react';

  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  type Icon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;

  // Social icons
  export const Github: Icon;
  export const Twitter: Icon;
  export const Linkedin: Icon;

  // Navigation icons
  export const Menu: Icon;
  export const X: Icon;
  export const LayoutDashboard: Icon;
  export const Folder: Icon;

  // Action icons
  export const Settings: Icon;
  export const LogOut: Icon;
  export const Plus: Icon;
  export const Save: Icon;
  export const Bell: Icon;
  export const Palette: Icon;

  // Status/State icons
  export const AlertCircle: Icon;
  export const Loader: Icon;
  export const Sparkles: Icon;

  // Form icons
  export const Wand2: Icon;
  export const Mail: Icon;
  export const Lock: Icon;
  export const User: Icon;
}
