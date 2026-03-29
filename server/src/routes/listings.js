const express = require('express');
const supabase = require('../lib/supabaseAdmin');
const requireAuth = require('../middleware/auth');
const { createListingSchema, updateListingSchema } = require('../schemas/listingSchema');

const router = express.Router();

// ── GET /api/listings (public) ──────────────────────────────────────
router.get('/', async (req, res) => {
  const { region, category, q, page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));
  const from = (pageNum - 1) * limitNum;

  try {
    // Look up region and category IDs if filters are provided
    let regionId = null;
    let categoryId = null;

    if (region) {
      const { data: regionData } = await supabase
        .from('regions')
        .select('id')
        .eq('name', region)
        .single();
      regionId = regionData?.id;
    }

    if (category) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .single();
      categoryId = categoryData?.id;
    }

    let query = supabase
      .from('listings')
      .select(`*, regions(name), categories(name)`)
      .order('created_at', { ascending: false })
      .range(from, from + limitNum - 1);

    if (regionId) query = query.eq('region_id', regionId);
    if (categoryId) query = query.eq('category_id', categoryId);
    if (q) query = query.ilike('title', `%${q}%`);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// ── GET /api/listings/:id (public) ──────────────────────────────────
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('listings')
    .select(`*, regions(name), categories(name)`)
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

// ── POST /api/listings (auth required) ──────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const parsed = createListingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  // Resolve region/category names to IDs
  const [{ data: region }, { data: category }] = await Promise.all([
    supabase.from('regions').select('id').eq('name', parsed.data.region).single(),
    supabase.from('categories').select('id').eq('name', parsed.data.category).single(),
  ]);

  if (!region || !category) {
    return res.status(400).json({ error: 'Invalid region or category' });
  }

  // Extract only the fields that exist in the database
  const { region: _region, category: _category, ...listingData } = parsed.data;

  const { data, error } = await supabase
    .from('listings')
    .insert({ 
      ...listingData, 
      user_id: req.userId, 
      region_id: region.id, 
      category_id: category.id 
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ── PUT /api/listings/:id (owner only) ──────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  const parsed = updateListingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  // Ownership check
  const { data: existing } = await supabase
    .from('listings').select('user_id').eq('id', req.params.id).single();

  if (!existing || existing.user_id !== req.userId)
    return res.status(403).json({ error: 'Forbidden' });

  let updateData = { ...parsed.data };

  // Resolve region/category if provided
  if (updateData.region) {
    const { data: region } = await supabase.from('regions').select('id').eq('name', updateData.region).single();
    if (region) updateData.region_id = region.id;
    delete updateData.region;
  }
  if (updateData.category) {
    const { data: category } = await supabase.from('categories').select('id').eq('name', updateData.category).single();
    if (category) updateData.category_id = category.id;
    delete updateData.category;
  }

  const { data, error } = await supabase
    .from('listings').update(updateData).eq('id', req.params.id).select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── DELETE /api/listings/:id (owner only) ───────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  const { data: existing } = await supabase
    .from('listings').select('user_id, image_url').eq('id', req.params.id).single();

  if (!existing || existing.user_id !== req.userId)
    return res.status(403).json({ error: 'Forbidden' });

  // Delete image from storage if present
  if (existing.image_url) {
    const path = existing.image_url.split('/listing-images/')[1];
    if (path) {
      await supabase.storage.from('listing-images').remove([path]);
    }
  }

  await supabase.from('listings').delete().eq('id', req.params.id);
  res.status(204).send();
});

module.exports = router;
