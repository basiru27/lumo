const { z } = require('zod');

const GAMBIAN_REGIONS = [
  'Banjul','Kanifing','Brikama','Mansakonko',
  'Kerewan','Kuntaur','Janjanbureh','Basse'
];

const CATEGORIES = [
  'Electronics','Vehicles','Property','Fashion & Clothing',
  'Food & Agriculture','Services','Jobs','Other'
];

exports.createListingSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  price: z.number().min(0),
  region: z.enum(GAMBIAN_REGIONS),
  category: z.enum(CATEGORIES),
  contact: z.string().min(5).max(100),
  image_url: z.string().url().optional(),
});

exports.updateListingSchema = exports.createListingSchema.partial();
