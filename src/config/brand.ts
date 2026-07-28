/**
 * إعدادات الهوية الرسمية — بن نوح للمحاماة والاستشارات القانونية.
 * Official Brand Configuration for Bin Nouh Law Firm & Legal Consultancy.
 */
export const brand = {
  firmNameAr: 'بن نوح للمحاماة والاستشارات القانونية',
  firmNameEn: 'Bin Nouh Law Firm & Legal Consultancy',
  nameAr: 'بن نوح للمحاماة والاستشارات القانونية',
  nameEn: 'Bin Nouh Law Firm & Legal Consultancy',
  shortNameAr: 'بن نوح',
  shortNameEn: 'Bin Nouh',
  lawyerNameAr: 'أ. بن نوح المحامي',
  lawyerNameEn: 'Advocate Bin Nouh',
  licenseNumber: '123456/44',
  phone: '+966112345678',
  phoneDisplay: '+966 11 234 5678',
  whatsappNumber: '+966512345678',
  email: 'info@binnouh.sa',
  city: 'الرياض',
  cityEn: 'Riyadh',
  officeAddress: 'الرياض — طريق الملك فهد، برج المكاتب، الدور 12',
  officeAddressEn: 'King Fahd Rd, Office Tower, 12th Floor, Riyadh',
  workingHours: 'الأحد – الخميس: 9 صباحًا – 6 مساءً',
  taglineAr: 'وضوح قانوني. قرارات أكثر ثقة.',
  taglineEn: 'Legal clarity. Confident decisions.',
} as const

export const BRAND = brand
export default brand
export type Brand = typeof brand
