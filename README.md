# SafeEscape
## Key Features.

### Essential Functionalities
1. **Real-Time Alerts**
   - Integrates with IMD (Indian Meteorological Department) and NDMA (National Disaster Management Authority) APIs for earthquake, cyclone, flood, and extreme weather alerts.
   - Push notifications in multiple languages (Hindi, English, regional languages).

2. **Evacuation Routes & Shelters**
   - GPS-based mapping of nearest shelters, hospitals, and police stations using Google Maps API.
   - Offline mode for areas with limited connectivity.

3. **First Aid & Emergency Procedures**
   - Offline-accessible step-by-step first aid guides (e.g., CPR, bleeding control).
   - AI chatbot for quick emergency responses.

4. **SOS & Emergency Contacts**
   - One-tap SOS button to notify emergency contacts and authorities.
   - Integration with 112 India Emergency Helpline.

5. **Community Reporting & Help Requests**
   - Users can report incidents (fires, landslides, accidents) with images/videos.
   - Crowdsource help requests & volunteer coordination.

## Tech Stack & Development Approach
- **Frontend:** React Native (for cross-platform Android & iOS support).
- **Backend:** Firebase / Node.js with MongoDB for real-time database.
- **APIs & Integrations:** Google Maps API, IMD/NDMA data, Twilio for SMS alerts.
- **AI/ML:** Chatbot for first aid guidance, NLP for multilingual support.

# SafeEscape Backend

## Configuration Setup

### Development Setup
1. Download service account JSON from Firebase Console
2. Place it in `config/firebase-serviceAccount.json`
3. Create `.env` file from `.env.example`
4. Install dependencies: `npm install`
5. Run development server: `npm run dev`

### Production Setup
1. Set all environment variables in your deployment platform
2. Ensure Firebase service account is properly configured
3. Run production server: `npm start`

### Security Best Practices
- Rotate service account keys every 90 days
- Use restricted service accounts with minimal permissions
- Monitor Firebase Security Rules
- Keep credentials secure and never commit them

## Available Scripts
- `npm start`: Run the production server
- `npm run dev`: Run development server with nodemon
- `npm run check-credentials`: Check Firebase credentials age
