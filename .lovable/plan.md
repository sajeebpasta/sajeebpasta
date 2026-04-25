

## National Bull Sales Landing Page

### Overview
A single-page landing site for bulk pasta/noodle sales with Bengali content, featuring the uploaded Sajeeb Group branding.

### Structure

**1. Header/Hero Section**
- Background: uploaded store image (image.png) with dark overlay
- Sajeeb Group logo (image-2.png) top-left
- Title: "National Bull Sales"
- Bengali subtitle with bulk order details
- Two CTA buttons: "বাল্ক কোটেশন নিন" and "হোয়াটসঅ্যাপে যোগাযোগ" (opens WhatsApp to 01711763315)

**2. Products Section — "Pasta Shapes and Sizes"**
- Grid of product cards with placeholder pasta images, name, size, details
- Initially show 4 items; "আরও দেখুন" button loads 6 more at a time
- Each card has a quantity input box and "Add to Cart" button
- Cart state managed with React state (no backend)

**3. Contact Us Section**
- Phone: 01711763315
- Clean card layout

**4. Bulk Quotation Form (বাল্ক কোটেশন)**
- Fields: নাম, ফোন, ব্যবসার ধরন (dropdown: খুচরা বিক্রেতা, পাইকারি ব্যবসায়ী, পরিবেশক, ইভেন্ট ক্রেতা), বার্তা
- Submit opens WhatsApp with pre-filled message including cart items + form data

**5. Footer**
- Email: info@sajeebgroup.com.bd
- Address: Shezan Point (Level 6), 2 Indira Road, Farmgate, Dhaka 1215, Bangladesh
- Facebook link
- Sajeeb Group logo

### Technical Plan
- Copy both uploaded images into `src/assets/`
- Replace `Index.tsx` with the full landing page (single component or split into sub-components)
- Use placeholder images for pasta products (Unsplash URLs or colored boxes)
- All text in Bengali as specified
- WhatsApp link format: `https://wa.me/8801711763315?text=...`
- Modern & clean design with white background, red accent (matching Sajeeb brand colors)

### Files to Create/Modify
- `src/assets/hero-bg.png` — copy from uploaded image.png
- `src/assets/logo.png` — copy from uploaded image-2.png
- `src/pages/Index.tsx` — full landing page
- `src/index.css` — update CSS variables (red/white brand theme)
- `index.html` — update title to "National Bull Sales"

