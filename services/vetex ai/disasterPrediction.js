const { VertexAI } = require('@google-cloud/vertexai');
const path = require('path'); // Add this import
const openWeatherService = require('../alertServices/openWeatherService');
const usgsEarthquakeService = require('../alertServices/usgsEarthquakeService');
require('dotenv').config();

// Update the path resolution to use proper path joining
const vertexai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.VERTEX_AI_LOCATION,
  credentials: require(path.join(__dirname, '../../', process.env.VERTEX_AI_CREDENTIALS))
});

// Fix variable name here too
const predictionModel = vertexai.getGenerativeModel({
  model: 'gemini-pro',
  generation_config: {
    max_output_tokens: 1024,
    temperature: 0.2,
    top_p: 0.95,
    top_k: 40
  }
});

// Mock historical data by region (in production, this would come from a database)
const historicalDisasterData = {
  'Delhi': [
    { disaster_type: "flood", occurrence: 8, avg_severity: 3.2, months: "Jul-Sep" },
    { disaster_type: "heatwave", occurrence: 15, avg_severity: 4.1, months: "Apr-Jun" },
    { disaster_type: "air_pollution", occurrence: 25, avg_severity: 4.5, months: "Oct-Feb" }
  ],
  'Mumbai': [
    { disaster_type: "flood", occurrence: 18, avg_severity: 4.3, months: "Jun-Sep" },
    { disaster_type: "cyclone", occurrence: 6, avg_severity: 3.8, months: "May-Jun, Oct-Nov" },
    { disaster_type: "landslide", occurrence: 4, avg_severity: 3.5, months: "Jul-Aug" }
  ],
  'Chennai': [
    { disaster_type: "flood", occurrence: 12, avg_severity: 4.0, months: "Oct-Dec" },
    { disaster_type: "cyclone", occurrence: 8, avg_severity: 3.9, months: "Oct-Dec" },
    { disaster_type: "drought", occurrence: 5, avg_severity: 3.2, months: "Mar-Jun" }
  ],
  'Kolkata': [
    { disaster_type: "flood", occurrence: 14, avg_severity: 3.7, months: "Jun-Sep" },
    { disaster_type: "cyclone", occurrence: 10, avg_severity: 4.2, months: "Apr-Jun, Oct-Nov" },
    { disaster_type: "heatwave", occurrence: 7, avg_severity: 3.5, months: "Apr-Jun" }
  ],
  'default': [
    { disaster_type: "flood", occurrence: 10, avg_severity: 3.5, months: "Jun-Sep" },
    { disaster_type: "earthquake", occurrence: 3, avg_severity: 2.8, months: "Any" },
    { disaster_type: "heatwave", occurrence: 8, avg_severity: 3.2, months: "Apr-Jun" }
  ]
};

