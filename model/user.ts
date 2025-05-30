import { User as PrismaUser } from '@prisma/client';
import { Role } from '../types';
import { ModelBase } from './modelBase';

export class User extends ModelBase {
    private userName: string;
    private firstName: string;
    private lastName: string;
    private email: string;
    private passWord: string;
    private role: Role;

    constructor(user: {
        id?: number;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        role: Role;
        createdDate?: Date;
        updatedDate?: Date;
    }) {
        super({ id: user.id, createdDate: user.createdDate, updatedDate: user.updatedDate });
        this.validate(user);

        this.userName = user.userName;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.passWord = user.passWord;
        this.role = user.role;
    }

    getId(): number | undefined {
        return this.id;
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

    getEmail(): string {
        return this.email;
    }

    getPassWord(): string {
        return this.passWord;
    }

    getRole(): Role {
        return this.role;
    }

    validate(user: {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        passWord: string;
        role: Role;
    }) {
        if (!user.userName?.trim()) throw new Error('User validation: Username is required');
        if (!user.firstName?.trim()) throw new Error('User validation: First name is required');
        if (!user.lastName?.trim()) throw new Error('User validation: Last name is required');
        if (!user.email?.trim()) throw new Error('User validation: Email is required');
        if (!user.passWord?.trim()) throw new Error('User validation: Password is required');
        if (!user.role) throw new Error('User validation: Role is required');
    }

    equals(user: User): boolean {
        return (
            this.userName === user.getUserName() &&
            this.firstName === user.getFirstName() &&
            this.lastName === user.getLastName() &&
            this.email === user.getEmail() &&
            this.passWord === user.getPassWord() &&
            this.role === user.getRole()
        );
    }

    static from({
        id,
        userName,
        firstName,
        lastName,
        email,
        passWord,
        role,
        createdDate,
        updatedDate,
    }: PrismaUser): User {
        return new User({
            id,
            userName,
            firstName,
            lastName,
            email,
            passWord,
            role: role as Role,
            createdDate: createdDate || undefined,
            updatedDate: updatedDate || undefined,
        });
    }
}
