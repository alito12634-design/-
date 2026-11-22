import React, { useMemo, useState } from 'react';
import {
  Search,
  UserPlus,
  FileSpreadsheet,
  RotateCcw,
  HeartPulse,
} from 'lucide-react';
import {
  Area,
  Driver,
  GRADE_LEVELS,
  REGISTRATION_TYPES,
  SECTION_LETTERS,
  Student,
} from '../types';
import { exportStudentsToExcel } from '../utils/excelExport';

interface StudentsViewProps {
  students: Student[];
  areas: Area[];
  drivers: Driver[];
  onOpenAddStudent: () => void;
  onSelectStudent: (student: Student) => void;
  initialChronicFilter?: boolean;
  initialAreaFilter?: string;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  areas,
  drivers,
  onOpenAddStudent,
  onSelectStudent,
  initialChronicFilter = false,
  initialAreaFilter = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [mentalMathFilter, setMentalMathFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [chronicFilter, setChronicFilter] = useState<'all' | 'yes' | 'no'>(
    initialChronicFilter ? 'yes' : 'all'
  );
  const [regTypeFilter, setRegTypeFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState(initialAreaFilter);

  const areaMap = useMemo(() => new Map(areas.map((a) => [a.id, a.name])), [areas]);
  const driverMap = useMemo(() => new Map(drivers.map((d) => [d.id, d.name])), [drivers]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      if (q) {
        const matchesName = s.fullName.toLowerCase().includes(q);
        const matchesFatherPhone = s.fatherPhone.includes(q);
        const matchesMotherPhone = s.motherPhone.includes(q);
        const matchesSeat = s.seatNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesFatherPhone && !matchesMotherPhone && !matchesSeat) {
          return false;
        }
      }
      if (gradeFilter && s.grade !== gradeFilter) return false;
      if (sectionFilter && s.section !== sectionFilter) return false;
      if (mentalMathFilter === 'yes' && !s.mentalMath) return false;
      if (mentalMathFilter === 'no' && s.mentalMath) return false;
      if (chronicFilter === 'yes' && !s.hasChronicIllness) return false;
      if (chronicFilter === 'no' && s.hasChronicIllness) return false;
      if (regTypeFilter && s.registrationType !== regTypeFilter) return false;
      if (areaFilter && s.areaId !== areaFilter) return false;
      return true;
    });
  }, [
    students,
    searchQuery,
    gradeFilter,
    sectionFilter,
    mentalMathFilter,
    chronicFilter,
    regTypeFilter,
    areaFilter,
  ]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(gradeFilter) ||
    Boolean(sectionFilter) ||
    mentalMathFilter !== 'all' ||
    chronicFilter !== 'all' ||
    Boolean(regTypeFilter) ||
    Boolean(areaFilter);

  const resetFilters = () => {
    setSearchQuery('');
    setGradeFilter('');
    setSectionFilter('');
    setMentalMathFilter('all');
    setChronicFilter('all');
    setRegTypeFilter('');
    setAreaFilter('');
  };

  return (
    <div className="space-y-5">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#111C38] font-display">
            سجل الطلاب الكامل
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
            إجمالي المعروض: {filteredStudents.length} من أصل {students.length} طالب · اضغط على أي طالب لعرض بطاقته وطباعتها
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => exportStudentsToExcel(filteredStudents, areas, drivers)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#111C38] bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير إلى Excel</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddStudent}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-[#0F1A36] bg-[#EAB308] hover:bg-[#D99B00] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة طالب جديد</span>
          </button>
        </div>
      </div>

      {/* Search & Quick Filters Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث سريع بالاسم الرباعي، رقم الهاتف، أو رقم المقعد..."
              className="w-full pr-10 pl-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
            />
          </div>

          {/* Grade Filter */}
          <div className="md:col-span-3">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              aria-label="تصفية حسب الصف"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
            >
              <option value="">كل الصفوف</option>
              {GRADE_LEVELS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="md:col-span-2">
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              aria-label="تصفية حسب الشعبة"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
            >
              <option value="">كل الشعب</option>
              {SECTION_LETTERS.map((sec) => (
                <option key={sec} value={sec}>
                  شعبة {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div className="md:col-span-2">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              aria-label="تصفية حسب المنطقة"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
            >
              <option value="">كل المناطق</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Quick Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">نوع التسجيل:</span>
            <select
              value={regTypeFilter}
              onChange={(e) => setRegTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-[#111C38]"
            >
              <option value="">الكل</option>
              {REGISTRATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">الحساب الذهني:</span>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-md">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'yes', label: 'مشترك' },
                { id: 'no', label: 'غير مشترك' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMentalMathFilter(opt.id as 'all' | 'yes' | 'no')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer whitespace-nowrap ${
                    mentalMathFilter === opt.id
                      ? 'bg-white text-[#111C38] font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-[#111C38]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">الأمراض المزمنة:</span>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-md">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'yes', label: 'لديهم حالة' },
                { id: 'no', label: 'سليم' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChronicFilter(opt.id as 'all' | 'yes' | 'no')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer whitespace-nowrap ${
                    chronicFilter === opt.id
                      ? 'bg-white text-[#111C38] font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-[#111C38]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mr-auto inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>مسح الفلاتر</span>
            </button>
          )}
        </div>
      </div>

      {/* Data Display: Desktop Table + Mobile Card List */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-slate-600">
            لا توجد نتائج مطابقة لخيارات البحث أو الفلترة الحالية.
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold text-[#111C38] bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              عرض جميع الطلاب
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="px-4 py-2 text-xs font-bold text-[#0F1A36] bg-[#EAB308] hover:bg-[#D99B00] rounded-lg cursor-pointer"
            >
              إضافة أول طالب
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">الاسم الرباعي</th>
                  <th className="py-3 px-4">الصف والشعبة</th>
                  <th className="py-3 px-4">التسجيل والمقعد</th>
                  <th className="py-3 px-4">المنطقة والخط</th>
                  <th className="py-3 px-4">هاتف ولي الأمر</th>
                  <th className="py-3 px-4">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((student) => {
                  const areaName = areaMap.get(student.areaId) || '—';
                  const driverName =
                    student.hasSchoolTransport && student.driverId
                      ? driverMap.get(student.driverId)
                      : null;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => onSelectStudent(student)}
                      className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#111C38]">
                        <div>{student.fullName}</div>
                        <div className="text-xs font-normal text-slate-500 mt-0.5">
                          الأم: {student.motherFullName || '—'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div>{student.grade}</div>
                        <div className="text-xs text-slate-500">شعبة {student.section}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 tabular-nums">
                        <div>{student.registrationType}</div>
                        <div className="text-xs text-slate-500">
                          مقعد {student.seatNumber || '—'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-medium text-[#111C38]">{areaName}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">
                          {driverName ? `خط: ${driverName}` : 'خط خاص'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 tabular-nums">
                        <div dir="ltr" className="text-right font-medium">
                          {student.fatherPhone || student.motherPhone || '—'}
                        </div>
                        {student.fatherPhone && student.motherPhone && (
                          <div dir="ltr" className="text-right text-xs text-slate-400">
                            {student.motherPhone}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="space-y-1">
                          {student.mentalMath && (
                            <div className="text-[#0EA5E9] font-medium">حساب ذهني</div>
                          )}
                          {student.hasChronicIllness && (
                            <div className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                              <HeartPulse className="w-3.5 h-3.5 shrink-0" />
                              <span>مرض مزمن</span>
                            </div>
                          )}
                          {!student.mentalMath && !student.hasChronicIllness && (
                            <span className="text-slate-400">اعتيادي</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Cards */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredStudents.map((student) => {
              const areaName = areaMap.get(student.areaId) || '—';
              return (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => onSelectStudent(student)}
                  className="w-full text-right p-4 hover:bg-slate-50 transition-colors space-y-2 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-[#111C38] text-sm">
                      {student.fullName}
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums shrink-0">
                      مقعد {student.seatNumber || '—'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>
                      {student.grade} - {student.section}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{areaName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{student.hasSchoolTransport ? 'خط المدرسة' : 'خط خاص'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 tabular-nums" dir="ltr">
                      {student.fatherPhone || student.motherPhone}
                    </span>
                    <div className="flex items-center gap-2">
                      {student.mentalMath && (
                        <span className="text-[#0EA5E9] font-medium">حساب ذهني</span>
                      )}
                      {student.hasChronicIllness && (
                        <span className="text-rose-600 font-semibold">مرض مزمن</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
