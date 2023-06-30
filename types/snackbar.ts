import { NotificationType } from "~/enums/notification";

export interface ISnackBar {
  show: boolean;
  text: string;
  color: string;
}

export interface INotification {
  id?: string;
  type: NotificationType.FEED_BACK | NotificationType.ORDER;
  content: string;
  idType: string;
  isRead: boolean;
  date: Date | string;
}
