import Stripe from "stripe";
// const stripe = new Stripe(
//   "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"
// );
const stripe = new Stripe(
  "sk_test_51NuIYPKs8Y4Y2av4NWgrHFmq8R42IrEiIZ4c8jAsc23JsPqeq60bX7uKZZGb24dujnaheL7J6WsisNUtrJof0wlq00jvt0higK"
);

export const stripeService = async (stripeId) => {
  console.log(stripeId);

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: stripeId },
    { apiVersion: "2022-11-15" } 
  );
  return ephemeralKey;
};
export const paymentIntent = async (stripeId, actualAmount) => {
  console.log(Number(Number(actualAmount * (100 / 100)).toFixed(0)));
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(Number(actualAmount * (100 / 100)).toFixed(0)),
    currency: "USD",
    customer: stripeId,
    payment_method_types: ["card"],
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });
  return paymentIntent;
};