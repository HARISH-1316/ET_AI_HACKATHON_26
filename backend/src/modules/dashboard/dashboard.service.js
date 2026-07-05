// ============================================================
// ISIP — Dashboard Service
// ============================================================

import prisma from '../../config/database.js';

class DashboardService {
  async getKPIs() {
    const [
      totalWorkers,
      activeWorkers,
      totalSensors,
      onlineSensors,
      activePermits,
      criticalAlerts,
      warningAlerts,
      zones,
    ] = await Promise.all([
      prisma.worker.count(),
      prisma.worker.count({ where: { status: 'ACTIVE' } }),
      prisma.sensor.count(),
      prisma.sensor.count({ where: { status: 'ONLINE' } }),
      prisma.permit.count({ where: { status: 'ACTIVE' } }),
      prisma.alert.count({ where: { severity: 'CRITICAL', acknowledged: false } }),
      prisma.alert.count({ where: { severity: 'WARNING', acknowledged: false } }),
      prisma.zone.findMany({
        select: { id: true, name: true, riskLevel: true },
      }),
    ]);

    // Calculate composite scores
    const sensorHealthRatio = totalSensors > 0 ? onlineSensors / totalSensors : 1;
    const alertPenalty = (criticalAlerts * 5 + warningAlerts * 2);
    const plantHealth = Math.max(0, Math.min(100, Math.round(sensorHealthRatio * 100 - alertPenalty)));
    const riskScore = Math.min(100, criticalAlerts * 15 + warningAlerts * 8);

    return {
      plantHealth,
      riskScore,
      activeWorkers,
      totalWorkers,
      sensorsOnline: onlineSensors,
      sensorsTotal: totalSensors,
      activePermits,
      criticalAlerts,
      warningAlerts,
      zones,
    };
  }
}

export default new DashboardService();
