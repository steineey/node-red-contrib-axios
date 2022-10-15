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

## Example flows

Try out this cool [basics flow](https://github.com/steineey/node-red-contrib-axios/blob/master/examples/basics.json).

Or learn how to use multipart/form-data with this [flow](https://github.com/steineey/node-red-contrib-axios/blob/master/examples/form-data.json).

![axios-flow](https://raw.githubusercontent.com/steineey/node-red-contrib-axios/master/examples/axios-flow.png)

## More documentation

All node functions are well documented inside Node-RED.