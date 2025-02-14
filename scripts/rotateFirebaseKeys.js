const fs = require('fs');
const path = require('path');

const checkCredentialsAge = () => {
  const serviceAccountPath = path.join(__dirname, '../config/firebase-serviceAccount.json');
  
  try {
    const stats = fs.statSync(serviceAccountPath);
    const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
    
    if (ageInDays > 90) {
      console.warn(`⚠️ WARNING: Firebase service account is ${Math.floor(ageInDays)} days old.`);
      console.warn('Please rotate your credentials for security!');
      console.warn('Visit: https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk');
    }
  } catch (error) {
    console.log('No local service account file found.');
  }
};

checkCredentialsAge(); 