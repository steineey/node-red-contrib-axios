const express = require("express");

class MockHttpServer {
    constructor(port) {
        this.app = express();
		this.app.use(express.json()) // for parsing application/json
        this.statusCode = 200;
        this.app.get("/", this.requestHandler);
        this.app.post("/", this.requestHandler);
        this.server = this.app.listen(port);
        console.log("MockHttpServer listens on port", port);
    }

    requestHandler = (req, res) => {
        res.statusCode = this.statusCode;
        res.json({
			method: req.method,
            query: req.query,
            headers: req.headers,
            body: req.body,
        });
    };

    setStatusCode(code) {
        this.statusCode = code;
    }

    close() {
        this.server.close();
    }
}

module.exports = {
    MockHttpServer: MockHttpServer,
};
