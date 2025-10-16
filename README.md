# Café Companion - Study Café Review Platform

A beautiful, cozy café review platform focused on helping people find the perfect study and work spots.

## Project Overview

Café Companion is a feed-first review site that helps users discover cafés ideal for studying and working. The MVP features a clean, responsive interface with warm coffee-shop aesthetics.

## Current Features (Homepage MVP)

- **Interactive Feed**: Browse reviews of study-friendly cafés
- **Smart Search**: Filter cafés by name in real-time
- **Review Cards**: Quick-view attributes (noise, Wi-Fi, outlets, laptop-friendly, ambience)
- **Detailed View**: Full review modal with Google Maps integration
- **Submit Reviews**: Easy-to-use form with validation
- **Save Cafés**: Save favorites to localStorage (Supabase integration planned)
- **Responsive Design**: Mobile-first layout with elegant desktop experience

## Design System

- **Colors**: Warm café palette with cream backgrounds (#FBF6F0), coffee brown accent (#6B4F3A)
- **Typography**: Playfair Display for headings, Inter for body text
- **Style**: Rounded corners (2xl), soft shadows, subtle gradients

## Tech Stack

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **Storage**: localStorage (temporary - Supabase planned)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Placeholder Pages

The following pages are currently placeholders and will be fully implemented in the next development phase:

- **Saved Page** (`SavedPagePlaceholder`): Shows preview of saved cafés
- **Account Page** (`AccountPagePlaceholder`): User preferences and data export

## Next Steps

### To continue development, run Lovable with this prompt:

**"Generate full Saved and Account pages for Café Companion"**

This will:
- Create a complete Saved page with filtering and sorting
- Build a full Account page with user settings
- Maintain the current design system and warm aesthetic

## Future Integrations

### Supabase Integration (Planned)

Currently using localStorage for data persistence. To integrate Supabase:

1. Enable Lovable Cloud in project settings
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Replace localStorage calls with Supabase queries:
   - Reviews → `reviews` table
   - Saved cafés → `saved_cafes` table with user relationships
   - User authentication for personalized experiences

### Planned Features

- Image upload for café photos
- User authentication and profiles
- Social features (like, comment on reviews)
- Advanced filtering (by attributes, location)
- Map view of nearby cafés
- Opening hours tracking
- Food/service ratings

## Code Structure

```
src/
├── components/
│   ├── NavBar.tsx              # Top navigation with search
│   ├── ReviewCard.tsx          # Individual review in feed
│   ├── ReviewModal.tsx         # Detailed review view
│   ├── SubmitReviewModal.tsx   # Add new review form
│   ├── StarRating.tsx          # Interactive star rating
│   ├── Toast.tsx               # Notification component
│   ├── SavedPagePlaceholder.tsx
│   └── AccountPagePlaceholder.tsx
├── data/
│   └── seedReviews.ts          # Sample review data
├── types/
│   └── review.ts               # TypeScript interfaces
└── pages/
    └── Index.tsx               # Main homepage
```

## Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Semantic HTML
- Focus management in modals
- Screen reader friendly

## Contributing

This is a Lovable-generated project. To make changes:
1. Use the Lovable editor for AI-assisted development
2. Or clone and edit locally, then push changes back

## License

Created with [Lovable](https://lovable.dev)
