-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SAFETY_OFFICER', 'OPERATOR', 'TECHNICIAN', 'VIEWER');

-- CreateEnum
CREATE TYPE "ZoneRiskLevel" AS ENUM ('SAFE', 'LOW', 'MODERATE', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('FURNACE', 'CONVERTER', 'BOILER', 'COMPRESSOR', 'TANK', 'MILL', 'CRANE', 'PUMP', 'VALVE', 'ELECTRICAL_PANEL', 'PIPELINE', 'OTHER');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('OPERATIONAL', 'MAINTENANCE', 'FAULTY', 'OFFLINE', 'DECOMMISSIONED');

-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('GAS', 'TEMPERATURE', 'PRESSURE', 'VIBRATION', 'HUMIDITY', 'FLOW');

-- CreateEnum
CREATE TYPE "SensorStatus" AS ENUM ('ONLINE', 'OFFLINE', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SensorTrend" AS ENUM ('UP', 'DOWN', 'STABLE');

-- CreateEnum
CREATE TYPE "WorkerStatus" AS ENUM ('ACTIVE', 'BREAK', 'EMERGENCY', 'EVACUATED', 'OFF_SHIFT');

-- CreateEnum
CREATE TYPE "PPEStatus" AS ENUM ('COMPLIANT', 'NON_COMPLIANT', 'PARTIAL');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "PermitType" AS ENUM ('HOT_WORK', 'CONFINED_SPACE', 'ELECTRICAL', 'WORKING_AT_HEIGHT', 'CHEMICAL');

-- CreateEnum
CREATE TYPE "PermitStatus" AS ENUM ('ACTIVE', 'PENDING', 'EXPIRED', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('GAS', 'TEMPERATURE', 'PRESSURE', 'EQUIPMENT', 'WORKER', 'PERMIT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TimelineCategory" AS ENUM ('SENSOR', 'WORKER', 'PERMIT', 'EQUIPMENT', 'AI', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('DAILY_SAFETY', 'INCIDENT', 'RISK_ANALYSIS', 'COMPLIANCE', 'WORKER_SAFETY', 'EQUIPMENT_HEALTH');

-- CreateEnum
CREATE TYPE "ReportFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "risk_level" "ZoneRiskLevel" NOT NULL DEFAULT 'SAFE',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "EquipmentType" NOT NULL DEFAULT 'OTHER',
    "status" "EquipmentStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "zone_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SensorType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "max" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "threshold" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "status" "SensorStatus" NOT NULL DEFAULT 'ONLINE',
    "trend" "SensorTrend" NOT NULL DEFAULT 'STABLE',
    "zone_id" TEXT NOT NULL,
    "equipment_id" TEXT,
    "last_reading" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sensors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "shift" TEXT NOT NULL DEFAULT 'Morning',
    "status" "WorkerStatus" NOT NULL DEFAULT 'ACTIVE',
    "ppe_status" "PPEStatus" NOT NULL DEFAULT 'COMPLIANT',
    "risk_level" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "heart_rate" DOUBLE PRECISION,
    "gas_exposure" DOUBLE PRECISION,
    "task" TEXT,
    "zone_id" TEXT,
    "permit_id" TEXT,
    "last_seen" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permits" (
    "id" TEXT NOT NULL,
    "type" "PermitType" NOT NULL,
    "title" TEXT NOT NULL,
    "status" "PermitStatus" NOT NULL DEFAULT 'PENDING',
    "risk_level" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "compliance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "issuer_id" TEXT,
    "zone_id" TEXT NOT NULL,
    "ai_recommendation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permit_equipment" (
    "permit_id" TEXT NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permit_equipment_pkey" PRIMARY KEY ("permit_id","equipment_id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "zone_id" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "category" "TimelineCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "zone_id" TEXT,
    "related_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ReportType" NOT NULL,
    "frequency" "ReportFrequency" NOT NULL DEFAULT 'ON_DEMAND',
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "data" JSONB,
    "generated_by_id" TEXT,
    "generated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "zones_name_key" ON "zones"("name");

-- CreateIndex
CREATE UNIQUE INDEX "zones_code_key" ON "zones"("code");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_code_key" ON "equipment"("code");

-- CreateIndex
CREATE INDEX "equipment_zone_id_idx" ON "equipment"("zone_id");

-- CreateIndex
CREATE INDEX "sensors_zone_id_idx" ON "sensors"("zone_id");

-- CreateIndex
CREATE INDEX "sensors_equipment_id_idx" ON "sensors"("equipment_id");

-- CreateIndex
CREATE INDEX "sensors_type_idx" ON "sensors"("type");

-- CreateIndex
CREATE INDEX "sensors_status_idx" ON "sensors"("status");

-- CreateIndex
CREATE UNIQUE INDEX "workers_badge_key" ON "workers"("badge");

-- CreateIndex
CREATE INDEX "workers_zone_id_idx" ON "workers"("zone_id");

-- CreateIndex
CREATE INDEX "workers_permit_id_idx" ON "workers"("permit_id");

-- CreateIndex
CREATE INDEX "workers_status_idx" ON "workers"("status");

-- CreateIndex
CREATE INDEX "permits_zone_id_idx" ON "permits"("zone_id");

-- CreateIndex
CREATE INDEX "permits_issuer_id_idx" ON "permits"("issuer_id");

-- CreateIndex
CREATE INDEX "permits_status_idx" ON "permits"("status");

-- CreateIndex
CREATE INDEX "permits_type_idx" ON "permits"("type");

-- CreateIndex
CREATE INDEX "alerts_zone_id_idx" ON "alerts"("zone_id");

-- CreateIndex
CREATE INDEX "alerts_severity_idx" ON "alerts"("severity");

-- CreateIndex
CREATE INDEX "alerts_acknowledged_idx" ON "alerts"("acknowledged");

-- CreateIndex
CREATE INDEX "alerts_type_idx" ON "alerts"("type");

-- CreateIndex
CREATE INDEX "timeline_events_zone_id_idx" ON "timeline_events"("zone_id");

-- CreateIndex
CREATE INDEX "timeline_events_category_idx" ON "timeline_events"("category");

-- CreateIndex
CREATE INDEX "timeline_events_severity_idx" ON "timeline_events"("severity");

-- CreateIndex
CREATE INDEX "timeline_events_timestamp_idx" ON "timeline_events"("timestamp");

-- CreateIndex
CREATE INDEX "reports_type_idx" ON "reports"("type");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_generated_by_id_idx" ON "reports"("generated_by_id");

-- AddForeignKey
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workers" ADD CONSTRAINT "workers_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workers" ADD CONSTRAINT "workers_permit_id_fkey" FOREIGN KEY ("permit_id") REFERENCES "permits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permits" ADD CONSTRAINT "permits_issuer_id_fkey" FOREIGN KEY ("issuer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permits" ADD CONSTRAINT "permits_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permit_equipment" ADD CONSTRAINT "permit_equipment_permit_id_fkey" FOREIGN KEY ("permit_id") REFERENCES "permits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permit_equipment" ADD CONSTRAINT "permit_equipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_generated_by_id_fkey" FOREIGN KEY ("generated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
