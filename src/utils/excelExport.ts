import * as XLSX from 'xlsx';
import { Area, Driver, Student, getStageFromGrade } from '../types';

function saveWorkbook(rows: Record<string, string | number>[], sheetName: string, fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!views'] = [{ rightToLeft: true }];

  // Auto-fit column widths based on header and cell content
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  worksheet['!cols'] = headers.map((header) => {
    const maxLen = Math.max(
      header.length,
      ...rows.map((r) => String(r[header] ?? '').length)
    );
    return { wch: Math.min(Math.max(maxLen + 5, 14), 45) };
  });

  const workbook = XLSX.utils.book_new();
  workbook.Workbook = { Views: [{ RTL: true }] };
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function exportStudentsToExcel(
  students: Student[],
  areas: Area[],
  drivers: Driver[],
  fileName = 'سجل_طلاب_شمس_المعارف'
) {
  const areaMap = new Map(areas.map((a) => [a.id, a.name]));
  const driverMap = new Map(drivers.map((d) => [d.id, d.name]));

  const rows = students.map((s, idx) => ({
    'ت': idx + 1,
    'الاسم الرباعي': s.fullName,
    'المرحلة': getStageFromGrade(s.grade),
    'الصف': s.grade,
    'الشعبة': s.section,
    'نوع التسجيل': s.registrationType,
    'المدرسة المنقول منها': s.registrationType === 'نقل' ? s.previousSchool || '—' : '—',
    'الحساب الذهني': s.mentalMath ? 'نعم' : 'لا',
    'رقم المقعد': s.seatNumber || '—',
    'تاريخ الحجز': s.seatReservationDate || '—',
    'تاريخ التسجيل الفعلي': s.actualRegistrationDate || 'قيد التأكيد',
    'حالة الوالدين': s.parentStatus,
    'يسكن مع': s.livesWith,
    'اسم ولي الأمر': s.guardianName || '—',
    'صلة القرابة': s.guardianRelation || '—',
    'تحصيل الأب': s.fatherEducation || '—',
    'مهنة الأب': s.fatherJob || '—',
    'هاتف الأب': s.fatherPhone || '—',
    'اسم الأم الثلاثي': s.motherFullName || '—',
    'تحصيل الأم': s.motherEducation || '—',
    'مهنة الأم': s.motherJob || '—',
    'هاتف الأم': s.motherPhone || '—',
    'المنطقة السكنية': areaMap.get(s.areaId) || 'غير محددة',
    'أقرب نقطة دالة': s.landmark || '—',
    'اشتراك الخط': s.hasSchoolTransport ? 'خط المدرسة' : 'خط خاص',
    'اسم السائق (أبو الخط)': s.hasSchoolTransport && s.driverId ? driverMap.get(s.driverId) || '—' : '—',
    'أمراض مزمنة': s.hasChronicIllness ? 'نعم' : 'لا',
    'تفاصيل الحالة الصحية': s.hasChronicIllness ? s.chronicIllnessNotes || '—' : 'لا توجد',
  }));

  saveWorkbook(rows, 'سجل الطلاب', fileName);
}

export function exportAreasToExcel(
  areaStats: {
    area: Area;
    studentCount: number;
    transportCount: number;
    driverCount: number;
  }[]
) {
  const rows = areaStats.map((item, idx) => ({
    'ت': idx + 1,
    'اسم المنطقة': item.area.name,
    'عدد الطلاب الساكنين': item.studentCount,
    'المشتركون بخط المدرسة': item.transportCount,
    'خط خاص': item.studentCount - item.transportCount,
    'عدد السواق المغطين للمنطقة': item.driverCount,
    'ملاحظات / نطاق المنطقة': item.area.notes || '—',
  }));

  saveWorkbook(rows, 'المناطق السكنية', 'جدول_المناطق_شمس_المعارف');
}

export function exportDriversToExcel(
  driverStats: {
    driver: Driver;
    studentCount: number;
    coveredAreasCount: number;
    coveredAreaNames: string[];
  }[]
) {
  const rows = driverStats.map((item, idx) => ({
    'ت': idx + 1,
    'اسم السائق (أبو الخط)': item.driver.name,
    'رقم الهاتف': item.driver.phone,
    'نوع السيارة': item.driver.vehicleType,
    'رقم اللوحة': item.driver.plateNumber || '—',
    'عدد الطلاب': item.studentCount,
    'عدد المناطق المغطاة': item.coveredAreasCount,
    'أسماء المناطق': item.coveredAreaNames.join('، ') || 'لا توجد مناطق بعد',
  }));

  saveWorkbook(rows, 'جدول الخطوط والسائقين', 'جدول_الخطوط_شمس_المعارف');
}

export function exportDriverRosterToExcel(
  driver: Driver,
  students: Student[],
  areas: Area[]
) {
  const areaMap = new Map(areas.map((a) => [a.id, a.name]));
  const rows = students.map((s, idx) => ({
    'ت': idx + 1,
    'اسم الطالب': s.fullName,
    'الصف والشعبة': `${s.grade} - ${s.section}`,
    'المنطقة السكنية': areaMap.get(s.areaId) || 'غير محددة',
    'أقرب نقطة دالة': s.landmark,
    'هاتف الأب': s.fatherPhone,
    'هاتف الأم': s.motherPhone,
  }));

  saveWorkbook(rows, `كشف ${driver.name.split(' ')[0]}`, `كشف_خط_${driver.name.replace(/\s+/g, '_')}`);
}
