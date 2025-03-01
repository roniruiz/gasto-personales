import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase/client';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Profile from './pages/Profile';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión actual
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
      
      // Escuchar cambios en la autenticación
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    getCurrentUser();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && <Navbar user={user} />}
        <div className="flex">
          {user && <Sidebar />}
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/add-expense" element={user ? <AddExpense /> : <Navigate to="/login" />} />
              <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;