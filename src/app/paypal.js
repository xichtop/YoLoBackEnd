// 1. Set up your server to make calls to PayPal

// 1a. Import the SDK package
const paypal = require('checkoutNodeJssdk');

// 1b. Add your client ID and secret
const PAYPAL_CLIENT = 'PAYPAL_SANDBOX_CLIENT';
const PAYPAL_SECRET = 'PAYPAL_SANDBOX_SECRET';

// 1c. Set up the SDK client
const env = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT, PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(env);

// 2. Set up your server to receive a call from the client
module.exports = async function handleRequest(req, res) {

  // 3. Call PayPal to set up a transaction with payee
  const request = new sdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '220.00'
      },
      payee: {
        email_address: 'yoloshoppersonal@email.com'
      }
    }]
  });

  let order;
  try {
    order = await payPalClient.client().execute(request);
  } catch (err) {

    // 4. Handle any errors from the call
    console.error(err);
    return res.send(500);
  }

//   // 5. Return a successful response to the client with the order ID
//   res.status(200).json{
//     orderID: order.result.id
//   });
}