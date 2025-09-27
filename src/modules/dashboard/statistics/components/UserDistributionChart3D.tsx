'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { Mesh, Vector3, RingGeometry, CylinderGeometry } from 'three';
import { DeviceData } from '@/types/statistics';

interface UserDistributionChart3DProps {
  data: DeviceData[];
  animated?: boolean;
  interactive?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
  explodeDistance?: number;
}

const UserDistributionChart3D: React.FC<UserDistributionChart3DProps> = ({
  data,
  animated = true,
  interactive = true,
  innerRadius = 2,
  outerRadius = 4,
  height = 1,
  explodeDistance = 0.5,
}) => {
  const groupRef = useRef<any>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animation frame
  useFrame((state, delta) => {
    if (animated && animationProgress < 1) {
      setAnimationProgress((prev) => Math.min(prev + delta * 1.2, 1));
    }

    // Gentle rotation
    if (groupRef.current && animated) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  // Calculate segments
  const segments = useMemo(() => {
    let currentAngle = 0;
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return data.map((item, index) => {
      const percentage = item.count / total;
      const segmentAngle = percentage * Math.PI * 2;
      const startAngle = currentAngle;
      const endAngle = currentAngle + segmentAngle;
      const midAngle = (startAngle + endAngle) / 2;

      // Calculate position for exploded effect
      const isHovered = hoveredSegment === `segment-${index}`;
      const explodeOffset = isHovered ? explodeDistance : 0;
      const offsetX = Math.cos(midAngle) * explodeOffset;
      const offsetZ = Math.sin(midAngle) * explodeOffset;

      currentAngle += segmentAngle;

      return {
        id: `segment-${index}`,
        startAngle,
        endAngle,
        midAngle,
        percentage: percentage * 100,
        item,
        position: [offsetX, 0, offsetZ] as [number, number, number],
        isHovered,
      };
    });
  }, [data, hoveredSegment, explodeDistance]);

  // Create 3D donut segments
  const DonutSegment: React.FC<{
    startAngle: number;
    endAngle: number;
    color: string;
    position: [number, number, number];
    id: string;
    item: DeviceData;
    percentage: number;
    isHovered: boolean;
    onHover: (id: string | null) => void;
  }> = ({ startAngle, endAngle, color, position, id, item, percentage, isHovered, onHover }) => {
    const meshRef = useRef<Mesh>(null);
    const segmentAngle = endAngle - startAngle;
    const thetaSegments = Math.max(8, Math.floor(segmentAngle / (Math.PI / 16)));

    useFrame(() => {
      if (meshRef.current) {
        // Scale animation
        const targetScaleY = animationProgress;
        const currentScaleY = meshRef.current.scale.y;
        meshRef.current.scale.y = currentScaleY + (targetScaleY - currentScaleY) * 0.1;

        // Hover effect
        const targetScale = isHovered ? 1.05 : 1;
        meshRef.current.scale.x =
          meshRef.current.scale.x + (targetScale - meshRef.current.scale.x) * 0.1;
        meshRef.current.scale.z =
          meshRef.current.scale.z + (targetScale - meshRef.current.scale.z) * 0.1;
      }
    });

    // Create custom geometry for the segment
    const geometry = useMemo(() => {
      const geom = new CylinderGeometry(
        outerRadius,
        outerRadius,
        height,
        thetaSegments,
        1,
        false,
        startAngle,
        segmentAngle,
      );

      // Create inner hole by modifying vertices
      const positions = geom.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        const distance = Math.sqrt(x * x + z * z);

        if (distance > 0) {
          const angle = Math.atan2(z, x);
          const newDistance = Math.max(innerRadius, distance);
          positions.setX(i, Math.cos(angle) * newDistance);
          positions.setZ(i, Math.sin(angle) * newDistance);
        }
      }

      geom.attributes.position.needsUpdate = true;
      geom.computeVertexNormals();
      return geom;
    }, [startAngle, segmentAngle, thetaSegments]);

    return (
      <group>
        <mesh
          ref={meshRef}
          position={position}
          geometry={geometry}
          onPointerOver={() => interactive && onHover(id)}
          onPointerOut={() => interactive && onHover(null)}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            metalness={0.2}
            roughness={0.6}
            emissive={isHovered ? color : '#000000'}
            emissiveIntensity={isHovered ? 0.2 : 0}
          />
        </mesh>

        {/* Percentage label on segment */}
        {percentage > 5 && (
          <Text
            position={[
              position[0] +
                (Math.cos((startAngle + endAngle) / 2) * (innerRadius + outerRadius)) / 2,
              height / 2 + 0.2,
              position[2] +
                (Math.sin((startAngle + endAngle) / 2) * (innerRadius + outerRadius)) / 2,
            ]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {percentage.toFixed(1)}%
          </Text>
        )}

        {/* Tooltip */}
        {isHovered && (
          <Html
            position={[
              position[0] + Math.cos((startAngle + endAngle) / 2) * (outerRadius + 1),
              height + 1,
              position[2] + Math.sin((startAngle + endAngle) / 2) * (outerRadius + 1),
            ]}
            center
          >
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                border: `2px solid ${color}`,
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {item.type === 'mobile'
                  ? '📱 Mobile'
                  : item.type === 'desktop'
                    ? '💻 Desktop'
                    : '📱 Tablet'}
              </div>
              <div>Người dùng: {item.count.toLocaleString()}</div>
              <div>Tỷ lệ: {percentage.toFixed(1)}%</div>
              <div>Sessions: {item.sessions.toLocaleString()}</div>
              <div>Thời gian TB: {item.avgDuration.toFixed(1)} phút</div>
            </div>
          </Html>
        )}
      </group>
    );
  };

  // Center statistics
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const totalSessions = data.reduce((sum, item) => sum + item.sessions, 0);

  return (
    <group ref={groupRef}>
      {/* Donut segments */}
      {segments.map((segment) => (
        <DonutSegment
          key={segment.id}
          startAngle={segment.startAngle}
          endAngle={segment.endAngle}
          color={segment.item.color}
          position={segment.position}
          id={segment.id}
          item={segment.item}
          percentage={segment.percentage}
          isHovered={segment.isHovered}
          onHover={setHoveredSegment}
        />
      ))}

      {/* Center statistics */}
      <group position={[0, height / 2 + 0.1, 0]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.8}
          color="#333333"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {total.toLocaleString()}
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.3} color="#666666" anchorX="center" anchorY="middle">
          Tổng người dùng
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.25}
          color="#999999"
          anchorX="center"
          anchorY="middle"
        >
          {totalSessions.toLocaleString()} sessions
        </Text>
      </group>

      {/* Legend */}
      <group position={[outerRadius + 3, height / 2, 0]}>
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          color="#333333"
          anchorX="left"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          Phân bố thiết bị
        </Text>

        {data.map((item, index) => {
          const deviceIcons = {
            mobile: '📱',
            desktop: '💻',
            tablet: '📱',
          };

          const deviceNames = {
            mobile: 'Mobile',
            desktop: 'Desktop',
            tablet: 'Tablet',
          };

          return (
            <group key={item.type} position={[0, 1 - index * 0.6, 0]}>
              {/* Color indicator */}
              <mesh position={[-0.3, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.2]} />
                <meshStandardMaterial color={item.color} />
              </mesh>

              {/* Device info */}
              <Text
                position={[0, 0.1, 0]}
                fontSize={0.3}
                color="#333333"
                anchorX="left"
                anchorY="middle"
              >
                {deviceIcons[item.type]} {deviceNames[item.type]}
              </Text>
              <Text
                position={[0, -0.2, 0]}
                fontSize={0.25}
                color="#666666"
                anchorX="left"
                anchorY="middle"
              >
                {item.count.toLocaleString()} ({item.percentage.toFixed(1)}%)
              </Text>
            </group>
          );
        })}
      </group>

      {/* Title */}
      <Text
        position={[0, height + 3, 0]}
        fontSize={0.6}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        Phân bố người dùng theo thiết bị
      </Text>

      {/* Base platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[outerRadius + 0.5, outerRadius + 0.5, 0.1]} />
        <meshStandardMaterial
          color="#f0f0f0"
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

export default UserDistributionChart3D;
