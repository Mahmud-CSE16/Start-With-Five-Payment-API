// var plaid = require('plaid');
// const plaidClient = new plaid.Client(process.env.NEXT_PUBLIC_PLAID_CLIENT_ID,process.env.NEXT_PUBLIC_PLAID_SECRET,plaid.environments['sandbox'])

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

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
      const clientUserId = req.body.customerId;
      

      const linkTokenResponse = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: clientUserId,
        },
        client_name: 'Start With Five',
        products: ['auth'],
        country_codes: ['US'],
        language: 'en',
        // webhook: "https://sample-web-hook.com",
        // redirect_uri: "https://domainname.com/oauth-page.html",
        // account_filters: {
        //     depository: {
        //         account_subtypes: ["checking"]
        //     }
        // }

      })

      console.log(linkTokenResponse);

      res.status(200).send({ link_token: linkTokenResponse.data.link_token })

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