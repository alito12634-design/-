import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  MapPin,
  Bus,
  LogOut,
  Menu,
  X,
  UserPlus,
  RotateCcw,
  KeyRound,
} from 'lucide-react';
import { ActiveSection, Area, Driver, Student } from './types';
import { INITIAL_AREAS, INITIAL_DRIVERS, INITIAL_STUDENTS } from './data/seedData';
import { SchoolLogo } from './components/SchoolLogo';
import { LoginScreen } from './components/LoginScreen';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { AreasView } from './components/AreasView';
import { DriversView } from './components/DriversView';
import { StudentWizardModal } from './components/StudentWizardModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { DriverRosterModal } from './components/DriverRosterModal';
import {
  AccountSettingsModal,
  AdminCredentials,
} from './components/AccountSettingsModal';

const STORAGE_KEYS = {
  AUTH: 'shams_admin_auth_v1',
  CREDENTIALS: 'shams_admin_credentials_v1',
  STUDENTS: 'shams_students_v1',
  AREAS: 'shams_areas_v1',
  DRIVERS: 'shams_drivers_v1',
};

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'shams2026',
  isCustom: false,
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [adminUser, setAdminUser] = useState<string | null>(() =>
    loadFromStorage<string | null>(STORAGE_KEYS.AUTH, null)
  );
  const [credentials, setCredentials] = useState<AdminCredentials>(() =>
    loadFromStorage<AdminCredentials>(STORAGE_KEYS.CREDENTIALS, DEFAULT_CREDENTIALS)
  );
  const [students, setStudents] = useState<Student[]>(() =>
    loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
  );
  const [areas, setAreas] = useState<Area[]>(() =>
    loadFromStorage<Area[]>(STORAGE_KEYS.AREAS, INITIAL_AREAS)
  );
  const [drivers, setDrivers] = useState<Driver[]>(() =>
    loadFromStorage<Driver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS)
  );

  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contextual navigation filters for StudentsView
  const [studentsViewKey, setStudentsViewKey] = useState(0);
  const [initialChronicFilter, setInitialChronicFilter] = useState(false);
  const [initialAreaFilter, setInitialAreaFilter] = useState('');

  // Modals state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(adminUser));
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  }, [drivers]);

  if (!adminUser) {
    return (
      <LoginScreen
        credentials={credentials}
        onLogin={(name) => setAdminUser(name)}
      />
    );
  }

  const navigateTo = (section: ActiveSection) => {
    if (section === 'students') {
      setInitialChronicFilter(false);
      setInitialAreaFilter('');
      setStudentsViewKey((k) => k + 1);
    }
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const navigateToChronicStudents = () => {
    setInitialChronicFilter(true);
    setInitialAreaFilter('');
    setStudentsViewKey((k) => k + 1);
    setActiveSection('students');
  };

  const navigateToAreaStudents = (areaId: string) => {
    setInitialChronicFilter(false);
    setInitialAreaFilter(areaId);
    setStudentsViewKey((k) => k + 1);
    setActiveSection('students');
  };

  const handleSaveStudent = (studentData: Student) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === studentData.id);
      if (exists) {
        return prev.map((s) => (s.id === studentData.id ? studentData : s));
      }
      return [studentData, ...prev];
    });
    if (selectedStudent?.id === studentData.id) {
      setSelectedStudent(studentData);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleResetDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setAreas(INITIAL_AREAS);
    setDrivers(INITIAL_DRIVERS);
    setConfirmReset(false);
  };

  const navItems: {
    id: ActiveSection;
    label: string;
    icon: React.FC<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'dashboard', label: 'لوحة التحكم الرئيسية', icon: LayoutDashboard },
    { id: 'students', label: 'قسم الطلاب', icon: Users, count: students.length },
    { id: 'areas', label: 'قسم المناطق', icon: MapPin, count: areas.length },
    { id: 'drivers', label: 'قسم الخطوط', icon: Bus, count: drivers.length },
  ];

  const sectionTitles: Record<ActiveSection, string> = {
    dashboard: 'لوحة التحكم الرئيسية',
    students: 'قسم الطلاب',
    areas: 'قسم المناطق السكنية',
    drivers: 'قسم الخطوط والسائقين',
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0F1A36] flex">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0F1A36]/50 lg:hidden no-print"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 z-40 h-screen w-[270px] bg-[#111C38] text-white flex flex-col justify-between shrink-0 transition-transform duration-200 no-print ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* School Brand in Sidebar */}
          <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <SchoolLogo size="md" variant="dark-bg" />
              <div className="min-w-0">
                <div className="text-sm font-bold font-display leading-snug text-white">
                  مدرسة شمس المعارف
                </div>
                <div className="text-xs text-[#EAB308] font-medium truncate">
                  الأساسية الأهلية
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="إغلاق القائمة"
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4 Linked Navigation Sections */}
          <nav className="p-3.5 space-y-1.5" aria-label="القائمة الرئيسية">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#EAB308] text-[#0F1A36] font-bold'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#0F1A36]' : 'text-[#38BDF8]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {typeof item.count === 'number' && (
                    <span
                      className={`text-xs tabular-nums ${
                        isActive ? 'text-[#0F1A36]/80 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setAccountSettingsOpen(true);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#EAB308] shrink-0" />
            <span>تغيير اليوزر والرمز</span>
          </button>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>استعادة البيانات التجريبية</span>
            </button>
          ) : (
            <div className="bg-white/10 rounded-lg p-2.5 text-xs space-y-2">
              <div className="text-slate-200">إعادة ضبط البيانات الافتراضية؟</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="px-2.5 py-1 bg-[#EAB308] text-[#0F1A36] font-bold rounded cursor-pointer"
                >
                  تأكيد
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 text-slate-300 hover:text-white cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setAdminUser(null)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-rose-200 hover:bg-rose-500/15 rounded-lg transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </span>
            <span className="text-slate-400 truncate max-w-[90px]">{adminUser}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col no-print">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="فتح القائمة"
              className="lg:hidden p-2 -mr-1 text-[#111C38] hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <SchoolLogo size="sm" variant="light-bg" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-[#111C38] font-display truncate">
                  مدرسة شمس المعارف الأساسية الأهلية
                </h1>
                <div className="text-xs text-slate-500 truncate">
                  {sectionTitles[activeSection]}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingStudent(null);
              setWizardOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#111C38] hover:bg-[#19284D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#EAB308]" />
            <span className="hidden sm:inline">إضافة طالب جديد</span>
            <span className="sm:hidden">طالب جديد</span>
          </button>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {activeSection === 'dashboard' && (
            <DashboardView
              students={students}
              areas={areas}
              drivers={drivers}
              onNavigate={(sec) => navigateTo(sec)}
              onFilterChronicStudents={navigateToChronicStudents}
              onSelectStudent={(std) => setSelectedStudent(std)}
              onOpenAddStudent={() => {
                setEditingStudent(null);
                setWizardOpen(true);
              }}
            />
          )}

          {activeSection === 'students' && (
            <StudentsView
              key={studentsViewKey}
              students={students}
              areas={areas}
              drivers={drivers}
              onOpenAddStudent={() => {
                setEditingStudent(null);
                setWizardOpen(true);
              }}
              onSelectStudent={(std) => setSelectedStudent(std)}
              initialChronicFilter={initialChronicFilter}
              initialAreaFilter={initialAreaFilter}
            />
          )}

          {activeSection === 'areas' && (
            <AreasView
              areas={areas}
              students={students}
              onAddArea={(area) => setAreas((prev) => [...prev, area])}
              onUpdateArea={(area) =>
                setAreas((prev) => prev.map((a) => (a.id === area.id ? area : a)))
              }
              onDeleteArea={(areaId) =>
                setAreas((prev) => prev.filter((a) => a.id !== areaId))
              }
              onViewAreaStudents={navigateToAreaStudents}
            />
          )}

          {activeSection === 'drivers' && (
            <DriversView
              drivers={drivers}
              students={students}
              areas={areas}
              onAddDriver={(drv) => setDrivers((prev) => [...prev, drv])}
              onUpdateDriver={(drv) =>
                setDrivers((prev) => prev.map((d) => (d.id === drv.id ? drv : d)))
              }
              onDeleteDriver={(drvId) =>
                setDrivers((prev) => prev.filter((d) => d.id !== drvId))
              }
              onSelectDriver={(drv) => setSelectedDriver(drv)}
            />
          )}
        </main>
      </div>

      {/* Modals rendered outside .no-print so Print view prints cleanly */}
      <StudentWizardModal
        isOpen={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        areas={areas}
        drivers={drivers}
        editingStudent={editingStudent}
      />

      <StudentProfileModal
        student={selectedStudent}
        areas={areas}
        drivers={drivers}
        onClose={() => setSelectedStudent(null)}
        onEdit={(std) => {
          setSelectedStudent(null);
          setEditingStudent(std);
          setWizardOpen(true);
        }}
        onDelete={handleDeleteStudent}
      />

      <DriverRosterModal
        driver={selectedDriver}
        students={students}
        areas={areas}
        onClose={() => setSelectedDriver(null)}
      />

      <AccountSettingsModal
        isOpen={accountSettingsOpen}
        onClose={() => setAccountSettingsOpen(false)}
        credentials={credentials}
        onUpdateCredentials={(next) => {
          setCredentials(next);
          setAdminUser(next.username);
        }}
      />
    </div>
  );
}
