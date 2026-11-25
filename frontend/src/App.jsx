import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SurveysPage from './pages/SurveysPage';
import SurveyDetailPage from './pages/SurveyDetailPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthModal from './components/AuthModal';
import { api } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [health, setHealth] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [surveyCount, setSurveyCount] = useState(0);

  // Inicialización de sesión y salud del servidor
  useEffect(() => {
    // 1. Chequear salud de la API
    api
      .getHealth()
      .then((h) => setHealth(h))
      .catch((err) => console.warn('API no disponible:', err.message));

    // 2. Chequear sesión activa
    api
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));

    // 3. Contar encuestas publicadas
    api
      .getSurveys()
      .then((data) => setSurveyCount(data.count || 0))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      if (currentView === 'admin') {
        setCurrentView('home');
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleSelectSurvey = (survey) => {
    setSelectedSurvey(survey);
    setCurrentView('survey_detail');
  };

  return (
    <>
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        health={health}
      />

      {api.isStaticDemo && (
        <aside className="static-demo-banner">
          Demostración estática institucional desplegada en GitHub Pages. Para verificar persistencia en MongoDB y endpoints REST en tiempo real, ejecute el entorno full-stack localmente (<code>npm run dev</code>).
        </aside>
      )}

      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomePage onNavigate={setCurrentView} surveyCount={surveyCount} />
        )}

        {currentView === 'surveys' && (
          <SurveysPage onSelectSurvey={handleSelectSurvey} user={user} />
        )}

        {currentView === 'survey_detail' && (
          <SurveyDetailPage
            survey={selectedSurvey}
            onBack={() => setCurrentView('surveys')}
            user={user}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'admin' && (
          user && user.role === 'admin' ? (
            <AdminDashboardPage user={user} />
          ) : (
            <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
              <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
                <Lock size={36} color="var(--color-petroleo)" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h3>Acceso Restringido</h3>
                <p style={{ color: 'var(--color-texto-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                  El panel de administración requiere una cuenta con rol <code>admin</code> autenticada.
                </p>
                <button className="btn btn-primary" onClick={() => handleOpenAuth('login')}>
                  Iniciar Sesión como Administrador
                </button>
              </div>
            </div>
          )
        )}
      </main>

      <Footer />

      {authModal.isOpen && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}
