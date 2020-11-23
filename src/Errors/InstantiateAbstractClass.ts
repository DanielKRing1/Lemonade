export class InstantiateAbstractClassError extends Error {
    constructor(message = '') {
        super(message);
        this.message = `Cannot instantiate this class directly: ${message}`;
    }
};