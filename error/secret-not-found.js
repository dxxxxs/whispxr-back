class SecretNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "SecretNotFoundError";
    }
}

module.exports = SecretNotFoundError;