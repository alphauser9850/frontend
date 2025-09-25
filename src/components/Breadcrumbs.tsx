import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedShinyText } from './magicui/animated-shiny-text';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="mt-10 Breadcrumbs" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center  text-sm text-foreground font-semibold">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {item.href && idx !== items.length - 1 ? (
              <Link to={item.href} className="hover:text-primary ">
                <AnimatedShinyText shimmerWidth={80}>{item.label}</AnimatedShinyText>
              </Link>
            ) : (
              <AnimatedShinyText shimmerWidth={80}>{item.label}</AnimatedShinyText>
            )}
            {idx < items.length - 1 && <span className="mx-2 divider">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 