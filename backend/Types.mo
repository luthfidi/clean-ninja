module {
  // Type untuk waste reports
  public type Report = {
    id : Text;
    reporter : Principal;
    location : Location;
    district : District;
    description : Text;
    imageBlob : ?Blob;
    timestamp : Int;
    status : ReportStatus;
    verifications : [Verification];
  };

  // Geographic location type
  public type Location = {
    latitude : Float;
    longitude : Float;
    address : ?Text;
  };

  // Location info for verification results
  public type LocationInfo = {
    district : District;
    address : Text;
    isValid : Bool;
  };

  // Districts in Jakarta
  public type District = {
    #central;
    #west;
    #south;
    #east;
    #north;
  };

  // Report status
  public type ReportStatus = {
    #reported;
    #cleaned;
  };

  // Verification type
  public type Verification = {
    verifier : Principal;
    timestamp : Int;
    isValid : Bool;
    comment : ?Text;
  };

  // Statistics type
  public type Statistics = {
    totalReports : Nat;
    reportedCount : Nat;
    cleanedCount : Nat;
    districtStats : [(District, Nat)];
  };
}