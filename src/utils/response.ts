export const successResponse = (response: Record<string, any> = []) => {
    return {
        success: true,
        ...response,
    };
};

export const failureResponse = (
    message: string,
    code: string,
) => {
    return {
        success: false,
        error: {
            message,
            code,
        },
    };
};
