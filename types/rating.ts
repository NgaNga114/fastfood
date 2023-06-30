import { UserProfile } from "~/types/user";

export interface IRating {
  id?: string;
  comment: string;
  uid: string;
  rate: number;
  date: Date | string;
  productId: string;
  isEdited: boolean;
  user?: UserProfile;
}