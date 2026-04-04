import { ActionError, FetchError } from "@/api/types/error";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
  async handleServerError(e) {
    console.error("Action error:", e.message);
    console.log(e, "handleReturnedServerError");
    if (e instanceof ActionError) {
      return e.message;
    }
    if (e instanceof FetchError) {
      if (e.status === 401) return "error.permission.actionAccess";
      if (e.status === 500) return "error.permission.actionAccess";
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient
  // Define authorization middleware.
  .use(async ({ next }) => {
    // const cookieStore = await cookies();
    const session = "cookieStore.ge";

    if (!session) {
      throw new Error("Session not found!");
    }
    // await getUserIdFromSessionId(session)
    const userId = "cds";

    if (!userId) {
      throw new Error("Session is not valid!");
    }

    // Return the next middleware with `userId` value in the context
    return next({ ctx: { userId } });
  });
