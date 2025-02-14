const DisasterReport = require("../models/DisasterReport");

exports.addDisasterReport = async (req, res) => {
    try {
        const reportData = req.body;
        const newReport = await DisasterReport.create(reportData);
        res.status(201).json({
            success: true,
            data: newReport
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getDisasterReports = async (req, res) => {
    try {
        const reports = await DisasterReport.getAll();
        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getDisasterReport = async (req, res) => {
    try {
        const report = await DisasterReport.getById(req.params.id);
        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateDisasterReport = async (req, res) => {
    try {
        const updatedReport = await DisasterReport.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: updatedReport
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 