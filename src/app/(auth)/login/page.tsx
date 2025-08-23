// 'use client';

// import { useState } from 'react';
// import { useJWTAuth } from '@/@crema/services/jwt-auth/JWTAuthProvider';
// import { ButtonLoading } from '@/@crema/components/ui/loading';
// import Link from 'next/link';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { signInUser, isLoading } = useJWTAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     try {
//       await signInUser({ email, password, remember: false });
//     } catch (err: any) {
//       setError(err.message || 'Đăng nhập thất bại');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//           Email
//         </label>
//         <input
//           id="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Nhập email của bạn"
//         />
//       </div>

//       <div>
//         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//           Mật khẩu
//         </label>
//         <input
//           id="password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Nhập mật khẩu"
//         />
//       </div>

//       {error && (
//         <div className="text-red-600 text-sm text-center">{error}</div>
//       )}

//       <ButtonLoading
//         type="submit"
//         loading={isLoading}
//         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//       >
//         Đăng nhập
//       </ButtonLoading>

//       <div className="text-center">
//         <Link href="/register" className="text-blue-600 hover:text-blue-500">
//           Chưa có tài khoản? Đăng ký ngay
//         </Link>
//       </div>
//     </form>
//   );
// }
