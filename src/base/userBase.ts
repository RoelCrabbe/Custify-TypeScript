import { EntityBase } from '@base/entityBase';
import { UserRole, UserStatus } from '@user/enums';

export abstract class UserBase extends EntityBase {
    protected userName: string;
    protected firstName: string;
    protected lastName: string;
    protected email: string;
    protected passWord: string;
    protected role: UserRole;
    protected status: UserStatus;
    protected phoneNumber?: string;

    constructor(userData: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        role: UserRole;
        status: UserStatus;
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
        this.role = userData.role ?? UserRole.Guest;
        this.status = userData.status ?? UserStatus.Active;
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

    getRole(): UserRole {
        return this.role;
    }

    getStatus(): UserStatus {
        return this.status;
    }

    getPhoneNumber(): string | undefined {
        return this.phoneNumber;
    }

    getPassWord(): string {
        return this.passWord;
    }
}
