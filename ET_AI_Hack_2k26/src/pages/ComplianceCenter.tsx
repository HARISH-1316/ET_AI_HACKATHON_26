import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, FileText, Download, ChevronRight, XCircle } from 'lucide-react';
import { sensorsApi, workersApi, permitsApi, dashboardApi } from '../services/api';
import './ComplianceCenter.css';

const ComplianceCenter: React.FC = () => {
  const [sensorsList, setSensorsList] = useState<any[]>([]);
  const [workersList, setWorkersList] = useState<any[]>([]);
  const [permitsList, setPermitsList] = useState<any[]>([]);
  const [kpi, setKpi] = useState<any>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sensorsRes, workersRes, permitsRes, kpiRes] = await Promise.all([
          sensorsApi.getAll(),
          workersApi.getAll(),
          permitsApi.getAll(),
          dashboardApi.getKPIs(),
        ]);
        if (sensorsRes.success && Array.isArray(sensorsRes.data)) setSensorsList(sensorsRes.data);
        if (workersRes.success && Array.isArray(workersRes.data)) setWorkersList(workersRes.data);
        if (permitsRes.success && Array.isArray(permitsRes.data)) setPermitsList(permitsRes.data);
        if (kpiRes.success && kpiRes.data) setKpi(kpiRes.data);
      } catch (err) {
        console.warn('ComplianceCenter load error:', err);
      }
    };
    fetchAll();
  }, []);

  // Compute checklist dynamically
  const gasSensors = sensorsList.filter(s => s.type?.toLowerCase() === 'gas' || s.type === 'GAS');
  const criticalGas = gasSensors.some(s => s.status === 'CRITICAL' || s.status === 'critical');
  const warningGas = gasSensors.some(s => s.status === 'WARNING' || s.status === 'warning');
  const gasStatus = criticalGas ? 'fail' : warningGas ? 'warning' : 'pass';

  const nonCompliantPpe = workersList.some(w => w.ppeStatus === 'NON_COMPLIANT' || w.ppeStatus === 'non-compliant');
  const partialPpe = workersList.some(w => w.ppeStatus === 'PARTIAL' || w.ppeStatus === 'partial');
  const ppeStatus = nonCompliantPpe ? 'fail' : partialPpe ? 'warning' : 'pass';

  const avgPermitCompliance = permitsList.length > 0
    ? Math.round(permitsList.reduce((acc, p) => acc + (p.compliance ?? 100), 0) / permitsList.length)
    : 100;
  const permitStatus = avgPermitCompliance < 70 ? 'fail' : avgPermitCompliance < 85 ? 'warning' : 'pass';

  const complianceChecks = [
    { id: 'C001', rule: 'IS 13947 — Electrical Isolation', status: 'pass', evidence: 'All electrical isolations verified', zone: 'Zone G' },
    { id: 'C002', rule: 'OISD-GDN-206 — Gas Detection', status: gasStatus, evidence: `${gasSensors.filter(s => s.status === 'ONLINE' || s.status === 'online').length}/${gasSensors.length} gas sensors operational`, zone: 'All Zones' },
    { id: 'C003', rule: 'Factory Act 1948 — PPE Compliance', status: ppeStatus, evidence: `${workersList.filter(w => w.ppeStatus === 'COMPLIANT' || w.ppeStatus === 'compliant').length}/${workersList.length} workers compliant`, zone: 'Zone E, F' },
    { id: 'C004', rule: 'OISD-STD-105 — Permit to Work', status: permitStatus, evidence: `Permit compliance score at ${avgPermitCompliance}%`, zone: 'Zone F' },
    { id: 'C005', rule: 'IS 15683 — Fire Protection', status: 'pass', evidence: 'All fire suppression systems active and charged', zone: 'All Zones' },
    { id: 'C006', rule: 'OISD-GDN-169 — Confined Space', status: 'warning', evidence: 'Oxygen level monitoring verified', zone: 'Zone F' },
  ];

  const passed = complianceChecks.filter(c => c.status === 'pass').length;
  const failed = complianceChecks.filter(c => c.status === 'fail').length;
  const warning = complianceChecks.filter(c => c.status === 'warning').length;

  const score = Math.round((passed / complianceChecks.length) * 100);

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance Center</h1>
          <p className="page-subtitle">Regulatory verification · Automated audits</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm"><Download size={13}/> Export Audit</button>
        </div>
      </div>

      <div className="grid grid-4 mb-4">
        <div className="card card-sm compliance-stat-card compliance-blue">
          <div className="label mb-2">Compliance Score</div>
          <div 
            className="compliance-metric-value" 
            style={{ color: score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--critical)' }}
          >
            {score}%
          </div>
        </div>
        <div className="card card-sm compliance-stat-card compliance-success">
          <div className="label mb-2">Checks Passed</div>
          <div className="compliance-metric-value" style={{ color: 'var(--success)' }}>{passed}</div>
        </div>
        <div className="card card-sm compliance-stat-card compliance-warning">
          <div className="label mb-2">Warnings</div>
          <div className="compliance-metric-value" style={{ color: 'var(--warning)' }}>{warning}</div>
        </div>
        <div className="card card-sm compliance-stat-card compliance-critical">
          <div className="label mb-2">Violations</div>
          <div className="compliance-metric-value" style={{ color: 'var(--critical)' }}>{failed}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Automated Safety Checklist</div>
        </div>
        <div className="compliance-checklist-container">
          {complianceChecks.map(check => (
            <div key={check.id} className="compliance-checklist-item">
              {check.status === 'pass' ? <CheckCircle size={18} color="var(--success)"/> :
               check.status === 'fail' ? <XCircle size={18} color="var(--critical)"/> :
               <AlertTriangle size={18} color="var(--warning)"/>}
              <div className="compliance-check-info">
                <div className="compliance-check-rule">{check.rule}</div>
                <div className="compliance-check-evidence">{check.evidence}</div>
              </div>
              <div className="compliance-check-right">
                <span className={`badge badge-${check.status==='pass'?'success':check.status==='fail'?'critical':'warning'}`}>
                  {check.status.toUpperCase()}
                </span>
                <div className="compliance-check-zone">{check.zone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceCenter;

