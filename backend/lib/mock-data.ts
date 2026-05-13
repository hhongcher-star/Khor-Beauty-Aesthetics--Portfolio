// Mock data for Khor Beauty Aesthetics Admin Dashboard

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Deposit Paid' | 'Fully Paid' | 'Refunded';
}

export interface Enquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  message: string;
  source: 'Website Form' | 'WhatsApp' | 'Instagram' | 'Manual';
  dateReceived: string;
  status: 'New' | 'Contacted' | 'Closed';
}

export interface Service {
  id: string;
  name: string;
  category: 'Skin Booster' | 'Facial Treatment' | 'Anti-Aging' | 'Brightening' | 'Hydration' | 'Body Treatment' | 'Other';
  description: string;
  price: number;
  duration: string;
  image: string;
  isActive: boolean;
}

export interface Payment {
  id: string;
  customerName: string;
  bookingRef: string;
  amount: number;
  method: 'Bank Transfer' | 'FPX' | 'Touch n Go eWallet' | 'Credit / Debit Card' | 'Cash';
  status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  date: string;
}

export const mockBookings: Booking[] = [
  {
    id: 'BK001',
    customerName: 'Amelia Tan',
    phone: '012-345 6789',
    email: 'amelia@example.com',
    service: 'Skin Booster Treatment',
    date: '2026-06-10',
    time: '2:00 PM',
    status: 'Pending',
    paymentStatus: 'Deposit Paid',
  },
  {
    id: 'BK002',
    customerName: 'Chloe Lim',
    phone: '011-888 2233',
    email: 'chloe@example.com',
    service: 'Brightening Facial',
    date: '2026-06-12',
    time: '5:00 PM',
    status: 'Confirmed',
    paymentStatus: 'Unpaid',
  },
  {
    id: 'BK003',
    customerName: 'Sarah Wong',
    phone: '016-777 4455',
    email: 'sarah@example.com',
    service: 'Korean Glow Facial',
    date: '2026-06-08',
    time: '10:00 AM',
    status: 'Completed',
    paymentStatus: 'Fully Paid',
  },
  {
    id: 'BK004',
    customerName: 'Michelle Lee',
    phone: '019-222 3344',
    email: 'michelle@example.com',
    service: 'Anti-Aging Treatment',
    date: '2026-06-15',
    time: '3:30 PM',
    status: 'Confirmed',
    paymentStatus: 'Deposit Paid',
  },
  {
    id: 'BK005',
    customerName: 'Jessica Ng',
    phone: '012-999 8877',
    email: 'jessica@example.com',
    service: 'Hydration Facial',
    date: '2026-06-05',
    time: '11:00 AM',
    status: 'Cancelled',
    paymentStatus: 'Refunded',
  },
];

export const mockEnquiries: Enquiry[] = [
  {
    id: 'ENQ001',
    customerName: 'Michelle Wong',
    phone: '012-333 4455',
    email: 'michelle.wong@example.com',
    message: 'I would like to know more about skin booster treatment. Is it suitable for sensitive skin?',
    source: 'WhatsApp',
    dateReceived: '2026-06-08',
    status: 'New',
  },
  {
    id: 'ENQ002',
    customerName: 'Sarah Lee',
    phone: '011-555 6677',
    email: 'sarah.lee@example.com',
    message: 'Can I book a home facial treatment next weekend? Please let me know your availability.',
    source: 'Website Form',
    dateReceived: '2026-06-07',
    status: 'Contacted',
  },
  {
    id: 'ENQ003',
    customerName: 'Emily Chen',
    phone: '016-888 9900',
    email: 'emily.chen@example.com',
    message: 'What are your prices for the Korean Glow Facial? Do you offer any packages?',
    source: 'Instagram',
    dateReceived: '2026-06-06',
    status: 'Closed',
  },
  {
    id: 'ENQ004',
    customerName: 'Amanda Tan',
    phone: '019-111 2233',
    email: 'amanda.tan@example.com',
    message: 'Do you provide services in Petaling Jaya area? I am interested in brightening treatments.',
    source: 'WhatsApp',
    dateReceived: '2026-06-09',
    status: 'New',
  },
];

export const mockServices: Service[] = [
  {
    id: 'SVC001',
    name: 'Skin Booster Treatment',
    category: 'Skin Booster',
    description: 'Deep hydration treatment that revitalizes and plumps the skin for a youthful glow.',
    price: 388,
    duration: '90 mins',
    image: '/placeholder-service.jpg',
    isActive: true,
  },
  {
    id: 'SVC002',
    name: 'Korean Glow Facial',
    category: 'Facial Treatment',
    description: 'Signature facial inspired by Korean skincare routines for glass-like radiant skin.',
    price: 288,
    duration: '75 mins',
    image: '/placeholder-service.jpg',
    isActive: true,
  },
  {
    id: 'SVC003',
    name: 'Brightening Treatment',
    category: 'Brightening',
    description: 'Target dark spots and uneven skin tone for a brighter, more luminous complexion.',
    price: 328,
    duration: '80 mins',
    image: '/placeholder-service.jpg',
    isActive: false,
  },
  {
    id: 'SVC004',
    name: 'Anti-Aging Rejuvenation',
    category: 'Anti-Aging',
    description: 'Advanced treatment to reduce fine lines and restore skin elasticity.',
    price: 458,
    duration: '90 mins',
    image: '/placeholder-service.jpg',
    isActive: true,
  },
  {
    id: 'SVC005',
    name: 'Hydration Facial',
    category: 'Hydration',
    description: 'Intense moisture replenishment for dry and dehydrated skin.',
    price: 248,
    duration: '60 mins',
    image: '/placeholder-service.jpg',
    isActive: true,
  },
  {
    id: 'SVC006',
    name: 'Body Sculpting Treatment',
    category: 'Body Treatment',
    description: 'Non-invasive body contouring to help achieve a toned silhouette.',
    price: 588,
    duration: '120 mins',
    image: '/placeholder-service.jpg',
    isActive: true,
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    customerName: 'Amelia Tan',
    bookingRef: 'BK001',
    amount: 100,
    method: 'Bank Transfer',
    status: 'Paid',
    date: '2026-06-05',
  },
  {
    id: 'PAY002',
    customerName: 'Chloe Lim',
    bookingRef: 'BK002',
    amount: 288,
    method: 'Touch n Go eWallet',
    status: 'Pending',
    date: '2026-06-08',
  },
  {
    id: 'PAY003',
    customerName: 'Sarah Wong',
    bookingRef: 'BK003',
    amount: 288,
    method: 'FPX',
    status: 'Paid',
    date: '2026-06-08',
  },
  {
    id: 'PAY004',
    customerName: 'Michelle Lee',
    bookingRef: 'BK004',
    amount: 150,
    method: 'Credit / Debit Card',
    status: 'Paid',
    date: '2026-06-10',
  },
  {
    id: 'PAY005',
    customerName: 'Jessica Ng',
    bookingRef: 'BK005',
    amount: 248,
    method: 'FPX',
    status: 'Refunded',
    date: '2026-06-04',
  },
];

export const dashboardStats = {
  totalBookings: 127,
  newEnquiries: 8,
  activeServices: 5,
  pendingPayments: 12,
  thisMonthCustomers: 34,
};
