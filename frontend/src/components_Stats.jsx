import React from 'react';

const Stats = ({ stats }) => {
  const { totalReports, reportedCount, cleanedCount } = stats;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-4 -mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-xl font-bold text-teal-600">{totalReports}</p>
          <p className="text-xs text-gray-500">Total Reports</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-teal-600">
            {totalReports ? Math.round((reportedCount + cleanedCount) / totalReports * 100) : 0}%
          </p>
          <p className="text-xs text-gray-500">Verified</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-teal-600">{reportedCount}</p>
          <p className="text-xs text-gray-500">Reported</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-teal-600">{cleanedCount}</p>
          <p className="text-xs text-gray-500">Cleaned</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;