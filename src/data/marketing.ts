export const testimonials = [
  {
    name: "Sarah M.",
    location: "Vancouver, BC",
    quote:
      "Our golden retriever from Sekhon Kennel is the sweetest addition to our family. The care and attention they put into raising their puppies really shows!",
  },
  {
    name: "James & Linda K.",
    location: "Surrey, BC",
    quote:
      "Professional, caring, and truly passionate about their dogs. We couldn't be happier with our new furry family member.",
  },
  {
    name: "The Patel Family",
    location: "Burnaby, BC",
    quote:
      "From our first visit to bringing our puppy home, the Sekhon family made the whole experience wonderful. Highly recommend!",
  },
];

const CORE_VACCINATIONS = ["Distemper", "Parvovirus", "Rabies"];

export const availableDogs = [
  {
    id: "max",
    name: "Max",
    breed: "Golden Retriever",
    dateOfBirth: new Date("2024-10-31"),
    gender: "male" as const,
    color: "Golden",
    size: "large" as const,
    weight: 12,
    status: "Available" as const,
    price: 2500,
    microchipped: true,
    health: {
      vaccinations: CORE_VACCINATIONS,
      dewormings: 2,
      vetChecked: true,
    },
    description:
      "Max is a playful and affectionate Golden Retriever who loves cuddles and outdoor adventures. He's great with kids and other pets, and has a gentle, eager-to-please temperament that makes him perfect for families.",
    images: ["/images/hero-puppies.png", "/images/hero-puppies.png", "/images/hero-puppies.png"],
  },
  {
    id: "bella",
    name: "Bella",
    breed: "Labrador",
    dateOfBirth: new Date("2024-10-17"),
    gender: "female" as const,
    color: "Chocolate",
    size: "large" as const,
    weight: 14,
    status: "Available" as const,
    price: 2200,
    microchipped: true,
    health: {
      vaccinations: CORE_VACCINATIONS,
      dewormings: 3,
      vetChecked: true,
    },
    description:
      "Bella is a sweet and energetic Chocolate Lab with a beautiful coat and loving personality. She's intelligent, easy to train, and loves water. Perfect for an active family looking for a loyal companion.",
    images: ["/images/hero-puppies.png", "/images/hero-puppies.png", "/images/hero-puppies.png"],
  },
  {
    id: "rocky",
    name: "Rocky",
    breed: "German Shepherd",
    dateOfBirth: new Date("2024-10-03"),
    gender: "male" as const,
    color: "Black & Tan",
    size: "large" as const,
    weight: 18,
    status: "Reserved" as const,
    price: 2800,
    microchipped: true,
    health: {
      vaccinations: [...CORE_VACCINATIONS, "Bordetella"],
      dewormings: 3,
      vetChecked: true,
    },
    description:
      "Rocky is a confident and alert German Shepherd with excellent structure and temperament. He's loyal, protective, and highly trainable. His parents are both health-tested with excellent pedigrees.",
    images: ["/images/hero-puppies.png", "/images/hero-puppies.png", "/images/hero-puppies.png"],
  },
];


