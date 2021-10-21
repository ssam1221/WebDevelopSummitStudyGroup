class Result {
    static SUCCESS = 0;
    static INVALID_INPUT = 1;
    static NOT_FOUND = 2;
    static ALREADY_EXISTS = 3;

    constructor(code, data) {
        this.code = code;
        this.data = data;
    }

    isSuccess() {
        return this.code == Result.SUCCESS;
    }
}

module.exports = Result;
