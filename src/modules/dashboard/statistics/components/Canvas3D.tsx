'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Grid,
  Stats,
  Html,
} from '@react-three/drei';
import { Card, Spin, Typography, Alert } from 'antd';
import { Chart3DConfig } from '@/types/statistics';

const { Text } = Typography;

interface Canvas3DProps {
  children: React.ReactNode;
  config?: Partial<Chart3DConfig>;
  title?: string;
  description?: string;
  height?: number;
  showGrid?: boolean;
  showStats?: boolean;
  showControls?: boolean;
  loading?: boolean;
  error?: string;
  onCameraChange?: (camera: any) => void;
  onClick?: (event: any) => void;
  onHover?: (event: any) => void;
}

const Canvas3D: React.FC<Canvas3DProps> = ({
  children,
  config,
  title,
  description,
  height = 600,
  showGrid = true,
  showStats = false,
  showControls = true,
  loading = false,
  error,
  onCameraChange,
  onClick,
  onHover,
}) => {
  const canvasRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default camera configuration
  const defaultCamera = {
    position: config?.camera?.position || [10, 10, 10],
    fov: config?.camera?.fov || 75,
    near: config?.camera?.near || 0.1,
    far: config?.camera?.far || 1000,
  };

  // Default lighting configuration
  const defaultLighting = {
    ambient: config?.lighting?.ambient || { color: '#404040', intensity: 0.4 },
    directional: config?.lighting?.directional || [
      { color: '#ffffff', intensity: 1, position: [10, 10, 5] },
    ],
  };

  const handleCreated = ({ gl, scene, camera }: any) => {
    // Configure renderer
    gl.setClearColor('#f5f5f5');
    gl.setPixelRatio(window.devicePixelRatio);
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = gl.PCFSoftShadowMap;

    // Enable tone mapping for better colors
    gl.toneMapping = gl.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;

    setIsLoading(false);
  };

  const LoadingFallback = () => (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Spin size="large" />
        <Text style={{ marginTop: '12px', color: '#666' }}>Đang tải 3D visualization...</Text>
      </div>
    </Html>
  );

  const ErrorFallback = ({ error }: { error: string }) => (
    <Html center>
      <Alert
        message="Lỗi 3D Rendering"
        description={error}
        type="error"
        showIcon
        style={{ maxWidth: '300px' }}
      />
    </Html>
  );

  if (error) {
    return (
      <Card title={title} style={{ height }}>
        <Alert message="Không thể tải 3D visualization" description={error} type="error" showIcon />
      </Card>
    );
  }

  return (
    <Card title={title} style={{ height }} bodyStyle={{ padding: 0, height: height - 57 }}>
      {description && (
        <div style={{ padding: '12px 16px 0', borderBottom: '1px solid #f0f0f0' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {description}
          </Text>
        </div>
      )}

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: description ? height - 100 : height - 57,
          overflow: 'hidden',
        }}
      >
        {(loading || isLoading) && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 10,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
              <div style={{ marginTop: '12px' }}>
                <Text type="secondary">Đang khởi tạo 3D engine...</Text>
              </div>
            </div>
          </div>
        )}

        <Canvas
          ref={canvasRef}
          onCreated={handleCreated}
          onClick={onClick}
          onPointerMove={onHover}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          frameloop="demand" // Only render when needed for better performance
        >
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={defaultCamera.position as [number, number, number]}
            fov={defaultCamera.fov}
            near={defaultCamera.near}
            far={defaultCamera.far}
          />

          {/* Controls */}
          {showControls && (
            <OrbitControls
              enablePan={config?.interactions?.pan !== false}
              enableZoom={config?.interactions?.zoom !== false}
              enableRotate={config?.interactions?.rotate !== false}
              enableDamping
              dampingFactor={0.05}
              minDistance={5}
              maxDistance={50}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              onChange={onCameraChange}
            />
          )}

          {/* Lighting */}
          <ambientLight
            color={defaultLighting.ambient.color}
            intensity={defaultLighting.ambient.intensity}
          />

          {defaultLighting.directional.map((light, index) => (
            <directionalLight
              key={index}
              color={light.color}
              intensity={light.intensity}
              position={light.position as [number, number, number]}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-20}
              shadow-camera-right={20}
              shadow-camera-top={20}
              shadow-camera-bottom={-20}
            />
          ))}

          {/* Environment */}
          <Environment preset="city" />

          {/* Grid */}
          {showGrid && (
            <Grid
              position={[0, -0.01, 0]}
              args={[20, 20]}
              cellSize={1}
              cellThickness={0.5}
              cellColor="#e0e0e0"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#c0c0c0"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={false}
            />
          )}

          {/* Performance Stats */}
          {showStats && <Stats />}

          {/* Content */}
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>

          {/* Error Boundary for 3D content */}
          <ErrorBoundary>{error && <ErrorFallback error={error} />}</ErrorBoundary>
        </Canvas>
      </div>
    </Card>
  );
};

// Error Boundary Component for 3D content
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <Alert
            message="3D Rendering Error"
            description="Có lỗi xảy ra khi render 3D content"
            type="error"
            showIcon
            style={{ maxWidth: '300px' }}
          />
        </Html>
      );
    }

    return this.props.children;
  }
}

export default Canvas3D;
