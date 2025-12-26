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
    description: "Max is a playful and affectionate Golden Retriever.",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1591769225440-811ad7d63ca2?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=800",
    ],
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
    description: "Bella is a sweet and energetic Labrador.",
    images: [
      "https://images.unsplash.com/photo-1553736026-ff14d1f8d7b9?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1591160674255-fc339bba18aa?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?auto=format&fit=crop&w=800",
    ],
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
    description: "Rocky is a confident and alert German Shepherd.",
    images: [
      "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1568393691622-c7bd13bbc252?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1628922716723-3f396cef04b0?auto=format&fit=crop&w=800",
    ],
  },

  {
    id: "luna",
    name: "Luna",
    breed: "Husky",
    dateOfBirth: new Date("2024-09-15"),
    gender: "female" as const,
    color: "Black & White",
    size: "medium" as const,
    weight: 15,
    status: "Available" as const,
    price: 2300,
    microchipped: true,
    health: {
      vaccinations: CORE_VACCINATIONS,
      dewormings: 3,
      vetChecked: true,
    },
    description: "Luna is a friendly Husky with striking eyes.",
    images: [
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1605568427561-421aac44f259?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800",
    ],
  },

  {
    id: "cooper",
    name: "Cooper",
    breed: "Beagle",
    dateOfBirth: new Date("2024-11-01"),
    gender: "male" as const,
    color: "Tri-color",
    size: "medium" as const,
    weight: 8,
    status: "Available" as const,
    price: 2000,
    microchipped: true,
    health: {
      vaccinations: ["Distemper", "Parvovirus"],
      dewormings: 2,
      vetChecked: true,
    },
    description: "Cooper is a happy and curious Beagle puppy.",
    images: [
      "https://images.unsplash.com/photo-1537151625747-7ae78dc59585?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1541364983171-a8ba01d95cfc?auto=format&fit=crop&w=800",
    ],
  },

  {
    id: "daisy",
    name: "Daisy",
    breed: "Poodle",
    dateOfBirth: new Date("2024-10-20"),
    gender: "female" as const,
    color: "Apricot",
    size: "medium" as const,
    weight: 10,
    status: "Available" as const,
    price: 2600,
    microchipped: true,
    health: {
      vaccinations: CORE_VACCINATIONS,
      dewormings: 2,
      vetChecked: true,
    },
    description: "Daisy is a smart and elegant Poodle.",
    images: [
      "https://images.unsplash.com/photo-1591384387119-073c7f24b0ec?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1506755855567-92ff770e8d30?auto=format&fit=crop&w=800",
    ],
  },

  {
    id: "bear",
    name: "Bear",
    breed: "Bernese Mountain Dog",
    dateOfBirth: new Date("2024-09-01"),
    gender: "male" as const,
    color: "Tri-color",
    size: "large" as const,
    weight: 25,
    status: "Available" as const,
    price: 3000,
    microchipped: true,
    health: {
      vaccinations: CORE_VACCINATIONS,
      dewormings: 4,
      vetChecked: true,
    },
    description: "Bear is a calm and affectionate puppy.",
    images: [
      "https://images.unsplash.com/photo-1589924691106-073b19565b0c?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1612774412771-005ed8e861d2?auto=format&fit=crop&w=800",
      "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800",
    ],
  },
];
