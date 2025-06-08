export const HttpMethod = {
    Get: 'Get',
    Post: 'Post',
    Put: 'Put',
    Patch: 'Patch',
    Delete: 'Delete',
} as const;

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export const isValidMethod = (method: unknown): method is HttpMethod => {
    return typeof method === 'string' && Object.values(HttpMethod).includes(method as HttpMethod);
};
