import { View, Text } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const StepIndicator = ({ currentStep, totalSteps, steps }: StepIndicatorProps) => {
  return (
    <View className="mb-6 items-center">
      <View className="flex-row items-center mb-3">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View key={index} className="flex-row items-center">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                index + 1 <= currentStep ? 'bg-[#3c86e7ff]' : 'bg-gray-300'
              }`}
            >
              <Text
                className={`font-semibold text-base ${
                  index + 1 <= currentStep ? 'text-white' : 'text-gray-600'
                }`}
                style={{ fontFamily: 'Inter-SemiBold' }}
              >
                {index + 1}
              </Text>
            </View>
            {index < totalSteps - 1 && (
              <View
                className={`h-1 mx-2 ${
                  index + 1 < currentStep ? 'bg-[#1B365D]' : 'bg-gray-300'
                }`}
                style={{ width: 60 }}
              />
            )}
          </View>
        ))}
      </View>
      <View className="flex-row" style={{ width: 280, justifyContent: 'space-between' }}>
        {steps.map((step, index) => (
          <Text
            key={index}
            className={`text-xs font-medium ${
              index + 1 === currentStep ? 'text-[#1B365D]' : 'text-gray-500'
            }`}
            style={{ fontFamily: 'Inter-Medium', width: 70, textAlign: 'center' }}
          >
            {step}
          </Text>
        ))}
      </View>
    </View>
  );
};
