import { dashboardData } from "../services/dashboardServices.js";

export async function getDashboardData (req, res) {
    try {
        const user_id = req.params.id;
        const dashboard = await dashboardData(user_id);
        if (!dashboard)
            return res.status(404).json({success: false, message: "Could not load dashboard."});
        res.status(200).json({success: true, data: dashboard});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
    }
};