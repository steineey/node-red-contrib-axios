const should = require("should");
const helper = require("node-red-node-test-helper");
const axiosNode = require("../src/axios.js");

const AXIOS_BASE_URL = process.env.AXIOS_BASE_URL || "https://httpbin.org";

helper.init(require.resolve("node-red"));

const defaultTestFlow = [
    {
        id: "axios-endpoint-node",
        type: "axios-endpoint",
        baseURL: AXIOS_BASE_URL,
    },
    {
        id: "axios-request-node",
        type: "axios-request",
        wires: [["helper-node"]],
        endpoint: "axios-endpoint-node",
        method: "get",
        url: "/get",
    },
    { id: "helper-node", type: "helper" },
];

describe("axios node tests", function () {
    beforeEach(function (done) {
        helper.startServer(done);
    });

    afterEach(function (done) {
        helper.unload();
        helper.stopServer(done);
    });

    it("simple get request", function (done) {
        helper.load(axiosNode, defaultTestFlow, function () {
            const helperNode = helper.getNode("helper-node");
            const requestNode = helper.getNode("axios-request-node");
            helperNode.on("input", (msg) => {
                try {
                    msg.should.have.property("statusCode", 200);
                    done();
                } catch (err) {
                    done(err);
                }
            });
            requestNode.receive({
                payload: {},
            });
        });
    });

    it("request with query param", function (done) {
        helper.load(axiosNode, defaultTestFlow, function () {
            const helperNode = helper.getNode("helper-node");
            const requestNode = helper.getNode("axios-request-node");
            helperNode.on("input", (msg) => {
                try {
                    msg.should.have.property("statusCode", 200);
                    msg.should.have
                        .property("payload")
                        .with.property("args")
                        .with.property("foo", "bar");
                    done();
                } catch (err) {
                    done(err);
                }
            });
            requestNode.receive({
                payload: {
                    foo: "bar",
                },
            });
        });
    });

    it("msg.url & msg.params & msg.headers", function (done) {
        helper.load(axiosNode, [
            {
                id: "axios-endpoint-node",
                type: "axios-endpoint",
                baseURL: AXIOS_BASE_URL,
            },
            {
                id: "axios-request-node",
                type: "axios-request",
                wires: [["helper-node"]],
                endpoint: "axios-endpoint-node",
                method: "get",
                url: "",
            },
            { id: "helper-node", type: "helper" },
        ], function () {
            const helperNode = helper.getNode("helper-node");
            const requestNode = helper.getNode("axios-request-node");
            helperNode.on("input", (msg) => {
                try {
                    msg.should.have.property("statusCode", 200);
                    msg.should.have
                        .property("payload")
                        .with.property("args")
                        .with.property("foo", "bar");
                    msg.should.have
                        .property("payload")
                        .with.property("headers")
                        .with.property("Foo", "bar");
                    done();
                } catch (err) {
                    done(err);
                }
            });
            requestNode.receive({
                url: "/get",
                params: {
                    foo: "bar",
                },
                headers: {
                    foo: "bar"
                }
            });
        });
    });

    it("custom header", function (done) {
        helper.load(axiosNode, [
            {
                id: "axios-endpoint-node",
                type: "axios-endpoint",
                baseURL: AXIOS_BASE_URL,
            },
            {
                id: "axios-request-node",
                type: "axios-request",
                wires: [["helper-node"]],
                endpoint: "axios-endpoint-node",
                method: "get",
                url: "/get",
                headers: [{
                    keyType: "str",
                    keyValue: "foo",
                    valueType: "str",
                    valueValue: "bar"
                }]
            },
            { id: "helper-node", type: "helper" },
        ], function () {
            const helperNode = helper.getNode("helper-node");
            const requestNode = helper.getNode("axios-request-node");
            helperNode.on("input", (msg) => {
                try {
                    msg.should.have.property("statusCode", 200);
                    msg.should.have
                        .property("payload")
                        .with.property("headers")
                        .with.property("Foo", "bar");
                    done();
                } catch (err) {
                    done(err);
                }
            });
            requestNode.receive({
                payload: {}
            });
        });
    });

    it("post request", function (done) {
        helper.load(
            axiosNode,
            [
                {
                    id: "axios-endpoint-node",
                    type: "axios-endpoint",
                    baseURL: AXIOS_BASE_URL,
                },
                {
                    id: "axios-request-node",
                    type: "axios-request",
                    wires: [["helper-node"]],
                    endpoint: "axios-endpoint-node",
                    method: "post",
                    url: "/post",
                },
                { id: "helper-node", type: "helper" },
            ],
            function () {
                const helperNode = helper.getNode("helper-node");
                const requestNode = helper.getNode("axios-request-node");
                helperNode.on("input", (msg) => {
                    try {
                        msg.should.have.property("statusCode", 200);
                        msg.should.have
                            .property("payload")
                            .with.property("json")
                            .with.property("foo", "bar");
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
                requestNode.receive({
                    payload: {
                        foo: "bar",
                    },
                });
            }
        );
    });

    it("basic authentication", function (done) {
        const credentials = {
            username: "my-super-user",
            password: "test-123",
        };
        helper.load(
            axiosNode,
            [
                {
                    id: "axios-endpoint-node",
                    type: "axios-endpoint",
                    baseURL: AXIOS_BASE_URL,
                },
                {
                    id: "axios-request-node",
                    type: "axios-request",
                    wires: [["helper-node"]],
                    endpoint: "axios-endpoint-node",
                    method: "get",
                    url: `/basic-auth/${credentials.username}/${credentials.password}`,
                },
                { id: "helper-node", type: "helper" },
            ],
            {
                "axios-endpoint-node": credentials,
            },
            function () {
                const helperNode = helper.getNode("helper-node");
                const requestNode = helper.getNode("axios-request-node");
                helperNode.on("input", (msg) => {
                    try {
                        msg.should.have.property("statusCode", 200);
                        msg.should.have
                            .property("payload")
                            .with.property("authenticated", true);
                        msg.should.have
                            .property("payload")
                            .with.property("user", credentials.username);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
                requestNode.receive({
                    payload: {},
                });
            }
        );
    });

    it("bearer authentication", function (done) {
        const bearerToken = "test123";
        helper.load(
            axiosNode,
            [
                {
                    id: "axios-endpoint-node",
                    type: "axios-endpoint",
                    baseURL: AXIOS_BASE_URL,
                },
                {
                    id: "axios-request-node",
                    type: "axios-request",
                    wires: [["helper-node"]],
                    endpoint: "axios-endpoint-node",
                    method: "get",
                    url: "/bearer",
                    validateStatus: false,
                },
                { id: "helper-node", type: "helper" },
            ],
            {
                "axios-endpoint-node": {
                    bearerToken: bearerToken,
                },
            },
            function () {
                const helperNode = helper.getNode("helper-node");
                const requestNode = helper.getNode("axios-request-node");
                helperNode.on("input", (msg) => {
                    try {
                        msg.should.have.property("statusCode", 200);
                        msg.should.have
                            .property("payload")
                            .with.property("authenticated", true);
                        msg.should.have
                            .property("payload")
                            .with.property("token", bearerToken);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
                requestNode.receive({
                    payload: {},
                });
            }
        );
    });
});
