# node-red-contrib-axios

A http request node for Node-RED.
Based on the [Axios](https://www.npmjs.com/package/axios) http client.

## Why this node and not the built-in http request node by Node-RED?

This extension separates endpoint base configuration from endpoint execution.
Define your api endpoint in a configuration node with a base URL, authentication, TLS and proxy.
Use this endpoint configuration in multiple request nodes.

### Endpoint configuration node

![axios-endpoint](https://raw.githubusercontent.com/steineey/node-red-contrib-axios/master/examples/axios-endpoint.png)

### Request node

![axios-request](https://raw.githubusercontent.com/steineey/node-red-contrib-axios/master/examples/axios-request.png)

## Example flow

Try out this cool [example flow](https://github.com/steineey/node-red-contrib-axios/blob/master/examples/axios-flow.json).

![axios-flow](https://raw.githubusercontent.com/steineey/node-red-contrib-axios/master/examples/axios-flow.png)

## More documentation

All node functions are well documented inside Node-RED.