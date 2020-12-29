import React, { FunctionComponent, ReactChildren } from 'react';
import DateTimePicker, { IOSNativeProps } from '@react-native-community/datetimepicker';
import { StyleProp, View, ViewStyle } from "react-native";

export type DatePickerType = IOSNativeProps & {
  style?: StyleProp<ViewStyle>
};

const DatePicker: FunctionComponent<DatePickerType> =
({ children, style, ...props }) => {
  return (
    <View style={[style, { flex: 1 }]}>
      {children}
      <DateTimePicker
        testID="dateTimePicker"
        display="default"
        {...props}
      />
    </View>
  );
}

export default DatePicker;