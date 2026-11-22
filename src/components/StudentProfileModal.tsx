import React, { useState } from 'react';
import { X, Printer, Pencil, Trash2 } from 'lucide-react';
import { Area, Driver, Student, getStageFromGrade, needsGuardianDetails } from '../types';
import { SchoolLogo } from './SchoolLogo';

interface StudentProfileModalProps {
  student: Student | null;
  areas: Area[];
  drivers: Driver[];
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  areas,
  drivers,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!student) return null;

  const area = areas.find((a) => a.id === student.areaId);
  const driver = student.driverId
    ? drivers.find((d) => d.id === student.driverId)
    : undefined;
  const stage = getStageFromGrade(student.grade);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1A36]/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:static print:bg-white print:p-0 print:block">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden my-auto print-only-container">
        {/* Top Action Bar (hidden when printing) */}
        <div className="bg-[#111C38] text-white px-5 py-3.5 flex items-center justify-between gap-3 no-print">
          <div className="text-sm font-bold font-display truncate">
            بطاقة الطالب الكاملة
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#EAB308] hover:bg-[#D99B00] text-[#0F1A36] rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة البطاقة</span>
            </button>
            <button
              type="button"
              onClick={() => onEdit(student)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>تعديل</span>
            </button>
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-rose-600 px-2 py-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(student.id);
                    onClose();
                  }}
                  className="text-xs font-bold text-white px-2 py-0.5 hover:underline cursor-pointer"
                >
                  تأكيد الحذف
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-rose-100 px-1.5 py-0.5 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            )}
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

        {/* Printable Dossier Content */}
        <div className="p-5 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          {/* Official School Card Header */}
          <div className="flex items-center justify-between gap-4 pb-5 border-b-2 border-[#111C38]">
            <div className="flex items-center gap-3.5">
              <SchoolLogo size="md" variant="light-bg" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#111C38] font-display">
                  مدرسة شمس المعارف الأساسية الأهلية
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  استمارة المعلومات المدرسية والصحية للطالب
                </p>
              </div>
            </div>
            <div className="text-left shrink-0">
              <div className="text-xs text-slate-500">رقم المقعد</div>
              <div className="text-base font-bold text-[#111C38] tabular-nums">
                {student.seatNumber || '—'}
              </div>
            </div>
          </div>

          {/* Student Primary Identity */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">الاسم الرباعي</div>
              <h3 className="text-xl font-bold text-[#111C38] font-display mt-0.5">
                {student.fullName}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1.5">
                <span>المرحلة: {stage}</span>
                <span aria-hidden="true">·</span>
                <span>الصف: {student.grade}</span>
                <span aria-hidden="true">·</span>
                <span>الشعبة: {student.section}</span>
                <span aria-hidden="true">·</span>
                <span>التسجيل: {student.registrationType}</span>
              </div>
            </div>
            <div className="text-xs sm:text-left space-y-1 text-slate-600 tabular-nums">
              <div>
                الحساب الذهني:{' '}
                <strong className="text-[#111C38]">
                  {student.mentalMath ? 'مشترك' : 'غير مشترك'}
                </strong>
              </div>
              <div>
                تاريخ الحجز: <strong>{student.seatReservationDate || '—'}</strong>
              </div>
              <div>
                التسجيل الفعلي:{' '}
                <strong>{student.actualRegistrationDate || 'قيد التأكيد'}</strong>
              </div>
            </div>
          </div>

          {/* Transfer Info if applicable */}
          {student.registrationType === 'نقل' && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm text-[#111C38]">
              <span className="text-slate-600">المدرسة المنقول منها: </span>
              <strong>{student.previousSchool || '—'}</strong>
            </div>
          )}

          {/* Chronic Illness Alert if applicable */}
          {student.hasChronicIllness && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-900">
              <div className="font-bold">تنبيه صحي (أمراض مزمنة):</div>
              <div className="mt-1">{student.chronicIllnessNotes || 'يوجد مرض مزمن مسجل'}</div>
            </div>
          )}

          {/* Family & Guardian Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-[#111C38] font-display pb-2 border-b border-slate-100">
                الوضع العائلي وبيانات الأب
              </h4>
              <dl className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">حالة الوالدين:</dt>
                  <dd className="font-medium text-[#111C38]">{student.parentStatus}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">يسكن الطالب مع:</dt>
                  <dd className="font-medium text-[#111C38]">{student.livesWith}</dd>
                </div>
                {needsGuardianDetails(student.livesWith) && (
                  <>
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">اسم ولي الأمر:</dt>
                      <dd className="font-semibold text-[#111C38]">
                        {student.guardianName || '—'}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">صلة القرابة:</dt>
                      <dd className="font-medium text-[#111C38]">
                        {student.guardianRelation || '—'}
                      </dd>
                    </div>
                  </>
                )}
                <div className="flex justify-between gap-2 pt-2 border-t border-slate-100">
                  <dt className="text-slate-500">تحصيل الأب:</dt>
                  <dd className="font-medium text-[#111C38]">{student.fatherEducation || '—'}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">مهنة الأب:</dt>
                  <dd className="font-medium text-[#111C38]">{student.fatherJob || '—'}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">هاتف الأب:</dt>
                  <dd className="font-semibold text-[#111C38] tabular-nums" dir="ltr">
                    {student.fatherPhone || '—'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-bold text-[#111C38] font-display pb-2 border-b border-slate-100">
                بيانات الأم والسكن والخط
              </h4>
              <dl className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">اسم الأم الثلاثي:</dt>
                  <dd className="font-medium text-[#111C38]">{student.motherFullName || '—'}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">تحصيل الأم:</dt>
                  <dd className="font-medium text-[#111C38]">{student.motherEducation || '—'}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">مهنة الأم:</dt>
                  <dd className="font-medium text-[#111C38]">{student.motherJob || '—'}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">هاتف الأم:</dt>
                  <dd className="font-semibold text-[#111C38] tabular-nums" dir="ltr">
                    {student.motherPhone || '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-2 pt-2 border-t border-slate-100">
                  <dt className="text-slate-500">المنطقة السكنية:</dt>
                  <dd className="font-semibold text-[#111C38]">{area?.name || 'غير محددة'}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">أقرب نقطة دالة:</dt>
                  <dd className="font-medium text-[#111C38] text-left">{student.landmark || '—'}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">النقل المدرسي:</dt>
                  <dd className="font-semibold text-[#111C38]">
                    {student.hasSchoolTransport
                      ? driver
                        ? `خط المدرسة · ${driver.name}`
                        : 'خط المدرسة'
                      : 'خط خاص (أهلي)'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Print Signature Footer */}
          <div className="hidden print:flex items-center justify-between pt-10 mt-6 border-t border-slate-200 text-xs text-slate-600">
            <span>توقيع ولي الأمر: ..........................</span>
            <span>ختم وتوقيع إدارة المدرسة: ..........................</span>
          </div>
        </div>
      </div>
    </div>
  );
};
