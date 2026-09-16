import { baseApi } from "@/redux/api/baseApi";

export type ContactSubmitInput = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  newsletterOptIn?: boolean;
};

/**
 * Mirrors the server's contact.validation.ts. The form enforces these up front
 * so a visitor learns what to fix before sending — keep the two in step.
 */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 200 },
  phone: { max: 40 },
  subject: { min: 2, max: 200 },
  message: { min: 10, max: 5000 },
} as const;

const contactApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitContactMessage: build.mutation<{ id: string; createdAt: string }, ContactSubmitInput>({
      query: (body) => ({ url: "/contact", method: "POST", body }),
      // The form shows its own errors beside the fields; the global toast only
      // ever said "Validation failed", which told the visitor nothing.
      extraOptions: { silent: true },
    }),
  }),
});

export const { useSubmitContactMessageMutation } = contactApiSlice;

export { contactApiSlice };
