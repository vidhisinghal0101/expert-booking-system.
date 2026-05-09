import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/experts" replace />} />
            <Route path="/experts" element={<ExpertList />} />
            <Route path="/experts/:id" element={<ExpertDetail />} />
            <Route path="/book/:id" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="*" element={<Navigate to="/experts" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
