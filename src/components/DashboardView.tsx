import React, { useMemo } from 'react';
import {
  Users,
  MapPin,
  Bus,
  HeartPulse,
  Armchair,
  ArrowUpLeft,
  UserPlus,
} from 'lucide-react';
import { Area, Driver, Student, getStageFromGrade } from '../types';

interface DashboardViewProps {
  students: Student[];
  areas: Area[];
  drivers: Driver[];
  onNavigate: (section: 'students' | 'areas' | 'drivers') => void;
  onFilterChronicStudents: () => void;
  onSelectStudent: (student: Student) => void;
  onOpenAddStudent: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  areas,
  drivers,
  onNavigate,
  onFilterChronicStudents,
  onSelectStudent,
  onOpenAddStudent,
}) => {
  const stats = useMemo(() => {
    const total = students.length;
    const kgCount = students.filter((s) => getStageFromGrade(s.grade) === 'تمهيدي').length;
    const primaryCount = students.filter((s) => getStageFromGrade(s.grade) === 'ابتدائي').length;
    const middleCount = students.filter((s) => getStageFromGrade(s.grade) === 'متوسط').length;

    const schoolTransportCount = students.filter((s) => s.hasSchoolTransport).length;
    const privateTransportCount = total - schoolTransportCount;
    const mentalMathCount = students.filter((s) => s.mentalMath).length;

    const chronicStudents = students.filter((s) => s.hasChronicIllness);
    const reservedSeatsStudents = students.filter((s) => Boolean(s.seatNumber?.trim()));
    const pendingConfirmationSeats = reservedSeatsStudents.filter(
      (s) => !s.actualRegistrationDate?.trim()
    );

    const areaCounts = areas
      .map((area) => ({
        area,
        count: students.filter((s) => s.areaId === area.id).length,
      }))
      .sort((a, b) => b.count - a.count);

    const topAreas = areaCounts.filter((a) => a.count > 0).slice(0, 5);
    const topArea = areaCounts[0];

    const transportPercentage =
      total > 0 ? Math.round((schoolTransportCount / total) * 100) : 0;

    return {
      total,
      kgCount,
      primaryCount,
      middleCount,
      schoolTransportCount,
      privateTransportCount,
      transportPercentage,
      mentalMathCount,
      chronicStudents,
      reservedSeatsCount: reservedSeatsStudents.length,
      pendingConfirmationSeats,
      topAreas,
      topArea,
    };
  }, [students, areas]);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Quick Action Strip */}
      <div className="bg-[#111C38] text-white rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[#1E2E58]">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-white">
            ملخص المدرسة والإحصائيات التلقائية
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            تتحدث جميع الأرقام والتنبيهات تلقائياً عند إضافة أو تعديل بيانات الطلاب والمناطق والسائقين
          </p>
        </div>
        <button
          onClick={onOpenAddStudent}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EAB308] hover:bg-[#D99B00] text-[#0F1A36] font-bold text-sm rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      {/* Primary 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Total Students + Stage Split */}
        <button
          type="button"
          onClick={() => onNavigate('students')}
          className="text-right bg-white border border-slate-200 rounded-xl p-5 hover:border-[#111C38]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>إجمالي عدد الطلاب</span>
            <Users className="w-4 h-4 text-[#111C38]" />
          </div>
          <div className="text-3xl font-bold text-[#111C38] font-display mt-2 tabular-nums">
            {stats.total}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 flex-wrap tabular-nums">
            <span>تمهيدي: {stats.kgCount}</span>
            <span aria-hidden="true">·</span>
            <span>ابتدائي: {stats.primaryCount}</span>
            <span aria-hidden="true">·</span>
            <span>متوسط: {stats.middleCount}</span>
          </div>
        </button>

        {/* KPI 2: Areas & Top Area */}
        <button
          type="button"
          onClick={() => onNavigate('areas')}
          className="text-right bg-white border border-slate-200 rounded-xl p-5 hover:border-[#111C38]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>المناطق السكنية المسجلة</span>
            <MapPin className="w-4 h-4 text-[#0EA5E9]" />
          </div>
          <div className="text-3xl font-bold text-[#111C38] font-display mt-2 tabular-nums">
            {areas.length}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 truncate tabular-nums">
            {stats.topArea && stats.topArea.count > 0 ? (
              <span>
                الأكثر طلاباً: <strong className="text-[#111C38]">{stats.topArea.area.name}</strong> ({stats.topArea.count})
              </span>
            ) : (
              <span>لا يوجد طلاب مسجلون بعد</span>
            )}
          </div>
        </button>

        {/* KPI 3: Drivers & Transport Split */}
        <button
          type="button"
          onClick={() => onNavigate('drivers')}
          className="text-right bg-white border border-slate-200 rounded-xl p-5 hover:border-[#111C38]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>السائقون وخطوط المدرسة</span>
            <Bus className="w-4 h-4 text-[#D99B00]" />
          </div>
          <div className="text-3xl font-bold text-[#111C38] font-display mt-2 tabular-nums">
            {drivers.length}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 tabular-nums">
            <span>خط المدرسة: {stats.schoolTransportCount}</span>
            <span aria-hidden="true">·</span>
            <span>خط خاص: {stats.privateTransportCount}</span>
          </div>
        </button>

        {/* KPI 4: Quick Alerts Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>تنبيهات المتابعة السريعة</span>
            <HeartPulse className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2.5 space-y-2">
            <button
              type="button"
              onClick={onFilterChronicStudents}
              className="w-full flex items-center justify-between text-xs bg-rose-50 hover:bg-rose-100/80 text-rose-900 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <span className="font-medium">ذوو الأمراض المزمنة</span>
              <span className="font-bold tabular-nums text-sm">
                {stats.chronicStudents.length} طالب
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('students')}
              className="w-full flex items-center justify-between text-xs bg-amber-50 hover:bg-amber-100/80 text-amber-900 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <span className="font-medium">المقاعد المحجوزة</span>
              <span className="font-bold tabular-nums text-sm">
                {stats.reservedSeatsCount} مقعد
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Breakdown + Transport Comparison */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#111C38] font-display">
              توزيع الطلاب حسب المراحل الدراسية والنقل
            </h3>
            <span className="text-xs text-slate-500 tabular-nums">
              الحساب الذهني: {stats.mentalMathCount} طالب
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'مرحلة التمهيدي', count: stats.kgCount, color: 'bg-[#38BDF8]' },
              { label: 'المرحلة الابتدائية (الأول - السادس)', count: stats.primaryCount, color: 'bg-[#111C38]' },
              { label: 'المرحلة المتوسطة (الأول - الثالث)', count: stats.middleCount, color: 'bg-[#EAB308]' },
            ].map((item) => {
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-600 tabular-nums">
                      <strong className="text-[#111C38]">{item.count}</strong> طالب ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-[#111C38]">
                نسبة الاشتراك بخطوط المدرسة مقابل الخط الخاص
              </span>
              <span className="text-slate-600 tabular-nums">
                {stats.transportPercentage}% خط المدرسة
              </span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-[#0EA5E9] h-full transition-all duration-300"
                style={{ width: `${stats.transportPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
              <span>مشتركون بخط المدرسة: {stats.schoolTransportCount} طالب</span>
              <span>خط خاص (أهلي): {stats.privateTransportCount} طالب</span>
            </div>
          </div>
        </div>

        {/* Top Areas by Student Count */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#111C38] font-display">
                أكثر المناطق السكنية طلاباً
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('areas')}
                className="text-xs font-medium text-[#0EA5E9] hover:text-[#111C38] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>عرض كل المناطق</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {stats.topAreas.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                لا توجد بيانات طلاب موزعة على المناطق بعد.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {stats.topAreas.map((item, idx) => {
                  const pct =
                    stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                  return (
                    <div
                      key={item.area.id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-[#111C38] text-xs font-bold flex items-center justify-center tabular-nums shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#111C38] truncate">
                            {item.area.name}
                          </div>
                          {item.area.notes && (
                            <div className="text-xs text-slate-400 truncate">
                              {item.area.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:block w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#111C38] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#111C38] tabular-nums w-14 text-left">
                          {item.count} طالب
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Quick Alerts: Chronic Conditions & Pending Seat Confirmations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chronic Illnesses Alert List */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <h3 className="text-base font-bold text-[#111C38] font-display">
                تنبيهات الحالات الصحية والأمراض المزمنة
              </h3>
            </div>
            <button
              type="button"
              onClick={onFilterChronicStudents}
              className="text-xs font-medium text-[#0EA5E9] hover:text-[#111C38] cursor-pointer"
            >
              تصفية في جدول الطلاب
            </button>
          </div>

          {stats.chronicStudents.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              لا توجد حالات أمراض مزمنة مسجلة حالياً.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.chronicStudents.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => onSelectStudent(student)}
                  className="w-full text-right py-3 hover:bg-slate-50 px-2 rounded-lg transition-colors flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#111C38]">
                      {student.fullName}
                    </div>
                    <div className="text-xs text-rose-700 mt-0.5">
                      {student.chronicIllnessNotes || 'حالة مزمنة مسجلة'}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                    {student.grade} · {student.section}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Seat Reservations Alert List */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Armchair className="w-4 h-4 text-[#D99B00]" />
              <h3 className="text-base font-bold text-[#111C38] font-display">
                حجوزات المقاعد قيد تأكيد التسجيل الفعلي
              </h3>
            </div>
            <span className="text-xs text-slate-500 tabular-nums">
              إجمالي المحجوز: {stats.reservedSeatsCount}
            </span>
          </div>

          {stats.pendingConfirmationSeats.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              جميع المقاعد المحجوزة مكتملة التسجيل الفعلي.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.pendingConfirmationSeats.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => onSelectStudent(student)}
                  className="w-full text-right py-3 hover:bg-slate-50 px-2 rounded-lg transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#111C38]">
                      {student.fullName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                      {student.grade} · حجز بتاريخ {student.seatReservationDate || 'غير محدد'}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#111C38] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md tabular-nums shrink-0">
                    مقعد {student.seatNumber}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
