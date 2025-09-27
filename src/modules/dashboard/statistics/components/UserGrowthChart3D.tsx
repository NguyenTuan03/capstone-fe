'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { MonthlyUserData } from '@/types/statistics';

interface UserGrowthChart3DProps {
  data: MonthlyUserData[];
  animated?: boolean;
  interactive?: boolean;
  colors?: {
    learners: string;
    coaches: string;
    admins: string;
  };
}

const UserGrowthChart3D: React.FC<UserGrowthChart3DProps> = ({
  data,
  animated = true,
  interactive = true,
  colors = {
    learners: '#1890ff',
    coaches: '#52c41a',
    admins: '#faad14',
  },
}) => {
  const groupRef = useRef<any>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Calculate max values for scaling
  const maxValues = useMemo(() => {
    return {
      learners: Math.max(...data.map((d) => d.learners)),
      coaches: Math.max(...data.map((d) => d.coaches)),
      admins: Math.max(...data.map((d) => d.admins)),
      total: Math.max(...data.map((d) => d.total)),
    };
  }, [data]);

  // Animation frame
  useFrame((state, delta) => {
    if (animated && animationProgress < 1) {
      setAnimationProgress((prev) => Math.min(prev + delta * 0.8, 1));
    }

    // Gentle rotation for the whole chart
    if (groupRef.current && animated) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  // Create bars for each month and user type
  const bars = useMemo(() => {
    const barWidth = 0.8;
    const barSpacing = 2;
    const typeSpacing = 0.3;
    const maxHeight = 8;

    return data.flatMap((monthData, monthIndex) => {
      const monthBars = [];
      const baseX = (monthIndex - data.length / 2) * barSpacing;

      // Learners bar
      const learnersHeight =
        (monthData.learners / maxValues.learners) * maxHeight * animationProgress;
      monthBars.push({
        id: `learners-${monthIndex}`,
        position: [baseX - typeSpacing, learnersHeight / 2, 0] as [number, number, number],
        scale: [barWidth, learnersHeight, barWidth] as [number, number, number],
        color: colors.learners,
        value: monthData.learners,
        type: 'Học viên',
        month: monthData.month,
      });

      // Coaches bar
      const coachesHeight = (monthData.coaches / maxValues.coaches) * maxHeight * animationProgress;
      monthBars.push({
        id: `coaches-${monthIndex}`,
        position: [baseX, coachesHeight / 2, 0] as [number, number, number],
        scale: [barWidth, coachesHeight, barWidth] as [number, number, number],
        color: colors.coaches,
        value: monthData.coaches,
        type: 'Huấn luyện viên',
        month: monthData.month,
      });

      // Admins bar
      const adminsHeight = (monthData.admins / maxValues.admins) * maxHeight * animationProgress;
      monthBars.push({
        id: `admins-${monthIndex}`,
        position: [baseX + typeSpacing, adminsHeight / 2, 0] as [number, number, number],
        scale: [barWidth, adminsHeight, barWidth] as [number, number, number],
        color: colors.admins,
        value: monthData.admins,
        type: 'Quản trị viên',
        month: monthData.month,
      });

      return monthBars;
    });
  }, [data, maxValues, animationProgress, colors]);

  // Create month labels
  const monthLabels = useMemo(() => {
    const barSpacing = 2;
    return data.map((monthData, index) => ({
      position: [(index - data.length / 2) * barSpacing, -1, 1.5] as [number, number, number],
      text: monthData.month,
    }));
  }, [data]);

  // Create axis labels
  const axisLabels = useMemo(() => {
    const maxHeight = 8;
    const steps = 5;
    const labels = [];

    // Y-axis labels (values)
    for (let i = 0; i <= steps; i++) {
      const value = Math.round((maxValues.total / steps) * i);
      const y = (maxHeight / steps) * i;
      labels.push({
        position: [-data.length - 1, y, 0] as [number, number, number],
        text: value.toLocaleString(),
        type: 'y-axis',
      });
    }

    return labels;
  }, [data.length, maxValues.total]);

  const Bar3D: React.FC<{
    position: [number, number, number];
    scale: [number, number, number];
    color: string;
    id: string;
    value: number;
    type: string;
    month: string;
    isHovered: boolean;
    onHover: (id: string | null) => void;
  }> = ({ position, scale, color, id, value, type, month, isHovered, onHover }) => {
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
      if (meshRef.current) {
        // Hover animation
        const targetScale = isHovered ? 1.1 : 1;
        meshRef.current.scale.lerp(new Vector3(targetScale, 1, targetScale), 0.1);
      }
    });

    return (
      <group>
        <Box
          ref={meshRef}
          position={position}
          scale={scale}
          onPointerOver={() => interactive && onHover(id)}
          onPointerOut={() => interactive && onHover(null)}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            metalness={0.3}
            roughness={0.4}
            emissive={isHovered ? color : '#000000'}
            emissiveIntensity={isHovered ? 0.1 : 0}
          />
        </Box>

        {/* Tooltip */}
        {isHovered && (
          <Html position={[position[0], position[1] + scale[1] / 2 + 1, position[2]]} center>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{month}</div>
              <div>
                {type}: {value.toLocaleString()}
              </div>
            </div>
          </Html>
        )}
      </group>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Bars */}
      {bars.map((bar) => (
        <Bar3D
          key={bar.id}
          position={bar.position}
          scale={bar.scale}
          color={bar.color}
          id={bar.id}
          value={bar.value}
          type={bar.type}
          month={bar.month}
          isHovered={hoveredBar === bar.id}
          onHover={setHoveredBar}
        />
      ))}

      {/* Month Labels */}
      {monthLabels.map((label, index) => (
        <Text
          key={`month-${index}`}
          position={label.position}
          fontSize={0.4}
          color="#666666"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {label.text}
        </Text>
      ))}

      {/* Y-Axis Labels */}
      {axisLabels.map((label, index) => (
        <Text
          key={`axis-${index}`}
          position={label.position}
          fontSize={0.3}
          color="#999999"
          anchorX="right"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}

      {/* Legend */}
      <group position={[data.length / 2 + 2, 6, 0]}>
        {Object.entries(colors).map(([key, color], index) => {
          const labels = {
            learners: 'Học viên',
            coaches: 'Huấn luyện viên',
            admins: 'Quản trị viên',
          };

          return (
            <group key={key} position={[0, -index * 0.8, 0]}>
              <Box position={[-0.5, 0, 0]} scale={[0.3, 0.3, 0.3]}>
                <meshStandardMaterial color={color} />
              </Box>
              <Text
                position={[0, 0, 0]}
                fontSize={0.3}
                color="#333333"
                anchorX="left"
                anchorY="middle"
              >
                {labels[key as keyof typeof labels]}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Title */}
      <Text
        position={[0, 10, 0]}
        fontSize={0.6}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        Tăng trưởng người dùng theo tháng
      </Text>
    </group>
  );
};

// Import Html for tooltips
import { Html } from '@react-three/drei';

export default UserGrowthChart3D;
