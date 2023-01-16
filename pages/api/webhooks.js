import Stripe from 'stripe';
import { buffer } from 'micro';
import Cors from 'micro-cors';
import { db } from '../../firebase-config';
import { doc, setDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req, res) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        signature,
        webhookSecret
      );
    } catch (err) {
      // On error, log and return the error message.
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id);
    const currentDate = new Date();
    

    const logRef = doc(db, "Log",currentDate.getTime().toString());
    await setDoc(logRef, event);

    switch (event.type) {
      case 'payment_method.automatically_updated': {
        const paymentMethod = event.data.object;
        console.log(`Payment Method Automatically Updated: ${paymentMethod.status}`);
        break;
      }
      case 'payment_method.updated': {
        const paymentMethod = event.data.object;
        console.log(`Payment Method Updated: ${paymentMethod.status}`);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent succeeded: ${paymentIntent.status}`);
        break;
      }
      case 'payment_intent.created': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent created: ${paymentIntent.status}`);
        break;
      }
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent canceled: ${paymentIntent.canceled}`);
        break;
      }
      case 'payment_intent.processing': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent processing: ${paymentIntent.processing}`);
        break;
      }
      case 'payment_intent.requires_action': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent requires_action: ${paymentIntent.requires_action}`);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(
          `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
        );
        break;
      }
      case 'charge.succeeded': {
        const charge = event.data.object;
        console.log(`Charge succeeded: ${charge.id}`);
        break;
      }
      case 'charge.pending': {
        const charge = event.data.object;
        console.log(`Charge pending: ${charge.id}`);
        break;
      }
      case 'charge.failed': {
        const charge = event.data.object;
        console.log(`Charge failed: ${charge.id}`);
        break;
      }
      case 'charge.expired': {
        const charge = event.data.object;
        console.log(`Charge expired: ${charge.id}`);
        break;
      }
      default: {
        console.warn(`Unhandled event type: ${event.type}`);
        break;
      }
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default cors(webhookHandler);