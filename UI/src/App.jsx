
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { LoaderProvider } from '@/contexts/LoaderContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlobalLoader from '@/components/GlobalLoader';
import Home from '@/pages/Home';
import AboutUs from '@/pages/AboutUs';
import AboutMission from '@/pages/AboutMission';
import AboutVision from '@/pages/AboutVision';
import AboutRecruitmentProcess from '@/pages/AboutRecruitmentProcess';
import AboutCorporateProfile from '@/pages/AboutCorporateProfile';
import AboutCompanyProfile from '@/pages/AboutCompanyProfile';
import AboutBusinessProposal from '@/pages/AboutBusinessProposal';
import Services from '@/pages/Services';
import Manpower from '@/pages/services/Manpower';
import PlacementServices from '@/pages/services/PlacementServices';
import StaffingSolutions from '@/pages/services/StaffingSolutions';
import CorporateTraining from '@/pages/services/CorporateTraining';
import CorporateRecruitmentSolutions from '@/pages/services/CorporateRecruitmentSolutions';
import ManagementTeam from '@/pages/ManagementTeam';
import Clients from '@/pages/Clients';
import Gallery from '@/pages/Gallery';
import JobSeekers from '@/pages/JobSeekers';
import JobDetail from '@/pages/JobDetail';
import JobApplications from '@/pages/JobApplications';
import Login from '@/pages/Login';
import Contact from '@/pages/Contact';

function App() {
  return (
    <Router>
      <LoaderProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <GlobalLoader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/about-us/mission" element={<AboutMission />} />
              <Route path="/about-us/vision" element={<AboutVision />} />
              <Route
                path="/about-us/recruitment-process"
                element={<AboutRecruitmentProcess />}
              />
              <Route
                path="/about-us/corporate-profile"
                element={<AboutCorporateProfile />}
              />
              <Route
                path="/about-us/company-profile"
                element={<AboutCompanyProfile />}
              />
              <Route
                path="/about-us/business-proposal"
                element={<AboutBusinessProposal />}
              />
              <Route path="/services" element={<Services />} />
              <Route path="/services/manpower" element={<Manpower />} />
              <Route
                path="/services/placement-services"
                element={<PlacementServices />}
              />
              <Route
                path="/services/staffing-solutions"
                element={<StaffingSolutions />}
              />
              <Route
                path="/services/corporate-training"
                element={<CorporateTraining />}
              />
              <Route
                path="/services/corporate-recruitment-solutions"
                element={<CorporateRecruitmentSolutions />}
              />
              <Route path="/management-team" element={<ManagementTeam />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/job-seekers" element={<JobSeekers />} />
              <Route path="/job-seekers/:jobID" element={<JobDetail />} />
              <Route path="/job-applications" element={<JobApplications />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </LoaderProvider>
    </Router>
  );
}

export default App;
