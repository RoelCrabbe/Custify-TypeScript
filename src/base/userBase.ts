import { EntityBase } from '@base/entityBase';
import { Role, Status } from '@user/enums';

export abstract class UserBase extends EntityBase {
    protected userName: string;
    protected firstName: string;
    protected lastName: string;
    protected email: string;
    protected passWord: string;
    protected role: Role;
    protected status: Status;
    protected phoneNumber?: string;

    constructor(userData: {
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
        this.role = userData.role ?? Role.Guest;
        this.status = userData.status ?? Status.Active;
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

    setRole(role: Role): void {
        this.role = role;
    }

    getRole(): Role {
        return this.role;
    }

    getStatus(): Status {
        return this.status;
    }

    getPhoneNumber(): string | undefined {
        return this.phoneNumber;
    }

    getPassWord(): string {
        return this.passWord;
    }
}
