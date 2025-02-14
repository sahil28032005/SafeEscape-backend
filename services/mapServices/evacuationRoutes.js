const googleMapsService = require('../googleMapsService');

class EvacuationRouteService {
  async calculateEvacuationRoute(userLocation, disasterType) {
    try {
      // Find nearest safe zones
      const safeZones = await this.findSafeZones(userLocation, disasterType);
      
      // Get routes to each safe zone
      const routes = await Promise.all(
        safeZones.map(zone => 
          googleMapsService.getDirections(userLocation, zone.location)
        )
      );

      // Select the optimal route
      return this.selectOptimalRoute(routes);
    } catch (error) {
      throw new Error('Failed to calculate evacuation route: ' + error.message);
    }
  }

  async findSafeZones(location, disasterType) {
    // Implementation based on disaster type
    const radius = this.getSearchRadius(disasterType);
    const placeType = this.getSafeZoneType(disasterType);
    
    return await googleMapsService.findNearbyPlaces(location, radius, placeType);
  }

  getSearchRadius(disasterType) {
    // Define radius based on disaster type
    const radiusMap = {
      'flood': 5000,
      'fire': 10000,
      'earthquake': 15000,
    };
    return radiusMap[disasterType] || 5000;
  }

  selectOptimalRoute(routes) {
    // Implementation for selecting the best route
    return routes.reduce((best, current) => 
      current.duration < best.duration ? current : best
    );
  }
}

module.exports = new EvacuationRouteService();