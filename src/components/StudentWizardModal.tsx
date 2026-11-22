import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  Area,
  Driver,
  EDUCATION_LEVELS,
  GRADE_LEVELS,
  GradeLevel,
  LIVES_WITH_OPTIONS,
  LivesWithOption,
  PARENT_STATUS_OPTIONS,
  ParentStatus,
  REGISTRATION_TYPES,
  RegistrationType,
  SECTION_LETTERS,
  SectionLetter,
  Student,
  needsGuardianDetails,
} from '../types';

interface StudentWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  areas: Area[];
  drivers: Driver[];
  editingStudent?: Student | null;
}

const createEmptyForm = (areas: Area[]): Omit<Student, 'id'> => ({
  fullName: '',
  grade: 'الأول الابتدائي',
  section: 'أ',
  registrationType: 'جديد',
  previousSchool: '',
  mentalMath: false,
  seatNumber: '',
  seatReservationDate: new Date().toISOString().split('T')[0],
  actualRegistrationDate: '',
  parentStatus: 'كلاهما على قيد الحياة',
  livesWith: 'أب وأم',
  guardianName: '',
  guardianRelation: '',
  fatherEducation: 'بكالوريوس',
  fatherJob: '',
  fatherPhone: '',
  motherFullName: '',
  motherEducation: 'بكالوريوس',
  motherJob: '',
  motherPhone: '',
  areaId: areas[0]?.id || '',
  landmark: '',
  hasSchoolTransport: false,
  driverId: '',
  hasChronicIllness: false,
  chronicIllnessNotes: '',
});

