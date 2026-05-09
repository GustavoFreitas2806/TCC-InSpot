import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RegisterEstablishmentPage } from './pages/RegisterEstablishmentPage';
import { DetailPage } from './pages/DetailPage';
import { EditEstablishmentPage } from './pages/EditEstablishmentPage';
import { ReservationPage } from './pages/ReservationPage';

const NO_LAYOUT_PAGES = ['login', 'register'];

function AppContent() {
  const { currentPage } = useApp();

  const isNoLayout = NO_LAYOUT_PAGES.includes(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'register-establishment':
        return <RegisterEstablishmentPage />;
      case 'detail':
        return <DetailPage />;
      case 'edit-establishment':
        return <EditEstablishmentPage />;
      case 'reservation':
        return <ReservationPage />;
      default:
        return <HomePage />;
    }
  };

  if (isNoLayout) {
    return (
      <>
        {renderPage()}
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
