
import React from 'react';
import { Button } from './button';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  action,
  breadcrumbs 
}) => {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-sayebo-pink-600 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        
        {action && (
          <Button 
            onClick={action.onClick}
            className="btn-primary flex items-center space-x-2"
          >
            {action.icon}
            <span>{action.label}</span>
          </Button>
        )}
      </div>
    </div>
  );
};
