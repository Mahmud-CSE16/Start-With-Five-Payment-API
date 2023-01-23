import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {

    console.log(req.body)
    try {
      // let customerId;

      // //Gets the customer who's email id matches the one sent by the client
      // const customerList = await stripe.customers.list({
      //     email: req.body.email,
      //     limit: 1
      // });
              
      // //Checks the if the customer exists, if not creates a new customer
      // if (customerList.data.length !== 0) {
      //     customerId = customerList.data[0].id;
      // }
      // else {
      //     const customer = await stripe.customers.create({
      //         email: req.body.email,
      //         name: req.body.name??"",
      //         // phone: req.body.phone,
      //         // address: "",
      //         // description: "",
      //     });
      //     customerId = customer.data.id;
      // }

      //Creates a temporary secret key linked with the customer 
      const ephemeralKey = await stripe.ephemeralKeys.create(
          { customer: req.body.customerId },
          { apiVersion: '2020-08-27' }
      );

      //Creates a new payment intent with amount passed in from the client
      const paymentIntent = await stripe.paymentIntents.create({
          amount: parseInt(req.body.amount * 100),
          currency: req.body.currency,
          customer: req.body.customerId,
          metadata: req.body.metadata,
          payment_method_types: ['card'], //us_bank_account
          description: req.body.description,
          setup_future_usage: "off_session",
          // automatic_payment_methods:{
          //   enabled: true,
          // }
      })

      res.status(200).send({
          clientSecret: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: req.body.customerId,
          success: true,
      })
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