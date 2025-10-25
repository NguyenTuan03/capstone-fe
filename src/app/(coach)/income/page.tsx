'use client';
import React, { useState } from 'react';

const IncomePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', margin: '24px' }}>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: '700',
        }}
      >
        Thu Nhập
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '24px',
          }}
        >
          <p style={{ color: '#4B5563', fontSize: '14px' }}>Tổng thu nhập</p>
          <p
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginTop: '4px',
            }}
          >
            94.5M đ
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '24px',
          }}
        >
          <p style={{ color: '#4B5563', fontSize: '14px' }}>Tổng buổi học</p>
          <p
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginTop: '4px',
            }}
          >
            318
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '24px',
          }}
        >
          <p style={{ color: '#4B5563', fontSize: '14px' }}>TB mỗi buổi</p>
          <p
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginTop: '4px',
            }}
          >
            297K đ
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
