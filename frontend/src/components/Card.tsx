import { FC, HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: FC<CardProps> = ({ children, className, glass = true, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        glass ? 'glass-card' : 'bg-slate-900 border border-slate-800',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
