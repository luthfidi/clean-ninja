import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

// Get canister ID from env or use fallback
const backendCanisterId = process.env.CANISTER_ID_BACKEND || 
                        window.process?.env?.CANISTER_ID_BACKEND || 
                        "twkfl-haaaa-aaaab-qbnpa-cai";

// Host URL based on network
const host = process.env.DFX_NETWORK === 'ic' || window.process?.env?.DFX_NETWORK === 'ic'
  ? 'https://ic0.app' 
  : 'http://localhost:8000';

// Default stats
const defaultStats = {
  totalReports: 0,
  reportedCount: 0,
  cleanedCount: 0,
  districtStats: []
};

// Simplified IDL factory
const idlFactory = ({ IDL }) => {
  const Report = IDL.Record({
    'id': IDL.Text,
    'reporter': IDL.Principal,
    'location': IDL.Record({
      'latitude': IDL.Float64,
      'longitude': IDL.Float64,
      'address': IDL.Opt(IDL.Text),
    }),
    'district': IDL.Variant({
      'central': IDL.Null,
      'west': IDL.Null,
      'south': IDL.Null,
      'east': IDL.Null,
      'north': IDL.Null,
    }),
    'description': IDL.Text,
    'imageBlob': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'timestamp': IDL.Int,
    'status': IDL.Variant({
      'reported': IDL.Null,
      'cleaned': IDL.Null,
    }),
    'verifications': IDL.Vec(IDL.Record({
      'verifier': IDL.Principal,
      'timestamp': IDL.Int,
      'isValid': IDL.Bool,
      'comment': IDL.Opt(IDL.Text),
    })),
  });
  
  const LocationInfo = IDL.Record({
    'district': IDL.Variant({
      'central': IDL.Null,
      'west': IDL.Null,
      'south': IDL.Null,
      'east': IDL.Null,
      'north': IDL.Null,
    }),
    'address': IDL.Text,
    'isValid': IDL.Bool,
  });
  
  const Result = IDL.Variant({ 'ok': IDL.Text, 'err': IDL.Text });
  const Result_1 = IDL.Variant({ 'ok': LocationInfo, 'err': IDL.Text });
  const Result_2 = IDL.Variant({ 'ok': IDL.Null, 'err': IDL.Text });
  
  const Statistics = IDL.Record({
    'totalReports': IDL.Nat,
    'reportedCount': IDL.Nat,
    'cleanedCount': IDL.Nat,
    'districtStats': IDL.Vec(IDL.Tuple(
      IDL.Variant({
        'central': IDL.Null,
        'west': IDL.Null,
        'south': IDL.Null,
        'east': IDL.Null,
        'north': IDL.Null,
      }),
      IDL.Nat
    )),
  });
  
  return IDL.Service({
    'createReport': IDL.Func([IDL.Record({
        'latitude': IDL.Float64, 'longitude': IDL.Float64, 'address': IDL.Opt(IDL.Text),
      }), IDL.Variant({
        'central': IDL.Null, 'west': IDL.Null, 'south': IDL.Null, 'east': IDL.Null, 'north': IDL.Null,
      }), IDL.Text, IDL.Opt(IDL.Vec(IDL.Nat8)),], [Result], []),
    'getAllReports': IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(Report)], ['query']),
    'getMyPrincipal': IDL.Func([], [IDL.Principal], ['query']),
    'getReport': IDL.Func([IDL.Text], [IDL.Opt(Report)], ['query']),
    'getReportsByDistrict': IDL.Func([IDL.Variant({
      'central': IDL.Null, 'west': IDL.Null, 'south': IDL.Null, 'east': IDL.Null, 'north': IDL.Null,
    })], [IDL.Vec(Report)], ['query']),
    'getReportsByStatus': IDL.Func([IDL.Variant({
      'reported': IDL.Null, 'cleaned': IDL.Null,
    })], [IDL.Vec(Report)], ['query']),
    'getStatistics': IDL.Func([], [Statistics], ['query']),
    'getUserReports': IDL.Func([IDL.Principal], [IDL.Vec(Report)], ['query']),
    'isAuthenticated': IDL.Func([], [IDL.Bool], ['query']),
    'markAsCleaned': IDL.Func([IDL.Text], [Result_2], []),
    'verifyLocation': IDL.Func([IDL.Float64, IDL.Float64], [Result_1], []),
    'verifyReport': IDL.Func([IDL.Text, IDL.Bool, IDL.Opt(IDL.Text)], [Result_2], []),
  });
};

// Initialize agent and actor
export const initActor = async () => {
  try {
    const authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();
    const agent = new HttpAgent({
      identity: isAuthenticated ? authClient.getIdentity() : undefined,
      host
    });
    
    // Disable certificate verification for local development
    if (process.env.DFX_NETWORK !== 'ic') {
      try { await agent.fetchRootKey(); } 
      catch (err) { console.warn("Unable to fetch root key. Check local replica"); }
    }

    const actor = Actor.createActor(idlFactory, { agent, canisterId: backendCanisterId });
    return { actor, authClient, isAuthenticated };
  } catch (error) {
    console.error("Actor initialization error:", error);
    return { actor: null, authClient: null, isAuthenticated: false };
  }
};

