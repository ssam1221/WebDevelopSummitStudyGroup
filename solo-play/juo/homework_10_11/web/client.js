class MemberClient {
    constructor(url) {
        this.url = url;
    }

    request(param, callback) {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            let body = undefined;

            if (this.readyState === XMLHttpRequest.DONE) {
                try {
                    body = JSON.parse(this.responseText);
                } catch (e) {
                    console.error("Invalid response body format: " + this.responseText);
                }

                callback(this.status, body);
            }
        }

        xhr.open(param.method, this.url + (param.resource ? ("/" + param.resource) : ""));

        if (param.data) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(param.data));
        } else {
            xhr.send();
        }
    }
}

class Result {
    static SUCCESS = 0;
    static INVALID_INPUT = 1;
    static NOT_FOUND = 2;
    static ALREADY_EXISTS = 3;
}
