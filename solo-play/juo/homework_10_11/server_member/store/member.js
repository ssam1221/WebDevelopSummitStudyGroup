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

module.exports = Member;
