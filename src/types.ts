export type GradeLevel =
  | 'تمهيدي'
  | 'الأول الابتدائي'
  | 'الثاني الابتدائي'
  | 'الثالث الابتدائي'
  | 'الرابع الابتدائي'
  | 'الخامس الابتدائي'
  | 'السادس الابتدائي'
  | 'الأول المتوسط'
  | 'الثاني المتوسط'
  | 'الثالث المتوسط';

export type StageGroup = 'تمهيدي' | 'ابتدائي' | 'متوسط';

export type SectionLetter = 'أ' | 'ب' | 'ج' | 'د';

export type RegistrationType = 'جديد' | 'تجديد' | 'نقل';

export type ParentStatus =
  | 'كلاهما على قيد الحياة'
  | 'يتيم الأب'
  | 'يتيم الأم'
  | 'يتيم الأبوين';

export type LivesWithOption =
  | 'أب وأم'
  | 'أب'
  | 'أم'
  | 'جد / جدة'
  | 'عم / عمة'
  | 'خال / خالة'
  | 'ولي أمر آخر';

export interface Area {
  id: string;
  name: string;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  plateNumber?: string;
}

export interface Student {
  id: string;
  // الخطوة 1: بيانات الطالب والتسجيل
  fullName: string;
  grade: GradeLevel;
  section: SectionLetter;
  registrationType: RegistrationType;
  previousSchool?: string;
  mentalMath: boolean;
  seatNumber: string;
  seatReservationDate: string;
  actualRegistrationDate: string;

  // الخطوة 2: بيانات الوالدين وولي الأمر
  parentStatus: ParentStatus;
  livesWith: LivesWithOption;
  guardianName?: string;
  guardianRelation?: string;
  fatherEducation: string;
  fatherJob: string;
  fatherPhone: string;
  motherFullName: string;
  motherEducation: string;
  motherJob: string;
  motherPhone: string;

  // الخطوة 3: السكن والخط والحالة الصحية
  areaId: string;
  landmark: string;
  hasSchoolTransport: boolean;
  driverId?: string;
  hasChronicIllness: boolean;
  chronicIllnessNotes?: string;
}

export type ActiveSection = 'dashboard' | 'students' | 'areas' | 'drivers';

export const GRADE_LEVELS: GradeLevel[] = [
  'تمهيدي',
  'الأول الابتدائي',
  'الثاني الابتدائي',
  'الثالث الابتدائي',
  'الرابع الابتدائي',
  'الخامس الابتدائي',
  'السادس الابتدائي',
  'الأول المتوسط',
  'الثاني المتوسط',
  'الثالث المتوسط',
];

export const SECTION_LETTERS: SectionLetter[] = ['أ', 'ب', 'ج', 'د'];

export const REGISTRATION_TYPES: RegistrationType[] = ['جديد', 'تجديد', 'نقل'];

export const PARENT_STATUS_OPTIONS: ParentStatus[] = [
  'كلاهما على قيد الحياة',
  'يتيم الأب',
  'يتيم الأم',
  'يتيم الأبوين',
];

export const LIVES_WITH_OPTIONS: LivesWithOption[] = [
  'أب وأم',
  'أب',
  'أم',
  'جد / جدة',
  'عم / عمة',
  'خال / خالة',
  'ولي أمر آخر',
];

export const EDUCATION_LEVELS: string[] = [
  'ابتدائية',
  'متوسطة',
  'إعدادية',
  'دبلوم',
  'بكالوريوس',
  'ماجستير',
  'دكتوراه',
  'غير متفرغ / أخرى',
];

export function getStageFromGrade(grade: GradeLevel): StageGroup {
  if (grade === 'تمهيدي') return 'تمهيدي';
  if (grade.includes('الابتدائي')) return 'ابتدائي';
  return 'متوسط';
}

export function needsGuardianDetails(livesWith: LivesWithOption): boolean {
  return livesWith !== 'أب وأم';
}
