import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface Translation {
  [key: string]: string | Translation;
}

export const en: Translation = {
  common: {
    appName: "Smart Mobility Simulator",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    refresh: "Refresh",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    reset: "Reset",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
  },
  auth: {
    login: "Login",
    logout: "Logout",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    firstName: "First Name",
    lastName: "Last Name",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    rememberMe: "Remember Me",
    loginTitle: "Sign In to Smart Mobility Simulator",
    welcomeBack: "Welcome back! Please sign in to continue.",
    invalidCredentials: "Invalid email or password",
    accountLocked: "Account is locked",
    passwordChanged: "Password changed successfully",
    passwordResetSent: "Password reset link sent to your email",
  },
  nav: {
    home: "Home",
    zones: "Zones",
    simulations: "Simulations",
    reports: "Reports",
    settings: "Settings",
    userManagement: "User Management",
    profile: "Profile",
  },
  zones: {
    title: "Traffic Zones",
    addZone: "Add Zone",
    editZone: "Edit Zone",
    zoneName: "Zone Name",
    emirate: "Emirate",
    zoneType: "Zone Type",
    chargePerHour: "Charge per Hour (AED)",
    residential: "Residential",
    commercial: "Commercial",
    mixed: "Mixed Use",
    peakHour: "Peak Hour",
  },
  simulation: {
    title: "Simulation",
    run: "Run Simulation",
    stop: "Stop",
    results: "Results",
    parameters: "Parameters",
    totalVehicles: "Total Vehicles",
    vehiclesDiverted: "Vehicles Diverted",
    congestionReduction: "Congestion Reduction",
    estimatedRevenue: "Estimated Revenue",
    equityImpact: "Equity Impact",
  },
  dashboard: {
    title: "Dashboard",
    overview: "Overview",
    statistics: "Statistics",
    recentActivity: "Recent Activity",
  },
  user: {
    title: "Users",
    addUser: "Add User",
    editUser: "Edit User",
    role: "Role",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
    createdAt: "Created At",
    lastLogin: "Last Login",
  },
};

export const ar: Translation = {
  common: {
    appName: "محاكي التنقل الذكي",
    loading: "جاري التحميل...",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    search: "بحث",
    filter: "تصفية",
    export: "تصدير",
    import: "استيراد",
    refresh: "تحديث",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    submit: "إرسال",
    reset: "إعادة تعيين",
    confirm: "تأكيد",
    yes: "نعم",
    no: "لا",
    success: "نجاح",
    error: "خطأ",
    warning: "تحذير",
    info: "معلومات",
  },
  auth: {
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    register: "تسجيل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    forgotPassword: "نسيت كلمة المرور؟",
    resetPassword: "إعادة تعيين كلمة المرور",
    changePassword: "تغيير كلمة المرور",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    rememberMe: "تذكرني",
    loginTitle: "تسجيل الدخول إلى محاكي التنقل الذكي",
    welcomeBack: "مرحباً بعودتك! يرجى تسجيل الدخول للمتابعة.",
    invalidCredentials: "بريد إلكتروني أو كلمة مرور غير صحيحة",
    accountLocked: "الحساب مقفل",
    passwordChanged: "تم تغيير كلمة المرور بنجاح",
    passwordResetSent:
      "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
  },
  nav: {
    home: "الرئيسية",
    zones: "المناطق",
    simulations: "المحاكاة",
    reports: "التقارير",
    settings: "الإعدادات",
    userManagement: "إدارة المستخدمين",
    profile: "الملف الشخصي",
  },
  zones: {
    title: "مناطق المرور",
    addZone: "إضافة منطقة",
    editZone: "تعديل المنطقة",
    zoneName: "اسم المنطقة",
    emirate: "الإمارة",
    zoneType: "نوع المنطقة",
    chargePerHour: "الرسوم لكل ساعة (درهم)",
    residential: "سكني",
    commercial: "تجاري",
    mixed: "استخدام مختلط",
    peakHour: "ساعة الذروة",
  },
  simulation: {
    title: "المحاكاة",
    run: "تشغيل المحاكاة",
    stop: "إيقاف",
    results: "النتائج",
    parameters: "المعلمات",
    totalVehicles: "إجمالي المركبات",
    vehiclesDiverted: "المركبات المتجاوزة",
    congestionReduction: "تقليل الازدحام",
    estimatedRevenue: "الإيرادات المقدرة",
    equityImpact: "التأثير على العدالة",
  },
  dashboard: {
    title: "لوحة المعلومات",
    overview: "نظرة عامة",
    statistics: "الإحصائيات",
    recentActivity: "النشاط الأخير",
  },
  user: {
    title: "المستخدمون",
    addUser: "إضافة مستخدم",
    editUser: "تعديل المستخدم",
    role: "الدور",
    status: "الحالة",
    active: "نشط",
    inactive: "غير نشط",
    admin: "مدير",
    editor: "محرر",
    viewer: "مشاهد",
    createdAt: "تاريخ الإنشاء",
    lastLogin: "آخر تسجيل دخول",
  },
};

@Injectable({
  providedIn: "root",
})
export class I18nService {
  private currentLanguage = new BehaviorSubject<string>("en");
  private translations: { [key: string]: Translation } = { en, ar };

  constructor() {
    // Load saved language preference
    const savedLang = localStorage.getItem("language");
    if (savedLang && this.translations[savedLang]) {
      this.currentLanguage.next(savedLang);
    }
  }

  getLanguage(): Observable<string> {
    return this.currentLanguage.asObservable();
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  setLanguage(lang: string): void {
    if (this.translations[lang]) {
      this.currentLanguage.next(lang);
      localStorage.setItem("language", lang);
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  }

  t(key: string): string {
    const lang = this.currentLanguage.value;
    const keys = key.split(".");
    let value: any = this.translations[lang];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = this.translations["en"];
        for (const k2 of keys) {
          if (value && typeof value === "object" && k2 in value) {
            value = value[k2];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }

    return typeof value === "string" ? value : key;
  }

  getAvailableLanguages(): { code: string; name: string }[] {
    return [
      { code: "en", name: "English" },
      { code: "ar", name: "العربية" },
    ];
  }
}
