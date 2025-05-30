const getApiUrl = (): string => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    return url?.trim() || 'http://localhost:3000';
};

const getWebSocketUrl = (): string => {
    const url = process.env.NEXT_WEBSOCKET_API_URL;
    return url?.trim() || 'ws://localhost:8765';
};

const getBaseUrl = (): string => {
    const url = process.env.NEXT_BASE_API_URL;
    return url?.trim() || 'http://localhost:8080';
};

const getDatabaseUrl = (): string => {
    const value = process.env.DATABASE_URL || 'default_url';
    return value;
};

const getJwtSecret = (): string => {
    const value = process.env.JWT_SECRET || 'default_secret';
    return value;
};

const getJwtExpiresHours = (): number => {
    const value = process.env.JWT_EXPIRES_HOURS;
    const hours = value ? parseInt(value, 10) : 1;
    return isNaN(hours) ? 1 : hours;
};

export const processEnv = {
    getApiUrl,
    getWebSocketUrl,
    getBaseUrl,
    getDatabaseUrl,
    getJwtSecret,
    getJwtExpiresHours,
};
