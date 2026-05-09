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
import { ProfilePage } from './pages/ProfilePage';
import { MyReservationsPage } from './pages/MyReservationsPage';
import { CalendarPage } from './pages/CalendarPage';
import { PointsPage } from './pages/PointsPage';
import { PromotionsPage } from './pages/PromotionsPage';
// 1. Importe a nova página aqui:
import { MyEstablishmentsPage } from './pages/MyEstablishmentsPage';

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
      // 2. Adicione o caso para a listagem de estabelecimentos:
      case 'my-establishments':
        return <MyEstablishmentsPage />;
      case 'reservation':
        return <ReservationPage />;
      case 'profile':
        return <ProfilePage />;
      case 'my-reservations':
        return <MyReservationsPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'points':
        return <PointsPage />;
      case 'promotions':
        return <PromotionsPage />;
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