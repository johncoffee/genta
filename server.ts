import * as express from "express";
import {Application, Request, Response} from "express";
const pump = require('pump')

const port = 8000
const server: Application = express()
server.set('json spaces', 2)

type CprPerson  = {
  name: string,
  address: string,
  postal: string,
  city: string,
}
server.get(`/cpr`, (req:Request, res: Response) => {
  res.json(<CprPerson>{
    name: 'John doe',
    address: "Herp",
    city: "København SV",
    postal: '2450',
  })
})

server.use('/', express.static('./'))

if (!module.parent) {
  server.listen(port)
}
