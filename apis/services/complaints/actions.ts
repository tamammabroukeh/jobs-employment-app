// "use server";
// import apiFetcher from "@/apis/api.instance";
// import { actionClient } from "@/lib/safe-action";
// import { complaintSchema } from "@/schemas/complaint";
// import IComplaint from "@workspace/shared/api/services/complaints/complaints.interface";
// import { APIResponse } from "@/apis/types";
// import { messages } from "@/constants/messages";
// import { ActionError } from "@/apis/types/error";

// export const createComplaintAction = actionClient
//   .inputSchema(complaintSchema)
//   .action(async ({ parsedInput: data }) => {
//     try {
//       const response = await apiFetcher<APIResponse<IComplaint>>(
//         `/complaints/create`,
//         {
//           method: "POST",
//           body: JSON.stringify(data),
//         },
//       );
//       console.log("createComplaintAction", response);
//       return messages.success.auth.login.title;
//     } catch {
//       throw new ActionError("could not create complaint");
//     }
//   });