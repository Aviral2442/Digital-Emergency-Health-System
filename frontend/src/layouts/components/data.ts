import { type MenuItemType } from '@/types/layout'
import { type IconType } from 'react-icons'
import { TbLogout2, TbUserCircle } from 'react-icons/tb'
import {
  LuCalendarCheck,
  LuCar,
  LuCircleGauge,
  LuHospital,
  LuShield,
} from 'react-icons/lu'

type UserDropdownItemType = {
  label?: string
  icon?: IconType
  url?: string
  isDivider?: boolean
  isHeader?: boolean
  class?: string
}

export const handlelogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/auth/sign-in';
}

export const userDropdownItems: UserDropdownItemType[] = [
  {
    label: 'Welcome back!',
    isHeader: true,
  },
  {
    label: 'Profile',
    icon: TbUserCircle,
    url: '/pages/profile',
  },
  {
    label: 'Log Out',
    icon: TbLogout2,
    url: '#',
    class: 'text-danger fw-semibold',
  },
]

export const menuItems: MenuItemType[] = [
  { key: 'manpower-dashboard', label: 'Dashboard', icon: LuCircleGauge, url: '/manpower-dashboard' },
  { key: '', label: 'Police', icon: LuShield, url: '' },
  { key: '', label: 'Hospitals', icon: LuHospital, url: '' },
  { key: '', label: 'Drivers', icon: LuCar, url: '' },
  { key: 'booking-list', label: 'Bookings', icon: LuCalendarCheck, url: '/ambulance/booking' },
]