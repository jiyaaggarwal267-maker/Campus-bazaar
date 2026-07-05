import type { User, Product, Conversation, Message, Notification } from './types';

export const currentUser: User = {
  id: 'u1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@iitd.ac.in',
  college: 'IIT Delhi',
  year: '3rd Year',
  avatar: 'https://i.pravatar.cc/200?img=12',
  bio: 'CS senior. Selling stuff I no longer need. Fast replies, fair prices.',
  rating: 4.8,
  totalRatings: 47,
  totalSales: 52,
  isVerified: true,
  isTrustedSeller: true,
  joinedAt: '2024-01-15T10:00:00Z',
};

export const users: User[] = [
  currentUser,
  { id: 'u2', name: 'Priya Patel', email: 'priya@iitb.ac.in', college: 'IIT Bombay', year: '4th Year',
    avatar: 'https://i.pravatar.cc/200?img=47', rating: 4.9, totalRatings: 89, totalSales: 94,
    isVerified: true, isTrustedSeller: true, joinedAt: '2023-08-12T10:00:00Z' },
  { id: 'u3', name: 'Rohan Verma', email: 'rohan@iiitd.ac.in', college: 'IIIT Delhi', year: '2nd Year',
    avatar: 'https://i.pravatar.cc/200?img=33', rating: 4.6, totalRatings: 23, totalSales: 28,
    isVerified: true, isTrustedSeller: false, joinedAt: '2024-03-20T10:00:00Z' },
  { id: 'u4', name: 'Ananya Singh', email: 'ananya@dtu.ac.in', college: 'DTU', year: '3rd Year',
    avatar: 'https://i.pravatar.cc/200?img=49', rating: 5.0, totalRatings: 12, totalSales: 14,
    isVerified: true, isTrustedSeller: true, joinedAt: '2024-06-01T10:00:00Z' },
  { id: 'u5', name: 'Kabir Mehta', email: 'kabir@bits.ac.in', college: 'BITS Pilani', year: '1st Year',
    avatar: 'https://i.pravatar.cc/200?img=15', rating: 4.4, totalRatings: 8, totalSales: 9,
    isVerified: true, isTrustedSeller: false, joinedAt: '2024-09-10T10:00:00Z' },
];

export const categories = [
  'Textbooks', 'Electronics', 'Furniture', 'Cycles', 'Clothing',
  'Sports', 'Notes', 'Hostel Essentials', 'Musical Instruments', 'Other',
];

export const products: Product[] = [
  {
    id: 'p1', title: 'MacBook Air M2 (8GB / 256GB)',
    description: 'Pristine condition MacBook Air M2. Used for 8 months, always with a case. Battery cycle count under 150. Includes original charger and a black hard case.',
    price: 78000, negotiable: true, category: 'Electronics', condition: 'like-new',
    status: 'available', images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
    ],
    sellerId: 'u2', college: 'IIT Bombay', views: 342, createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'p2', title: 'Engineering Mathematics Bundle (5 books)',
    description: 'Complete set of engineering math books in great condition. Includes Kreyszig, Higher Engineering Mathematics by BS Grewal, and more.',
    price: 1200, negotiable: true, category: 'Textbooks', condition: 'good',
    status: 'available', images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800'],
    sellerId: 'u1', college: 'IIT Delhi', views: 89, createdAt: '2025-01-12T10:00:00Z',
  },
  {
    id: 'p3', title: 'Study Table with Drawer',
    description: 'Solid wood study table, perfect for hostel rooms. One small scratch on top, otherwise excellent. Self-assembled, easy to disassemble.',
    price: 2500, negotiable: true, category: 'Furniture', condition: 'good',
    status: 'reserved', images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'],
    sellerId: 'u3', college: 'IIIT Delhi', views: 156, createdAt: '2025-01-08T10:00:00Z',
    reservedBy: 'u1',
  },
  {
    id: 'p4', title: 'Firefox Cycle — Single Speed',
    description: 'Black Firefox cycle, 6 months old. Smooth ride, perfect for campus. Includes lock.',
    price: 4500, negotiable: false, category: 'Cycles', condition: 'good',
    status: 'available', images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800'],
    sellerId: 'u4', college: 'DTU', views: 220, createdAt: '2025-01-14T10:00:00Z',
  },
  {
    id: 'p5', title: 'Acoustic Guitar — Yamaha F310',
    description: 'Beautiful Yamaha F310 acoustic guitar. Bought for a class I no longer take. Comes with a gig bag and a few picks.',
    price: 6500, negotiable: true, category: 'Musical Instruments', condition: 'like-new',
    status: 'available', images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'],
    sellerId: 'u2', college: 'IIT Bombay', views: 178, createdAt: '2025-01-11T10:00:00Z',
  },
  {
    id: 'p6', title: 'Complete CS Notes — Sem 1 to 4',
    description: 'Hand-written and digital notes for all CS core subjects. Toppers notes. PDF drive link will be shared.',
    price: 350, negotiable: false, category: 'Notes', condition: 'new',
    status: 'available', images: ['https://images.unsplash.com/photo-1517842645767-c639042777db?w=800'],
    sellerId: 'u1', college: 'IIT Delhi', views: 412, createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'p7', title: 'Sony WH-1000XM4 — Black',
    description: 'Industry-leading noise cancellation. Used for 4 months, no scratches. Original packaging included.',
    price: 18500, negotiable: true, category: 'Electronics', condition: 'like-new',
    status: 'sold', images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'],
    sellerId: 'u1', college: 'IIT Delhi', views: 567, createdAt: '2025-01-05T10:00:00Z',
    soldTo: 'u3', soldAt: '2025-01-13T15:00:00Z',
  },
  {
    id: 'p8', title: 'Hoodie — Navy Blue, Size M',
    description: 'Barely worn. Bought two of the same color by accident. Size M fits true.',
    price: 600, negotiable: true, category: 'Clothing', condition: 'like-new',
    status: 'available', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
    sellerId: 'u5', college: 'BITS Pilani', views: 45, createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'p9', title: 'Badminton Racket — Yonex Astrox',
    description: 'Yonex Astrox 22. Lightly used, restrung recently. Comes with a cover.',
    price: 1800, negotiable: true, category: 'Sports', condition: 'good',
    status: 'available', images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'],
    sellerId: 'u4', college: 'DTU', views: 67, createdAt: '2025-01-14T10:00:00Z',
  },
  {
    id: 'p10', title: 'Hostel Mattress — Queen Size',
    description: 'Used for one year. Clean and in good condition. Pickup only.',
    price: 1500, negotiable: true, category: 'Hostel Essentials', condition: 'good',
    status: 'available', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
    sellerId: 'u3', college: 'IIIT Delhi', views: 98, createdAt: '2025-01-13T10:00:00Z',
  },
  {
    id: 'p11', title: 'iPad Air 5th Gen + Apple Pencil',
    description: 'iPad Air M1, 64GB, Space Grey. Apple Pencil 2nd gen included. Perfect for notes.',
    price: 42000, negotiable: true, category: 'Electronics', condition: 'like-new',
    status: 'available', images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800'],
    sellerId: 'u2', college: 'IIT Bombay', views: 289, createdAt: '2025-01-12T10:00:00Z',
  },
  {
    id: 'p12', title: 'Wooden Bookshelf — 4 Tier',
    description: 'Compact 4-tier bookshelf, easy to assemble. Perfect for hostel rooms.',
    price: 1200, negotiable: true, category: 'Furniture', condition: 'good',
    status: 'available', images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'],
    sellerId: 'u5', college: 'BITS Pilani', views: 34, createdAt: '2025-01-15T10:00:00Z',
  },
];

