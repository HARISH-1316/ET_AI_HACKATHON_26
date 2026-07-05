// ============================================================
// ISIP — Database Seed Script
// Populates the database with default mock data matching frontend
// ============================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing data
  console.log('Cleaning existing data...');
  await prisma.permitEquipment.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.permit.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('test@123', 12);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@isip.com',
      username: 'test',
      password: hashedPassword,
      firstName: 'Priya',
      lastName: 'Singh',
      role: 'ADMIN',
    },
  });

  const safetyOfficer = await prisma.user.create({
    data: {
      email: 'safety@isip.com',
      username: 'safety_officer',
      password: hashedPassword,
      firstName: 'Ravi',
      lastName: 'Patel',
      role: 'SAFETY_OFFICER',
    },
  });

  // 3. Create Zones
  console.log('Creating zones...');
  const zoneA = await prisma.zone.create({
    data: { name: 'Zone A - Blast Furnace', code: 'ZONE-A', riskLevel: 'WARNING', latitude: 12.9716, longitude: 77.5946 }
  });
  const zoneB = await prisma.zone.create({
    data: { name: 'Zone B - Converter', code: 'ZONE-B', riskLevel: 'WARNING', latitude: 12.9717, longitude: 77.5947 }
  });
  const zoneC = await prisma.zone.create({
    data: { name: 'Zone C - Boiler Room', code: 'ZONE-C', riskLevel: 'SAFE', latitude: 12.9718, longitude: 77.5948 }
  });
  const zoneD = await prisma.zone.create({
    data: { name: 'Zone D - Chimney', code: 'ZONE-D', riskLevel: 'SAFE', latitude: 12.9719, longitude: 77.5949 }
  });
  const zoneE = await prisma.zone.create({
    data: { name: 'Zone E - Compressor Station', code: 'ZONE-E', riskLevel: 'WARNING', latitude: 12.9720, longitude: 77.5950 }
  });
  const zoneF = await prisma.zone.create({
    data: { name: 'Zone F - Tank Farm', code: 'ZONE-F', riskLevel: 'CRITICAL', latitude: 12.9721, longitude: 77.5951 }
  });
  const zoneG = await prisma.zone.create({
    data: { name: 'Zone G - Rolling Mill', code: 'ZONE-G', riskLevel: 'SAFE', latitude: 12.9722, longitude: 77.5952 }
  });
  const zoneH = await prisma.zone.create({
    data: { name: 'Zone H - Gas Plant', code: 'ZONE-H', riskLevel: 'SAFE', latitude: 12.9723, longitude: 77.5953 }
  });
  const zoneI = await prisma.zone.create({
    data: { name: 'Zone I - Electrolyzer', code: 'ZONE-I', riskLevel: 'WARNING', latitude: 12.9724, longitude: 77.5954 }
  });
  const controlRoom = await prisma.zone.create({
    data: { name: 'Control Room', code: 'CTRL-RM', riskLevel: 'SAFE', latitude: 12.9725, longitude: 77.5955 }
  });

  // 4. Create Equipment
  console.log('Creating equipment...');
  const eqBF1 = await prisma.equipment.create({
    data: { name: 'Blast Furnace Unit 1', code: 'BF-1', type: 'FURNACE', status: 'OPERATIONAL', zoneId: zoneA.id }
  });
  const eqCV2 = await prisma.equipment.create({
    data: { name: 'Converter Unit 2', code: 'CV-2', type: 'CONVERTER', status: 'OPERATIONAL', zoneId: zoneB.id }
  });
  const eqB3 = await prisma.equipment.create({
    data: { name: 'Steam Boiler B3', code: 'B3', type: 'BOILER', status: 'OPERATIONAL', zoneId: zoneC.id }
  });
  const eqC3 = await prisma.equipment.create({
    data: { name: 'Compressor C3', code: 'C3', type: 'COMPRESSOR', status: 'MAINTENANCE', zoneId: zoneE.id }
  });
  const eqT14 = await prisma.equipment.create({
    data: { name: 'Tank T-14', code: 'T-14', type: 'TANK', status: 'OPERATIONAL', zoneId: zoneF.id }
  });
  const eqM1 = await prisma.equipment.create({
    data: { name: 'Rolling Mill M1', code: 'RM-1', type: 'MILL', status: 'OPERATIONAL', zoneId: zoneG.id }
  });

  // 5. Create Sensors
  console.log('Creating sensors...');
  await prisma.sensor.createMany({
    data: [
      { name: 'H₂S Monitor — Blast Furnace A', type: 'GAS', value: 8.4, unit: 'ppm', min: 0, max: 20, threshold: 10, status: 'WARNING', trend: 'UP', zoneId: zoneA.id, equipmentId: eqBF1.id },
      { name: 'CO Detector — Converter Bay', type: 'GAS', value: 23.1, unit: 'ppm', min: 0, max: 50, threshold: 25, status: 'WARNING', trend: 'UP', zoneId: zoneB.id, equipmentId: eqCV2.id },
      { name: 'Temperature — Furnace Outlet', type: 'TEMPERATURE', value: 1487, unit: '°C', min: 1200, max: 1600, threshold: 1500, status: 'WARNING', trend: 'UP', zoneId: zoneA.id, equipmentId: eqBF1.id },
      { name: 'Pressure — Steam Header', type: 'PRESSURE', value: 12.8, unit: 'bar', min: 8, max: 16, threshold: 14, status: 'ONLINE', trend: 'STABLE', zoneId: zoneC.id, equipmentId: eqB3.id },
      { name: 'SO₂ Sensor — Stack Emission', type: 'GAS', value: 4.2, unit: 'mg/m³', min: 0, max: 10, threshold: 8, status: 'ONLINE', trend: 'STABLE', zoneId: zoneD.id },
      { name: 'Vibration — Compressor #3', type: 'VIBRATION', value: 7.8, unit: 'mm/s', min: 0, max: 12, threshold: 8, status: 'WARNING', trend: 'UP', zoneId: zoneE.id, equipmentId: eqC3.id },
      { name: 'O₂ Deficiency — Tank Farm', type: 'GAS', value: 18.2, unit: '%', min: 16, max: 21, threshold: 19.5, status: 'CRITICAL', trend: 'DOWN', zoneId: zoneF.id, equipmentId: eqT14.id },
      { name: 'Flame Detector — Rolling Mill', type: 'TEMPERATURE', value: 342, unit: '°C', min: 200, max: 500, threshold: 450, status: 'ONLINE', trend: 'STABLE', zoneId: zoneG.id, equipmentId: eqM1.id },
      { name: 'CH₄ Detector — Gas Plant', type: 'GAS', value: 1.8, unit: '%LEL', min: 0, max: 5, threshold: 3, status: 'ONLINE', trend: 'STABLE', zoneId: zoneH.id },
      { name: 'Flow Rate — Cooling Water', type: 'FLOW', value: 420, unit: 'L/min', min: 350, max: 500, threshold: 380, status: 'ONLINE', trend: 'STABLE', zoneId: zoneA.id },
      { name: 'Pressure — Hydraulic System', type: 'PRESSURE', value: 28.6, unit: 'bar', min: 20, max: 35, threshold: 32, status: 'ONLINE', trend: 'DOWN', zoneId: zoneG.id },
      { name: 'H₂ Sensor — Electrolyzer', type: 'GAS', value: 0.4, unit: '%', min: 0, max: 1, threshold: 0.5, status: 'WARNING', trend: 'UP', zoneId: zoneI.id }
    ]
  });

  // 6. Create Permits
  console.log('Creating permits...');
  const permit1 = await prisma.permit.create({
    data: {
      id: 'PTW-2024-0041',
      type: 'HOT_WORK',
      title: 'Blast Furnace Tapping — Unit 1',
      status: 'ACTIVE',
      riskLevel: 'HIGH',
      compliance: 91,
      startTime: new Date('2026-07-06T06:00:00Z'),
      endTime: new Date('2026-07-06T14:00:00Z'),
      issuerId: admin.id,
      zoneId: zoneA.id,
      aiRecommendation: 'Continuous H₂S monitoring required. Temperature trending upward — consider early termination at 13:00 if temp exceeds 1500°C.'
    }
  });

  const permit2 = await prisma.permit.create({
    data: {
      id: 'PTW-2024-0042',
      type: 'CONFINED_SPACE',
      title: 'Tank T-14 Internal Inspection',
      status: 'ACTIVE',
      riskLevel: 'CRITICAL',
      compliance: 62,
      startTime: new Date('2026-07-06T07:00:00Z'),
      endTime: new Date('2026-07-06T11:00:00Z'),
      issuerId: safetyOfficer.id,
      zoneId: zoneF.id,
      aiRecommendation: '⚠️ CRITICAL: O₂ level at 18.2% (below 19.5% threshold). Worker W004 PPE non-compliant. Recommend immediate evacuation and permit suspension.'
    }
  });

  const permit3 = await prisma.permit.create({
    data: {
      id: 'PTW-2024-0043',
      type: 'ELECTRICAL',
      title: 'Compressor C3 Maintenance',
      status: 'ACTIVE',
      riskLevel: 'HIGH',
      compliance: 78,
      startTime: new Date('2026-07-06T08:00:00Z'),
      endTime: new Date('2026-07-06T12:00:00Z'),
      issuerId: admin.id,
      zoneId: zoneE.id,
      aiRecommendation: 'Worker W003 missing face shield (partial PPE). Vibration escalating — monitor compressor bearing temperature closely.'
    }
  });

  // Create PermitEquipment links
  await prisma.permitEquipment.createMany({
    data: [
      { permitId: permit1.id, equipmentId: eqBF1.id },
      { permitId: permit2.id, equipmentId: eqT14.id },
      { permitId: permit3.id, equipmentId: eqC3.id }
    ]
  });

  // 7. Create Workers
  console.log('Creating workers...');
  await prisma.worker.createMany({
    data: [
      { id: 'W001', name: 'Arjun Sharma', role: 'Furnace Operator', badge: 'B-1042', status: 'ACTIVE', ppeStatus: 'COMPLIANT', riskLevel: 'HIGH', heartRate: 94, gasExposure: 7.2, task: 'Tapping operation', zoneId: zoneA.id, permitId: permit1.id },
      { id: 'W002', name: 'Ravi Patel', role: 'Safety Officer', badge: 'B-0891', status: 'ACTIVE', ppeStatus: 'COMPLIANT', riskLevel: 'MEDIUM', heartRate: 78, gasExposure: 18.4, task: 'Safety Inspection', zoneId: zoneB.id },
      { id: 'W003', name: 'Deepak Verma', role: 'Maintenance Technician', badge: 'B-2234', status: 'ACTIVE', ppeStatus: 'PARTIAL', riskLevel: 'HIGH', heartRate: 88, gasExposure: 2.1, task: 'Vibration analysis', zoneId: zoneE.id, permitId: permit3.id },
      { id: 'W004', name: 'Suresh Kumar', role: 'Process Operator', badge: 'B-3341', status: 'ACTIVE', ppeStatus: 'NON_COMPLIANT', riskLevel: 'CRITICAL', heartRate: 105, gasExposure: 0.8, task: 'Tank inspection', zoneId: zoneF.id, permitId: permit2.id },
      { id: 'W005', name: 'Manish Gupta', role: 'Electrical Technician', badge: 'B-1893', status: 'ACTIVE', ppeStatus: 'COMPLIANT', riskLevel: 'MEDIUM', heartRate: 82, gasExposure: 0.3, task: 'Electrical maintenance', zoneId: zoneG.id },
      { id: 'W006', name: 'Priya Singh', role: 'Safety Inspector', badge: 'B-0523', status: 'ACTIVE', ppeStatus: 'COMPLIANT', riskLevel: 'LOW', heartRate: 72, gasExposure: 0.1, task: 'Monitoring operations', zoneId: controlRoom.id },
      { id: 'W007', name: 'Rajesh Nair', role: 'Crane Operator', badge: 'B-4421', status: 'ACTIVE', ppeStatus: 'COMPLIANT', riskLevel: 'MEDIUM', heartRate: 80, gasExposure: 0.5, task: 'Material handling', zoneId: zoneG.id },
      { id: 'W008', name: 'Amit Joshi', role: 'Boiler Operator', badge: 'B-3092', status: 'ACTIVE', ppeStatus: 'COMPLIANT', riskLevel: 'LOW', heartRate: 76, gasExposure: 1.2, task: 'Steam pressure monitoring', zoneId: zoneC.id }
    ]
  });

  // 8. Create Alerts
  console.log('Creating alerts...');
  await prisma.alert.createMany({
    data: [
      { id: 'ALT001', type: 'GAS', severity: 'CRITICAL', title: 'O₂ Deficiency Detected', description: 'Oxygen level dropped to 18.2% in Zone F - Tank Farm. Worker W004 at risk.', acknowledged: false, source: 'S007', zoneId: zoneF.id },
      { id: 'ALT002', type: 'WORKER', severity: 'CRITICAL', title: 'PPE Non-Compliance', description: 'Worker Suresh Kumar (W004) entered confined space without proper PPE.', acknowledged: false, source: 'W004', zoneId: zoneF.id },
      { id: 'ALT003', type: 'GAS', severity: 'WARNING', title: 'H₂S Level Rising', description: 'H₂S concentration trending up to 8.4 ppm. Threshold is 10 ppm.', acknowledged: false, source: 'S001', zoneId: zoneA.id },
      { id: 'ALT004', type: 'GAS', severity: 'WARNING', title: 'CO Elevated', description: 'Carbon monoxide at 23.1 ppm, approaching 25 ppm threshold.', acknowledged: true, source: 'S002', zoneId: zoneB.id, userId: admin.id },
      { id: 'ALT005', type: 'EQUIPMENT', severity: 'WARNING', title: 'Compressor Vibration High', description: 'Compressor C3 vibration at 7.8 mm/s approaching 8 mm/s limit.', acknowledged: false, source: 'S006', zoneId: zoneE.id }
    ]
  });

  // 9. Create Timeline Events
  console.log('Creating timeline events...');
  await prisma.timelineEvent.createMany({
    data: [
      { id: 'TL001', category: 'AI', title: 'AI Risk Alert Generated', description: 'Compound risk detected in Zone F: O₂ deficiency + active confined space permit + worker presence', severity: 'CRITICAL', zoneId: zoneF.id, relatedId: 'ALT001' },
      { id: 'TL002', category: 'SENSOR', title: 'O₂ Sensor Critical Threshold', description: 'S007 oxygen level dropped below 19.5% safety threshold to 18.2%', severity: 'CRITICAL', zoneId: zoneF.id, relatedId: 'ALT001' },
      { id: 'TL003', category: 'WORKER', title: 'PPE Violation Detected', description: 'Worker W004 (Suresh Kumar) entered confined space without full PPE compliance', severity: 'CRITICAL', zoneId: zoneF.id, relatedId: 'W004' },
      { id: 'TL004', category: 'SENSOR', title: 'H₂S Level Rising', description: 'H₂S concentration increased from 6.1 to 8.4 ppm over 15 minutes', severity: 'WARNING', zoneId: zoneA.id, relatedId: 'S001' },
      { id: 'TL005', category: 'PERMIT', title: 'Permit PTW-0043 Activated', description: 'Compressor C3 maintenance permit activated for worker Deepak Verma', severity: 'INFO', zoneId: zoneE.id, relatedId: 'PTW-2024-0043' }
    ]
  });

  // 10. Create Reports
  console.log('Creating reports...');
  await prisma.report.create({
    data: {
      name: 'Daily Safety Report',
      description: 'Complete daily overview of all safety incidents, sensor data, and worker activity',
      type: 'DAILY_SAFETY',
      frequency: 'DAILY',
      status: 'COMPLETED',
      generatedById: admin.id,
      generatedAt: new Date(),
      data: {
        incidentFreeDays: 47,
        complianceScore: 73,
        kpiSummary: "Morning Shift Assessment: Plant safety is currently at elevated risk due to compound hazards in Zone F."
      }
    }
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
