import { UserBase } from '@base/userBase';
import { ValidationError } from '@error-log/exceptions';
import { PrismaUser, PrismaUserImage } from '@prisma/index';
import { UserImage, UserRole, UserStatus, isValidUserRole, isValidUserStatus } from '@user';

export class User extends UserBase {
    public readonly profileImage?: UserImage;

    constructor(user: {
        profileImage?: UserImage;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        role: UserRole;
        status: UserStatus;
        phoneNumber?: string;
        id?: number;
        createdById?: number;
        createdDate?: Date;
        modifiedById?: number;
        modifiedDate?: Date;
    }) {
        super(user);

        this.profileImage = user.profileImage;
        this.validate(user);
    }

    private validate(user: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        role?: UserRole;
        status?: UserStatus;
    }): void {
        if (!user.userName?.trim()) {
            throw new ValidationError('User validation: Username is required');
        }
        if (!user.firstName?.trim()) {
            throw new ValidationError('User validation: First name is required');
        }
        if (!user.lastName?.trim()) {
            throw new ValidationError('User validation: Last name is required');
        }
        if (!user.email?.trim()) {
            throw new ValidationError('User validation: Email is required');
        }
        if (!user.passWord?.trim()) {
            throw new ValidationError('User validation: Password is required');
        }
        if (!isValidUserRole(user.role)) {
            throw new ValidationError('User validation: Role is invalid or missing.');
        }
        if (!isValidUserStatus(user.status)) {
            throw new ValidationError('User validation: Status is invalid or missing.');
        }
    }

    getProfileImage(): UserImage | undefined {
        return this.profileImage;
    }

    equals(user: User): boolean {
        return (
            this.userName === user.getUserName() &&
            this.firstName === user.getFirstName() &&
            this.lastName === user.getLastName() &&
            this.email === user.getEmail() &&
            this.role === user.getRole() &&
            this.status === user.getStatus()
        );
    }

    toJSON() {
        return {
            id: this.getId(),
            userName: this.userName,
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.getFullName(),
            email: this.email,
            role: this.role,
            status: this.status,
            phoneNumber: this.phoneNumber,
            profileImage: this.profileImage,
            createdById: this.getCreatedById(),
            createdDate: this.getCreatedDate(),
            modifiedById: this.getModifiedById(),
            modifiedDate: this.getModifiedDate(),
        };
    }

    static from({
        id,
        userName,
        firstName,
        lastName,
        email,
        passWord,
        role,
        status,
        phoneNumber,
        profileImage,
        createdById,
        createdDate,
        modifiedById,
        modifiedDate,
    }: PrismaUser & { profileImage?: PrismaUserImage | null }): User {
        return new User({
            id,
            userName,
            firstName,
            lastName,
            email,
            passWord,
            role: role as UserRole,
            status: status as UserStatus,
            phoneNumber: phoneNumber || undefined,
            profileImage: profileImage ? UserImage.from(profileImage) : undefined,
            createdById: createdById || undefined,
            createdDate: createdDate || undefined,
            modifiedById: modifiedById || undefined,
            modifiedDate: modifiedDate || undefined,
        });
    }

    static create({
        currentUser,
        userData,
    }: {
        currentUser: User | null;
        userData: {
            userName: string;
            firstName: string;
            lastName: string;
            email: string;
            passWord: string;
            phoneNumber?: string;
        };
    }): User {
        return new User({
            ...userData,
            role: UserRole.Guest,
            status: UserStatus.Active,
            createdById: currentUser?.getId() ?? undefined,
        });
    }

    static update({
        currentUser,
        existingUser,
        userData,
    }: {
        currentUser: User;
        existingUser: User;
        userData: {
            userName: string;
            firstName: string;
            lastName: string;
            email: string;
            passWord: string;
            role: UserRole;
            status: UserStatus;
            phoneNumber?: string;
        };
    }): User {
        return new User({
            id: existingUser.getId(),
            userName: userData.userName ?? existingUser.getUserName(),
            firstName: userData.firstName ?? existingUser.getFirstName(),
            lastName: userData.lastName ?? existingUser.getLastName(),
            email: userData.email ?? existingUser.getEmail(),
            passWord: userData.passWord ?? existingUser.getPassWord(),
            role: userData.role ?? existingUser.getRole(),
            status: userData.status ?? existingUser.getStatus(),
            phoneNumber: userData.phoneNumber ?? existingUser.getPhoneNumber(),
            createdById: existingUser.getCreatedById(),
            createdDate: existingUser.getCreatedDate(),
            modifiedById: currentUser.getId()!,
        });
    }

    roleGuest(): void {
        this.role = UserRole.Guest;
    }

    roleHumanResource(): void {
        this.role = UserRole.HumanResources;
    }

    roleAdmin(): void {
        this.role = UserRole.Admin;
    }

    statusActive(): void {
        this.status = UserStatus.Active;
    }

    statusInActive(): void {
        this.status = UserStatus.InActive;
    }

    statusDelete(): void {
        this.status = UserStatus.Deleted;
    }
}
