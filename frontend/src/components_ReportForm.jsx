import React, { useState, useEffect } from 'react';
import { createReport, verifyLocation } from './utils_api';

const ReportForm = ({ isOpen, onClose, onReportCreated }) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null, address: null });
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);
  const [formError, setFormError] = useState('');

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setPhotoPreview(null);
      setPhotoFile(null);
      setLocation({ latitude: null, longitude: null, address: null });
      setDistrict('');
      setDescription('');
      setFormError('');
    }
  }, [isOpen]);

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setFormError('Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Maximum file size is 5MB');
      return;
    }

    setPhotoFile(file);
    setFormError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Handle location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setFormError('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingLocation(true);
    setFormError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setLocation({...location, latitude, longitude});
        
        // Verify location with backend
        try {
          setIsVerifyingLocation(true);
          const locationInfo = await verifyLocation(latitude, longitude);
          
          // Set district and address based on response
          const districtKey = Object.keys(locationInfo.district)[0];
          const districtName = 
            districtKey === 'central' ? 'Central Jakarta' :
            districtKey === 'west' ? 'West Jakarta' :
            districtKey === 'south' ? 'South Jakarta' :
            districtKey === 'east' ? 'East Jakarta' :
            districtKey === 'north' ? 'North Jakarta' : '';
          
          setDistrict(districtName);
          setLocation({
            latitude,
            longitude,
            address: locationInfo.address,
          });
        } catch (error) {
          console.error('Error verifying location:', error);
          setFormError(`Error: ${error.message}`);
        } finally {
          setIsVerifyingLocation(false);
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        console.error('Geolocation error:', error);
        setFormError(`Error: ${error.message}`);
      }
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!description) {
      setFormError('Please provide a description');
      return;
    }

    if (!location.latitude || !location.longitude) {
      setFormError('Please specify a location');
      return;
    }

    if (!district) {
      setFormError('Please select a district');
      return;
    }

    try {
      setIsSubmitting(true);
      const districtVariant = district.toLowerCase().split(' ')[0];

      // If no photo, submit with null imageBlob
      if (!photoFile) {
        await createReport(location, districtVariant, description, null);
        alert('Report submitted successfully!');
        onReportCreated();
        onClose();
        return;
      }

      // Read photo file as ArrayBuffer
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          await createReport(location, districtVariant, description, event.target.result);
          alert('Report submitted successfully!');
          onReportCreated();
          onClose();
        } catch (error) {
          setFormError(`Error: ${error.message}`);
        } finally {
          setIsSubmitting(false);
        }
      };
      
      reader.onerror = () => {
        setFormError('Failed to read image file');
        setIsSubmitting(false);
      };
      
      reader.readAsArrayBuffer(photoFile);
    } catch (error) {
      setIsSubmitting(false);
      setFormError(`Error: ${error.message}`);
    }
  };

  // Submit demo report
  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
      setFormError('Please provide a description');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const dummyLocation = location.latitude ? location : {
        latitude: -6.2088,
        longitude: 106.8456,
        address: "Central Jakarta (Demo)"
      };
      
      const districtVariant = district ? 
        district.toLowerCase().split(' ')[0] : 'central';
      
      await createReport(dummyLocation, districtVariant, description, null);
      alert('Demo report created successfully!');
      onReportCreated();
      onClose();
    } catch (error) {
      setFormError(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-800">Report Waste</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            {formError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {formError}
              </div>
            )}
            
            {/* Photo Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <div
                onClick={() => document.getElementById('waste-photo').click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition"
              >
                {photoPreview ? (
                  <div className="mb-3">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="mx-auto max-h-32 rounded"
                    />
                    <p className="text-gray-500 text-sm mt-2">Click to change photo</p>
                  </div>
                ) : (
                  <div>
                    <span className="icon-camera text-gray-400 text-xl mb-2"></span>
                    <p className="text-gray-500 text-sm">Click to upload photo</p>
                    <p className="text-gray-400 text-xs mt-1">PNG, JPG up to 5MB</p>
                    <p className="text-gray-400 text-xs mt-1">(Optional)</p>
                  </div>
                )}
                <input
                  type="file"
                  id="waste-photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="flex">
                <input
                  type="text"
                  value={
                    isDetectingLocation ? 'Detecting location...' :
                    isVerifyingLocation ? 'Verifying...' :
                    location.address || 
                    (location.latitude ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Detecting your location...')
                  }
                  className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  readOnly
                />
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation || isVerifyingLocation}
                  className={`
                    px-3 py-2 text-sm rounded-r-lg
                    ${isDetectingLocation || isVerifyingLocation 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                    }
                  `}
                >
                  <span role="img" aria-label="location">📍</span>
                </button>
              </div>
            </div>

            {/* District */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  style={{ paddingRight: '2.5rem' }}
                >
                  <option value="">-- Select District --</option>
                  <option value="Central Jakarta">Central Jakarta</option>
                  <option value="West Jakarta">West Jakarta</option>
                  <option value="South Jakarta">South Jakarta</option>
                  <option value="East Jakarta">East Jakarta</option>
                  <option value="North Jakarta">North Jakarta</option>
                </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Describe the waste issue..."
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex flex-col mt-6 gap-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm mr-2 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
                  } text-white px-4 py-2 rounded text-sm`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={handleDemoSubmit}
                  disabled={isSubmitting || !description}
                  className="text-teal-600 text-sm hover:underline"
                >
                  Demo Submit (No Location Check)
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