const now = Date.now();
const minutes = (m: number) => new Date(now - m * 60_000).toISOString();
const hours = (h: number) => new Date(now - h * 3_600_000).toISOString();
const days = (d: number) => new Date(now - d * 86_400_000).toISOString();

export const conversations: Conversation[] = [
  { id: 'c1', productId: 'p1', buyerId: 'u1', sellerId: 'u2', unreadCount: 2, updatedAt: minutes(5) },
  { id: 'c2', productId: 'p4', buyerId: 'u1', sellerId: 'u4', unreadCount: 0, updatedAt: hours(2) },
  { id: 'c3', productId: 'p5', buyerId: 'u1', sellerId: 'u2', unreadCount: 1, updatedAt: hours(20) },
];

export const messages: Message[] = [
  { id: 'm1', conversationId: 'c1', senderId: 'u1', type: 'text',
    content: 'Hey! Is the MacBook still available?', createdAt: hours(3), read: true },
  { id: 'm2', conversationId: 'c1', senderId: 'u2', type: 'text',
    content: 'Yes it is! Are you on IIT Delhi?', createdAt: hours(2), read: true },
  { id: 'm3', conversationId: 'c1', senderId: 'u1', type: 'offer',
    offer: { id: 'o1', amount: 70000, status: 'countered', fromUserId: 'u1',
             createdAt: hours(2), counterAmount: 74000 },
    createdAt: hours(2), read: true },
  { id: 'm4', conversationId: 'c1', senderId: 'u2', type: 'text',
    content: 'I can do 74,000. Comes with a free Magic Mouse.', createdAt: hours(2), read: true },
  { id: 'm5', conversationId: 'c1', senderId: 'u1', type: 'text',
    content: 'Hmm, would you take 72,000? I can pick it up today.', createdAt: minutes(15), read: false },
  { id: 'm6', conversationId: 'c1', senderId: 'u2', type: 'text',
    content: 'Let me think. Will get back in 10 min.', createdAt: minutes(5), read: false },
  { id: 'm7', conversationId: 'c2', senderId: 'u1', type: 'text',
    content: 'Is the cycle still available? Can I see it tomorrow?', createdAt: hours(2), read: true },
  { id: 'm8', conversationId: 'c2', senderId: 'u4', type: 'text',
    content: 'Yes! Meet me at the DTU main gate at 5pm tomorrow.', createdAt: hours(2), read: true },
  { id: 'm9', conversationId: 'c3', senderId: 'u1', type: 'text',
    content: 'Beautiful guitar! Does it come with extra strings?', createdAt: hours(20), read: true },
  { id: 'm10', conversationId: 'c3', senderId: 'u2', type: 'text',
    content: 'Yes! Comes with two sets of DAddario strings.', createdAt: hours(20), read: false },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'offer', title: 'New offer received',
    body: 'Priya offered ₹70,000 for MacBook Air M2', link: '/chat/c1',
    read: false, createdAt: minutes(8) },
  { id: 'n2', type: 'message', title: 'New message',
    body: 'Priya: Let me think. Will get back in 10 min.', link: '/chat/c1',
    read: false, createdAt: minutes(5) },
  { id: 'n3', type: 'reserved', title: 'Item reserved',
    body: 'Your Study Table is reserved by Aarav', link: '/dashboard',
    read: true, createdAt: hours(6) },
  { id: 'n4', type: 'rating', title: 'New 5-star review',
    body: 'Rohan rated you 5 stars for Sony WH-1000XM4', link: '/profile/u1',
    read: true, createdAt: days(2) },
  { id: 'n5', type: 'offer-accepted', title: 'Offer accepted',
    body: 'Ananya accepted your offer of ₹4,200 for Firefox Cycle', link: '/chat/c2',
    read: true, createdAt: days(3) },
];

