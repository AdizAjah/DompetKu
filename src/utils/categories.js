import { 
  UtensilsCrossed, Car, Zap, Gamepad2, ShoppingBag, Heart, 
  MoreHorizontal, Banknote, Laptop, Gift, Tag,
  Home, Wifi, BookOpen, Plane, Coffee, Shirt,
  Smartphone, Wrench, GraduationCap, Baby
} from 'lucide-react';

/**
 * Map icon name strings to Lucide components
 */
export const iconMap = {
  UtensilsCrossed, Car, Zap, Gamepad2, ShoppingBag, Heart,
  MoreHorizontal, Banknote, Laptop, Gift, Tag,
  Home, Wifi, BookOpen, Plane, Coffee, Shirt,
  Smartphone, Wrench, GraduationCap, Baby
};

/**
 * Get icon component by name
 */
export function getCategoryIcon(iconName) {
  return iconMap[iconName] || Tag;
}

/**
 * Available icons for category creation
 */
export const availableIcons = [
  { name: 'UtensilsCrossed', label: 'Makanan' },
  { name: 'Car', label: 'Kendaraan' },
  { name: 'Zap', label: 'Listrik' },
  { name: 'Gamepad2', label: 'Game' },
  { name: 'ShoppingBag', label: 'Belanja' },
  { name: 'Heart', label: 'Kesehatan' },
  { name: 'Banknote', label: 'Uang' },
  { name: 'Laptop', label: 'Teknologi' },
  { name: 'Gift', label: 'Hadiah' },
  { name: 'Home', label: 'Rumah' },
  { name: 'Wifi', label: 'Internet' },
  { name: 'BookOpen', label: 'Pendidikan' },
  { name: 'Plane', label: 'Perjalanan' },
  { name: 'Coffee', label: 'Kopi' },
  { name: 'Shirt', label: 'Pakaian' },
  { name: 'Smartphone', label: 'Gadget' },
  { name: 'Wrench', label: 'Perbaikan' },
  { name: 'GraduationCap', label: 'Sekolah' },
  { name: 'Baby', label: 'Anak' },
  { name: 'Tag', label: 'Lainnya' },
];

/**
 * Available colors for categories
 */
export const availableColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#64748b',
];
