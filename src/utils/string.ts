export const generateCode = (numericOnly = false, length = 8) => {
    let result = '';
    const numericCharacters = '0123456789';
    const characters = numericOnly ? numericCharacters : `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz${numericCharacters}`;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
