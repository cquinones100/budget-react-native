import React, { FunctionComponent } from 'react';
import Base from '../styles/Base';
import DatePicker, { DatePickerType } from './DatePicker';
import { StyledText } from './StyledText';

const DateComponent: FunctionComponent<DatePickerType> = ({ children, value, ...props }) => (
  <DatePicker
    style={{ width: "50%", margin: Base.margin }}
    value={value}
    {...props}
  >
    <StyledText style={{ marginBottom: Base.margin / 2 }}>
      {children}
    </StyledText>
  </DatePicker>
);

export default DateComponent;
