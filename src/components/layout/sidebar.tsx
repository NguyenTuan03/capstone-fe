'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  CreditCard, 
  Settings, 
  Users, 
  BarChart3,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';

const navigation = [
  { name: 'Tổng quan', href: '/dashboard', icon: Home },
  { name: 'Giao dịch', href: '/transactions', icon: CreditCard },
  { name: 'Thống kê', href: '/analytics', icon: BarChart3 },
  { name: 'Người dùng', href: '/users', icon: Users, adminOnly: true },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 shadow-lg">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-blue-600">PayFlow</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="group -mx-2 mt-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600"
              >
                <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600" />
                Đăng xuất
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}