export const StudentWizardModal: React.FC<StudentWizardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  areas,
  drivers,
  editingStudent,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<Omit<Student, 'id'>>(() => createEmptyForm(areas));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setError('');
    if (editingStudent) {
      const { id: _id, ...rest } = editingStudent;
      setForm({
        ...createEmptyForm(areas),
        ...rest,
      });
    } else {
      setForm(createEmptyForm(areas));
    }
  }, [isOpen, editingStudent, areas]);

  if (!isOpen) return null;

  const updateField = <K extends keyof Omit<Student, 'id'>>(
    key: K,
    value: Omit<Student, 'id'>[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  const validateStep = (currentStep: 1 | 2 | 3): boolean => {
    if (currentStep === 1) {
      if (!form.fullName.trim()) {
        setError('يرجى كتابة الاسم الرباعي للطالب.');
        return false;
      }
      if (form.registrationType === 'نقل' && !form.previousSchool?.trim()) {
        setError('يرجى كتابة اسم المدرسة المنقول منها.');
        return false;
      }
      if (!form.seatNumber.trim()) {
        setError('يرجى إدخال رقم المقعد المحجوز.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (needsGuardianDetails(form.livesWith)) {
        if (!form.guardianName?.trim() || !form.guardianRelation?.trim()) {
          setError('يرجى إدخال اسم ولي الأمر وصلة القرابة.');
          return false;
        }
      }
      if (!form.fatherPhone.trim() && !form.motherPhone.trim()) {
        setError('يرجى إدخال رقم هاتف الأب أو الأم للتواصل.');
        return false;
      }
      if (!form.motherFullName.trim()) {
        setError('يرجى إدخال اسم الأم الثلاثي.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!form.areaId) {
        setError('يرجى اختيار المنطقة السكنية.');
        return false;
      }
      if (!form.landmark.trim()) {
        setError('يرجى كتابة أقرب نقطة دالة للسكن.');
        return false;
      }
      if (form.hasSchoolTransport && !form.driverId) {
        setError('يرجى اختيار اسم السائق (أبو الخط) أو إلغاء الاشتراك بخط المدرسة.');
        return false;
      }
      if (form.hasChronicIllness && !form.chronicIllnessNotes?.trim()) {
        setError('يرجى توضيح نوع المرض المزمن أو الملاحظات الصحية.');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => (prev === 1 ? 2 : 3));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const cleanStudent: Student = {
      id: editingStudent?.id || `std-${Date.now()}`,
      ...form,
      fullName: form.fullName.trim(),
      previousSchool:
        form.registrationType === 'نقل' ? form.previousSchool?.trim() : undefined,
      guardianName: needsGuardianDetails(form.livesWith)
        ? form.guardianName?.trim()
        : undefined,
      guardianRelation: needsGuardianDetails(form.livesWith)
        ? form.guardianRelation?.trim()
        : undefined,
      driverId: form.hasSchoolTransport ? form.driverId : undefined,
      chronicIllnessNotes: form.hasChronicIllness
        ? form.chronicIllnessNotes?.trim()
        : undefined,
    };

    onSave(cleanStudent);
    onClose();
  };

  const stepLabels = [
    { num: 1, title: 'بيانات الطالب والتسجيل' },
    { num: 2, title: 'الوالدان وولي الأمر' },
    { num: 3, title: 'السكن والخط والصحة' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F1A36]/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-[#111C38] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display">
              {editingStudent ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              الخطوة {step} من 3 · {stepLabels[step - 1].title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 grid grid-cols-3 gap-2">
          {stepLabels.map((item) => {
            const isActive = step === item.num;
            const isDone = step > item.num;
            return (
              <button
                key={item.num}
                type="button"
                onClick={() => {
                  if (item.num < step) setStep(item.num);
                }}
                className={`flex items-center gap-2 text-right px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-white border border-slate-200 text-[#111C38] font-bold shadow-xs'
                    : isDone
                      ? 'text-emerald-700 font-medium cursor-pointer'
                      : 'text-slate-400 cursor-default'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs flex items-center justify-center shrink-0 tabular-nums ${
                    isActive
                      ? 'bg-[#111C38] text-white'
                      : isDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : item.num}
                </span>
                <span className="text-xs truncate hidden sm:inline">{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg px-3.5 py-2.5">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  الاسم الرباعي واللقب <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="مثال: علي حسين جبار الكعبي"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    الصف الدراسي
                  </label>
                  <select
                    value={form.grade}
                    onChange={(e) => updateField('grade', e.target.value as GradeLevel)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                  >
                    {GRADE_LEVELS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    الشعبة
                  </label>
                  <select
                    value={form.section}
                    onChange={(e) => updateField('section', e.target.value as SectionLetter)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                  >
                    {SECTION_LETTERS.map((sec) => (
                      <option key={sec} value={sec}>
                        شعبة {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    نوع التسجيل
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
                    {REGISTRATION_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateField('registrationType', type as RegistrationType)}
                        className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          form.registrationType === type
                            ? 'bg-[#111C38] text-white'
                            : 'text-slate-600 hover:text-[#111C38]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    الاشتراك في برنامج الحساب الذهني
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => updateField('mentalMath', true)}
                      className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        form.mentalMath
                          ? 'bg-[#111C38] text-white'
                          : 'text-slate-600 hover:text-[#111C38]'
                      }`}
                    >
                      نعم (مشترك)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('mentalMath', false)}
                      className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        !form.mentalMath
                          ? 'bg-white text-[#111C38] shadow-xs'
                          : 'text-slate-600 hover:text-[#111C38]'
                      }`}
                    >
                      لا
                    </button>
                  </div>
                </div>
              </div>

              {form.registrationType === 'نقل' && (
                <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
                  <label className="block text-sm font-medium text-[#111C38] mb-1.5">
                    اسم المدرسة المنقول منها <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.previousSchool || ''}
                    onChange={(e) => updateField('previousSchool', e.target.value)}
                    placeholder="اكتب اسم المدرسة السابقة بالكامل"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-sky-200 rounded-lg focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <div className="text-sm font-semibold text-[#111C38] mb-3">
                  تفاصيل حجز المقعد والتسجيل
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      رقم المقعد <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.seatNumber}
                      onChange={(e) => updateField('seatNumber', e.target.value)}
                      placeholder="مثال: A-101"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      تاريخ حجز المقعد
                    </label>
                    <input
                      type="date"
                      value={form.seatReservationDate}
                      onChange={(e) => updateField('seatReservationDate', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      تاريخ التسجيل الفعلي
                    </label>
                    <input
                      type="date"
                      value={form.actualRegistrationDate}
                      onChange={(e) => updateField('actualRegistrationDate', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38] tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    حالة الوالدين
                  </label>
                  <select
                    value={form.parentStatus}
                    onChange={(e) => updateField('parentStatus', e.target.value as ParentStatus)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                  >
                    {PARENT_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    مع من يسكن الطالب؟
                  </label>
                  <select
                    value={form.livesWith}
                    onChange={(e) => updateField('livesWith', e.target.value as LivesWithOption)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                  >
                    {LIVES_WITH_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {needsGuardianDetails(form.livesWith) && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111C38] mb-1">
                      اسم ولي الأمر المسؤول <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.guardianName || ''}
                      onChange={(e) => updateField('guardianName', e.target.value)}
                      placeholder="الاسم الكامل لولي الأمر"
                      className="w-full px-3 py-2 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:border-[#D99B00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111C38] mb-1">
                      صلة القرابة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.guardianRelation || ''}
                      onChange={(e) => updateField('guardianRelation', e.target.value)}
                      placeholder="مثال: الجد، العم، الخال..."
                      className="w-full px-3 py-2 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:border-[#D99B00]"
                    />
                  </div>
                </div>
              )}

              {/* Father Info */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-sm font-semibold text-[#111C38] mb-3">بيانات الأب</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      التحصيل الدراسي
                    </label>
                    <select
                      value={form.fatherEducation}
                      onChange={(e) => updateField('fatherEducation', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                    >
                      {EDUCATION_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      المهنة
                    </label>
                    <input
                      type="text"
                      value={form.fatherJob}
                      onChange={(e) => updateField('fatherJob', e.target.value)}
                      placeholder="مثال: مهندس، كاسب..."
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      رقم هاتف الأب
                    </label>
                    <input
                      type="tel"
                      value={form.fatherPhone}
                      onChange={(e) => updateField('fatherPhone', e.target.value)}
                      placeholder="0770xxxxxxx"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38] tabular-nums text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Mother Info */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-sm font-semibold text-[#111C38] mb-3">بيانات الأم</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      اسم الأم الثلاثي <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.motherFullName}
                      onChange={(e) => updateField('motherFullName', e.target.value)}
                      placeholder="الاسم الثلاثي للأم"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      رقم هاتف الأم
                    </label>
                    <input
                      type="tel"
                      value={form.motherPhone}
                      onChange={(e) => updateField('motherPhone', e.target.value)}
                      placeholder="0780xxxxxxx"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38] tabular-nums text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      التحصيل الدراسي للأم
                    </label>
                    <select
                      value={form.motherEducation}
                      onChange={(e) => updateField('motherEducation', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                    >
                      {EDUCATION_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      مهنة الأم
                    </label>
                    <input
                      type="text"
                      value={form.motherJob}
                      onChange={(e) => updateField('motherJob', e.target.value)}
                      placeholder="مثال: معلمة، ربة بيت..."
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    المنطقة السكنية <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.areaId}
                    onChange={(e) => updateField('areaId', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                  >
                    <option value="">— اختر المنطقة من القائمة —</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    أقرب نقطة دالة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.landmark}
                    onChange={(e) => updateField('landmark', e.target.value)}
                    placeholder="مثال: قرب جامع أم الطبول"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#111C38]"
                  />
                </div>
              </div>

              {/* School Transport Toggle */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  هل الطالب مشترك بخط المدرسة؟
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg max-w-sm">
                  <button
                    type="button"
                    onClick={() => updateField('hasSchoolTransport', true)}
                    className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      form.hasSchoolTransport
                        ? 'bg-[#111C38] text-white'
                        : 'text-slate-600 hover:text-[#111C38]'
                    }`}
                  >
                    نعم (مشترك بخط المدرسة)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('hasSchoolTransport', false);
                      updateField('driverId', '');
                    }}
                    className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      !form.hasSchoolTransport
                        ? 'bg-white text-[#111C38] shadow-xs'
                        : 'text-slate-600 hover:text-[#111C38]'
                    }`}
                  >
                    لا (خط خاص)
                  </button>
                </div>

                {form.hasSchoolTransport && (
                  <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4">
                    <label className="block text-xs font-semibold text-[#111C38] mb-1.5">
                      اختر السائق (أبو الخط) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.driverId || ''}
                      onChange={(e) => updateField('driverId', e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-sky-200 rounded-lg focus:outline-none focus:border-[#0EA5E9]"
                    >
                      <option value="">— اختر اسم أبو الخط —</option>
                      {drivers.map((drv) => (
                        <option key={drv.id} value={drv.id}>
                          {drv.name} · {drv.vehicleType}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Chronic Illness Toggle */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  هل يعاني الطالب من أمراض مزمنة أو حساسية خاصة؟
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg max-w-sm">
                  <button
                    type="button"
                    onClick={() => updateField('hasChronicIllness', true)}
                    className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      form.hasChronicIllness
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-600 hover:text-[#111C38]'
                    }`}
                  >
                    نعم (يوجد مرض مزمن)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('hasChronicIllness', false);
                      updateField('chronicIllnessNotes', '');
                    }}
                    className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      !form.hasChronicIllness
                        ? 'bg-white text-[#111C38] shadow-xs'
                        : 'text-slate-600 hover:text-[#111C38]'
                    }`}
                  >
                    لا (سليم)
                  </button>
                </div>

                {form.hasChronicIllness && (
                  <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
                    <label className="block text-xs font-semibold text-rose-900 mb-1.5">
                      نوع المرض المزمن أو الملاحظات الصحية <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.chronicIllnessNotes || ''}
                      onChange={(e) => updateField('chronicIllnessNotes', e.target.value)}
                      placeholder="اكتب اسم المرض والتعليمات الطبية الضرورية لإدارة المدرسة..."
                      className="w-full px-3.5 py-2 text-sm bg-white border border-rose-200 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Navigation Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev === 3 ? 2 : 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  إلغاء
                </button>
              )}
            </div>

            <div>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-[#111C38] hover:bg-[#19284D] rounded-lg transition-colors cursor-pointer"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-[#0F1A36] bg-[#EAB308] hover:bg-[#D99B00] rounded-lg transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingStudent ? 'حفظ التعديلات' : 'حفظ وإضافة الطالب'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
