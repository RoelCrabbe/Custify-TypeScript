import { EntityBase } from '@base/entityBase';
import { ValidationError } from '@error-log/exceptions';
import {
    isValidNotificationCategory,
    isValidNotificationPriority,
    isValidNotificationStatus,
    NotificationCategory,
    NotificationPriority,
    NotificationStatus,
} from '@notification/enums';
import { PrismaNotification, PrismaUser } from '@prisma';
import { User } from '@user';

export class Notification extends EntityBase {
    public readonly title: string;
    public readonly body: string;
    public readonly status: NotificationStatus;
    public readonly category: NotificationCategory;
    public readonly priority: NotificationPriority;
    public readonly sentDate?: Date;
    public readonly readDate?: Date;
    public readonly sender?: User;
    public readonly recipient: User;

    constructor(notification: {
        title: string;
        body: string;
        status: NotificationStatus;
        category: NotificationCategory;
        priority: NotificationPriority;
        sentDate?: Date;
        readDate?: Date;
        sender?: User;
        recipient: User;
        id?: number;
        createdById?: number;
        createdDate?: Date;
        modifiedById?: number;
        modifiedDate?: Date;
    }) {
        super(notification);

        this.title = notification.title;
        this.body = notification.body;
        this.status = notification.status;
        this.category = notification.category;
        this.priority = notification.priority;
        this.sentDate = notification.sentDate;
        this.readDate = notification.readDate;
        this.sender = notification.sender;
        this.recipient = notification.recipient;

        this.validate(notification);
    }

    private validate(notification: {
        title: string;
        body: string;
        status: NotificationStatus;
        category: NotificationCategory;
        priority: NotificationPriority;
    }): void {
        if (!notification.title?.trim()) {
            throw new ValidationError('Notification validation: Title is required');
        }
        if (!notification.body?.trim()) {
            throw new ValidationError('Notification validation: Body is required');
        }
        if (!isValidNotificationStatus(notification.status)) {
            throw new ValidationError('Notification validation: Status is invalid or missing.');
        }
        if (!isValidNotificationCategory(notification.category)) {
            throw new ValidationError('Notification validation: Category is invalid or missing.');
        }
        if (!isValidNotificationPriority(notification.priority)) {
            throw new ValidationError('Notification validation: Priority is invalid or missing.');
        }
    }

    getTitle(): string {
        return this.title;
    }

    getBody(): string {
        return this.body;
    }

    getStatus(): NotificationStatus {
        return this.status;
    }

    getCategory(): NotificationCategory {
        return this.category;
    }

    getPriority(): NotificationPriority {
        return this.priority;
    }

    getSentDate(): Date | undefined {
        return this.sentDate;
    }

    getReadDate(): Date | undefined {
        return this.readDate;
    }

    getSender(): User | undefined {
        return this.sender;
    }

    getRecipient(): User {
        return this.recipient;
    }

    equals(notification: Notification): boolean {
        return (
            this.title === notification.getTitle() &&
            this.body === notification.getBody() &&
            this.status === notification.getStatus() &&
            this.category === notification.getCategory() &&
            this.priority === notification.getPriority()
        );
    }

    toJSON() {
        return {
            id: this.getId(),
            title: this.title,
            body: this.body,
            status: this.status,
            category: this.category,
            priority: this.priority,
            sentDate: this.sentDate,
            readDate: this.readDate,
            sender: this.sender,
            recipient: this.recipient,
            createdById: this.getCreatedById(),
            createdDate: this.getCreatedDate(),
            modifiedById: this.getModifiedById(),
            modifiedDate: this.getModifiedDate(),
        };
    }

    static from({
        id,
        title,
        body,
        status,
        category,
        priority,
        sentDate,
        readDate,
        sender,
        recipient,
        createdById,
        createdDate,
        modifiedById,
        modifiedDate,
    }: PrismaNotification & { sender?: PrismaUser | null; recipient: PrismaUser }): Notification {
        return new Notification({
            id,
            title,
            body,
            status: status as NotificationStatus,
            category: category as NotificationCategory,
            priority: priority as NotificationPriority,
            sentDate,
            readDate: readDate || undefined,
            sender: sender ? User.from(sender) : undefined,
            recipient: User.from(recipient),
            createdById: createdById || undefined,
            createdDate: createdDate || undefined,
            modifiedById: modifiedById || undefined,
            modifiedDate: modifiedDate || undefined,
        });
    }

    static create({
        currentUser,
        notificationData,
    }: {
        currentUser: User;
        notificationData: {
            body: string;
            category: NotificationCategory;
            priority: NotificationPriority;
            status: NotificationStatus;
            title: string;
            recipient: User;
            sender?: User;
        };
    }): Notification {
        return new Notification({
            ...notificationData,
            createdById: currentUser.getId(),
        });
    }

    static update({
        existingNotification,
        notificationData,
        currentUser,
    }: {
        existingNotification: Notification;
        notificationData: {
            body: string;
            category: NotificationCategory;
            priority: NotificationPriority;
            status: NotificationStatus;
            title: string;
            readDate?: Date;
            recipient: User;
            sender?: User;
        };
        currentUser: User;
    }): Notification {
        return new Notification({
            id: existingNotification.getId(),
            body: notificationData.body ?? existingNotification.getBody(),
            category: notificationData.category ?? existingNotification.getCategory(),
            priority: notificationData.priority ?? existingNotification.getPriority(),
            status: notificationData.status ?? existingNotification.getStatus(),
            title: notificationData.title ?? existingNotification.getTitle(),
            readDate: notificationData.readDate ?? existingNotification.getReadDate(),
            sentDate: existingNotification.getSentDate(),
            recipient: notificationData.recipient ?? existingNotification.getRecipient(),
            sender: existingNotification.getSender(),
            createdById: existingNotification.getCreatedById(),
            createdDate: existingNotification.getCreatedDate(),
            modifiedById: currentUser.getId(),
        });
    }
}
