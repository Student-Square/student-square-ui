/** Types for the /profile API surface. */

export type ProfileUpdateInput = {
  bio?: string;
  bioBn?: string;
  phone?: string;
  country?: string;
  city?: string;
  currentAddress?: string;
  university?: string;
  department?: string;
  profession?: string;
  workplace?: string;
  preferredAnonymous?: boolean;
};
