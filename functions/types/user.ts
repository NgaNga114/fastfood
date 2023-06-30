export enum UserPermissions {
  ADMIN = "admin",
  SHIPPER = "shipper",
  USER = "user"
}

export enum StaffStatus {
  BUSY = "busy",
  FREE = "free"
}
export interface UserProfile {
  id: string;
  phone: number;
  email: string;
  name: string;
  sex?: string;
  age?: number;
  role: UserPermissions;
  avatarUrl?: string | null;
  // primaryAddress?: string | null;
  // subAddress?: string | null;
  address?: string[];
}

export interface userProfileFeedBack {
  id: string | null,
  phoneNumber: number,
  email: string,
  name: string,
  address: string
}
