import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AuthenticationPage from './pages/AuthenticationPage';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './pages/NotFound'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
}

export default App;
