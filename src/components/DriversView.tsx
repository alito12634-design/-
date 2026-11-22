import React, { useMemo, useState } from 'react';
import { Bus, Plus, FileSpreadsheet, Pencil, Trash2, X, Users } from 'lucide-react';
import { Area, Driver, Student } from '../types';
import { exportDriversToExcel } from '../utils/excelExport';

interface DriversViewProps {
  drivers: Driver[];
  students: Student[];
  areas: Area[];
  onAddDriver: (driver: Driver) => void;
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (driverId: string) => void;
  onSelectDriver: (driver: Driver) => void;
}

export const DriversView: React.FC<DriversViewProps> = ({
  drivers,
  students,
  areas,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver,
  onSelectDriver,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [error, setError] = useState('');
  const [deleteWarningId, setDeleteWarningId] = useState<string | null>(null);

  const areaMap = useMemo(() => new Map(areas.map((a) => [a.id, a.name])), [areas]);

  const driverStats = useMemo(() => {
    return drivers.map((driver) => {
      const driverStudents = students.filter(
        (s) => s.hasSchoolTransport && s.driverId === driver.id
      );
      const coveredAreaNames = Array.from(
        new Set(driverStudents.map((s) => areaMap.get(s.areaId)).filter(Boolean))
      ) as string[];

      return {
        driver,
        studentCount: driverStudents.length,
        coveredAreasCount: coveredAreaNames.length,
        coveredAreaNames,
      };
    });
  }, [drivers, students, areaMap]);

  const openNewModal = () => {
    setEditingDriver(null);
    setName('');
    setPhone('');
    setVehicleType('');
    setPlateNumber('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setName(driver.name);
    setPhone(driver.phone);
    setVehicleType(driver.vehicleType);
    setPlateNumber(driver.plateNumber || '');
    setError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !vehicleType.trim()) {
      setError('يرجى إدخال اسم السائق ورقم الهاتف ونوع السيارة.');
      return;
    }

    if (editingDriver) {
      onUpdateDriver({
        ...editingDriver,
        name: name.trim(),
        phone: phone.trim(),
        vehicleType: vehicleType.trim(),
        plateNumber: plateNumber.trim(),
      });
    } else {
      onAddDriver({
        id: `drv-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        vehicleType: vehicleType.trim(),
        plateNumber: plateNumber.trim(),
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#111C38] font-display">
            الخطوط المدرسية والسائقون
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {drivers.length} سائق مسجل · اضغط على اسم السائق لعرض كشف طلابه ونقاطهم الدالة وطباعته
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => exportDriversToExcel(driverStats)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#111C38] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير إلى Excel</span>
          </button>

          <button
            type="button"
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0F1A36] bg-[#EAB308] hover:bg-[#D99B00] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سائق جديد</span>
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">اسم السائق (أبو الخط)</th>
                <th className="py-3 px-4">رقم الهاتف</th>
                <th className="py-3 px-4">نوع السيارة</th>
                <th className="py-3 px-4">عدد الطلاب</th>
                <th className="py-3 px-4">المناطق المغطاة</th>
                <th className="py-3 px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {driverStats.map(
                ({ driver, studentCount, coveredAreasCount, coveredAreaNames }) => (
                  <tr key={driver.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#111C38]">
                      <button
                        type="button"
                        onClick={() => onSelectDriver(driver)}
                        className="inline-flex items-center gap-2 text-right hover:text-[#0EA5E9] transition-colors cursor-pointer"
                      >
                        <Bus className="w-4 h-4 text-[#D99B00] shrink-0" />
                        <span>{driver.name}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-700" dir="ltr">
                      <span className="block text-right">{driver.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{driver.vehicleType}</div>
                      {driver.plateNumber && (
                        <div className="text-xs text-slate-400">{driver.plateNumber}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 tabular-nums">
                      <button
                        type="button"
                        onClick={() => onSelectDriver(driver)}
                        className="inline-flex items-center gap-1.5 font-bold text-[#111C38] hover:text-[#0EA5E9] cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{studentCount} طالب</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div className="font-semibold text-[#111C38] tabular-nums">
                        {coveredAreasCount} {coveredAreasCount === 1 ? 'منطقة' : 'مناطق'}
                      </div>
                      {coveredAreaNames.length > 0 && (
                        <div className="text-slate-500 truncate max-w-[220px]">
                          {coveredAreaNames.join('، ')}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(driver)}
                          title="تعديل بيانات السائق"
                          className="p-1.5 text-slate-500 hover:text-[#111C38] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {deleteWarningId === driver.id ? (
                          <div className="inline-flex items-center gap-1 text-xs bg-rose-50 border border-rose-200 px-2 py-1 rounded-md">
                            {studentCount > 0 ? (
                              <>
                                <span className="text-rose-700">لديه طلاب</span>
                                <button
                                  type="button"
                                  onClick={() => setDeleteWarningId(null)}
                                  className="text-slate-600 underline mr-1 cursor-pointer"
                                >
                                  إغلاق
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteDriver(driver.id);
                                    setDeleteWarningId(null);
                                  }}
                                  className="text-rose-700 font-bold cursor-pointer"
                                >
                                  تأكيد
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteWarningId(null)}
                                  className="text-slate-500 mr-1 cursor-pointer"
                                >
                                  إلغاء
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteWarningId(driver.id)}
                            title="حذف السائق"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Driver Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A36]/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-[#111C38] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold font-display">
                {editingDriver ? 'تعديل بيانات السائق' : 'إضافة سائق (أبو خط) جديد'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  اسم السائق (أبو الخط) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: علي جابر كاظم (أبو حسن)"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0770xxxxxxx"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38] tabular-nums text-left"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  نوع السيارة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  placeholder="مثال: تويوتا هايس 14 راكب"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  رقم اللوحة (اختياري)
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="مثال: بغداد 41820 ب"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-[#0F1A36] bg-[#EAB308] hover:bg-[#D99B00] rounded-lg cursor-pointer"
                >
                  {editingDriver ? 'حفظ التعديل' : 'إضافة السائق'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
