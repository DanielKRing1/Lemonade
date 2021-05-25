const CHARACTERS = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{[}];:,<.>?`;
const CHARS_LENGTH = CHARACTERS.length;

export const uuid = (length: number): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARS_LENGTH));
  }
  return result;
};
