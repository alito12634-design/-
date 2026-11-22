import React, { useMemo, useState } from 'react';
import { MapPin, Plus, FileSpreadsheet, Pencil, Trash2, X } from 'lucide-react';
import { Area, Student } from '../types';
import { exportAreasToExcel } from '../utils/excelExport';

interface AreasViewProps {
  areas: Area[];
  students: Student[];
  onAddArea: (area: Area) => void;
  onUpdateArea: (area: Area) => void;
  onDeleteArea: (areaId: string) => void;
  onViewAreaStudents: (areaId: string) => void;
}

export const AreasView: React.FC<AreasViewProps> = ({
  areas,
  students,
  onAddArea,
  onUpdateArea,
  onDeleteArea,
  onViewAreaStudents,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [deleteWarningId, setDeleteWarningId] = useState<string | null>(null);

  const areaStats = useMemo(() => {
    return areas
      .map((area) => {
        const areaStudents = students.filter((s) => s.areaId === area.id);
        const transportCount = areaStudents.filter((s) => s.hasSchoolTransport).length;
        const uniqueDriverIds = new Set(
          areaStudents
            .filter((s) => s.hasSchoolTransport && s.driverId)
            .map((s) => s.driverId as string)
        );

        return {
          area,
          studentCount: areaStudents.length,
          transportCount,
          driverCount: uniqueDriverIds.size,
        };
      })
      .sort((a, b) => b.studentCount - a.studentCount);
  }, [areas, students]);

  const openNewModal = () => {
    setEditingArea(null);
    setName('');
    setNotes('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (area: Area) => {
    setEditingArea(area);
    setName(area.name);
    setNotes(area.notes || '');
    setError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('يرجى إدخال اسم المنطقة السكنية.');
      return;
    }

    const duplicate = areas.find(
      (a) => a.name.trim() === cleanName && a.id !== editingArea?.id
    );
    if (duplicate) {
      setError('هذه المنطقة مسجلة بالفعل.');
      return;
    }

    if (editingArea) {
      onUpdateArea({ ...editingArea, name: cleanName, notes: notes.trim() });
    } else {
      onAddArea({
        id: `area-${Date.now()}`,
        name: cleanName,
        notes: notes.trim(),
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
            المناطق السكنية
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            {areas.length} منطقة مسجلة · يتم احتساب عدد الطلاب الساكنين تلقائياً من سجل الطلاب
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => exportAreasToExcel(areaStats)}
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
            <span>إضافة منطقة</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">اسم المنطقة</th>
                <th className="py-3 px-4">عدد الطلاب الساكنين</th>
                <th className="py-3 px-4">خط المدرسة / خاص</th>
                <th className="py-3 px-4">عدد السائقين</th>
                <th className="py-3 px-4">ملاحظات النطاق</th>
                <th className="py-3 px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {areaStats.map(({ area, studentCount, transportCount, driverCount }) => (
                <tr key={area.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#111C38]">
                    <button
                      type="button"
                      onClick={() => onViewAreaStudents(area.id)}
                      className="inline-flex items-center gap-2 hover:text-[#0EA5E9] transition-colors cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-[#0EA5E9] shrink-0" />
                      <span>{area.name}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums">
                    <span className="font-bold text-[#111C38]">{studentCount}</span>{' '}
                    <span className="text-xs text-slate-500">طالب</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 tabular-nums">
                    <span>{transportCount} خط</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{studentCount - transportCount} خاص</span>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-slate-700">
                    {driverCount} سائق
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                    {area.notes || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-left">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(area)}
                        title="تعديل المنطقة"
                        className="p-1.5 text-slate-500 hover:text-[#111C38] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteWarningId === area.id ? (
                        <div className="inline-flex items-center gap-1 text-xs bg-rose-50 border border-rose-200 px-2 py-1 rounded-md">
                          {studentCount > 0 ? (
                            <>
                              <span className="text-rose-700">مرتبطة بطلاب</span>
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
                                  onDeleteArea(area.id);
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
                          onClick={() => setDeleteWarningId(area.id)}
                          title="حذف المنطقة"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Area Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F1A36]/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-[#111C38] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold font-display">
                {editingArea ? 'تعديل بيانات المنطقة' : 'إضافة منطقة سكنية جديدة'}
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
                  اسم المنطقة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: الأعظمية"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  ملاحظات أو شوارع قريبة (اختياري)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: شارع الضباط وساحة عنتر"
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
                  {editingArea ? 'حفظ التعديل' : 'إضافة المنطقة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
