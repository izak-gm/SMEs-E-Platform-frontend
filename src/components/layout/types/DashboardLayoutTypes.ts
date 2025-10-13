import { LucideProps } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  subItems?: NavItem[];
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};
