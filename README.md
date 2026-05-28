# Smit Sir Commerce — Premium Commerce Learning Platform

A complete, production-quality education website for Class 11 & 12 CBSE Commerce students.

## Tech Stack
- **React 18** + **Vite** (fast build tool)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (smooth animations)
- **Lucide React** (icons)
- **React Router DOM** (page routing)

## Pages Included
| Page | URL |
|------|-----|
| Home | `/` |
| Courses | `/courses` |
| Video Lectures | `/lectures` |
| Study Material | `/study-material` |
| Quizzes | `/quizzes` |
| Test Series | `/test-series` |
| Live Classes | `/live-classes` |
| Online Batch | `/online-batch` |
| Offline Batch | `/offline-batch` |
| Student Dashboard | `/dashboard` |
| Admin Dashboard | `/admin` |
| Parent Info | `/parent-info` |
| About | `/about` |
| Contact | `/contact` |
| FAQ | `/faq` |

## Setup Instructions

### Step 1 — Install Node.js
Download and install Node.js from: https://nodejs.org
Choose the **LTS** version (recommended).

### Step 2 — Install dependencies
Open a terminal in this folder and run:
```
npm install
```

### Step 3 — Start development server
```
npm run dev
```
Open your browser and go to: **http://localhost:5173**

### Step 4 — Build for production
```
npm run build
```

## Replacing the Teacher Photo
The teacher photo is at: `src/assets/teacher-photo.jpg`
Replace it with your preferred high-quality portrait photo.

## Customization
- **Contact details**: Search for `90000 00000` and replace with real number
- **Social links**: Update Instagram/YouTube URLs in `Footer.jsx`
- **WhatsApp link**: Update the phone number in `WhatsApp` links
- **Fee structure**: Update fee details in `BatchPage.jsx`
- **Location**: Update address in `Contact.jsx` and `Footer.jsx`

## Backend Integration (Future)
All data is structured in `/src/data/` files ready for API replacement:
- `courses.js` — Course and chapter data
- `lectures.js` — Video lecture data
- `studyMaterial.js` — PDF/notes data
- `quizzes.js` — Quiz data
- `testimonials.js` — Student testimonials
- `faqs.js` — FAQ data
