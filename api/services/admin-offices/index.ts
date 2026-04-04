import apiFetcher from "@/api/api.instance";
import { IAdminOffice } from "./interface";
import { APIResponse } from "@/api/types";


export const adminOfficesRepository = {
  getAdminOffices: (): Promise<APIResponse<IAdminOffice[]>> =>
    apiFetcher<APIResponse<IAdminOffice[]>>(`/admin/offices`),
};
