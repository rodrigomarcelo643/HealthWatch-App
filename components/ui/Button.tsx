import { Text, TouchableOpacity, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  sizeStyle?: StyleProp<ViewStyle>;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', sizeStyle, ...props }: ButtonProps) {
  const baseStyles = 'rounded-lg items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-[#3c86e7ff] active:bg-[#154ea1ff] active:border-[#154ea1ff]',
    secondary: 'bg-gray-600 active:bg-gray-700',
    outline: 'border-2 border-blue-500 active:bg-blue-50',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  
  const textStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    outline: 'text-[#1B365D] font-semibold',
  };
  
  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      style={sizeStyle}
      {...props}
    >
      <Text className={`${textStyles[variant]} ${textSizeStyles[size]}`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
