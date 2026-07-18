import { getTranslations } from "next-intl/server";

export async function getAuthTranslations() {
  return await getTranslations("auth");
}

export async function getDashboardTranslations() {
  return await getTranslations("dashboard");
}

export async function getErrorTranslations() {
  return await getTranslations("errors");
}

export async function getSessionTranslations() {
  return await getTranslations("session");
}

export async function getHomeTranslations() {
  return await getTranslations("home");
}

export async function getFooterTranslations() {
  return await getTranslations("footer");
}

export async function getJobsTranslations() {
  return await getTranslations("jobs");
}

export async function getCompaniesTranslations() {
  return await getTranslations("companies");
}

export async function getJobDetailTranslations() {
  return await getTranslations("jobDetail");
}

export async function getProfileTranslations() {
  return await getTranslations("profile");
}

export async function getCandidatesTranslations() {
  return await getTranslations("candidates");
}
