export const NotificationStatus = {
    Pending: 'Pending',
    Sent: 'Sent',
    Read: 'Read',
} as const;

export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];

export const isValidNotificationStatus = (
    notificationStatus: unknown,
): notificationStatus is NotificationStatus => {
    return (
        typeof notificationStatus === 'string' &&
        Object.values(NotificationStatus).includes(notificationStatus as NotificationStatus)
    );
};

export const NotificationCategory = {
    General: 'General',
    System: 'System',
    Alert: 'Alert',
} as const;

export type NotificationCategory = (typeof NotificationCategory)[keyof typeof NotificationCategory];

export const isValidNotificationCategory = (
    notificationCategory: unknown,
): notificationCategory is NotificationCategory => {
    return (
        typeof notificationCategory === 'string' &&
        Object.values(NotificationCategory).includes(notificationCategory as NotificationCategory)
    );
};

export const NotificationPriority = {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
} as const;

export type NotificationPriority = (typeof NotificationPriority)[keyof typeof NotificationPriority];

export const isValidNotificationPriority = (
    notificationPriority: unknown,
): notificationPriority is NotificationPriority => {
    return (
        typeof notificationPriority === 'string' &&
        Object.values(NotificationPriority).includes(notificationPriority as NotificationPriority)
    );
};
