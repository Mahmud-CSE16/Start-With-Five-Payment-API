// var plaid = require('plaid');
// const plaidClient = new plaid.Client(process.env.NEXT_PUBLIC_PLAID_CLIENT_ID,process.env.NEXT_PUBLIC_PLAID_SECRET,plaid.environments['sandbox'])

import { Configuration, PlaidApi, PlaidEnvironments, ProcessorStripeBankAccountTokenCreateRequest } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.NEXT_PUBLIC_PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.NEXT_PUBLIC_PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {

    console.log(req.body)
    try {    
    

      const publicToken = req.body.plaid_public_token
      const exchangePublicTokenResponse = await plaidClient.itemPublicTokenExchange({public_token: publicToken })

      console.log(exchangePublicTokenResponse.data)

      const accessToken = exchangePublicTokenResponse.data.access_token;
      //const accessToken = "access-sandbox-8f88cad0-772e-4d11-aeb8-24d65cb7c896"

      // const request = ProcessorStripeBankAccountTokenCreateRequest({
      //   access_token: accessToken,
      //   account_id: req.body.account_id,
      // });

      const accountId = req.body.account_id;
      const request = {
        access_token: accessToken,
        account_id: accountId,
      };
      const stripeTokenResponse = await plaidClient.processorStripeBankAccountTokenCreate( request);

      const bankAccountToken = stripeTokenResponse.data.stripe_bank_account_token;

      res.status(200).send({ stripe_bank_account_token: bankAccountToken })

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