module.exports = function (RED) {
    var axios = require("axios");
    var http = require("http");
    var https = require("https");
    var fs = require("fs");

    function EndpointNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.config = {
            ...n,
        };
    }

    RED.nodes.registerType("axios-endpoint", EndpointNode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" },
            proxyUsername: { type: "text" },
            proxyPassword: { type: "password" },
        },
    });

    function RequestNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        // get request endpoint
        var endpoint = RED.nodes.getNode(n.endpoint);

        // http / https agent config
        var agentConfig = {
            keepAlive: n.keepAlive
        };

        // read ca certificate file
        if(endpoint.config.caCertPath) {
            try {
                agentConfig.ca = fs.readFileSync(endpoint.config.caCertPath);
            }catch(err){
                node.error(new Error('ca cert read error'));
            }
        }

        // axios request base config
        var baseConfig = {
            method: n.method,
            baseURL: endpoint.config.baseURL,
            timeout: n.timeout || 30000,
            responseType: n.responseType,
            httpsAgent: new https.Agent(agentConfig),
            httpAgent: new http.Agent(agentConfig)
        };

        // request credentials
        if (endpoint.credentials.username && endpoint.credentials.password) {
            baseConfig.auth = {
                username: endpoint.credentials.username,
                password: endpoint.credentials.password,
            };
        }

        // proxy config
        if (endpoint.proxyEnabled) {
            baseConfig.proxy = {
                protocol: n.proxyProtocol,
                host: n.proxyHost,
                port: n.proxyPort,
            };

            if (
                endpoint.credentials.proxyUsername &&
                endpoint.credentials.proxyPassword
            ) {
                baseConfig.proxy.auth = {
                    username: endpoint.credentials.proxyUsername,
                    password: endpoint.credentials.proxyPassword,
                };
            }
        }

        // count success and error
        var successCount = 0;
        var errorCount = 0;

        node.on("input", async function (msg, send, done) {
            try {
                var config = {
                    ...baseConfig,
                    url: msg.url || n.url,
                    headers: msg.headers,
                    params: msg.params,
                };

                if (["put", "post", "delete", "patch"].includes(config.method)) {
                    config.data = msg.payload;
                }

                var response = await axios.request(config);

                send({
                    ...msg,
                    payload: response.data,
                    statusCode: response.status,
                });
                successCount++;
                node.status({
                    fill: "green",
                    shape: "dot",
                    text: `success ${successCount}, error ${errorCount}`,
                });
                done();
            } catch (err) {
                errorCount++;
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: `success ${successCount}, error ${errorCount}`,
                });
                done(err);
            }
        });
    }

    RED.nodes.registerType("axios-request", RequestNode);
};
