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

export const availableDogs = [
  {
    id: "max",
    name: "Max",
    breed: "Golden Retriever",
    dateOfBirth: new Date("2024-10-31"),
    gender: "male" as const,
    color: "Golden",
    status: "Available" as const,
    image: "/images/hero-puppies.png",
  },
  {
    id: "bella",
    name: "Bella",
    breed: "Labrador",
    dateOfBirth: new Date("2024-10-17"),
    gender: "female" as const,
    color: "Chocolate",
    status: "Available" as const,
    image: "/images/hero-puppies.png",
  },
  {
    id: "rocky",
    name: "Rocky",
    breed: "German Shepherd",
    dateOfBirth: new Date("2024-10-03"),
    gender: "male" as const,
    color: "Black & Tan",
    status: "Reserved" as const,
    image: "/images/hero-puppies.png",
  },
];

