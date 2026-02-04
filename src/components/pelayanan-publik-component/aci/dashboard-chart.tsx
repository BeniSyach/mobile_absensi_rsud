import React from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Svg,
} from 'react-native-svg';

import { Text } from '@/components/ui/text';

const { width } = Dimensions.get('window');

const ChartGrid = () => (
  <View className="ml-8 h-[150px]">
    {[0, 1, 2, 3, 4].map((i) => (
      <View
        key={i}
        className="absolute h-px w-full bg-gray-100"
        style={{ top: i * 37.5 }}
      />
    ))}
  </View>
);

const ChartLine = ({
  chartHeight,
  chartWidth,
  chartData,
  maxVal,
  stepX,
  pathD,
}: any) => (
  <View className="-mt-[150px] ml-8 h-[150px]">
    <Svg
      height={chartHeight}
      width={chartWidth + 20}
      style={{ overflow: 'visible' }}
    >
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0066FF" stopOpacity="0.5" />
          <Stop offset="1" stopColor="#0066FF" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {chartData.length > 0 && (
        <>
          <Path d={pathD} fill="none" stroke="#0066FF" strokeWidth="2" />
          {chartData.map((val: number, index: number) => {
            const x = index * stepX + 5;
            const y = chartHeight - (val / maxVal) * chartHeight;
            return (
              <Circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="white"
                stroke="#0066FF"
                strokeWidth="2"
              />
            );
          })}
        </>
      )}
    </Svg>
  </View>
);

const YAxisLabels = ({ maxVal }: { maxVal: number }) => (
  <View className="absolute inset-y-4 left-4 z-10 justify-between">
    {[maxVal, maxVal * 0.8, maxVal * 0.6, maxVal * 0.4, maxVal * 0.2].map(
      (val, i) => (
        <Text key={i} className="text-[10px] text-gray-400">
          {Math.round(val)}
        </Text>
      )
    )}
  </View>
);

const DashboardChartHeader = ({
  days,
  onDaysChange,
}: {
  days: number;
  onDaysChange: (days: number) => void;
}) => (
  <View className="mb-4 flex-row items-center justify-between">
    <View>
      <Text className="text-lg font-bold text-black">Statistik Laporan</Text>
      <Text className="text-xs text-gray-500">
        Statistik laporan masyarakat
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => onDaysChange(days === 10 ? 30 : 10)}
      className="rounded-full bg-blue-50 px-3 py-1.5"
    >
      <Text className="text-xs font-semibold text-[#0066FF]">
        {days} Hari Terakhir
        <Text className="text-[10px]"> ▼</Text>
      </Text>
    </TouchableOpacity>
  </View>
);

export const DashboardChart = ({
  data = [],
  days,
  onDaysChange,
}: {
  data?: { tanggal: string; total: number }[];
  days: number;
  onDaysChange: (days: number) => void;
}) => {
  const chartHeight = 150;
  // width - (screen padding: 48) - (card padding: 32) - (left margin for labels: 32)
  const chartWidth = width - 48 - 32 - 32;
  const chartData =
    data.length > 0 ? data.map((d) => d.total) : [0, 0, 0, 0, 0];
  const maxVal = Math.max(...chartData, 5);
  const stepX =
    chartData.length > 1 ? chartWidth / (chartData.length - 1) : chartWidth / 2;
  const points = chartData.map((val, index) => {
    const x = index * stepX + 10;
    const y = chartHeight - (val / maxVal) * chartHeight;
    return `${x},${y}`;
  });
  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';

  return (
    <View className="mt-6 px-6 pb-24">
      <DashboardChartHeader days={days} onDaysChange={onDaysChange} />

      <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <YAxisLabels maxVal={maxVal} />

        <ChartGrid />
        <ChartLine
          chartHeight={chartHeight}
          chartWidth={chartWidth}
          chartData={chartData}
          maxVal={maxVal}
          stepX={stepX}
          pathD={pathD}
        />

        <View className="ml-8 mt-2 flex-row justify-between">
          {data.length > 0 && (
            <>
              <Text className="text-[10px] text-gray-400">
                {data[0].tanggal.split('-').slice(1).reverse().join('/')}
              </Text>
              <Text className="text-[10px] text-gray-400">
                {data[data.length - 1].tanggal
                  .split('-')
                  .slice(1)
                  .reverse()
                  .join('/')}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};
