import { UserBase } from '@base/userBase';
import { User as PrismaUser } from '@prisma/client';
import { Role } from '@types';

export class User extends UserBase {
    constructor(user: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        role: Role;
        isActive: boolean;
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
    }): void {
        if (!user.userName?.trim()) {
            throw new Error('User validation: Username is required');
        }
        if (user.userName.length < 3) {
            throw new Error('User validation: Username must be at least 3 characters long');
        }
        if (!user.firstName?.trim()) {
            throw new Error('User validation: First name is required');
        }
        if (!user.lastName?.trim()) {
            throw new Error('User validation: Last name is required');
        }
        if (!user.email?.trim()) {
            throw new Error('User validation: Email is required');
        }
        if (!user.passWord?.trim()) {
            throw new Error('User validation: Password is required');
        }
        if (user.role && !Object.values(Role).includes(user.role)) {
            throw new Error('User validation: Invalid role');
        }
    }

    equals(user: User): boolean {
        return (
            this.userName === user.getUserName() &&
            this.firstName === user.getFirstName() &&
            this.lastName === user.getLastName() &&
            this.email === user.getEmail() &&
            this.role === user.getRole()
        );
    }

    toJSON() {
        return {
            id: this.id,
            userName: this.userName,
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.getFullName(),
            email: this.email,
            role: this.role,
            isActive: this.isActive,
            phoneNumber: this.phoneNumber,
            createdDate: this.createdDate,
            modifiedDate: this.modifiedDate,
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
        isActive,
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
            isActive: isActive,
            phoneNumber: phoneNumber || undefined,
            createdDate: createdDate || undefined,
            modifiedDate: modifiedDate || undefined,
            createdById: createdById || undefined,
            modifiedById: modifiedById || undefined,
        });
    }

    static create(userData: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        phoneNumber?: string;
    }): User {
        return new User({
            ...userData,
            role: Role.USER,
            isActive: true,
        });
    }

    static update(
        existingUser: User,
        updateData: {
            userName?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            passWord?: string;
            phoneNumber?: string;
            role?: Role;
            isActive?: boolean;
            modifiedById?: number;
        },
    ): User {
        return new User({
            id: existingUser.getId(),
            userName: updateData.userName ?? existingUser.getUserName(),
            firstName: updateData.firstName ?? existingUser.getFirstName(),
            lastName: updateData.lastName ?? existingUser.getLastName(),
            email: updateData.email ?? existingUser.getEmail(),
            passWord: updateData.passWord ?? existingUser.getPassWord(),
            role: updateData.role ?? existingUser.getRole(),
            isActive: updateData.isActive ?? existingUser.getIsActive(),
            phoneNumber: updateData.phoneNumber ?? existingUser.getPhoneNumber(),
            createdById: existingUser.getCreatedById(),
            modifiedById: updateData.modifiedById ?? existingUser.getModifiedById(),
        });
    }

    activate(): void {
        this.isActive = true;
    }

    deactivate(): void {
        this.isActive = false;
    }
}
