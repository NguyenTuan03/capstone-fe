/**
 * Mock Authentication API Service
 * Simulates real authentication endpoints for development
 */

import authData from '@/data/auth.json';

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      avatar?: string;
      phone?: string;
      location?: string;
      permissions: string[];
    };
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    resetToken?: string; // Only for demo purposes
  };
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponse {
  success: boolean;
  message: string;
  data?: {
    verificationToken: string;
  };
}

export interface ResetPasswordRequest {
  verificationToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// Helper function to simulate API delay
const simulateDelay = (ms: number = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate simple mock token (avoiding btoa issues)
const generateMockToken = (user: any) => {
  // Simple token without btoa encoding
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `mock-token-${user.id}-${timestamp}-${random}`;
};

// Generate simple refresh token (avoiding btoa issues)
const generateRefreshToken = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `refresh-token-${timestamp}-${random}`;
};

export class AuthApiService {
  /**
   * Mock login endpoint
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    await simulateDelay(500); // Simulate network delay (reduced for testing)

    const { email, password, remember = false } = credentials;

    console.log('🔍 Login attempt:', { email, password, remember });

    // Find user by email
    const user = authData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    console.log('🔍 Found user:', user);

    if (!user) {
      console.log('❌ User not found');
      return {
        success: false,
        message: 'Tài khoản không tồn tại trong hệ thống',
      };
    }

    // Check password
    if (user.password !== password) {
      console.log('❌ Wrong password');
      return {
        success: false,
        message: 'Mật khẩu không chính xác',
      };
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('❌ User is not admin');
      return {
        success: false,
        message: 'Bạn không có quyền truy cập vào hệ thống quản trị',
      };
    }

    console.log('✅ Login successful');

    // Generate tokens
    const token = generateMockToken(user);
    const refreshToken = generateRefreshToken();

    console.log('🎟️ Generated tokens:', { token, refreshToken });

    // Update last login (in real app, this would be saved to database)
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          phone: updatedUser.phone,
          location: updatedUser.location,
          permissions: updatedUser.permissions,
        },
        token,
        refreshToken,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
      },
    };
  }

  /**
   * Mock forgot password endpoint
   */
  static async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    await simulateDelay(2000);

    const { email } = request;

    // Find user by email
    const user = authData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        message: 'Email không tồn tại trong hệ thống',
      };
    }

    // Generate reset code (in real app, this would be saved to database and sent via email)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`🔑 Reset code for ${email}: ${resetCode}`); // For demo purposes

    return {
      success: true,
      message: `Mã xác minh đã được gửi đến email ${email}`,
      data: {
        resetToken: resetCode, // In real app, don't return this
      },
    };
  }

  /**
   * Mock verify reset code endpoint
   */
  static async verifyResetCode(request: VerifyResetCodeRequest): Promise<VerifyResetCodeResponse> {
    await simulateDelay(1500);

    const { email, code } = request;

    // Find user by email
    const user = authData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        message: 'Email không tồn tại trong hệ thống',
      };
    }

    // For demo purposes, accept any 6-digit code or specific test codes
    const validCodes = ['123456', '111111', '000000'];
    const isValidCode = code.length === 6 && (/^\d{6}$/.test(code) || validCodes.includes(code));

    if (!isValidCode) {
      return {
        success: false,
        message: 'Mã xác minh không hợp lệ',
      };
    }

    // Generate verification token
    const verificationToken = btoa(`verify-${email}-${Date.now()}`);

    return {
      success: true,
      message: 'Mã xác minh hợp lệ',
      data: {
        verificationToken,
      },
    };
  }

  /**
   * Mock reset password endpoint
   */
  static async resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    await simulateDelay(1500);

    const { verificationToken, newPassword, confirmPassword } = request;

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: 'Mật khẩu xác nhận không khớp',
      };
    }

    // Validate password length
    if (newPassword.length < 6) {
      return {
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      };
    }

    // Validate verification token (basic check for demo)
    if (!verificationToken || !verificationToken.startsWith('dmVyaWZ5LQ==')) {
      // base64 "verify-"
      return {
        success: false,
        message: 'Token xác minh không hợp lệ hoặc đã hết hạn',
      };
    }

    // In real app, would update password in database
    console.log(`🔐 Password reset successfully for token: ${verificationToken}`);

    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.',
    };
  }

  /**
   * Mock logout endpoint
   */
  static async logout(): Promise<{ success: boolean; message: string }> {
    await simulateDelay(500);

    return {
      success: true,
      message: 'Đăng xuất thành công',
    };
  }

  /**
   * Mock refresh token endpoint
   */
  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    await simulateDelay(1000);

    // In real app, would validate refresh token and generate new tokens
    const mockUser = authData.users[0]; // Use first admin user for demo

    const newToken = generateMockToken(mockUser);
    const newRefreshToken = generateRefreshToken();

    return {
      success: true,
      message: 'Token làm mới thành công',
      data: {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          avatar: mockUser.avatar,
          phone: mockUser.phone,
          location: mockUser.location,
          permissions: mockUser.permissions,
        },
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 24 * 60 * 60,
      },
    };
  }

  /**
   * Get current user info from token
   */
  static async getCurrentUser(token: string): Promise<LoginResponse> {
    await simulateDelay(500);

    try {
      // For mock tokens, just return the first admin user
      if (token.startsWith('mock-token-')) {
        const user = authData.users[0]; // First admin user

        return {
          success: true,
          message: 'Lấy thông tin user thành công',
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              avatar: user.avatar,
              phone: user.phone,
              location: user.location,
              permissions: user.permissions,
            },
            token,
            refreshToken: '', // Current refresh token
            expiresIn: 24 * 60 * 60, // 24 hours
          },
        };
      }

      // Try to decode JWT token
      const payloadPart = token.split('.')[1];
      if (!payloadPart) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(atob(payloadPart));

      // Find user by ID
      const user = authData.users.find((u) => u.id === payload.sub);

      if (!user) {
        return {
          success: false,
          message: 'User không tồn tại',
        };
      }

      return {
        success: true,
        message: 'Lấy thông tin user thành công',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            location: user.location,
            permissions: user.permissions,
          },
          token,
          refreshToken: '', // Current refresh token
          expiresIn: payload.exp - Math.floor(Date.now() / 1000),
        },
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return {
        success: false,
        message: 'Token không hợp lệ',
      };
    }
  }
}
