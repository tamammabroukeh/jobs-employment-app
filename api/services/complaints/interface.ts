// import IComplaint from "@workspace/shared/api/services/complaints/complaints.interface";

// export interface IComplaintsData {
//   all_complaints: IComplaint[];
//   pending_complaints: IComplaint[];
//   resolved_complaints: IComplaint[];
// }
export interface IComplaintStatistics {
  total_complaints: number;
  pending_complaints: number;
  resolved_complaints: number;
}
export interface IComplaintConfig {
  competent_authorities: IConfigItem[];
  destinations: IConfigItem[];
  complaint_types: IConfigItem[];
}
export interface IConfigItem {
  id: number;
  name: string;
}
