import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './utils_auth';
import { getAllReports, getStatistics, getReportsByDistrict, getReportsByStatus } from './utils_api';
import Navbar from './components_Navbar';
import Stats from './components_Stats';
import ReportCard from './components_ReportCard';
import ReportForm from './components_ReportForm';

// Main application component
const MainApp = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    reportedCount: 0,
    cleanedCount: 0,
    districtStats: []
  });
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data when component mounts
  useEffect(() => {
    if (!isInitializing) loadData();
  }, [isInitializing]);

  // Load data from backend
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load statistics
      const statsData = await getStatistics();
      setStats(statsData);
      
      // Load reports based on filters
      let reportsData = [];
      
      if (selectedDistrict === 'all' && selectedStatus === 'all') {
        reportsData = await getAllReports(20, 0);
      } else if (selectedDistrict !== 'all' && selectedStatus === 'all') {
        const districtVariant = { [selectedDistrict]: null };
        reportsData = await getReportsByDistrict(districtVariant);
      } else if (selectedDistrict === 'all' && selectedStatus !== 'all') {
        const statusVariant = { [selectedStatus]: null };
        reportsData = await getReportsByStatus(statusVariant);
      } else {
        // Combined filters implemented client-side
        const districtVariant = { [selectedDistrict]: null };
        const reportsForDistrict = await getReportsByDistrict(districtVariant);
        
        reportsData = reportsForDistrict.filter(report => {
          const statusKey = Object.keys(report.status)[0];
          return statusKey === selectedStatus;
        });
      }
      
      setReports(reportsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Handle district selection
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    loadFilteredData(district, selectedStatus);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    loadFilteredData(selectedDistrict, newStatus);
  };

  // Load data with specific filter values
  const loadFilteredData = async (district, status) => {
    try {
      setLoading(true);
      
      let reportsData = [];
      
      if (district === 'all' && status === 'all') {
        reportsData = await getAllReports(20, 0);
      } else if (district !== 'all' && status === 'all') {
        const districtVariant = { [district]: null };
        reportsData = await getReportsByDistrict(districtVariant);
      } else if (district === 'all' && status !== 'all') {
        const statusVariant = { [status]: null };
        reportsData = await getReportsByStatus(statusVariant);
      } else {
        const districtVariant = { [district]: null };
        const reportsForDistrict = await getReportsByDistrict(districtVariant);
        
        reportsData = reportsForDistrict.filter(report => {
          const statusKey = Object.keys(report.status)[0];
          return statusKey === status;
        });
      }
      
      setReports(reportsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Districts data
  const districts = [
    { id: 'central', name: 'Central Jakarta' },
    { id: 'west', name: 'West Jakarta' },
    { id: 'south', name: 'South Jakarta' },
    { id: 'east', name: 'East Jakarta' },
    { id: 'north', name: 'North Jakarta' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="bg-teal-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">Clean City Together</h1>
          <p className="mb-6 max-w-lg mx-auto">
            Report abandoned waste in your area and help create a cleaner, healthier city.
          </p>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                alert('Please login first to report waste');
                return;
              }
              setIsReportFormOpen(true);
            }}
            className="bg-white text-teal-600 hover:bg-gray-100 px-5 py-2 rounded font-medium shadow-sm"
          >
            Report Waste
          </button>
        </div>
      </header>

      {/* Stats */}
      <Stats stats={stats} />

      {/* District Buttons */}
      <div className="container mx-auto px-4 py-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Waste by District
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            className={`px-4 py-2 ${
              selectedDistrict === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-teal-100 text-teal-800'
            } rounded hover:bg-teal-600 hover:text-white shadow-sm`}
            onClick={() => handleDistrictSelect('all')}
          >
            All Districts
          </button>
          {districts.map((district) => (
            <button
              key={district.id}
              className={`px-4 py-2 ${
                selectedDistrict === district.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-100 text-teal-800'
              } rounded hover:bg-teal-600 hover:text-white shadow-sm`}
              onClick={() => handleDistrictSelect(district.id)}
            >
              {district.name}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">
            Waste Reports
          </h2>
          <div className="flex space-x-2">
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={handleStatusFilterChange}
              className="border border-gray-300 rounded px-3 py-1 text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="cleaned">Cleaned</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded shadow-sm overflow-hidden animate-pulse">
                <div className="w-full h-36 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button 
              onClick={loadData}
              className="mt-2 bg-teal-500 text-white px-4 py-2 rounded text-sm hover:bg-teal-600"
            >
              Try Again
            </button>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map(report => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onAction={loadData}
                principal={principal}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No reports found. 
            {isAuthenticated ? (
              <button 
                onClick={() => setIsReportFormOpen(true)}
                className="ml-2 text-teal-600 hover:underline"
              >
                Create a new report
              </button>
            ) : (
              <span> Please login to create a report.</span>
            )}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-8 bg-white mt-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center px-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📸</span>
            </div>
            <h3 className="font-medium">1. Report</h3>
            <p className="text-sm text-gray-600">
              Take a photo of waste. Location is verified with GPS and HTTPS Outcalls.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">✅</span>
            </div>
            <h3 className="font-medium">2. Verify</h3>
            <p className="text-sm text-gray-600">
              Other users verify reports using blockchain-based verification.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🧹</span>
            </div>
            <h3 className="font-medium">3. Clean</h3>
            <p className="text-sm text-gray-600">
              Community resolves the issue. Report status is updated transparently.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <div className="text-lg font-bold mb-1">🥷 Clean Ninja</div>
              <p className="text-sm text-gray-400">
                Blockchain-based waste reporting platform
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-400">Powered by</div>
              <div className="font-medium">Internet Computer Protocol</div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4 text-center text-sm text-gray-400">
            <p>© 2025 Clean Ninja. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Report Form Modal */}
      {isReportFormOpen && (
        <ReportForm 
          isOpen={isReportFormOpen}
          onClose={() => setIsReportFormOpen(false)}
          onReportCreated={loadData}
        />
      )}
    </div>
  );
};

// Wrap MainApp with AuthProvider
const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;