const axios = require('axios');

const openFemaService = {
    async getDisasterDeclarations(options = {}) {
        try {
            const params = {
                $orderby: 'declarationDate desc',
                $top: options.limit || 100,
                ...options.state && { $filter: `state eq '${options.state}'` }
            };

            const response = await axios.get('https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries', { params });
            
            const formattedData = response.data.DisasterDeclarationsSummaries.map(disaster => ({
                title: disaster.declarationTitle,
                type: {
                    incident: disaster.incidentType,
                    declaration: disaster.declarationType,
                    tribal: disaster.tribalRequest ? 'Yes' : 'No'
                },
                location: {
                    state: disaster.state,
                    area: disaster.designatedArea,
                    region: disaster.region,
                    fipsData: {
                        state: disaster.fipsStateCode,
                        county: disaster.fipsCountyCode,
                        place: disaster.placeCode
                    }
                },
                dates: {
                    declared: new Date(disaster.declarationDate).toLocaleDateString(),
                    started: new Date(disaster.incidentBeginDate).toLocaleDateString(),
                    ended: disaster.incidentEndDate ? new Date(disaster.incidentEndDate).toLocaleDateString() : 'Ongoing',
                    closeout: disaster.disasterCloseoutDate ? new Date(disaster.disasterCloseoutDate).toLocaleDateString() : 'Active',
                    lastRefresh: new Date(disaster.lastRefresh).toLocaleString()
                },
                programs: {
                    publicAssistance: disaster.paProgramDeclared ? 'Yes' : 'No',
                    hazardMitigation: disaster.hmProgramDeclared ? 'Yes' : 'No',
                    individualAssistance: disaster.iaProgramDeclared ? 'Yes' : 'No',
                    individualHousehold: disaster.ihProgramDeclared ? 'Yes' : 'No'
                },
                reference: {
                    disasterNumber: disaster.disasterNumber,
                    declarationString: disaster.femaDeclarationString,
                    requestNumber: disaster.declarationRequestNumber,
                    incidentId: disaster.incidentId,
                    fiscalYear: disaster.fyDeclared
                },
                filingDeadline: disaster.lastIAFilingDate ? new Date(disaster.lastIAFilingDate).toLocaleDateString() : 'Not Applicable',
                designatedIncidentTypes: disaster.designatedIncidentTypes || 'Not Specified',
                hash: disaster.hash,
                id: disaster.id
            }));

            // Calculate summary statistics
            const summary = {
                total: formattedData.length,
                byState: {},
                byIncidentType: {},
                byProgram: {
                    publicAssistance: 0,
                    hazardMitigation: 0,
                    individualAssistance: 0,
                    individualHousehold: 0
                },
                activeIncidents: 0
            };

            formattedData.forEach(disaster => {
                summary.byState[disaster.location.state] = (summary.byState[disaster.location.state] || 0) + 1;
                summary.byIncidentType[disaster.type.incident] = (summary.byIncidentType[disaster.type.incident] || 0) + 1;
                
                if (disaster.programs.publicAssistance === 'Yes') summary.byProgram.publicAssistance++;
                if (disaster.programs.hazardMitigation === 'Yes') summary.byProgram.hazardMitigation++;
                if (disaster.programs.individualAssistance === 'Yes') summary.byProgram.individualAssistance++;
                if (disaster.programs.individualHousehold === 'Yes') summary.byProgram.individualHousehold++;
                
                if (disaster.dates.closeout === 'Active') summary.activeIncidents++;
            });

            // Return standardized response format
            return {
                success: true,
                timestamp: new Date().toISOString(),
                metadata: {
                    source: 'FEMA Disaster Declarations API',
                    endpoint: 'DisasterDeclarationsSummaries',
                    queryParameters: params,
                    resultCount: formattedData.length
                },
                summary: {
                    ...summary,
                    byState: Object.entries(summary.byState)
                        .sort(([,a], [,b]) => b - a)
                        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}),
                    byIncidentType: Object.entries(summary.byIncidentType)
                        .sort(([,a], [,b]) => b - a)
                        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
                },
                data: {
                    declarations: formattedData
                }
            };
        } catch (error) {
            console.error('Error fetching OpenFEMA disaster declarations:', error);
            return {
                success: false,
                timestamp: new Date().toISOString(),
                error: {
                    message: error.message,
                    code: error.response?.status || 500,
                    details: error.response?.data || 'Internal server error'
                }
            };
        }
    }
};

module.exports = openFemaService;