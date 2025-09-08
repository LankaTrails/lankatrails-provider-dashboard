// Token service to access the current token from axios instance
let currentToken: string | null = null;

export const setCurrentToken = (token: string | null) => {
    currentToken = token;
};

export const getCurrentToken = (): string | null => {
    return currentToken;
};

export const clearCurrentToken = () => {
    currentToken = null;
};
