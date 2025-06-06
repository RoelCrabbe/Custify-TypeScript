import { JwtToken } from '@types';
import { getJwtExpiresHours, getJwtSecret } from '@utils/processEnv';
import jwt from 'jsonwebtoken';

export const generateJwtToken = ({ userId, role }: JwtToken) => {
    const options = {
        expiresIn: getJwtExpiresHours() * 60 * 60,
        issuer: 'Custify-TypeScript',
    };

    try {
        return jwt.sign({ userId, role }, getJwtSecret(), options);
    } catch (error) {
        console.error(error);
        throw new Error('Error generating JWT. See server log for details.');
    }
};
