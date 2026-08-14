import { baseApi } from "@/redux/api/baseApi";

export type ContactSubmitInput = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  newsletterOptIn?: boolean;
};

const contactApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitContactMessage: build.mutation<{ id: string; createdAt: string }, ContactSubmitInput>({
      query: (body) => ({ url: "/contact", method: "POST", body }),
    }),
  }),
});

export const { useSubmitContactMessageMutation } = contactApiSlice;

export { contactApiSlice };
