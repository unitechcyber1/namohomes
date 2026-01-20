// Indian market formatting utilities

// Format price in Indian Rupees with Lakhs/Crores notation
export const formatINR = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (absAmount >= 10000000) {
    // Crores (1 Crore = 10 Million)
    const crores = (absAmount / 10000000)?.toFixed(2);
    return `${sign}₹${crores} Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs (1 Lakh = 100 Thousand)
    const lakhs = (absAmount / 100000)?.toFixed(2);
    return `${sign}₹${lakhs} L`;
  } else if (absAmount >= 1000) {
    // Thousands
    const thousands = (absAmount / 1000)?.toFixed(2);
    return `${sign}₹${thousands}K`;
  } else {
    return `${sign}₹${absAmount?.toLocaleString('en-IN')}`;
  }
};

// Format full price with Indian number system (commas)
export const formatFullINR = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${amount?.toLocaleString('en-IN', {
    maximumFractionDigits: 0
  })}`;
};

// Format area in square feet (Indian standard)
export const formatArea = (sqft) => {
  if (!sqft && sqft !== 0) return '0 sq.ft';
  return `${sqft?.toLocaleString('en-IN')} sq.ft`;
};

// Format number with Indian comma system
export const formatIndianNumber = (num) => {
  if (!num && num !== 0) return '0';
  return num?.toLocaleString('en-IN');
};

// Property type mappings for Indian market
export const INDIAN_PROPERTY_TYPES = [
  { value: '', label: 'All Property Types' },
  { value: 'flat', label: 'Flat/Apartment' },
  { value: 'independent-house', label: 'Independent House/Villa' },
  { value: 'builder-floor', label: 'Builder Floor' },
  { value: 'residential-plot', label: 'Residential Plot' },
  { value: 'studio', label: 'Studio Apartment' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'commercial', label: 'Commercial Space' },
  { value: 'office', label: 'Office Space' },
  { value: 'shop', label: 'Shop/Showroom' },
  { value: 'agricultural', label: 'Agricultural Land' }
];

// Indian price ranges in INR
export const INDIAN_PRICE_RANGES = [
  { value: '', label: 'Any Budget', min: '', max: '' },
  { value: '0-2000000', label: 'Under ₹20 Lakhs', min: '0', max: '2000000' },
  { value: '2000000-4000000', label: '₹20L - ₹40L', min: '2000000', max: '4000000' },
  { value: '4000000-6000000', label: '₹40L - ₹60L', min: '4000000', max: '6000000' },
  { value: '6000000-10000000', label: '₹60L - ₹1 Cr', min: '6000000', max: '10000000' },
  { value: '10000000-20000000', label: '₹1 Cr - ₹2 Cr', min: '10000000', max: '20000000' },
  { value: '20000000-50000000', label: '₹2 Cr - ₹5 Cr', min: '20000000', max: '50000000' },
  { value: '50000000+', label: 'Above ₹5 Cr', min: '50000000', max: '' }
];

// Major Indian cities and metros
export const INDIAN_CITIES = [
  'Mumbai, Maharashtra',
  'Delhi NCR',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Ahmedabad, Gujarat',
  'Gurgaon, Haryana',
  'Noida, Uttar Pradesh',
  'Navi Mumbai, Maharashtra',
  'Thane, Maharashtra',
  'Ghaziabad, Uttar Pradesh',
  'Faridabad, Haryana'
];

// Indian-specific amenities
export const INDIAN_AMENITIES = [
  'Gated Community',
  'Security/CCTV',
  'Lift/Elevator',
  'Power Backup',
  'Water Storage',
  'Parking',
  'Gym/Fitness Center',
  'Swimming Pool',
  'Clubhouse',
  'Children Play Area',
  'Garden/Park',
  'Servant Room',
  'Vastu Compliant',
  'Rainwater Harvesting',
  'Solar Panels',
  'Intercom',
  'Piped Gas',
  'Modular Kitchen',
  'Air Conditioning',
  'Visitor Parking'
];

// Popular search tags for Indian market
export const INDIAN_SEARCH_TAGS = [
  'Flats in Gurgaon',
  'Villas in Gurugram',
  'Apartments in Delhi NCR',
  'Commercial Space in Gurgaon',
  'Budget Homes under ₹50L',
  'Luxury Properties'
];
