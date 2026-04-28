export interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "The Amara Silhouette",
    price: "₦550,000",
    priceValue: 550000,
    image: "https://i.ibb.co/RkZ6YZtW/bridexx-planet-1777276602-3884399822497469036-34446236868.jpg",
    category: "Gowns",
    description: "A breathtaking A-line gown crafted from premium silk tulle with intricate lace detailing on the bodice. Perfect for a timeless entrance."
  },
  {
    id: 2,
    name: "Imperial Lace Ensemble",
    price: "₦720,000",
    priceValue: 720000,
    image: "https://i.ibb.co/9mWs9CQT/bridexx-planet-1777011295-3882174021060335182-34446236868.jpg",
    category: "Traditional",
    description: "Honoring tradition with royal elegance. This ensemble features hand-woven George fabric and heavy coral bead embellishments."
  },
  {
    id: 3,
    name: "Celestial Tulle Gown",
    price: "₦680,000",
    priceValue: 680000,
    image: "https://i.ibb.co/hJFFd4qR/bridexx-planet-1777011295-3882174028064877310-34446236868.jpg",
    category: "Gowns",
    description: "Light as air and sparking with ethereal charm. A multi-layered tulle masterpiece designed for the bride who wants to shine under the stars."
  },
  {
    id: 4,
    name: "The Royal Meridian",
    price: "₦850,000",
    priceValue: 850000,
    image: "https://i.ibb.co/VYZrs2tC/bridexx-planet-1776674217-3879345988536444726-34446236868.jpg",
    category: "Bespoke",
    description: "A signature bespoke creation featuring a structured corset and an expansive train, representing the peak of Bridexx craftsmanship."
  },
  {
    id: 5,
    name: "Ivory Whisper Dress",
    price: "₦500,000",
    priceValue: 500000,
    image: "https://i.ibb.co/3X2jpNm/bridexx-planet-1769861631-3822197899820628201-34446236868.jpg",
    category: "Reception",
    description: "Elegance meets comfort. Designed for the sophisticated bride's reception, allowing grace and movement for the celebrations ahead."
  },
  {
    id: 6,
    name: "Golden Heritage Wrap",
    price: "₦620,000",
    priceValue: 620000,
    image: "https://i.ibb.co/ZRX9FyB0/bridexx-planet-1766477099-3793807340378850297-34446236868.jpg",
    category: "Traditional",
    description: "A vibrant celebration of culture. Rich damask weave with gold thread detailing, tailored to a modern silhouette."
  },
  {
    id: 7,
    name: "The Eternal Grace",
    price: "₦950,000",
    priceValue: 950000,
    image: "https://i.ibb.co/vvq5gSnY/bridexx-planet-1751102901-3664839223543082471-34446236868.jpg",
    category: "Gowns",
    description: "Minimalist yet bold. A silhouette that defines grace, utilizing Italian crepe and a hand-finished neckline."
  },
  {
    id: 8,
    name: "Majestic Bloom Gown",
    price: "₦780,000",
    priceValue: 780000,
    image: "https://i.ibb.co/0V1w35QL/bridexx-planet-1777011295-3882174121455239540-34446236868.jpg",
    category: "Reception",
    description: "A floral-inspired reception gown with 3D applique work and a delicate sweetheart neckline. Modern romance at its finest."
  }
];
