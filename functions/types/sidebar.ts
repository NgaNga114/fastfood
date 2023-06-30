import { UserPermissions } from "./user";

export interface ISidebarItem {
  permissions: UserPermissions[];
  icon?: string;
  title: string;
  to?: string;
  children?: IChildren[];
}

export interface IChildren {
  permissions?: UserPermissions[];
  title: string;
  to: string;
}
