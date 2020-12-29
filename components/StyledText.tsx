import * as React from 'react';

import { Text, TextProps } from './Themed';

export enum FontSizes {
  base = 20,
  title = 45,
}

export function StyledText(props: TextProps) {
  return <Text {...props} style={[ { fontSize: FontSizes.base }, props.style ]} />;
}
