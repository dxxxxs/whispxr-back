class ExpirationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ExpirationError";
    }
}

module.exports = ExpirationError;