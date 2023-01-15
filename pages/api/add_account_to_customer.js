// https://github.com/talenteddeveloper/StripeTutorial/blob/master/app.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {

      console.log(req.body)
      try {
        
        
        const card = await stripe.customers.createSource(req.body.customerId,{source: req.body.tokenId})

        if(card){
          console.log("customer: "+card)
          res.status(200).send(card)
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
