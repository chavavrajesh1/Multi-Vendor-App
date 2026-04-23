import { Types } from "mongoose";
import { Notification } from "../../models/notification.model";

export class NotificationService{

    async createNotification(
        userId: Types.ObjectId,
        title: string,
        message: string,
        type: string = "SYSTEM"
    ){
        const notification = await Notification.create({
            user: userId,
            title,
            message,
            type,
        });
        return notification;
    }

    async getUserNotifications(userId: Types.ObjectId) {

        const notifications = await Notification.find({
            user: userId,
        }).sort({ createdAt: -1 });

        return notifications
    }

    async markAsRead(notificationId: string) {
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        return notification;
    }

    async markAllAsRead(userId: Types.ObjectId) {

        await Notification.updateMany(
            { user: userId },
            { isRead: true }
        );

        return { message: "All notifications marked as read" };
    }

    async deleteNotification(notificationId: string) {
        await Notification.findByIdAndDelete(notificationId);

        return { message: "Notification deleted" };
    }
}