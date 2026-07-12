// 空调产品数据
export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: 'wall-mounted' | 'portable' | 'central' | 'floor-standing';
  rating: number;
  reviews: number;
  features: string[];
  specs: Record<string, string>;
  description: string;
  badge?: string;
  energyClass: string;
  coolingCapacity: string;
  noiseLevel: string;
  color: string;
}

export const categories = [
  { id: 'all', name: 'All Products', nameEn: 'All' },
  { id: 'wall-mounted', name: 'Wall Mounted', nameEn: 'Wall' },
  { id: 'portable', name: 'Portable', nameEn: 'Portable' },
  { id: 'floor-standing', name: 'Floor Standing', nameEn: 'Tower' },
  { id: 'central', name: 'Central AC', nameEn: 'Central' },
] as const;

export const products: Product[] = [
  {
    id: 'arctic-breeze-9000',
    name: 'Arctic Breeze 9000',
    subtitle: 'Compact Wall-Mounted AC',
    price: 449,
    originalPrice: 549,
    image: '/products/arctic-breeze-9000.jpg',
    images: ['/products/arctic-breeze-9000.jpg', '/products/arctic-breeze-9000-angle.jpg', '/products/arctic-breeze-9000-side.jpg', '/products/arctic-breeze-9000-detail.jpg'],
    category: 'wall-mounted',
    rating: 4.8,
    reviews: 342,
    features: ['9,000 BTU', 'Inverter Technology', 'WiFi Smart Control', 'A+++ Energy'],
    specs: {
      'Cooling Capacity': '9,000 BTU / 2.6 kW',
      'Room Size': '15-25 m²',
      'Energy Class': 'A+++',
      'Noise Level': '19-38 dB',
      'Refrigerant': 'R32 Eco-friendly',
      'Dimensions': '790 × 275 × 200 mm',
      'Weight': '9.5 kg',
      'Warranty': '3 Years',
    },
    description: 'The Arctic Breeze 9000 is perfect for bedrooms and small living rooms. Its ultra-quiet operation at just 19dB ensures peaceful sleep, while the advanced inverter compressor saves up to 60% energy compared to conventional units.',
    badge: 'Best Seller',
    energyClass: 'A+++',
    coolingCapacity: '9,000 BTU',
    noiseLevel: '19-38 dB',
    color: '#3B82F6',
  },
  {
    id: 'polar-max-12000',
    name: 'Polar Max 12000',
    subtitle: 'Premium Wall-Mounted AC',
    price: 699,
    originalPrice: 849,
    image: '/products/alpine-cool-pro.jpg',
    images: ['/products/alpine-cool-pro.jpg', '/products/alpine-cool-pro-angle.jpg', '/products/alpine-cool-pro-side.jpg', '/products/alpine-cool-pro-detail.jpg'],
    category: 'wall-mounted',
    rating: 4.9,
    reviews: 521,
    features: ['12,000 BTU', 'Dual Inverter', 'Air Purifier', 'Voice Control'],
    specs: {
      'Cooling Capacity': '12,000 BTU / 3.5 kW',
      'Room Size': '25-40 m²',
      'Energy Class': 'A+++',
      'Noise Level': '20-42 dB',
      'Refrigerant': 'R32 Eco-friendly',
      'Dimensions': '890 × 310 × 220 mm',
      'Weight': '12.3 kg',
      'Warranty': '5 Years',
    },
    description: 'Our flagship wall-mounted unit combines powerful cooling with built-in HEPA air purification. The dual inverter compressor delivers rapid cooling in under 60 seconds while maintaining whisper-quiet operation.',
    badge: 'Top Rated',
    energyClass: 'A+++',
    coolingCapacity: '12,000 BTU',
    noiseLevel: '20-42 dB',
    color: '#6366F1',
  },
  {
    id: 'frost-free-18000',
    name: 'Frost Free 18000',
    subtitle: 'High-Power Wall-Mounted AC',
    price: 999,
    originalPrice: 1199,
    image: '/products/glacier-max-18000.jpg',
    images: ['/products/glacier-max-18000.jpg', '/products/glacier-max-18000-angle.jpg', '/products/glacier-max-18000-side.jpg', '/products/glacier-max-18000-detail.jpg'],
    category: 'wall-mounted',
    rating: 4.7,
    reviews: 189,
    features: ['18,000 BTU', 'Turbo Cool', 'Self-Cleaning', 'Smart Sensors'],
    specs: {
      'Cooling Capacity': '18,000 BTU / 5.3 kW',
      'Room Size': '40-60 m²',
      'Energy Class': 'A++',
      'Noise Level': '24-46 dB',
      'Refrigerant': 'R32 Eco-friendly',
      'Dimensions': '1080 × 330 × 250 mm',
      'Weight': '16.8 kg',
      'Warranty': '5 Years',
    },
    description: 'Designed for large living rooms and open-plan spaces, the Frost Free 18000 delivers powerful cooling with intelligent air distribution. Smart sensors detect room occupancy and adjust airflow automatically.',
    energyClass: 'A++',
    coolingCapacity: '18,000 BTU',
    noiseLevel: '24-46 dB',
    color: '#0EA5E9',
  },
  {
    id: 'cool-move-3000',
    name: 'CoolMove 3000',
    subtitle: 'Portable Air Conditioner',
    price: 349,
    originalPrice: 399,
    image: '/products/breezeport-360.jpg',
    images: ['/products/breezeport-360.jpg', '/products/breezeport-360-angle.jpg', '/products/breezeport-360-back.jpg'],
    category: 'portable',
    rating: 4.5,
    reviews: 267,
    features: ['9,000 BTU', '3-in-1 Function', 'Easy Roll', 'No Permanent Install'],
    specs: {
      'Cooling Capacity': '9,000 BTU / 2.6 kW',
      'Room Size': '15-25 m²',
      'Energy Class': 'A',
      'Noise Level': '42-54 dB',
      'Functions': 'Cool / Dehumidify / Fan',
      'Dimensions': '350 × 350 × 730 mm',
      'Weight': '28 kg (with wheels)',
      'Warranty': '2 Years',
    },
    description: 'The CoolMove 3000 is the perfect solution for renters and temporary cooling needs. Simply roll it to any room, connect the exhaust hose to a window, and enjoy instant relief from the heat.',
    badge: 'Great Value',
    energyClass: 'A',
    coolingCapacity: '9,000 BTU',
    noiseLevel: '42-54 dB',
    color: '#10B981',
  },
  {
    id: 'cool-move-pro-5000',
    name: 'CoolMove Pro 5000',
    subtitle: 'Premium Portable AC',
    price: 549,
    image: '/products/coolmove-500.jpg',
    images: ['/products/coolmove-500.jpg', '/products/coolmove-500-angle.jpg'],
    category: 'portable',
    rating: 4.6,
    reviews: 154,
    features: ['12,000 BTU', 'Heat Pump', 'WiFi Control', 'Auto Evaporation'],
    specs: {
      'Cooling Capacity': '12,000 BTU / 3.5 kW',
      'Room Size': '25-35 m²',
      'Energy Class': 'A+',
      'Noise Level': '38-50 dB',
      'Functions': 'Cool / Heat / Dehumidify / Fan',
      'Dimensions': '400 × 380 × 780 mm',
      'Weight': '32 kg (with wheels)',
      'Warranty': '3 Years',
    },
    description: 'Our premium portable AC offers year-round comfort with both cooling and heating modes. The auto-evaporation system means no water tank emptying in most conditions.',
    energyClass: 'A+',
    coolingCapacity: '12,000 BTU',
    noiseLevel: '38-50 dB',
    color: '#14B8A6',
  },
  {
    id: 'glacier-central-24',
    name: 'Glacier Central 24',
    subtitle: 'Multi-Split Central System',
    price: 2499,
    originalPrice: 2999,
    image: '/products/multizone-central-30000.jpg',
    images: ['/products/multizone-central-30000.jpg', '/products/multizone-central-30000-angle.jpg', '/products/multizone-central-30000-top.jpg', '/products/multizone-central-30000-detail.jpg'],
    category: 'central',
    rating: 4.9,
    reviews: 87,
    features: ['24,000 BTU', 'Multi-Zone', 'Ductless Design', 'Whole Home'],
    specs: {
      'Cooling Capacity': '24,000 BTU / 7.0 kW',
      'Room Size': '60-100 m² (multi-zone)',
      'Energy Class': 'A+++',
      'Noise Level': 'Outdoor: 48 dB',
      'Zones': 'Up to 4 indoor units',
      'Outdoor Dimensions': '850 × 700 × 330 mm',
      'Indoor Dimensions': '790 × 275 × 200 mm each',
      'Warranty': '7 Years',
    },
    description: 'Transform your entire home with our multi-split central system. Control each room independently with up to 4 indoor units connected to a single, efficient outdoor compressor.',
    badge: 'Premium',
    energyClass: 'A+++',
    coolingCapacity: '24,000 BTU',
    noiseLevel: '48 dB (outdoor)',
    color: '#8B5CF6',
  },
  {
    id: 'frostline-tower-24000',
    name: 'FrostLine Tower 24000',
    subtitle: 'Floor Standing AC',
    price: 1099,
    originalPrice: 1299,
    image: '/products/frostline-tower-24000.jpg',
    images: ['/products/frostline-tower-24000.jpg', '/products/frostline-tower-24000-angle.jpg', '/products/frostline-tower-24000-back.jpg', '/products/frostline-tower-24000-detail.jpg'],
    category: 'floor-standing',
    rating: 4.7,
    reviews: 89,
    features: [
      '360° Air Distribution',
      'Touch Control Panel',
      'Smart Inverter Technology',
      'Ultra Quiet Operation 32dB',
      'Self-Cleaning Function',
      'WiFi Remote Control',
    ],
    specs: {
      'Cooling Capacity': '24,000 BTU/h',
      'Coverage Area': '45-65 m²',
      'Power Consumption': '2,100 W',
      'Energy Class': 'A++',
      'Noise Level': '32-45 dB',
      'Dimensions': '520 × 350 × 1730 mm',
      'Weight': '42 kg',
      'Refrigerant': 'R32',
      'Warranty': '5 Years',
    },
    description: 'Elegant floor-standing tower design perfect for living rooms and large spaces. 360° air distribution ensures even cooling throughout the room, while the ultra-quiet operation keeps your environment peaceful.',
    badge: 'New',
    energyClass: 'A++',
    coolingCapacity: '24,000 BTU',
    noiseLevel: '32-45 dB',
    color: '#06B6D4',
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products;
  return products.filter((p) => p.category === category);
}
