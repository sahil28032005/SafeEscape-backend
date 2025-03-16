require('dotenv').config();
const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.VERTEX_AI_LOCATION || 'us-central1',
});

async function testVertexAI() {
  console.log('🧪 TESTING VERTEX AI BASIC FUNCTIONALITY 🧪');
  console.log('===========================================');
  console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
  console.log('Location:', process.env.VERTEX_AI_LOCATION || 'us-central1');
  console.log('===========================================\n');

  try {
    // Test with Gemini Pro model
    const model = vertexAI.getGenerativeModel({
      model: 'gemini-pro',
    });
    
    console.log('Sending test prompt to Gemini Pro...');
    
    const result = await model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [{ text: 'What should I do during a flood emergency? Provide 3 key steps.' }] 
      }],
    });
    
    console.log('\n✅ RESPONSE FROM GEMINI PRO:');
    console.log('----------------------------');
    console.log(result.response.candidates[0].content.parts[0].text);
    console.log('----------------------------');
    console.log('\n✅ TEST COMPLETED SUCCESSFULLY');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    
    if (error.message.includes('not allowed to use')) {
      console.log('\n🔧 TROUBLESHOOTING TIPS:');
      console.log('1. Make sure you have enabled the Vertex AI API in Google Cloud Console');
      console.log('2. Ensure your project has billing enabled');
      console.log('3. Verify that your service account has the "Vertex AI User" role');
      console.log('4. Check if Gemini API is available in your region (us-central1 is recommended)');
    }
  }
}

// Run the test
testVertexAI(); 