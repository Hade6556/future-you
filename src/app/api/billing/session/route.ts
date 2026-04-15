import { billingSessionPost } from "@/lib/stripe-billing";

export const POST = (request: Request) => billingSessionPost(request);
