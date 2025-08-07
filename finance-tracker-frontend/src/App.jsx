import { Routes, Route } from 'react-router-dom';
import Navigation from './components/MyNavbar';
import Insights from './pages/Insights';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import Dashboard from './pages/Dashboard';
import './App.css';
import './theme.css';
import AuthForms from './components/AuthForms';
import { useAuth } from './contexts/useAuth';
import { Spinner } from 'react-bootstrap';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: 'var(--color-primary-dark)' }}>
        <Spinner animation="border" role="status" style={{ color: 'var(--color-accent-blue)' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="ms-3 text-light">Loading user session...</p>
      </div>
    );
  }

  if (!currentUser || currentUser.isAnonymous) {
    return <AuthForms />;
  }

  return (
    <>
      <Navigation />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
