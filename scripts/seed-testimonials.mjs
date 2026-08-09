import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ikasa_renovations";

const testimonials = [
  {
    name: "Aisha Rahman",
    projectType: "Full Kitchen Makeover",
    role: "Homeowner",
    location: "North York",
    quote:
      "Ikasa helped us turn a tired, cramped kitchen into a bright space we actually love cooking in. The consultation was clear, the product guidance was practical, and installation felt well coordinated from start to finish.",
    rating: 5,
    featured: true,
    published: true,
    order: 1,
  },
  {
    name: "Daniel Moretti",
    projectType: "Complete Bathroom Makeover",
    role: "Homeowner",
    location: "Mississauga",
    quote:
      "Our bathroom finally feels like a calm retreat. The vanity, glass enclosure and tile selections all work together, and the team kept us informed about timing and site details throughout the process.",
    rating: 5,
    featured: true,
    published: true,
    order: 2,
  },
  {
    name: "Priya & Jason Chen",
    projectType: "Walk-In Closet",
    role: "Homeowners",
    location: "Markham",
    quote:
      "The walk-in closet is beautifully organised and easy to use every day. Shelving, hanging zones and drawers were planned around how we actually live—not a generic layout.",
    rating: 5,
    featured: true,
    published: true,
    order: 3,
  },
  {
    name: "Michelle Okonkwo",
    projectType: "Custom Kitchen Design",
    role: "Homeowner",
    location: "Etobicoke",
    quote:
      "From layout planning to cabinetry and lighting, everything felt intentional. We appreciated honest conversations about materials and what would work best for our home.",
    rating: 5,
    featured: false,
    published: true,
    order: 4,
  },
  {
    name: "Robert Lang",
    projectType: "Vanities, Showers & Glass",
    role: "Homeowner",
    location: "Scarborough",
    quote:
      "The new vanity and glass shower completely changed the feel of our main bathroom. Clean lines, better storage, and a much more polished finish than we expected.",
    rating: 5,
    featured: false,
    published: true,
    order: 5,
  },
  {
    name: "Sofia Alvarez",
    projectType: "Reach-In Closet",
    role: "Homeowner",
    location: "Richmond Hill",
    quote:
      "Even our smaller reach-in closet now works harder. Adjustable shelves and better hanging space made a simple upgrade feel thoughtfully designed.",
    rating: 5,
    featured: false,
    published: true,
    order: 6,
  },
  {
    name: "Kevin Patel",
    projectType: "Kitchen & Appliance Guidance",
    role: "Homeowner",
    location: "Brampton",
    quote:
      "Appliance placement and product choices were explained clearly before we committed. The finished kitchen feels efficient for family meals and entertaining.",
    rating: 5,
    featured: false,
    published: true,
    order: 7,
  },
  {
    name: "Emily Nguyen",
    projectType: "Bathroom Renovation",
    role: "Homeowner",
    location: "Vaughan",
    quote:
      "Communication was steady and the final walkthrough was thorough. We are very happy with the tiling, fixtures and overall resort-inspired feel of the room.",
    rating: 5,
    featured: false,
    published: true,
    order: 8,
  },
];

await mongoose.connect(uri);
const col = mongoose.connection.db.collection("testimonials");

await col.deleteMany({});
const result = await col.insertMany(
  testimonials.map((t) => ({
    ...t,
    image: "",
    service: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
);

console.log(`Inserted ${result.insertedCount} published testimonials`);
await mongoose.disconnect();
