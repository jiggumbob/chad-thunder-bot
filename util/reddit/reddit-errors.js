class InvalidSubredditError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidSubredditError";
    }
}
