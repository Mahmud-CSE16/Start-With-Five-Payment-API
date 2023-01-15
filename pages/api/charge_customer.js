// https://github.com/talenteddeveloper/StripeTutorial/blob/master/app.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {

      console.log(req.body)
      try {
        
        var param = {
          amount: req.body.amount,
          currency: req.body.currency,
          description: req.body.description,
          customer: req.body.customerId,
          source: req.body.source,
          metadata: req.body.metadata
        }
        
        const charge = await stripe.charges.create(param);

        if(charge){
          console.log("charge: "+charge)
          res.status(200).send(charge)
        }else{
          console.log("Something wrong")
          res.status(400).end('Something wrong');
        }
      } catch (err) {
        console.log(err.message)
        res.status(err.statusCode || 500).json(err.message);
      }
    } else {
      console.log("Stripe Post Method")
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
}
