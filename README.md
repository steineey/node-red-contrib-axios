# node-red-contrib-axios

An advanced http request node for Node-RED.
Based on the [Axios](https://www.npmjs.com/package/axios) http client.

[![npm version](https://img.shields.io/npm/v/node-red-contrib-axios.svg?style=flat-square)](https://www.npmjs.org/package/node-red-contrib-axios)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=node-red-contrib-axios&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=node-red-contrib-axios)
[![npm downloads](https://img.shields.io/npm/dm/node-red-contrib-axios.svg?style=flat-square)](https://npm-stat.com/charts.html?package=node-red-contrib-axios)
[![Known Vulnerabilities](https://snyk.io/test/npm/node-red-contrib-axios/badge.svg)](https://snyk.io/test/npm/node-red-contrib-axios)

## Nodes of this package

This package provides two nodes.

### Http endpoint configuration node

Define your http endpoints base configuration (base URL, authentication, certificates, proxy) in a configuration node.
This is a huge benefit, because you can reuse this configuration in multiple request nodes.

![axios-endpoint](https://raw.githubusercontent.com/steineey/node-red-contrib-axios/master/examples/axios-endpoint.png)

### Http request node

Use this node inside your flows to make http requests.

![axios-request](https://raw.githubusercontent.com/steineey/node-red-contrib-axios/master/examples/axios-request.png)

## Example flows

Try out this cool [basics flow](https://github.com/steineey/node-red-contrib-axios/blob/master/examples/basics.json).

Or learn how to use multipart/form-data with this [flow](https://github.com/steineey/node-red-contrib-axios/blob/master/examples/form-data.json).

![axios-flow](https://raw.githubusercontent.com/steineey/node-red-contrib-axios/master/examples/axios-flow.png)

## More documentation

All node functions are well documented inside Node-RED.
