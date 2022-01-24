export class HandledError extends Error {
    constructor(message) {
        super(message);
        this.handled = true;
    }
}

export class UnhandledError extends Error {
    constructor(message) {
        super(message);
        this.handled = false;
    }
}
