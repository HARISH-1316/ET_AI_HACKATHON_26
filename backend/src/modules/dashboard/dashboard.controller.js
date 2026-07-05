// ============================================================
// ISIP — Dashboard Controller
// ============================================================

import dashboardService from './dashboard.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

class DashboardController {
  getKPIs = asyncHandler(async (req, res) => {
    const kpis = await dashboardService.getKPIs();
    ApiResponse.ok(res, 'Dashboard KPIs retrieved', kpis);
  });
}

export default new DashboardController();
