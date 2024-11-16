import React from 'react';
import { Dimensions } from 'react-native';
import { Svg, G, Path, Text, Rect } from 'react-native-svg';

const colors = ['#e8e8e8', '#f48888', '#f26060', '#f23838', '#d40000'];

const getColorForCount = (count) => {
  if(count >= 30) return colors[4];
  if(count >= 15) return colors[3];
  if(count >= 5) return colors[2];
  if(count >= 1) return colors[1];
  return colors[0];
}

const ClockChart = ({data}) => {
  const screenWidth = Dimensions.get('window').width;
  const chartSize = screenWidth - 80;  // 스크린 너비에서 80픽셀 줄인 크기
  const radius = chartSize / 4;
  const segmentAngle = 360 / 48;  // 30분 단위
  const offsetAngle = -90;

  return (
    <Svg
      height={radius * 2 + 40}
      width={chartSize}
      viewBox={`${10} ${-20} ${radius * 2 + 60} ${radius * 2 + 40}`}
    >
      <G origin={`${radius}, ${radius}`}>
        {Object.entries(data).map(([time, count], index) => {
          const startAngle = index * segmentAngle + offsetAngle;
          const endAngle = startAngle + segmentAngle;
          const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
          
          const x1 = radius + radius * Math.cos((Math.PI / 180) * startAngle);
          const y1 = radius + radius * Math.sin((Math.PI / 180) * startAngle);
          const x2 = radius + radius * Math.cos((Math.PI / 180) * endAngle);
          const y2 = radius + radius * Math.sin((Math.PI / 180) * endAngle);

          return (
            <Path
              key={time}
              d={`M${radius},${radius} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`}
              fill={getColorForCount(count)}
            />
          );
        })}
              
        {/* Label for 0:00 (Top) */}
        <Text
          x={radius}
          y={-10}
          fontSize="10"
          fill="black"
          textAnchor="middle"
        >
          0시
        </Text>
        
        {/* Label for 6:00 (Right) */}
        <Text
          x={radius * 2 + 15}
          y={radius}
          fontSize="10"
          fill="black"
          textAnchor="middle"
        >
          6시
        </Text>
        
        {/* Label for 12:00 (Bottom) */}
        <Text
          x={radius}
          y={radius * 2 + 20}
          fontSize="10"
          fill="black"
          textAnchor="middle"
        >
          12시
        </Text>
        
        {/* Label for 18:00 (Left) */}
        <Text
          x={-15}
          y={radius}
          fontSize="10"
          fill="black"
          textAnchor="middle"
        >
          18시
        </Text>
      </G>

      {/* 범례 블록 */}
      {colors.slice().reverse().map((color, index) => (
        <Rect
          key={index}
          x={radius * 2 + 50}
          y={index * 30 + 5}
          width="20"
          height="30"
          fill={color}
        />
      ))}

      {/* 범례 텍스트 */}
      <Text x={radius * 2 + 75} y={25} fontSize="10" fill="black">
        30건 이상
      </Text>
      <Text x={radius * 2 + 75} y={55} fontSize="10" fill="black">
        15건 이상
      </Text>
      <Text x={radius * 2 + 75} y={85} fontSize="10" fill="black">
        5건 이상
      </Text>
      <Text x={radius * 2 + 75} y={115} fontSize="10" fill="black">
        1건 이상
      </Text>
      <Text x={radius * 2 + 75} y={145} fontSize="10" fill="black">
        0건
      </Text>
    </Svg>
  );
}

export default ClockChart;
