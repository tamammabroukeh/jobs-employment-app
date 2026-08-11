"use server";

import { talentsRepository } from "./index";

export const getTalentByIdAction = async (userId: string) => {
  try {
    console.log('[Get Talent Detail] ========== FETCHING TALENT DETAIL ==========');
    console.log('[Get Talent Detail] User ID:', userId);
    
    const response = await talentsRepository.getTalentById(userId);
    console.log('[Get Talent Detail] Response:', response);

    if (!response) {
      console.error('[Get Talent Detail] Fetch failed');
      throw new Error('Failed to fetch talent detail');
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('[Get Talent Detail] ========== EXCEPTION ==========');
    console.error('[Get Talent Detail] Error:', error);

    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to fetch talent detail');
    }
    throw new Error('Failed to fetch talent detail. Please try again.');
  }
};