// Get current user's principal
export const getMyPrincipal = async () => {
  try {
    const { actor, isAuthenticated } = await initActor();
    if (!actor || !isAuthenticated) return null;
    return await actor.getMyPrincipal();
  } catch (error) {
    console.error("Error getting principal:", error);
    return null;
  }
};

// Check authentication status
export const isAuthenticatedCheck = async () => {
  try {
    const { actor } = await initActor();
    return actor ? await actor.isAuthenticated() : false;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Create a new report
export const createReport = async (location, district, description, imageArrayBuffer) => {
  try {
    const { actor, isAuthenticated } = await initActor();
    if (!actor) throw new Error("Backend connection failed");
    if (!isAuthenticated) throw new Error("Authentication required");
    
    // Convert district to variant
    const districtVariant = { [district]: null };
    
    // Prepare image if present
    let imageBlob = [];
    if (imageArrayBuffer) {
      const uint8Array = new Uint8Array(imageArrayBuffer);
      imageBlob = [Array.from(uint8Array)];
    }
    
    const result = await actor.createReport(
      { 
        latitude: location.latitude, 
        longitude: location.longitude,
        address: location.address ? [location.address] : []
      },
      districtVariant,
      description,
      imageBlob.length ? imageBlob : []
    );
    
    return 'ok' in result ? result.ok : Promise.reject(new Error(result.err));
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
};

// Verify location
export const verifyLocation = async (latitude, longitude) => {
  try {
    const { actor } = await initActor();
    if (!actor) return getFallbackLocationInfo(latitude, longitude);
    
    const result = await actor.verifyLocation(latitude, longitude);
    
    if ('ok' in result) return result.ok;
    throw new Error(result.err);
  } catch (error) {
    console.error("Error verifying location:", error);
    return getFallbackLocationInfo(latitude, longitude);
  }
};

// Fallback location function
const getFallbackLocationInfo = (latitude, longitude) => {
  let district = { central: null };
  
  if (latitude > -6.2 && latitude < -6.15) district = { central: null };
  else if (latitude > -6.15 && latitude < -6.1) district = { north: null };
  else if (latitude < -6.2 && latitude > -6.25) district = { south: null };
  else if (longitude < 106.8) district = { west: null };
  else district = { east: null };
  
  return {
    district,
    address: `Jakarta (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
    isValid: true
  };
};

// Verify a report
export const verifyReport = async (reportId, isValid, comment = null) => {
  try {
    const { actor, isAuthenticated } = await initActor();
    if (!actor) throw new Error("Backend connection failed");
    if (!isAuthenticated) throw new Error("Authentication required");
    
    const result = await actor.verifyReport(reportId, isValid, comment ? [comment] : []);
    return 'ok' in result;
  } catch (error) {
    console.error("Error verifying report:", error);
    throw error;
  }
};

// Mark a report as cleaned
export const markAsCleaned = async (reportId) => {
  try {
    const { actor, isAuthenticated } = await initActor();
    if (!actor) throw new Error("Backend connection failed");
    if (!isAuthenticated) throw new Error("Authentication required");
    
    const result = await actor.markAsCleaned(reportId);
    return 'ok' in result;
  } catch (error) {
    console.error("Error marking report as cleaned:", error);
    throw error;
  }
};

// Get all reports
export const getAllReports = async (limit = 10, offset = 0) => {
  try {
    const { actor } = await initActor();
    return actor ? await actor.getAllReports(limit, offset) : [];
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
};

// Get reports by district
export const getReportsByDistrict = async (district) => {
  try {
    const { actor } = await initActor();
    return actor ? await actor.getReportsByDistrict(district) : [];
  } catch (error) {
    console.error("Error fetching reports by district:", error);
    return [];
  }
};

// Get reports by status
export const getReportsByStatus = async (status) => {
  try {
    const { actor } = await initActor();
    return actor ? await actor.getReportsByStatus(status) : [];
  } catch (error) {
    console.error("Error fetching reports by status:", error);
    return [];
  }
};

// Get statistics
export const getStatistics = async () => {
  try {
    const { actor } = await initActor();
    if (!actor) return defaultStats;
    
    const stats = await actor.getStatistics();
    
    return {
      totalReports: Number(stats.totalReports),
      reportedCount: Number(stats.reportedCount),
      cleanedCount: Number(stats.cleanedCount),
      districtStats: stats.districtStats.map(([district, count]) => ({
        district: Object.keys(district)[0],
        count: Number(count)
      }))
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return defaultStats;
  }
};