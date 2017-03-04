import {join} from "path";
import * as Stripe from 'stripe'
import ICustomer = StripeNode.customers.ICustomer;
import ISubscription = StripeNode.subscriptions.ISubscription;
import IList = StripeNode.IList;

const config = require(join(__dirname, "/../../config.json"))
const stripe = new Stripe(config.stripe_key)

export async function getCustomers () {
  return stripe.customers.list()
    .then((customers:IList<ICustomer>) => customers,
      (err) => {
        console.log(err)
        throw err
      }
    )
}

export async function createCustomerFromToken (token: string):Promise<ICustomer> {
  return stripe.customers.create({
    source: token
  })
  .then(customer => customer, (err) => {
    console.log(err)
    throw err
  })
}

export async function subscribeCustomerToPlan (stripeCustomerID: string, plan:string):Promise<ISubscription> {
  return stripe.subscriptions.create({
    customer: stripeCustomerID,
    plan: plan,
  })
  .then(subscription => subscription, err => {throw err})
}

// copied from documentation
export type StripeEvent = {
  "id": string,
  "object": "event",
  "api_version": null,
  "created": 1487347679,
  "data": {
    "object": {
      "customer": string,
      "id": string,
      "object": "plan",
      "amount": number,
      "created": number,
      "currency": "dkk",
      "interval": "month",
      "interval_count": number,
      "livemode": false,
      "metadata": Object,
      "name": string,
      "statement_descriptor": null,
      "trial_period_days": null
    }
  },
  "livemode": boolean,
  "pending_webhooks": number,
  "request": null,
  "type": "plan.created" | 'customer.subscription.created',
}