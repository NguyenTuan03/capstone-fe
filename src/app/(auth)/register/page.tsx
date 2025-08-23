// 'use client';

// import { useState } from 'react';
// import { ButtonLoading } from '@/components/ui/loading';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Mật khẩu xác nhận không khớp');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       if (response.ok) {
//         router.push('/login?message=Đăng ký thành công. Vui lòng đăng nhập.');
//       } else {
//         const error = await response.json();
//         throw new Error(error.message || 'Đăng ký thất bại');
//       }
//     } catch (err: any) {
//       setError(err.message || 'Đăng ký thất bại');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//           Họ và tên
//         </label>
//         <input
//           id="name"
//           name="name"
//           type="text"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Nhập họ và tên"
//         />
//       </div>

//       <div>
//         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//           Email
//         </label>
//         <input
//           id="email"
//           name="email"
//           type="email"
//           value={formData.email}
//           onChange={handleChange}
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
//           name="password"
//           type="password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Nhập mật khẩu"
//         />
//       </div>

//       <div>
//         <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//           Xác nhận mật khẩu
//         </label>
//         <input
//           id="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           required
//           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           placeholder="Nhập lại mật khẩu"
//         />
//       </div>

//       {error && (
//         <div className="text-red-600 text-sm text-center">{error}</div>
//       )}

//       <ButtonLoading
//         type="submit"
//         loading={loading}
//         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//       >
//         Đăng ký
//       </ButtonLoading>

//       <div className="text-center">
//         <Link href="/login" className="text-blue-600 hover:text-blue-500">
//           Đã có tài khoản? Đăng nhập ngay
//         </Link>
//       </div>
//     </form>
//   );
// }
