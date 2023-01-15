// https://github.com/talenteddeveloper/StripeTutorial/blob/master/app.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {

      console.log(req.body)
      try {
        
        var param = {};
        param.card ={
            number: req.body.number,
            exp_month: req.body.exp_month,
            exp_year:req.body.exp_year,
            cvc:req.body.cvc
        }

        const token = await stripe.tokens.create(param)

        if(token){
          console.log("customer: "+token)
          res.status(200).send(token)
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
