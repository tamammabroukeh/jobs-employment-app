import { APIResponse } from "@/api/types";
import {
  IComplaintConfig,
  IComplaintsData,
  IComplaintStatistics,
} from "./interface";
import IComplaint from "@workspace/shared/api/services/complaints/complaints.interface";
import { authFetcher } from "@/api/authInstace";

export const citizenUserRepository = {
  getComplaints: async (): Promise<APIResponse<IComplaintsData>> =>
    authFetcher<APIResponse<IComplaintsData>>(`/me/complaints`),
  getComplaint: async (id: number): Promise<APIResponse<IComplaint>> =>
    authFetcher<APIResponse<IComplaint>>(`/me/complaints/${id}`),
  getComplaintsStatistics: async (): Promise<
    APIResponse<IComplaintStatistics>
  > => authFetcher<APIResponse<IComplaintStatistics>>(`/me/statistics`),
  getComplaintsConfig: async (): Promise<APIResponse<IComplaintConfig>> =>
    authFetcher<APIResponse<IComplaintConfig>>(`/complaints/complaint-configs`),
};
