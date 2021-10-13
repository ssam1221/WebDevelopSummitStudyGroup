// TODO: Add JSDoc comment...
// TODO: Hashing password...

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

class Member {
    constructor(params) {
        this.id = params.id;
        this.password = params.password;
        this.nickname = params.nickname;
    }

    isValid() {
        return (this.id && this.password && this.nickname);
    }
}

class MemberManager {
    constructor() {
        this.members = new Map();
    }

    add(member) {
        if (!member || !member.isValid()) return new Result(Result.INVALID_INPUT);
        if (this.members.has(member.id)) return new Result(Result.ALREADY_EXISTS);

        this.members.set(member.id, member);
        return new Result(Result.SUCCESS);
    }

    get(id) {
        if (!id) return new Result(Result.INVALID_INPUT);
        if (!this.members.has(id)) return new Result(Result.NOT_FOUND);

        return new Result(Result.SUCCESS, {...this.members.get(id)});
    }

    modify(id, member) {
        if (!id) return new Result(Result.INVALID_INPUT);
        if (!this.members.has(id)) return new Result(Result.NOT_FOUND);
        if (!member || !member.isValid()) return new Result(Result.INVALID_INPUT);

        this.members.set(id, member);
        return new Result(Result.SUCCESS);
    }

    delete(id) {
        if (!id) return new Result(Result.INVALID_INPUT);

        const result = this.members.delete(id);
        if (!result) return new Result(Result.NOT_FOUND);

        return new Result(Result.SUCCESS);
    }
}
