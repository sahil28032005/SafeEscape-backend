const express = require("express");
const { 
    addDisasterReport, 
    getDisasterReports,
    getDisasterReport,
    updateDisasterReport 
} = require("../controllers/emergencyController");

const router = express.Router();

router.post("/report", addDisasterReport);
router.get("/reports", getDisasterReports);
router.get("/report/:id", getDisasterReport);
router.put("/report/:id", updateDisasterReport);

module.exports = router; 