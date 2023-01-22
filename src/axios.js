module.exports = function (RED) {
    const axios = require("axios");
    const http = require("http");
    const https = require("https");
    const fs = require("fs");

    function EndpointNode(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        node.config = {
            ...n,
        };
    }

    RED.nodes.registerType("axios-endpoint", EndpointNode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" },
            bearerToken: { type: "password" },
            proxyUsername: { type: "text" },
            proxyPassword: { type: "password" },
        },
    });

    function RequestNode(n) {
        RED.nodes.createNode(this, n);
        const node = this;

        // get request endpoint
        const endpoint = RED.nodes.getNode(n.endpoint);

        // http / https agent config
        const agentConfig = {
            keepAlive: n.keepAlive,
            rejectUnauthorized: endpoint.config.rejectUnauthorized,
        };

        // read ca certificate file
        if (endpoint.config.caCertPath) {
            try {
                agentConfig.ca = fs.readFileSync(endpoint.config.caCertPath);
            } catch (err) {
                node.error(new Error("ca cert read error"));
            }
        }

        // axios request base config
        const baseConfig = {
            method: n.method,
            baseURL: endpoint.config.baseURL,
            timeout: n.timeout || 30000,
            responseType: n.responseType,
            httpsAgent: new https.Agent(agentConfig),
            httpAgent: new http.Agent(agentConfig),
            headers: {},
        };

        // request authentication basic
        if (endpoint.credentials.username && endpoint.credentials.password) {
            baseConfig.auth = {
                username: endpoint.credentials.username,
                password: endpoint.credentials.password,
            };
        }

        // request authentication bearer token
        if (endpoint.credentials.bearerToken) {
            baseConfig.headers = {
                ...baseConfig.headers,
                Authorization: `Bearer ${endpoint.credentials.bearerToken}`,
            };
        }

        if (n.validateStatus === false) {
            baseConfig.validateStatus = function (status) {
                return true;
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
        let successCount = 0;
        let errorCount = 0;
        node.status({
            fill: "green",
            shape: "dot",
            text: `success ${successCount}, error ${errorCount}`,
        });

        node.on("input", async function (msg, send, done) {

            function getTypedInput(type, v) {
                switch(type) {
                    case 'str':
                        return v;
                    case 'msg':
                        return msg[v];
                    case 'flow':
                        return node.context().flow.get(v);
                    case 'global':
                        return node.context().global.get(v);
                }
            }
    
            function getProperty(arr) {
                const property = {};
                if (!Array.isArray(arr)) return property;
                arr.forEach((el)=>{
                    property[getTypedInput(el.keyType, el.keyValue)] = getTypedInput(el.valueType, el.valueValue);
                });
                return property;
            }

            try {
                const config = {
                    ...baseConfig,
                    url: n.url || msg.url,
                    params: null,
                    headers: null
                };

                if (config.method === "get") {
                    // in case of get-method use payload for params
                    config.params = msg.params || msg.payload;
                } else {
                    // in case of other mehthods
                    config.params = msg.params;
                    config.data = msg.payload;
                }

                config.params = {
                    ...config.params,
                    ...getProperty(n.params)
                };

                config.headers = {
                    ...msg.headers,
                    ...getProperty(n.headers)
                };

                axios
                    .request(config)
                    .then((response) => {
                        send({
                            ...msg,
                            headers: response.headers,
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
                    })
                    .catch((err) => {
                        if (err.response) {
                            msg.payload = err.response.data;
                            msg.headers = err.response.headers;
                            msg.statusCode = err.response.status;
                        }
                        
                        errorCount++;
                        node.status({
                            fill: "red",
                            shape: "dot",
                            text: `success ${successCount}, error ${errorCount}`,
                        });
                        
                        done(err);
                    });
            } catch (err) {
                done(err);
            }
        });
    }

    RED.nodes.registerType("axios-request", RequestNode);
};
