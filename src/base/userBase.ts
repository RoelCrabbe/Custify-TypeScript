import { EntityBase } from '@base/entityBase';
import { Role } from '@types';

export abstract class UserBase extends EntityBase {
    protected userName: string;
    protected firstName: string;
    protected lastName: string;
    protected email: string;
    protected passWord: string;
    protected role: Role;
    protected isActive: boolean;
    protected phoneNumber?: string;

    constructor(userData: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        role?: Role;
        isActive?: boolean;
        phoneNumber?: string;
        id?: number;
        createdDate?: Date;
        modifiedDate?: Date;
        createdById?: number;
        modifiedById?: number;
    }) {
        super({
            id: userData.id,
            createdDate: userData.createdDate,
            modifiedDate: userData.modifiedDate,
            createdById: userData.createdById,
            modifiedById: userData.modifiedById,
        });

        this.userName = userData.userName;
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
        this.email = userData.email;
        this.passWord = userData.passWord;
        this.role = userData.role ?? Role.USER;
        this.isActive = userData.isActive ?? true;
        this.phoneNumber = userData.phoneNumber;
    }

    getUserName(): string {
        return this.userName;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    getEmail(): string {
        return this.email;
    }

    getRole(): Role {
        return this.role;
    }

    getIsActive(): boolean {
        return this.isActive;
    }

    getPhoneNumber(): string | undefined {
        return this.phoneNumber;
    }

    getPassWord(): string {
        return this.passWord;
    }
}
