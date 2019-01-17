const printHelloWorld = require("../dist/teronis-ts-auto-bind-es6").printHelloWorld;

describe("printHelloWorld", function () {
    it("function should print hello world", (done) => {
        printHelloWorld();
        done();
    });
});