const disasterPredictionService = {
  async getCurrentConditions(location) {
    try {
      // Get weather data
      const weatherData = await openWeatherService.getWeatherData(location.coordinates);
      
      // Get earthquake data
      const earthquakeData = await usgsEarthquakeService.getRecentEarthquakes(
        location.coordinates.latitude,
        location.coordinates.longitude
      );

      return {
        weather: weatherData,
        earthquakes: earthquakeData,
        timestamp: new Date().toISOString(),
        location: location
      };
    } catch (error) {
      console.error('Error fetching current conditions:', error);
      throw error;
    }
  },
  async getPredictiveAnalysis(location) {
    try {
      console.log('Generating predictive analysis for:', location);
      
      // Validate location data
      if (!location || !location.city) {
        throw new Error('Invalid location data');
      }

      // Get historical disaster data
      const historicalData = historicalDisasterData[location.city] || historicalDisasterData['default'];
      
      // Get current environmental conditions with better error handling
      let currentConditions;
      try {
        currentConditions = await this.getCurrentConditions(location);
      } catch (error) {
        console.error('Error getting current conditions:', error);
        currentConditions = this.getDefaultConditions(location);
      }

      // Create prompt for predictive analysis
      const prompt = `
        Based on historical disaster data and current environmental conditions, 
        analyze the potential disaster risks for ${location.city || 'Unknown'}, ${location.state || 'Unknown'}, India.
        
        Historical disaster data:
        ${JSON.stringify(historicalData, null, 2)}
        
        Current conditions:
        ${JSON.stringify(currentConditions, null, 2)}
        
        Current month: ${new Date().toLocaleString('en-US', { month: 'long' })}
        
        Provide a risk assessment with the following:
        1. Top 3 potential disaster risks in the next 72 hours
        2. Risk level for each (Low, Medium, High, Extreme)
        3. Key indicators supporting this assessment
        4. Recommended precautionary measures
        
        Format your response as JSON with this structure:
        {
          "risks": [
            {
              "disasterType": "type of disaster",
              "riskLevel": "Low/Medium/High/Extreme",
              "indicators": ["indicator1", "indicator2"],
              "precautions": ["precaution1", "precaution2"]
            }
          ],
          "overallRiskLevel": "Low/Medium/High/Extreme",
          "validityPeriod": "72 hours from now"
        }
      `
      
      // Get prediction from AI model
      const result = await predictionModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      
      const prediction = result.response.candidates[0].content.parts[0].text;
      
      return {
        timestamp: new Date().toISOString(),
        location: location,
        historicalData: historicalData,
        currentConditions: currentConditions,
        prediction: JSON.parse(prediction)
      };
    } catch (error) {
      console.error('Error in predictive analysis:', error);
      return this.getFallbackPrediction(location);
    }
  },

  getDefaultConditions(location) {
    return {
      weather: {
        main: { temp: 25, humidity: 50 },
        wind: { speed: 10 },
        weather: [{ main: 'Clear', description: 'clear sky' }]
      },
      earthquakes: [],
      timestamp: new Date().toISOString(),
      location: {
        ...location,
        coordinates: location.coordinates || {
          latitude: null,
          longitude: null
        }
      }
    };
  },

  getFallbackPrediction(location) {
    const cityData = historicalDisasterData[location.city] || historicalDisasterData['default'];
    const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
    
    const relevantDisasters = cityData.filter(d => 
      d.months.includes(currentMonth) || d.months.includes('Any')
    ).slice(0, 3);

    return {
      timestamp: new Date().toISOString(),
      location: location,
      risks: relevantDisasters.map(d => ({
        disasterType: d.disaster_type,
        riskLevel: d.avg_severity >= 4 ? "High" : d.avg_severity >= 3 ? "Medium" : "Low",
        indicators: [
          `Historical occurrence: ${d.occurrence} times`,
          `Average severity: ${d.avg_severity}`,
          `Typical season: ${d.months}`
        ],
        precautions: this.getDefaultPrecautions(d.disaster_type)
      })),
      overallRiskLevel: "Medium",
      validityPeriod: "72 hours from now"
    };
  },

  getDefaultPrecautions(disasterType) {
    const precautions = {
      flood: ["Move to higher ground", "Avoid flood waters", "Keep emergency supplies ready"],
      cyclone: ["Stay indoors", "Secure loose objects", "Follow evacuation orders"],
      earthquake: ["Drop, cover, hold", "Stay away from windows", "Be prepared for aftershocks"],
      heatwave: ["Stay hydrated", "Avoid outdoor activities", "Check on vulnerable people"],
      landslide: ["Evacuate if advised", "Watch for signs", "Stay alert for warnings"],
      "air_pollution": ["Use masks", "Stay indoors", "Use air purifiers"],
      drought: ["Conserve water", "Follow restrictions", "Monitor updates"]
    };
    return precautions[disasterType] || ["Stay alert", "Follow official guidance", "Keep emergency kit ready"];
  }
};

module.exports = disasterPredictionService;