import React from 'react';
import { X, Printer, FileSpreadsheet, Phone, Car } from 'lucide-react';
import { Area, Driver, Student } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { exportDriverRosterToExcel } from '../utils/excelExport';

interface DriverRosterModalProps {
  driver: Driver | null;
  students: Student[];
  areas: Area[];
  onClose: () => void;
}

export const DriverRosterModal: React.FC<DriverRosterModalProps> = ({
  driver,
  students,
  areas,
  onClose,
}) => {
  if (!driver) return null;

  const areaMap = new Map(areas.map((a) => [a.id, a.name]));
  const driverStudents = students.filter(
    (s) => s.hasSchoolTransport && s.driverId === driver.id
  );

  const coveredAreas = Array.from(
    new Set(driverStudents.map((s) => areaMap.get(s.areaId)).filter(Boolean))
  ) as string[];

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1A36]/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:static print:bg-white print:p-0 print:block">
      <div className="bg-white w-full max-w-4xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden my-auto print-only-container">
        {/* Top Action Bar */}
        <div className="bg-[#111C38] text-white px-5 py-3.5 flex items-center justify-between gap-3 no-print">
          <div className="text-sm font-bold font-display truncate">
            كشف طلاب الخط المدرسي
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => exportDriverRosterToExcel(driver, driverStudents, areas)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span>تصدير Excel</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#EAB308] hover:bg-[#D99B00] text-[#0F1A36] rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الكشف</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Manifest Body */}
        <div className="p-5 sm:p-7 space-y-5 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b-2 border-[#111C38]">
            <div className="flex items-center gap-3">
              <SchoolLogo size="md" variant="light-bg" />
              <div>
                <h2 className="text-lg font-bold text-[#111C38] font-display">
                  مدرسة شمس المعارف الأساسية الأهلية
                </h2>
                <p className="text-xs text-slate-500">كشف توزيع طلاب الخطوط المدرسية</p>
              </div>
            </div>
            <div className="text-xs sm:text-left text-slate-600 tabular-nums space-y-0.5">
              <div>
                عدد الطلاب: <strong className="text-[#111C38]">{driverStudents.length}</strong>
              </div>
              <div>
                المناطق المغطاة: <strong className="text-[#111C38]">{coveredAreas.length}</strong>
              </div>
            </div>
          </div>

          {/* Driver Summary Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-xs text-slate-500">اسم السائق (أبو الخط)</div>
              <div className="font-bold text-[#111C38] mt-0.5">{driver.name}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">رقم الهاتف</div>
              <div
                className="font-semibold text-[#111C38] mt-0.5 tabular-nums inline-flex items-center gap-1.5"
                dir="ltr"
              >
                <Phone className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>{driver.phone}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">السيارة المغطية للخط</div>
              <div className="font-medium text-[#111C38] mt-0.5 inline-flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#D99B00]" />
                <span>
                  {driver.vehicleType} {driver.plateNumber ? `(${driver.plateNumber})` : ''}
                </span>
              </div>
            </div>
          </div>

          {coveredAreas.length > 0 && (
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-[#111C38]">المناطق التي يغطيها: </span>
              <span>{coveredAreas.join(' · ')}</span>
            </div>
          )}

          {/* Student List Table */}
          {driverStudents.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
              لا يوجد طلاب مسجلون على خط هذا السائق حالياً.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th className="py-2.5 px-3">ت</th>
                      <th className="py-2.5 px-3">اسم الطالب</th>
                      <th className="py-2.5 px-3">الصف والشعبة</th>
                      <th className="py-2.5 px-3">المنطقة</th>
                      <th className="py-2.5 px-3">أقرب نقطة دالة</th>
                      <th className="py-2.5 px-3">أرقام هواتف الأهل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {driverStudents.map((s, idx) => (
                      <tr key={s.id}>
                        <td className="py-3 px-3 text-slate-500 tabular-nums">{idx + 1}</td>
                        <td className="py-3 px-3 font-semibold text-[#111C38]">
                          {s.fullName}
                        </td>
                        <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                          {s.grade} - {s.section}
                        </td>
                        <td className="py-3 px-3 font-medium text-[#111C38] whitespace-nowrap">
                          {areaMap.get(s.areaId) || '—'}
                        </td>
                        <td className="py-3 px-3 text-slate-700">{s.landmark}</td>
                        <td className="py-3 px-3 tabular-nums text-left" dir="ltr">
                          {s.fatherPhone && (
                            <div className="font-medium text-[#111C38]">{s.fatherPhone}</div>
                          )}
                          {s.motherPhone && (
                            <div className="text-xs text-slate-500">{s.motherPhone}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
