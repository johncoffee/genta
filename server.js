"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const pump = require('pump');
const port = 8000;
const server = express();
server.set('json spaces', 2);
server.get(`/cpr`, (req, res) => {
    res.json({
        name: 'John doe',
        address: "Herp",
        city: "København SV",
        postal: '2450',
    });
});
server.use('/', express.static('./'));
if (!module.parent) {
    server.listen(port);
}
