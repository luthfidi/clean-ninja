import React from 'react';

const Stats = ({ stats }) => {
  const { totalReports, reportedCount, cleanedCount } = stats;
  
  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="bg-teal-100 rounded-lg shadow-sm p-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        
        <div className="md:hidden">
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-black -translate-x-px"></div>
          <div className="absolute top-1/2 left-4 right-4 h-px bg-black -translate-y-px"></div>
        </div>
        
        <div className="hidden md:block">
          <div className="absolute left-1/4 top-4 bottom-4 w-px bg-black"></div>
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-black"></div>
          <div className="absolute left-3/4 top-4 bottom-4 w-px bg-black"></div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
