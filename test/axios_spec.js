const assert = require("assert");
const helper = require("node-red-node-test-helper");
const axiosNode = require("../src/axios.js");
const MockHttpServer = require("./MockHttpServer").MockHttpServer;

helper.init(require.resolve("node-red"));

describe("axios Node", function () {
    const PORT = 3000;

    const defaultTestFlow = [
        {
            id: "axios-endpoint-node",
            type: "axios-endpoint",
            baseURL: `http://localhost:${PORT}`,
        },
        {
            id: "axios-request-node",
            type: "axios-request",
            wires: [["helper-node"]],
            endpoint: "axios-endpoint-node",
            method: "get",
            url: "/",
        },
        { id: "helper-node", type: "helper" },
    ];

    const endpointCredentials = {
        username: "nodered",
        password: "nodered",
    };

    let mockHttpServer;

    before(function (done) {
        mockHttpServer = new MockHttpServer(PORT);
        done();
    });

    after(function (done) {
        mockHttpServer.close();
        done();
    });

    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload().then(function () {
            helper.stopServer(done);
        });
    });

    it("get request with query param", function (done) {
        helper.load(
            axiosNode,
            defaultTestFlow,
            { "axios-endpoint-node": endpointCredentials },
            function () {
                const helperNode = helper.getNode("helper-node");
                const requestNode = helper.getNode("axios-request-node");
                const testId = "123";
                helperNode.on("input", (msg) => {
                    try {
                        assert.equal(
                            msg.payload.query.id,
                            testId,
                            "query parameter id"
                        );
                        done();
                    } catch (err) {
                        done(err);
                    }
                });

                requestNode.receive({
                    payload: { id: testId },
                });
            }
        );
    });

    it("post request with json body", function (done) {
        const testFlow = [...defaultTestFlow];
        testFlow[1].method = "post"; // change to http post request

        helper.load(
            axiosNode,
            testFlow,
            { "axios-endpoint-node": endpointCredentials },
            function () {
                const helperNode = helper.getNode("helper-node");
                const requestNode = helper.getNode("axios-request-node");
                const testBody = { id: "2" };

                helperNode.on("input", (msg) => {
                    try {
                        assert.equal(msg.payload.method, "POST", "http method");
                        assert.equal(
                            msg.payload.body.id,
                            testBody.id,
                            "body id"
                        );
                        done();
                    } catch (err) {
                        done(err);
                    }
                });

                requestNode.receive({
                    payload: testBody,
                });
            }
        );
    });
});
