const { Vendor, Banner, Store } = require("../../src/models");
const {
  DELETE_MASSAGES,
  STATUS_CODES,
  ERROR_MESSAGES,
} = require("./../config/appConstants");
const { OperationalError } = require("../utils/errors");
const moment = require("moment");

const Stripe = require("stripe");
const stripe = new Stripe(
  "sk_test_51MKSEVLBN7xbh0EQH9R2gQi1pon2Do6OQPdXKcAXfqQMWkn7OYwwBb2LRUJFElYeVpVJkkI5Dffgxlj2QjBakBp700a1efzUf0"
);

const stripeServices = async (stripeId) => {
  console.log(stripeId)
  
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: stripeId },
    { apiVersion: "2022-11-15" }
  );
  return ephemeralKey
};

const paymentIntent = async (stripeId,actualAmount) => {
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: actualAmount,
    currency: "USD",
    customer: stripeId,
    payment_method_types: ["card"],
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });
  return paymentIntent
};


module.exports={
    stripeServices,
    paymentIntent
}