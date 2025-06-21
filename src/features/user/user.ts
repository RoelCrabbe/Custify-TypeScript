import { UserBase } from '@base/userBase';
import { ValidationError } from '@errorLog/exceptions';
import { PrismaUser, PrismaUserImage } from '@prisma';
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
        createUser,
        createData,
    }: {
        createUser: User | null;
        createData: {
            userName: string;
            firstName: string;
            lastName: string;
            email: string;
            passWord: string;
            phoneNumber?: string;
        };
    }): User {
        return new User({
            ...createData,
            role: UserRole.Guest,
            status: UserStatus.Active,
            createdById: createUser?.getId(),
        });
    }

    static update({
        updateUser,
        updateData,
        updateEntity,
    }: {
        updateUser: User;
        updateData: {
            userName: string;
            firstName: string;
            lastName: string;
            email: string;
            passWord: string;
            role: UserRole;
            status: UserStatus;
            phoneNumber?: string;
        };
        updateEntity: User;
    }): User {
        return new User({
            id: updateEntity.getId(),
            userName: updateData.userName ?? updateEntity.getUserName(),
            firstName: updateData.firstName ?? updateEntity.getFirstName(),
            lastName: updateData.lastName ?? updateEntity.getLastName(),
            email: updateData.email ?? updateEntity.getEmail(),
            passWord: updateData.passWord ?? updateEntity.getPassWord(),
            role: updateData.role ?? updateEntity.getRole(),
            status: updateData.status ?? updateEntity.getStatus(),
            phoneNumber: updateData.phoneNumber ?? updateEntity.getPhoneNumber(),
            createdById: updateEntity.getCreatedById(),
            createdDate: updateEntity.getCreatedDate(),
            modifiedById: updateUser.getId()!,
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
