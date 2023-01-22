import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {

    console.log(req.body)
    try {
    
      //Creates a new payment intent with amount passed in from the client
      const paymentIntent = await stripe.paymentIntents.create({
          amount: parseInt(req.body.amount * 100),
          currency: req.body.currency,
          customer: req.body.customerId,
          metadata: req.body.metadata,
          description: req.body.description,
          payment_method: req.body.paymentMethodId,
          off_session: true,
          confirm: true,
      })

      res.status(200).send(paymentIntent)
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