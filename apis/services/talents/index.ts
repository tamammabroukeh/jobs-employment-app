import apiFetcher from "@/apis/api.instance";
import { Methods } from "@/constants/methods";
import type { TalentDetailResponse } from "./interface";

export const talentsRepository = {
  /**
   * Get talent detail by user ID
   * @param userId - User ID of the talent
   * @returns Promise with talent detail
   */
  getTalentById: async (userId: string): Promise<TalentDetailResponse> => {
    return apiFetcher<TalentDetailResponse>(`/users/${userId}`, {
      method: Methods.GET,
      next: {
        tags: [`talent-${userId}`],
        revalidate: 3600,
      },
    });
  },
};
