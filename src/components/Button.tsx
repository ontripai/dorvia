import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  href,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "border-0 bg-[#2F6FED] hover:bg-[#081f3f] text-white focus:ring-[#2F6FED] shadow-xs hover:-translate-y-0.5",
    accent: "border-0 bg-[#2F6FED] hover:bg-[#1A5BB8] text-white font-extrabold focus:ring-[#2F6FED] shadow-sm hover:-translate-y-0.5",
    secondary: "bg-white hover:bg-[#eef3f8] text-[#142033] border border-[#dfe6ef] focus:ring-[#2F6FED]",
    outline: "bg-transparent hover:bg-white/10 text-white border border-white/30 backdrop-blur focus:ring-white",
    ghost: "border-0 bg-transparent hover:bg-[#eef3f8] text-[#2F6FED] focus:ring-[#2F6FED]",
    danger: "border-0 bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
  };

  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: "text-xs min-h-[36px] px-3.5 space-x-1.5 rtl:space-x-reverse",
    md: "text-xs sm:text-sm min-h-[46px] px-5 space-x-2 rtl:space-x-reverse",
    lg: "text-sm sm:text-base min-h-[52px] px-7 space-x-2.5 rtl:space-x-reverse"
  };

  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClassName} onClick={props.onClick as any}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
};
