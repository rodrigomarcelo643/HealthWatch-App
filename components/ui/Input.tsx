import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TextInputProps, Animated } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onFocus?: () => void;
}

export const Input = ({ label, error, icon, rightIcon, value, onFocus: onFocusProp, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  const renderLabel = () => {
    if (!label) return null;
    const parts = label.split('*');
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}<Text style={{ color: '#ef4444' }}>*</Text>{parts[1]}
        </>
      );
    }
    return label;
  };

  useEffect(() => {
    if (value) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (!isFocused) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocusProp?.();
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const labelStyle = {
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -10],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
  };

  return (
    <View 
      // @ts-ignore - NativeWind className
      className={error ? "mb-1" : "mb-3"}
    >
      <View 
        // @ts-ignore - NativeWind className
        className="relative"
      >
        <View 
          // @ts-ignore - NativeWind className
          className="flex-row items-center border-2 rounded-xl px-4 bg-white"
          style={{
            borderColor: error ? '#f87171' : isFocused ? '#4aacd3ff' : '#e5e7eb',
          }}
        >
          {icon && (
            <View 
              // @ts-ignore - NativeWind className
              className="mr-3"
            >
              {icon}
            </View>
          )}
          <View 
            // @ts-ignore - NativeWind className
            className="flex-1 relative"
          >
            {label && (
              <Animated.Text
                style={[
                  {
                    position: 'absolute',
                    left: 0,
                    color: error ? '#f87171' : isFocused ? '#1B365D' : '#6b7280',
                    backgroundColor: 'white',
                    paddingHorizontal: 4,
                    fontFamily: 'Inter-Medium',
                  },
                  labelStyle,
                ]}
              >
                {renderLabel()}
              </Animated.Text>
            )}
            <TextInput
              // @ts-ignore - NativeWind className
              className="text-gray-800 text-base"
              style={{ paddingVertical: 20, fontFamily: 'Inter-Medium' }}
              placeholderTextColor="transparent"
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={value}
              {...props}
            />
          </View>
          {rightIcon && (
            <View 
              // @ts-ignore - NativeWind className
              className="ml-3"
            >
              {rightIcon}
            </View>
          )}
        </View>
      </View>
      {error && (
        <Text 
          // @ts-ignore - NativeWind className
          className="text-red-500 text-sm mt-2 font-medium"
          style={{ fontFamily: 'Inter-Medium' }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};