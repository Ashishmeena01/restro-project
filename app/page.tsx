import { getPublicMenu } from '@/services/product.service';
import { HomeClient } from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'vrindavan-sweets';
  let menuData = null;
  try {
    menuData = await getPublicMenu(defaultSlug);
  } catch (e) {
    console.error('Error fetching menu data on homepage:', e);
  }

  const business = menuData?.business || {
    name: 'Vrindavan Pure Veg Sweets & Café',
    tagline: 'Authentic Indian Delicacies & Pure Desi Ghee Sweets',
    address: 'Shop 12, Mandir Marg, Near Banke Bihari, Vrindavan, UP 281121',
    phone: '+91 98765 43210',
    openingHours: '08:00 AM - 10:30 PM',
  };

  const previewProducts = menuData?.categories?.flatMap((c) => c.products).slice(0, 4) || [
    { id: '1', name: 'Samosa', price: 1500, description: 'Golden crispy crust filled with fragrant spiced potatoes and green peas.' },
    { id: '2', name: 'Kachori', price: 2000, description: 'Flaky khasta kachori with spiced moong dal served with hing aloo sabzi.' },
    { id: '3', name: 'Tea', price: 1000, description: 'Hot kadak ginger & cardamom spiced Indian masala chai.' },
    { id: '4', name: 'Poha', price: 2500, description: 'Steamed flattened rice with peanuts, mustard seeds, and crunchy Ratlami sev.' },
  ];

  return <HomeClient business={business} previewProducts={previewProducts} />;
}
