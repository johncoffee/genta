import * as express from "express"
import {Response} from "express/lib/response"
import {NextFunction} from "express/lib/router/index";
import { StripeEvent} from "./stripe";
import ICustomer = StripeNode.customers.ICustomer;
import {transitionContract} from "../contract-state-machine";

const jsonParser = bodyParser.json()
const routes = express.Router()

routes.post("/stripe-web-hook", jsonParser, async (req: ParsedAsJson, res: Response, next: NextFunction) => {
  let body = req.body as StripeEvent
  switch (body['type']) {
    case 'customer.subscription.created':
      try {
        let stripeCustomerId = body.data.object.customer
        let contract = await req.dbConn.getRepository(entity.ServiceContract)
          .createQueryBuilder('serviceContract')
          .leftJoinAndSelect('serviceContract.customer', 'customer')
          .leftJoinAndSelect('customer.stripeCustomer', 'sc')
          .where('sc.stripe_id = :id', {id: stripeCustomerId})
          .getOne()
        if (contract) {
          contract = await transitionContract(ContractState.Active, contract, req.dbConn)
        }
      }
      catch (e) {
        console.log("Failed to handle 'customer.subscription.created'")
        res.status(500)
        return next()
      }
      break
  }

  res.status(204)
  next()
})

export default routes