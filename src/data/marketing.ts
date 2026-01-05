export type Testimonial = {
  name: string;
  location: string;
  quote: string;
};

export const testimonials: Array<Testimonial> = [
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
