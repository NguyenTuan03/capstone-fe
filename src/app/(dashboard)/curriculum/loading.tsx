import { Spin } from 'antd';

export default function CurriculumLoading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
      }}
    >
      <Spin size="large" />
    </div>
  );
}
