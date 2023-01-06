const { Store, User, Token } = require("../models");
const { OperationalError } = require("./errors");
const {
  STATUS_CODES,
  SUCCESS_MESSAGES,
  USER_TYPE,
  ERROR_MESSAGES,
} = require("../config/appConstants");
const config = require("../config/config");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createStripeCustomer = async (data) => {
  const customer = await stripe.customers.create({
    email: data.email,
    name: data.name,
    address: {
      line1: "TC 9/4 Old MES colony",
      postal_code: "452331",
      city: "Indore",
      state: "Madhya Pradesh",
      country: "India",
    },
  });
  const user = await User.findOneAndUpdate(
    { id: data.id },
    { stripeId: customer.id },
    { upsert: false, new: true }
  );

  return;
};

const createPaymentSheet = async (customer, body) => {
  try {
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.stripeId },
      { apiVersion: "2022-11-15" }
    );
    let actualAmount = parseInt(
      (Number(body.amount) - Number(body.walletAmount)) * 100
    );
    if (actualAmount < 100) {
      actualAmount = 100;
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: actualAmount,
      currency: "USD",
      customer: customer.stripeId,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return { ephemeralKey, paymentIntent, customer: paymentIntent.customer };
  } catch (err) {
    console.log(err);
  }
}
 

module.exports = {
  createStripeCustomer,
  createPaymentSheet
};
