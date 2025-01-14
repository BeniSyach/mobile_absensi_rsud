import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, Path } from 'react-native-svg';

export const UserIcon = ({ color = '#CCC', style, ...props }: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
    style={StyleSheet.flatten([style])}
  >
    {/* Kepala */}
    <Circle cx={12} cy={8} r={4} fill={color} />

    {/* Tubuh */}
    <Path
      d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default UserIcon;
