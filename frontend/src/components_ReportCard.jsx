import React, { useState, useEffect } from 'react';
import { verifyReport, markAsCleaned } from '../utils_api';

const ReportCard = ({ report, onAction, principal, isAuthenticated }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);

  // Check if user has already verified this report
  useEffect(() => {
    if (isAuthenticated && principal && report.verifications) {
      // Check if user has already verified this report
      const userHasVerified = report.verifications.some(
        v => v.verifier.toString() === principal
      );
      setHasVerified(userHasVerified);
    }
  }, [report, principal, isAuthenticated]);
  
  // Format timestamp
  const formatTimeAgo = (timestamp) => {
    try {
      const now = Date.now();
      const diff = now - Number(timestamp) / 1000000; // timestamp in nanoseconds
      
      const seconds = Math.floor(diff / 1000);
      if (seconds < 60) return `${seconds} seconds ago`;
      
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minutes ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hours ago`;
      
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    } catch (error) {
      return 'Unknown time';
    }
  };
  
  // Get district name from variant
  const getDistrictName = (district) => {
    if (!district) return 'Jakarta';
    
    if ('central' in district) return 'Central Jakarta';
    if ('west' in district) return 'West Jakarta';
    if ('south' in district) return 'South Jakarta';
    if ('east' in district) return 'East Jakarta';
    if ('north' in district) return 'North Jakarta';
    return 'Jakarta';
  };
  
  // Count verifications
  const { validCount, invalidCount } = (() => {
    if (!report.verifications || !Array.isArray(report.verifications)) {
      return { validCount: 0, invalidCount: 0 };
    }
    
    let valid = 0, invalid = 0;
    report.verifications.forEach(v => v.isValid ? valid++ : invalid++);
    return { validCount: valid, invalidCount: invalid };
  })();
  
  // Handle verify button click - opens dialog instead of immediate verification
  const handleVerify = () => {
    if (!isAuthenticated) {
      alert('Please login first to verify reports');
      return;
    }
    
    // Open verification dialog instead of direct verification
    setShowVerifyDialog(true);
  };
  
  // Handle valid verification
  const handleValidVerify = async () => {
    try {
      setIsVerifying(true);
      await verifyReport(report.id, true);
      alert('Report verified as valid!');
      setShowVerifyDialog(false);
      setHasVerified(true);
      if (onAction) onAction();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Handle invalid verification
  const handleInvalidVerify = async () => {
    try {
      setIsVerifying(true);
      await verifyReport(report.id, false);
      alert('Report marked as invalid!');
      setShowVerifyDialog(false);
      setHasVerified(true);
      if (onAction) onAction();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Handle mark as cleaned button click
  const handleMarkCleaned = async () => {
    if (!isAuthenticated) {
      alert('Please login first to mark reports as cleaned');
      return;
    }
    
    if (!confirm('Are you sure this waste has been cleaned up?')) {
      return;
    }
    
    try {
      setIsMarking(true);
      await markAsCleaned(report.id);
      alert('Report marked as cleaned successfully!');
      if (onAction) onAction();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsMarking(false);
    }
  };

  // Create map URL from location
  const createMapUrl = (location) => {
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      return 'https://maps.google.com';
    }
    return `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  };
  
  // Create image URL from image blob
  const getImageUrl = () => {
    try {
      if (!report.imageBlob || !report.imageBlob[0]) {
        return "https://via.placeholder.com/300x200?text=No+Image";
      }
      
      const uint8Array = new Uint8Array(report.imageBlob[0]);
      const blob = new Blob([uint8Array], { type: 'image/png' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating image URL:', error);
      return "https://via.placeholder.com/300x200?text=Error+Loading+Image";
    }
  };
  
  // Report status
  const isReported = report.status && 'reported' in report.status;
  
  // Safe access to reporter
  const reporterString = typeof report.reporter?.toString === 'function' 
    ? report.reporter.toString().substring(0, 10) + '...' 
    : 'Unknown';
  
  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <div className="w-full h-36 bg-gray-200 relative">
        {report.imageBlob && report.imageBlob[0] ? (
          <img
            src={getImageUrl()}
            alt={report.description ? report.description.substring(0, 30) : "Waste report"}
            className="w-full h-full object-cover absolute top-0 left-0"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full flex items-center justify-center ${report.imageBlob && report.imageBlob[0] ? 'hidden' : ''}`}
        >
          <span className="text-3xl">🗑️</span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              isReported ? 'bg-gray-100 text-gray-800' : 'bg-teal-100 text-teal-800'
            } px-2 py-0.5 rounded text-xs`}
          >
            {isReported ? 'Reported' : 'Cleaned'}
          </span>
          <span className="text-gray-400 text-xs">{formatTimeAgo(report.timestamp)}</span>
        </div>
        <h3 className="font-medium text-sm mb-1">
          {report.description 
            ? (report.description.substring(0, 50) + (report.description.length > 50 ? '...' : ''))
            : 'No description provided'}
        </h3>

        <div className="flex mb-2">
          <div className="w-1/2">
            <a
              href={createMapUrl(report.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline text-xs block mb-1"
            >
              <span className="icon-location"></span> {getDistrictName(report.district)}
            </a>
            <span className="text-xs text-gray-500 block">
              <span className="icon-user"></span> {reporterString}
            </span>
          </div>
          <div className="w-1/2 text-right">
            <span className="text-teal-600 text-xs block mb-1">
              <span className="icon-check"></span> {validCount} verified
            </span>
            <span className="text-gray-500 text-xs block">
              <span className="icon-close"></span> {invalidCount} invalid
            </span>
          </div>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={handleVerify}
            disabled={isVerifying || hasVerified}
            className={`flex-1 ${
              isVerifying ? 'bg-gray-200 cursor-not-allowed' : 
              hasVerified ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
              'bg-gray-50 hover:bg-gray-100'
            } text-teal-700 py-1 rounded text-xs`}
          >
            {isVerifying ? 'Processing...' : 
             hasVerified ? 'Verified' : 'Verify'}
          </button>
          <button
            onClick={handleMarkCleaned}
            disabled={isMarking || !isReported}
            className={`flex-1 ${
              isMarking ? 'bg-gray-200 cursor-not-allowed' :
              !isReported ? 'bg-gray-50 opacity-50 cursor-not-allowed' : 
              'bg-gray-50 hover:bg-gray-100'
            } text-teal-700 py-1 rounded text-xs`}
          >
            {isMarking ? 'Processing...' : 'Mark Cleaned'}
          </button>
        </div>
      </div>

      {/* Verification Dialog */}
      {showVerifyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Verify This Report</h3>
            <p className="mb-6">Do you think this waste report is valid?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowVerifyDialog(false)} 
                className="px-4 py-2 bg-gray-200 rounded text-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleInvalidVerify} 
                className="px-4 py-2 bg-red-500 text-white rounded"
                disabled={isVerifying}
              >
                Invalid Report
              </button>
              <button 
                onClick={handleValidVerify} 
                className="px-4 py-2 bg-teal-500 text-white rounded"
                disabled={isVerifying}
              >
                Valid Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCard;