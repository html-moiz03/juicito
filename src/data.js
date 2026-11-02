// ───────────────────────────────────────────────
// JUICITO – edit everything the owner will want to
// change right here (phone, address, hours, menu).
// Prices: add  p: 'Rs. 250'  to any item and it shows.
// ───────────────────────────────────────────────

export const PHONE = '0335 7316100'
export const TEL = 'tel:03357316100'

export const INFO = {
  branches: [
    { tab: 'Satellite Town', q: 'Juicito Commercial Market 4th Road Satellite Town Rawalpindi', name: 'Satellite Town', area: 'Commercial Market, 4th Road', phones: ['0332-8777828', '051-8777828'] },
    { tab: 'Civic Center Ph 4', q: 'Juicito Civic Center Bahria Town Phase 4 Rawalpindi', name: 'Bahria Town Phase 4', area: 'Civic Center', phones: ['0335-7316100', '051-5731610', '0300-0341022'] },
    { tab: 'Spring North Ph 7', q: 'Juicito Spring North Bahria Town Phase 7 Rawalpindi', name: 'Bahria Town Phase 7', area: 'Spring North', phones: ['0336-0026333', '051-5400263'] },
    { tab: 'Main Ph 7', q: 'Juicito Main Expressway Bahria Town Phase 7 Rawalpindi', name: 'Bahria Town Phase 7', area: 'Main Expressway / Sector F', phones: ['0336-6600151', '051-2000791'] },
    { tab: 'DHA Ph 5', q: 'Juicito DHA Phase 5 Islamabad', name: 'DHA Phase 5', area: 'DHA 2 / EMAAR, Islamabad', phones: ['0334-6108787', '051-6108787'] },
  ],
  // Optional: paste an exact Google Maps share link as  mapUrl: '...'  on a branch to override the search
  hours: [
    { days: 'MON – SUN', time: '12:00 PM → 2:00 AM' },
  ],
  instagram: 'https://www.instagram.com/juicitoofficial/',
  facebook: 'https://www.facebook.com/juicito.pk/',
  youtube: 'https://www.youtube.com/@Juicito.pk-Official',
  tiktok: 'https://www.tiktok.com/@juicito.pk',
  foodpanda: '#',
}

export const MENU = [
  {
    id: 'juice',
    kind: 'juice',
    title: 'Fresh Juice',
    color: '#f58220',
    items: [
      { n: 'Orange Juice' },
      { n: 'Pineapple Juice' },
      { n: 'Mango Juice' },
      { n: 'Strawberry Juice' },
      { n: 'Guava Juice' },
      { n: 'Apple Juice' },
      { n: 'Watermelon Juice' },
      { n: 'Grapefruit Juice' },
    ],
  },
  {
    id: 'cold',
    kind: 'shake',
    title: 'Cold Beverages',
    color: '#e6007e',
    items: [
      { n: 'Strawberry Oreo Shake' },
      { n: 'Cold Coffee' },
      { n: 'Banana Shake' },
      { n: 'Cranberry Shake' },
      { n: 'Chocolate Shake' },
      { n: 'Mint Margarita' },
    ],
  },
  {
    id: 'hot',
    kind: 'chai',
    title: 'Hot Beverages',
    color: '#b0005f',
    items: [
      { n: 'Green Tea' },
      { n: 'Karak Chai' },
      { n: 'Kashmiri Chai' },
      { n: 'Hot Coffee' },
      { n: 'Cappuccino' },
      { n: 'Chocolate Coffee' },
    ],
  },
  {
    id: 'soup',
    kind: 'soup',
    title: 'Soup',
    color: '#ffc20e',
    items: [
      { n: 'Winter Season Special' },
      { n: 'Vegetable Soup' },
      { n: 'Chicken Corn Soup' },
      { n: 'Hot & Sour Soup' },
    ],
  },
  {
    id: 'burgers',
    kind: 'burger',
    title: 'Burgers',
    color: '#f58220',
    items: [
      { n: 'Chicken Burger' },
      { n: 'Zinger Burger' },
      { n: 'Spicy Chicken Burger' },
      { n: 'JUICITO Grilled Burger' },
    ],
  },
  {
    id: 'fast',
    kind: 'fries',
    title: 'Fast Food',
    color: '#66a81b',
    items: [
      { n: 'French Fries' },
      { n: 'Chicken Nuggets' },
      { n: 'Chicken Wings' },
      { n: 'Crispy Chicken Fingers' },
      { n: 'Chicken Roll Paratha' },
      { n: 'Pizza' },
    ],
  },
  {
    id: 'chat',
    kind: 'chaat',
    title: 'Chatpatas',
    color: '#e6007e',
    items: [
      { n: 'Chana Chaat' },
      { n: 'Papri Chaat' },
      { n: 'Dahi Bhalla' },
      { n: 'Gol Gappay' },
      { n: 'Fruit Chaat' },
    ],
  },
]

export const FLAVORS_A = [
  'MANGO', 'ORANGE', 'PINEAPPLE', 'STRAWBERRY',
  'GUAVA', 'WATERMELON', 'OREO SHAKE', 'COLD COFFEE',
]
export const FLAVORS_B = [
  'KARAK CHAI', 'ZINGER', 'CHICKEN BURGER', 'FRENCH FRIES',
  'NUGGETS', 'CHANA CHAAT', 'GOL GAPPAY', 'HOT SOUP',
]

export const STEPS = [
  { n: '01', t: 'EL VASO', d: 'A tall, clean glass.' },
  { n: '02', t: 'FRESH JUICE', d: 'Squeezed to order.' },
  { n: '03', t: 'ICE, ICE', d: 'Cold. Very cold.' },
  { n: '04', t: 'THE FRUIT', d: 'A slice on the rim.' },
  { n: '05', t: 'THE STRAW!', d: 'Now you sip.' },
]
