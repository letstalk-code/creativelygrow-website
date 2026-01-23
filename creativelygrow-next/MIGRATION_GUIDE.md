# Migration & Setup Guide

The `creativelygrow-next` project has been fully generated. Follow these steps to launch it.

## 1. Install Dependencies
Open your terminal in the `creativelygrow-next` folder and run:
```bash
cd /Users/labiffilmhouse/Desktop2/creativelygrow-clone/creativelygrow-next
npm install
```

## 2. Copy Assets
The project needs the images and logos from your original site. Run this command to copy them:
```bash
cp -r ../assets ./public/
```

## 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3005](http://localhost:3005) to see your new site.

## 4. Test the AI Analyzer
1. Scroll down to the "Instant AI Website Analysis" section (below Services).
2. Enter a URL (e.g., `https://google.com` or your own).
3. Enter Name/Email.
4. Click "Analyze My Website".
5. See the AI-generated report!

## Notes for Future Development
- **PageSpeed API:** Currently, we are mocking the PageSpeed scores because a Google API key wasn't provided (and they are complex to set up). To add real scores later, get a key from Google Cloud Console and update `app/api/analyze/route.ts`.
- **Email Storage:** Currently, the leads (Name, Email) are just processed for the report. You will likely want to save them to a database (Supabase/Firebase) or send them to GoHighLevel via webhook in `app/api/analyze/route.ts`.
