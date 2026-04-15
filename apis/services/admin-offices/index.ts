import apiFetcher from "@/apis/api.instance";
import { IAdminOffice } from "./interface";
import { APIResponse } from "@/apis/types";


export const adminOfficesRepository = {
  getAdminOffices: (): Promise<APIResponse<IAdminOffice[]>> =>
    apiFetcher<APIResponse<IAdminOffice[]>>(`/admin/offices`),
};
