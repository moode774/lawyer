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

// Public
const HomePage = lazy(() => import('./pages/public/HomePage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/public/ServiceDetailPage'))
const LawyerPage = lazy(() => import('./pages/public/LawyerPage'))
const InsightsPage = lazy(() => import('./pages/public/InsightsPage'))
const ArticlePage = lazy(() => import('./pages/public/ArticlePage'))
const FaqPage = lazy(() => import('./pages/public/FaqPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/public/TermsPage'))

// Acquisition
const BookPage = lazy(() => import('./pages/BookPage'))
const IntakePage = lazy(() => import('./pages/IntakePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))

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

// Portal
const PortalHomePage = lazy(() => import('./pages/portal/PortalHomePage'))
const PortalMattersPage = lazy(() => import('./pages/portal/PortalMattersPage'))
const PortalMatterDetailPage = lazy(() => import('./pages/portal/PortalMatterDetailPage'))
const PortalDocumentsPage = lazy(() => import('./pages/portal/PortalDocumentsPage'))
const PortalAppointmentsPage = lazy(() => import('./pages/portal/PortalAppointmentsPage'))
const PortalMessagesPage = lazy(() => import('./pages/portal/PortalMessagesPage'))
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
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* الموقع العام */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/services/:slug" element={<ServiceDetailPage />} />
                      <Route path="/lawyer" element={<Navigate to="/about" replace />} />
                      <Route path="/insights" element={<Navigate to="/about" replace />} />
                      <Route path="/insights/:slug" element={<ArticlePage />} />
                      <Route path="/faq" element={<FaqPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                    </Route>

                    <Route path="/book" element={<BookPage />} />
                    <Route path="/legal-intake" element={<IntakePage />} />
                    <Route path="/login" element={<LoginPage />} />

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
                      <Route path="analytics" element={<AnalyticsPage />} />
                      <Route path="ai" element={<AiPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>

                    {/* بوابة العميل */}
                    <Route path="/portal" element={<PortalLayout />}>
                      <Route index element={<PortalHomePage />} />
                      <Route path="matters" element={<PortalMattersPage />} />
                      <Route path="matters/:id" element={<PortalMatterDetailPage />} />
                      <Route path="documents" element={<PortalDocumentsPage />} />
                      <Route path="appointments" element={<PortalAppointmentsPage />} />
                      <Route path="messages" element={<PortalMessagesPage />} />
                      <Route path="profile" element={<PortalProfilePage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
