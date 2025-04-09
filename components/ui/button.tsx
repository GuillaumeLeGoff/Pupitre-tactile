import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'flex flex-row items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        destructive: 'bg-destructive',
        outline: 'border border-input bg-background',
        secondary: 'bg-secondary',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva('font-medium text-center', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      link: 'text-primary underline',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      icon: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  onPress?: () => void;
}

export const Button = ({
  className,
  textClassName,
  variant,
  size,
  children,
  disabled,
  onPress,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }), disabled && 'opacity-50')}
      disabled={disabled}
      onPress={onPress}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={cn(buttonTextVariants({ variant, size, className: textClassName }))}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}; 