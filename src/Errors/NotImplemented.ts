export class NotImplementedError extends Error {
    constructor(message = '') {
        super(message);
        this.message = `Method must be implemented: ${message}`;
    }
};