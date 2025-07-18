import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup';
import CivilianDashboard from './pages/CivilianDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PostGoodDeed from './pages/PostGoodDeed';
import Announcements from './pages/Announcements';
import CivilianComplaints from './pages/CivilianComplaints';
import CivilianProfile from './pages/CivilianProfile';
import AuthorityAnnouncements from './pages/AuthorityAnnouncements';
import AuthorityComplaints from './pages/AuthorityComplaints';
import ReportCivilian from './pages/ReportCivilian';
import CommitteeFeed from './pages/CommitteeFeed';
import AuthoritySearch from './pages/AuthoritySearch';
import './App.css';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/civilian" element={
          <ProtectedRoute role="civilian">
            <CivilianDashboard />
          </ProtectedRoute>
        } />
        <Route path="/authority" element={
          <ProtectedRoute role="authority">
            <AuthorityDashboard />
          </ProtectedRoute>
        } />
<Route path="/civilian/post-deed" element={
  <ProtectedRoute role="civilian">
    <PostGoodDeed />
  </ProtectedRoute>
} />

<Route path="/civilian/announcements" element={
  <ProtectedRoute role="civilian">
    <Announcements />
  </ProtectedRoute>
} />

<Route path="/civilian/complaints" element={
  <ProtectedRoute role="civilian">
    <CivilianComplaints />
  </ProtectedRoute>
} />

<Route path="/civilian/profile" element={
  <ProtectedRoute role="civilian">
    <CivilianProfile />
  </ProtectedRoute>
} />

<Route path="/authority/announcements" element={
  <ProtectedRoute role="authority">
    <AuthorityAnnouncements />
  </ProtectedRoute>
} />

<Route path="/authority/complaints" element={
  <ProtectedRoute role="authority">
    <AuthorityComplaints />
  </ProtectedRoute>
} />

<Route path="/authority/report" element={
  <ProtectedRoute role="authority">
    <ReportCivilian />
  </ProtectedRoute>
} />


<Route path="/committee-feed" element ={<CommitteeFeed/>}/>


<Route path="/authority/search" element={<AuthoritySearch />} />

      </Routes>
    </Router>
  );
}

export default App;


