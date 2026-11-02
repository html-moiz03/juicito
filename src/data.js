// ───────────────────────────────────────────────
// JUICITO – edit everything the owner will want to
// change right here (phone, address, hours, menu).
// Prices: add  p: 'Rs. 250'  to any item and it shows.
// ───────────────────────────────────────────────

export const PHONE = '031 1110 382'
export const TEL = 'tel:03111110382'

export const INFO = {
  addressLines: ['ADD BRANCH ADDRESS', 'ADD AREA, CITY'],
  mapNote: 'Google Maps embed goes here',
  hours: [
    { days: 'MON – THU', time: '--:-- → --:--' },
    { days: 'FRI – SUN', time: '--:-- → --:--' },
  ],
  instagram: '#',
  facebook: '#',
  foodpanda: '#',
}

export const MENU = [
  {
    id: 'juice',
    title: 'Fresh Juice',
    color: '#f58220',
    items: [
      { e: '🍊', n: 'Orange Juice' },
      { e: '🍍', n: 'Pineapple Juice' },
      { e: '🥭', n: 'Mango Juice' },
      { e: '🍓', n: 'Strawberry Juice' },
      { e: '🍈', n: 'Guava Juice' },
      { e: '🍎', n: 'Apple Juice' },
      { e: '🍉', n: 'Watermelon Juice' },
      { e: '🍊', n: 'Grapefruit Juice' },
    ],
  },
  {
    id: 'cold',
    title: 'Cold Beverages',
    color: '#e6007e',
    items: [
      { e: '🥤', n: 'Strawberry Oreo Shake' },
      { e: '🧋', n: 'Cold Coffee' },
      { e: '🍌', n: 'Banana Shake' },
      { e: '🥤', n: 'Cranberry Shake' },
      { e: '🍫', n: 'Chocolate Shake' },
      { e: '🍹', n: 'Mint Margarita' },
    ],
  },
  {
    id: 'hot',
    title: 'Hot Beverages',
    color: '#b0005f',
    items: [
      { e: '🍵', n: 'Green Tea' },
      { e: '☕', n: 'Karak Chai' },
      { e: '🫖', n: 'Kashmiri Chai' },
      { e: '☕', n: 'Hot Coffee' },
      { e: '☕', n: 'Cappuccino' },
      { e: '🍫', n: 'Chocolate Coffee' },
    ],
  },
  {
    id: 'soup',
    title: 'Soup',
    color: '#ffc20e',
    items: [
      { e: '🍲', n: 'Winter Season Special' },
      { e: '🥣', n: 'Vegetable Soup' },
      { e: '🌽', n: 'Chicken Corn Soup' },
      { e: '🌶️', n: 'Hot & Sour Soup' },
    ],
  },
  {
    id: 'burgers',
    title: 'Burgers',
    color: '#f58220',
    items: [
      { e: '🍔', n: 'Chicken Burger' },
      { e: '🍔', n: 'Zinger Burger' },
      { e: '🌶️', n: 'Spicy Chicken Burger' },
      { e: '🍔', n: 'JUICITO Grilled Burger' },
    ],
  },
  {
    id: 'fast',
    title: 'Fast Food',
    color: '#66a81b',
    items: [
      { e: '🍟', n: 'French Fries' },
      { e: '🍗', n: 'Chicken Nuggets' },
      { e: '🍗', n: 'Chicken Wings' },
      { e: '🍤', n: 'Crispy Chicken Fingers' },
      { e: '🌯', n: 'Chicken Roll Paratha' },
      { e: '🍕', n: 'Pizza' },
    ],
  },
  {
    id: 'chat',
    title: 'Chatpatas',
    color: '#e6007e',
    items: [
      { e: '🥗', n: 'Chana Chaat' },
      { e: '🥣', n: 'Papri Chaat' },
      { e: '🍛', n: 'Dahi Bhalla' },
      { e: '🫓', n: 'Gol Gappay' },
      { e: '🍇', n: 'Fruit Chaat' },
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
