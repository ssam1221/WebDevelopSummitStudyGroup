class Cookie {
    constructor() {
        this.cookies = new Map();
    }

    static from(rawCookie) {
        const cookie = new Cookie();
        if (!rawCookie) return cookie;

        rawCookie.split(";").forEach(eachRawCookie => {
            const parts = eachRawCookie.split("=");
            cookie.set(parts.shift().trim(), decodeURI(parts.join("=")));
        });

        return cookie;
    }

    get(name) {
        return this.cookies.get(name);
    }

    set(name, value) {
        this.cookies.set(name, value);
    }

    parameterize() {
        const parameters = [];
        this.cookies.forEach((value, key) => parameters.push(`${key}=${value}`));
        return parameters;
    }
}

module.exports = Cookie;
