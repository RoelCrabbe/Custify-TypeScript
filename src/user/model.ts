import { UserBase } from '@base/userBase';
import { ValidationError } from '@middleware/exceptions/index';
import { User as PrismaUser } from '@prisma/client';
import { isValidRole, Role } from '@user/role';
import { isValidStatus, Status } from '@user/status';

export class User extends UserBase {
    constructor(user: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        role: Role;
        status: Status;
        phoneNumber?: string;
        id?: number;
        createdDate?: Date;
        modifiedDate?: Date;
        createdById?: number;
        modifiedById?: number;
    }) {
        super(user);
        this.validate(user);
    }

    private validate(user: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        role?: Role;
        status?: Status;
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
        if (!isValidRole(user.role)) {
            throw new ValidationError('User validation: Role is invalid or missing.');
        }
        if (!isValidStatus(user.status)) {
            throw new ValidationError('User validation: Status is invalid or missing.');
        }
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
            createdDate: this.getCreatedDate(),
            modifiedDate: this.getModifiedDate(),
            createdById: this.getCreatedById(),
            modifiedById: this.getModifiedById(),
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
        createdDate,
        modifiedDate,
        createdById,
        modifiedById,
    }: PrismaUser): User {
        return new User({
            id,
            userName,
            firstName,
            lastName,
            email,
            passWord,
            role: role as Role,
            status: status as Status,
            phoneNumber: phoneNumber || undefined,
            createdDate: createdDate || undefined,
            modifiedDate: modifiedDate || undefined,
            createdById: createdById || undefined,
            modifiedById: modifiedById || undefined,
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
            role: Role.Guest,
            status: Status.Active,
            createdById: currentUser?.getId() ?? undefined,
            modifiedById: currentUser?.getId() ?? undefined,
        });
    }

    static update({
        currentUser,
        existingUser,
        updateData,
    }: {
        currentUser: User;
        existingUser: User;
        updateData: {
            userName: string;
            firstName: string;
            lastName: string;
            email: string;
            passWord: string;
            role: Role;
            status: Status;
            phoneNumber?: string;
        };
    }): User {
        return new User({
            id: existingUser.getId(),
            userName: updateData.userName ?? existingUser.getUserName(),
            firstName: updateData.firstName ?? existingUser.getFirstName(),
            lastName: updateData.lastName ?? existingUser.getLastName(),
            email: updateData.email ?? existingUser.getEmail(),
            passWord: updateData.passWord ?? existingUser.getPassWord(),
            role: updateData.role ?? existingUser.getRole(),
            status: updateData.status ?? existingUser.getStatus(),
            phoneNumber: updateData.phoneNumber ?? existingUser.getPhoneNumber(),
            createdDate: existingUser.getCreatedDate(),
            createdById: existingUser.getCreatedById(),
            modifiedDate: existingUser.getModifiedDate(),
            modifiedById: currentUser.getId()!,
        });
    }

    roleGuest(): void {
        this.role = Role.Guest;
    }

    roleHumanResource(): void {
        this.role = Role.HumanResources;
    }

    roleAdmin(): void {
        this.role = Role.Admin;
    }

    statusActive(): void {
        this.status = Status.Active;
    }

    statusInActive(): void {
        this.status = Status.InActive;
    }

    statusDelete(): void {
        this.status = Status.Deleted;
    }
}
