/**
 * إعدادات الهوية الرسمية — مكتب المحامي أحمد بن عبد الحفيظ بن عبد الرحمن بن نوح للمحاماة والاستشارات القانونية.
 * Official Brand Configuration for Ahmed Abdulhafith Nouh Law Firm.
 * مرخص من وزارة العدل برقم ترخيص (4210) ومسجل بالهيئة السعودية للمحامين برقم (7050561203).
 */
export const brand = {
  firmNameAr: 'مكتب المحامي أحمد بن عبد الحفيظ بن عبد الرحمن بن نوح للمحاماة والاستشارات القانونية',
  firmNameEn: 'Ahmed Abdulhafith Nouh Law Firm & Legal Consultancy',
  nameAr: 'مكتب المحامي أحمد بن نوح للمحاماة والاستشارات القانونية',
  nameEn: 'Ahmed Bin Nouh Law Firm',
  shortNameAr: 'بن نوح للمحاماة',
  shortNameEn: 'Bin Nouh Law',
  lawyerNameAr: 'أحمد بن عبد الحفيظ بن عبد الرحمن بن نوح',
  lawyerNameEn: 'AHMED ABDULHAFITH ABDULRAHMAN NOUH',
  licenseNumber: '4210',
  // ملاحظة: رقم الهوية الوطنية الشخصي للمالك لا يوضع هنا إطلاقًا —
  // كل ما في هذا الملف يُشحن داخل حزمة الموقع ويقرأه أي زائر.
  // البيانات النظامية العلنية هي رقم الترخيص ورقم الهوية الاعتبارية فقط.
  legalEntityId: '7050561203',
  activityCode: '691010',
  phone: '+966500424282',
  phoneDisplay: '+966 50 042 4282',
  whatsappNumber: '+966500424282',
  email: 'ednouh42@gmail.com',
  city: 'الرياض',
  cityEn: 'Riyadh',
  district: 'حي المحمدية',
  districtEn: 'Al-Muhammadiyah',
  officeAddress: 'الرياض — حي المحمدية، طريق الملك فهد، مبنى رقم 8006، الرمز البريدي 12363',
  officeAddressEn: 'Building 8006, King Fahd Rd, Al-Muhammadiyah, Riyadh 12363',
  workingHours: 'الأحد – الخميس: 8:30 صباحًا – 5:30 مساءً',
  taglineAr: 'وضوح قانوني. حماية شاملة. حلول دقيقة.',
  taglineEn: 'Legal clarity. Complete protection. Precise solutions.',
} as const

export const BRAND = brand
export default brand
export type Brand = typeof brand
