import jwt from 'jsonwebtoken';
import { JwtToken, Role } from '../../types';
import { processEnv } from '../../utils/processEnv';

const generateJwtToken = ({ userId, role }: JwtToken) => {
    const options = {
        expiresIn: processEnv.getJwtExpiresHours() * 60 * 60,
        issuer: 'Custify-TypeScript',
    };
    try {
        return jwt.sign({ userId, role }, processEnv.getJwtSecret(), options);
    } catch (error) {
        console.error(error);
        throw new Error('Error generating JWT. See server log for details.');
    }
};

const authorizeRole = (role: Role) => {
    switch (role) {
        case Role.ADMIN:
            return { isAdmin: true, isHr: false, isUser: false };
        case Role.HR:
            return { isAdmin: false, isHr: true, isUser: false };
        case Role.USER:
            return { isAdmin: false, isHr: false, isUser: true };
        default:
            return { isAdmin: false, isHr: false, isUser: false };
    }
};

const isValidRole = (role: Role): boolean => {
    const validRoles: Role[] = [Role.ADMIN, Role.HR, Role.USER];
    return validRoles.includes(role);
};

export { authorizeRole, generateJwtToken, isValidRole };
