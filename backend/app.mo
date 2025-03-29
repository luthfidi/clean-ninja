import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import Float "mo:base/Float";
import Bool "mo:base/Bool";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Types "Types";

persistent actor CleanNinja {
  // Type aliases
  type Report = Types.Report;
  type Location = Types.Location;
  type District = Types.District;
  type ReportStatus = Types.ReportStatus;
  type Verification = Types.Verification;
  type Statistics = Types.Statistics;
  type LocationInfo = Types.LocationInfo;

  // HTTP interface for outcalls
  type IC = actor { http_request : shared { url : Text; method : { #get; #post; #head }; headers : [{ name : Text; value : Text }]; body : ?Blob; max_response_bytes : ?Nat64 } -> async HttpResponse };
  type HttpResponse = { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };

  // Stable storage
  stable var nextReportId : Nat = 0;
  stable var reportsEntries : [(Text, Report)] = [];
  stable var userReportsEntries : [(Principal, [Text])] = [];

  // Runtime storage
  transient var reports = HashMap.HashMap<Text, Report>(0, Text.equal, Text.hash);
  transient var userReports = HashMap.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);

  // Initialize from stable storage
  if (reportsEntries.size() > 0) {
    reports := HashMap.fromIter<Text, Report>(Iter.fromArray(reportsEntries), 0, Text.equal, Text.hash);
    userReports := HashMap.fromIter<Principal, [Text]>(Iter.fromArray(userReportsEntries), 0, Principal.equal, Principal.hash);
  };

  // Helper to check if coordinates are valid for Jakarta
  private func isValidCoordinate(lat : Float, long : Float) : Bool { lat >= -6.4 and lat <= -6.1 and long >= 106.7 and long <= 107.0 };

  // Helper to convert District to Text
  private func districtToText(district : District) : Text {
    switch (district) {
      case (#central) { "Central Jakarta" };
      case (#west) { "West Jakarta" };
      case (#south) { "South Jakarta" };
      case (#east) { "East Jakarta" };
      case (#north) { "North Jakarta" };
    };
  };

  // Sample data initializer (simplified)
  private func initSampleData() {
    if (reports.size() > 0) { return };
    
    let defaultPrincipal = Principal.fromText("2vxsx-fae");
    
    // Sample 1
    let report1 : Report = {
      id = "0";
      reporter = defaultPrincipal;
      location = {
        latitude = -6.2088;
        longitude = 106.8456;
        address = ?"Central Jakarta";
      };
      district = #central;
      description = "Trash pile on roadside near bus stop.";
      imageBlob = null;
      timestamp = Time.now();
      status = #reported;
      verifications = [{
        verifier = defaultPrincipal;
        timestamp = Time.now();
        isValid = true;
        comment = null;
      }];
    };
    
    // Sample 2
    let report2 : Report = {
      id = "1";
      reporter = defaultPrincipal;
      location = {
        latitude = -6.1750;
        longitude = 106.7772;
        address = ?"West Jakarta";
      };
      district = #west;
      description = "Clogged drain with plastic waste.";
      imageBlob = null;
      timestamp = Time.now() - 1000000000;
      status = #reported;
      verifications = [{
        verifier = defaultPrincipal;
        timestamp = Time.now();
        isValid = true;
        comment = null;
      }];
    };
    
    // Sample 3
    let report3 : Report = {
      id = "2";
      reporter = defaultPrincipal;
      location = {
        latitude = -6.1255;
        longitude = 106.8450;
        address = ?"North Jakarta";
      };
      district = #north;
      description = "Coastal cleanup success by local community.";
      imageBlob = null;
      timestamp = Time.now() - 2000000000;
      status = #cleaned;
      verifications = [{
        verifier = defaultPrincipal;
        timestamp = Time.now();
        isValid = true;
        comment = null;
      }];
    };
    
    reports.put("0", report1);
    reports.put("1", report2);
    reports.put("2", report3);
    
    userReports.put(defaultPrincipal, ["0", "1", "2"]);
    nextReportId := 3;
  };

  // Initialize sample data
  initSampleData();

  // Location verification using HTTPS outcall
  public func verifyLocation(lat : Float, lng : Float) : async Result.Result<LocationInfo, Text> {
    if (not isValidCoordinate(lat, lng)) { return #err("Invalid coordinates for Jakarta area") };
    
    try {
      let ic : IC = actor("aaaaa-aa");
      let url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" # Float.toText(lat) # "&lon=" # Float.toText(lng);
      
      // Add cycles for outcall
      ExperimentalCycles.add<system>(100_000_000_000);
      
      let response = await ic.http_request({
        url = url;
        method = #get;
        headers = [{ name = "User-Agent"; value = "CleanNinja_ICP_App/1.0" }];
        body = null;
        max_response_bytes = ?2000;
      });
      
      if (response.status != 200) { return #err("Failed to verify location: " # Nat.toText(response.status)) };
      
      // Simple district detection based on coordinates
      var district : District = #central;
      
      if (lat > -6.2 and lat < -6.15) {
        district := #central;
      } else if (lat > -6.15 and lat < -6.1) {
        district := #north;
      } else if (lat < -6.2 and lat > -6.25) {
        district := #south;
      } else if (lng < 106.8) {
        district := #west;
      } else {
        district := #east;
      };
          
      return #ok({
        district = district;
        address = districtToText(district);
        isValid = true;
      });
    } catch (_) {
      #err("Error during location verification")
    }
  };

  // ===== PUBLIC API =====

  // Get current user's Principal
  public shared query(msg) func getMyPrincipal() : async Principal {
    return msg.caller;
  };

  // Check if user is authenticated
  public shared query(msg) func isAuthenticated() : async Bool {
    return not Principal.isAnonymous(msg.caller);
  };

  // Create a new report
  public shared(msg) func createReport(location : Location, district : District, description : Text, imageBlob : ?Blob) : async Result.Result<Text, Text> {
    if (Principal.isAnonymous(msg.caller)) { return #err("Authentication required") };
    if (description == "") { return #err("Description cannot be empty") };
    
    let reportId = Nat.toText(nextReportId);
    nextReportId += 1;
    
    let newReport : Report = {
      id = reportId;
      reporter = msg.caller;
      location = location;
      district = district;
      description = description;
      imageBlob = imageBlob;
      timestamp = Time.now();
      status = #reported;
      verifications = [];
    };
    
    reports.put(reportId, newReport);
    
    // Update user's reports list
    switch (userReports.get(msg.caller)) {
      case (null) { userReports.put(msg.caller, [reportId]); };
      case (?existingReports) { userReports.put(msg.caller, Array.append<Text>(existingReports, [reportId])); };
    };
    
    #ok(reportId)
  };
  
  // Verify a report
  public shared(msg) func verifyReport(reportId : Text, isValid : Bool, comment : ?Text) : async Result.Result<(), Text> {
    if (Principal.isAnonymous(msg.caller)) { return #err("Authentication required") };
    
    switch (reports.get(reportId)) {
      case (null) { #err("Report not found") };
      case (?report) {
        for (verification in report.verifications.vals()) {
          if (Principal.equal(verification.verifier, msg.caller)) {
            return #err("Already verified");
          };
        };
        
        let newVerification : Verification = {
          verifier = msg.caller;
          timestamp = Time.now();
          isValid = isValid;
          comment = comment;
        };
        
        let updatedReport = {
          id = report.id;
          reporter = report.reporter;
          location = report.location;
          district = report.district;
          description = report.description;
          imageBlob = report.imageBlob;
          timestamp = report.timestamp;
          status = report.status;
          verifications = Array.append<Verification>(report.verifications, [newVerification]);
        };
        
        reports.put(reportId, updatedReport);
        #ok()
      };
    };
  };
  
  // Mark a report as cleaned
  public shared(msg) func markAsCleaned(reportId : Text) : async Result.Result<(), Text> {
    if (Principal.isAnonymous(msg.caller)) { return #err("Authentication required") };
    
    switch (reports.get(reportId)) {
      case (null) { #err("Report not found") };
      case (?report) {
        if (report.status == #cleaned) { return #err("Already cleaned") };
        
        let updatedReport = {
          id = report.id;
          reporter = report.reporter;
          location = report.location;
          district = report.district;
          description = report.description;
          imageBlob = report.imageBlob;
          timestamp = report.timestamp;
          status = #cleaned;
          verifications = report.verifications;
        };
        
        reports.put(reportId, updatedReport);
        #ok()
      };
    };
  };
  
  // ===== QUERY FUNCTIONS =====
  
  // Get all reports (with pagination)
  public query func getAllReports(limit : Nat, offset : Nat) : async [Report] {
    let allReports = Iter.toArray(reports.vals());
    let totalReports = allReports.size();
    
    if (offset >= totalReports) { return [] };
    
    let end = Nat.min(offset + limit, totalReports);
    return Array.tabulate<Report>(end - offset, func(i) { allReports[i + offset] });
  };
  
  // Get a single report by ID
  public query func getReport(id : Text) : async ?Report {
    return reports.get(id);
  };
  
  // Get reports by district
  public query func getReportsByDistrict(district : District) : async [Report] {
    var results : [Report] = [];
    for (report in reports.vals()) {
      if (report.district == district) {
        results := Array.append(results, [report]);
      };
    };
    return results;
  };
  
  // Get reports by status
  public query func getReportsByStatus(status : ReportStatus) : async [Report] {
    var results : [Report] = [];
    for (report in reports.vals()) {
      if (report.status == status) {
        results := Array.append(results, [report]);
      };
    };
    return results;
  };
  
  // Get reports created by a specific user
  public query func getUserReports(user : Principal) : async [Report] {
    switch (userReports.get(user)) {
      case (null) { return [] };
      case (?reportIds) { 
        var results : [Report] = [];
        for (id in reportIds.vals()) {
          switch (reports.get(id)) {
            case (null) { /* Skip */ };
            case (?report) { results := Array.append(results, [report]); };
          };
        };
        return results;
      };
    };
  };
  
  // Get statistics
  public query func getStatistics() : async Statistics {
    var totalReports = 0;
    var reported = 0;
    var cleaned = 0;
    var centralCount = 0;
    var westCount = 0;
    var southCount = 0;
    var eastCount = 0;
    var northCount = 0;
    
    for (report in reports.vals()) {
      totalReports += 1;
      
      if (report.status == #reported) {
        reported += 1;
      } else if (report.status == #cleaned) {
        cleaned += 1;
      };
      
      switch (report.district) {
        case (#central) { centralCount += 1; };
        case (#west) { westCount += 1; };
        case (#south) { southCount += 1; };
        case (#east) { eastCount += 1; };
        case (#north) { northCount += 1; };
      };
    };
    
    return {
      totalReports = totalReports;
      reportedCount = reported;
      cleanedCount = cleaned;
      districtStats = [
        (#central, centralCount),
        (#west, westCount),
        (#south, southCount),
        (#east, eastCount),
        (#north, northCount)
      ];
    };
  };
  
  // Pre-upgrade hook
  system func preupgrade() {
    reportsEntries := Iter.toArray(reports.entries());
    userReportsEntries := Iter.toArray(userReports.entries());
  };
  
  // Post-upgrade hook
  system func postupgrade() {
    reports := HashMap.fromIter<Text, Report>(Iter.fromArray(reportsEntries), 0, Text.equal, Text.hash);
    userReports := HashMap.fromIter<Principal, [Text]>(Iter.fromArray(userReportsEntries), 0, Principal.equal, Principal.hash);
    reportsEntries := [];
    userReportsEntries := [];
  };
}
