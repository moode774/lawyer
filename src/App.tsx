import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from './lib/i18n'
import { AuthProvider } from './lib/auth'
import { ToastProvider } from './components/ui/toast'
import { ErrorBoundary } from './components/ui/error-boundary'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import PortalLayout from './layouts/PortalLayout'
import { Skeleton } from './components/ui/skeleton'
import { TourProvider } from './components/ui/premium-tour'

// Public
const HomePage = lazy(() => import('./pages/public/HomePage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/public/ServiceDetailPage'))
const InsightsPage = lazy(() => import('./pages/public/InsightsPage'))
const ArticlePage = lazy(() => import('./pages/public/ArticlePage'))
const FaqPage = lazy(() => import('./pages/public/FaqPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/public/TermsPage'))
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'))

// Acquisition & Auth
const BookPage = lazy(() => import('./pages/BookPage'))
const IntakePage = lazy(() => import('./pages/IntakePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))

// Admin
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const PipelinePage = lazy(() => import('./pages/admin/PipelinePage'))
const LeadsPage = lazy(() => import('./pages/admin/LeadsPage'))
const LeadDetailPage = lazy(() => import('./pages/admin/LeadDetailPage'))
const BookingsPage = lazy(() => import('./pages/admin/BookingsPage'))
const ClientsPage = lazy(() => import('./pages/admin/ClientsPage'))
const ClientDetailPage = lazy(() => import('./pages/admin/ClientDetailPage'))
const MattersPage = lazy(() => import('./pages/admin/MattersPage'))
const MatterDetailPage = lazy(() => import('./pages/admin/MatterDetailPage'))
const TasksPage = lazy(() => import('./pages/admin/TasksPage'))
const DocumentsPage = lazy(() => import('./pages/admin/DocumentsPage'))
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'))
const AiPage = lazy(() => import('./pages/admin/AiPage'))
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'))
const MarketingPage = lazy(() => import('./pages/admin/MarketingPage'))
const FinancePage = lazy(() => import('./pages/admin/FinancePage'))
const FinanceReportsPage = lazy(() => import('./pages/admin/FinanceReportsPage'))
const DebtsPage = lazy(() => import('./pages/admin/DebtsPage'))
const InvoicesPage = lazy(() => import('./pages/admin/InvoicesPage'))
const BankingPage = lazy(() => import('./pages/admin/BankingPage'))
const OfficeSettingsPage = lazy(() => import('./pages/admin/OfficeSettingsPage'))

// Portal
const PortalHomePage = lazy(() => import('./pages/portal/PortalHomePage'))
const PortalMattersPage = lazy(() => import('./pages/portal/PortalMattersPage'))
const PortalMatterDetailPage = lazy(() => import('./pages/portal/PortalMatterDetailPage'))
const PortalDocumentsPage = lazy(() => import('./pages/portal/PortalDocumentsPage'))
const PortalAppointmentsPage = lazy(() => import('./pages/portal/PortalAppointmentsPage'))
const PortalMessagesPage = lazy(() => import('./pages/portal/PortalMessagesPage'))
const PortalInvoicesPage = lazy(() => import('./pages/portal/PortalInvoicesPage'))
const PortalProfilePage = lazy(() => import('./pages/portal/PortalProfilePage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
})

function PageLoader() {
  return (
    <div className="container space-y-4 py-16">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <BrowserRouter>
                <TourProvider>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* الموقع العام */}
                      <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/services/:slug" element={<ServiceDetailPage />} />
                        <Route path="/lawyer" element={<Navigate to="/about" replace />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/insights/:slug" element={<ArticlePage />} />
                        <Route path="/faq" element={<FaqPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        {/* الحجز داخل التخطيط العام: ترويسة وتنقّل وفوتر كبقية الصفحات */}
                        <Route path="/book" element={<BookPage />} />
                      </Route>

                      <Route path="/legal-intake" element={<IntakePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/admin-login" element={<AdminLoginPage />} />
                      <Route path="/register" element={<Navigate to="/login" replace />} />
                      <Route path="/client-register" element={<Navigate to="/login" replace />} />

                      {/* لوحة الإدارة */}
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="pipeline" element={<PipelinePage />} />
                        <Route path="leads" element={<LeadsPage />} />
                        <Route path="leads/:id" element={<LeadDetailPage />} />
                        <Route path="bookings" element={<BookingsPage />} />
                        <Route path="clients" element={<ClientsPage />} />
                        <Route path="clients/:id" element={<ClientDetailPage />} />
                        <Route path="matters" element={<MattersPage />} />
                        <Route path="matters/:id" element={<MatterDetailPage />} />
                        <Route path="tasks" element={<TasksPage />} />
                        <Route path="documents" element={<DocumentsPage />} />
                        <Route path="finance" element={<FinancePage />} />
                        <Route path="finance/reports" element={<FinanceReportsPage />} />
                        <Route path="finance/debts" element={<DebtsPage />} />
                        <Route path="finance/invoices" element={<InvoicesPage />} />
                        <Route path="finance/banking" element={<BankingPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="ai" element={<AiPage />} />
                        <Route path="marketing" element={<MarketingPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="settings/office" element={<OfficeSettingsPage />} />
                      </Route>

                      {/* بوابة العميل */}
                      <Route path="/portal" element={<PortalLayout />}>
                        <Route index element={<PortalHomePage />} />
                        <Route path="matters" element={<PortalMattersPage />} />
                        <Route path="matters/:id" element={<PortalMatterDetailPage />} />
                        <Route path="documents" element={<PortalDocumentsPage />} />
                        <Route path="appointments" element={<PortalAppointmentsPage />} />
                        <Route path="messages" element={<PortalMessagesPage />} />
                        <Route path="invoices" element={<PortalInvoicesPage />} />
                        <Route path="profile" element={<PortalProfilePage />} />
                      </Route>

                      {/* 404 داخل التخطيط العام — لا يُعاد توجيهها للرئيسية حتى لا يُعدّ soft 404 */}
                      <Route element={<PublicLayout />}>
                        <Route path="*" element={<NotFoundPage />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </TourProvider>
              </BrowserRouter>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
