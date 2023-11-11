import bcrypt from "bcryptjs";
import {
  User,
  Token,
  Admin,
  Request,
  Filter,
  Payment,
  Consultations,
  Subscriptions,
} from "../../models/index.js";
import { formatUser, formatVendor } from "../../utils/commonFunction.js";
import * as stripeServices from "../../middlewares/stripe.js";
import { editProfile } from "../../utils/sendMail.js";
import {
  USER_TYPE,
  STATUS_CODES,
  ERROR_MESSAGES,
  FEE_STRUCTURE,
  VALID_FEE_STRUCTURE,
  OPTIONS,
  STRIPE_STATUS,
} from "../../config/appConstants.js";
import { OperationalError } from "../../utils/errors.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const stripe = new Stripe(
  "sk_test_51NuIYPKs8Y4Y2av4NWgrHFmq8R42IrEiIZ4c8jAsc23JsPqeq60bX7uKZZGb24dujnaheL7J6WsisNUtrJof0wlq00jvt0higK"
);

export const createUser = async (userData) => {
  const check = await User.findOneAndUpdate(
    {
      email: userData.email,
      isDeleted: false,
    },
    {
      $set: {
        email: userData.email,
      },
    },
    { upsert: true, new: true }
  );
  return check;
};
export const getFilter = async (type) => {
  const filter = await Filter.findOne({ isDeleted: false });
  if (type == "All") {
    const data = [
      {
        key: "projectType",
        isMultiple: false,
        value: filter.projectType,
      },
      {
        key: "AcceptVirtualConsultation",
        isMultiple: false,
        value: ["yes", "No"],
      },
      {
        key: "fullServiceClient",
        isMultiple: false,
        value: ["Yes", "No"],
      },
      {
        key: "destination",
        isMultiple: false,
        value: ["Yes", "No"],
      },
      {
        key: "styles",
        isMultiple: true,
        value: filter.style,
      },
      {
        key: "preferences",
        isMultiple: true,
        value: filter.preferences,
      },
      {
        key: "projectSize",
        isMultiple: false,
        value: filter.projectSize,
      },
    ];
    return data;
  }
  if (type == "Virtual") {
    const data = [
      {
        key: "projectSize",
        isMultiple: false,
        value: filter.projectSize,
      },
      {
        key: "dateRange",
        isMultiple: false,
        value: ["startDate", "endDate"],
      },
      {
        key: "consultationLength",
        isMultiple: false,
        value: ["25 mins", "55 mins"],
      },
      {
        key: "consultationFee",
        isMultiple: false,
        value: ["minimumPrice", "maximumPrice"],
      },
      {
        key: "goals",
        isMultiple: true,
        value: filter.goals,
      },
      {
        key: "styles",
        isMultiple: true,
        value: filter.style,
      },
      {
        key: "preferences",
        isMultiple: true,
        value: filter.preferences,
      },
    ];
    return data;
  }
  if (type == "Interior") {
    const data = [
      {
        key: "destination",
        isMultiple: false,
        value: ["Yes", "No"],
      },
      {
        key: "projectSize",
        isMultiple: false,
        value: filter.projectSize,
      },
      {
        key: "feeStructure",
        isMultiple: false,
        value: VALID_FEE_STRUCTURE,
      },
      {
        key: "totalProjectSpend",
        isMultiple: false,
        value: ["minimumPrice", "maximumPrice"],
      },
      {
        key: "styles",
        isMultiple: true,
        value: filter.style,
      },
      {
        key: "preferences",
        isMultiple: true,
        value: filter.preferences,
      },
    ];
    return data;
  }
  if (type == "signUp") {
    const data = [
      {
        key: "projectSize",
        value: filter.projectSize,
      },
      {
        key: "projectType",
        value: filter.projectType,
      },
      {
        key: "goals",
        value: filter.goals,
      },
      {
        key: "destination",
        value: ["Yes", "No"],
      },
      {
        key: "goals",
        value: filter.goals,
      },
      {
        key: "preferences",
        value: filter.preferences,
      },
      {
        key: "styles",
        value: filter.style,
      },
      {
        key: "feeStructure",
        value: VALID_FEE_STRUCTURE,
      },
      {
        key: "tradeDiscount",
        value: ["Yes", "No"],
      },
      {
        key: "needHelp",
        value: filter.needHelp,
      },
      {
        key: "fullServiceClient",
        value: ["Yes", "No"],
      },
    ];
    return data;
  }
};
export const register = async (userData) => {
  console.log(userData);
  const check = await User.findOne({
    email: userData.email,
    //isVerify: true,
    type: userData.type,
    isDeleted: false,
  });
  console.log(check);
  if (check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }
  var user = await User.findOneAndUpdate(
    {
      email: userData.email,
      type: userData.type,
    },
    {
      $set: {
        email: userData.email,
        name: userData.name,
        password: await bcrypt.hash(userData.password, 8),
        type: userData.type,
      },
    },
    { upsert: true, new: true }
  );
  const value = user.toObject();
  if (userData.type == "Vendor") {
    const customer = await stripe.customers.create({
      userId: user._id,
      email: userData.email,
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
      description: "Payment",
      metadata: {
        userId: user.id.toString(),
      },
    });
    const account = await stripe.accounts.create({
      country: "US",
      type: "express",
      userId: user._id,
      email: userData.email,
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      metadata: {
        userId: JSON.stringify(user._id),
      },
      business_type: "individual",
      business_profile: {
        url: "https://api.tald.co",
      },
    });
    console.log(account);
    await User.findOneAndUpdate(
      { _id: user._id },
      { stripe: { accountId: account.id, customerId: customer.id } },
      { new: true }
    );
    await formatUser(value);
    return value;
  } else {
    const customer = await stripe.customers.create({
      userId: user._id,
      email: userData.email,
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
      description: "Payment",
    });
    await User.findOneAndUpdate(
      { _id: user._id },
      { stripe: { customerId: customer.id } },
      { new: true }
    );
    await formatUser(value);
    return value;
  }
};
export const createStripeConnectLink = async (userId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });
  // const accId = "acct_1OA8Zt4IA6hQJdV0"
  // const account = await stripe.accounts.retrieve(accId);
  // console.log(account.metadata)
  console.log(user.stripeId);
  const accountLink = await stripe.accountLinks.create({
    account: user.stripe.accountId,
    refresh_url: `https://designer.tald.co`,
    return_url: `${process.env.API_BASE_URL}/user/auth/return?accountId=${user.stripe.accountId}`,
    type: "account_onboarding",
  });
  return accountLink;
};
export const return_url = async (accountId) => {
  console.log(accountId, "accountId");
  const account = await stripe.accounts.retrieve(accountId);
  console.log(account);
  const cardPaymentsCapability = account.capabilities.card_payments;

  if (cardPaymentsCapability && account.charges_enabled) {
    const data = await User.findOneAndUpdate(
      {
        _id: JSON.parse(account.metadata.userId),
        isDeleted: false,
      },
      {
        "stripe.status": STRIPE_STATUS.ENABLE,
      },
      {
        new: true,
      }
    );
    console.log(data);
    // Payment methods (credit card payments) are enabled for this account

    return `https://designer.tald.co/my-subscriptions`;
  } else {
    // Payment methods are not enabled
    return "error : Payment methods are not enabled for this account";
  }
};
export const profileEdit = async (data, userId, token) => {
  await editProfile(data.email, token, data.name);
  return;
};
export const payment = async (userId, amount1, designerId, consultationId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });
  console.log(user);
  // const card = await stripe.customers.createSource(user.stripe.customerId, {
  //   source: "tok_visa",
  // });
  const amount = amount1 * 100;
  // const ephemeralKey = await stripeServices.stripeService(
  //   user.stripe.customerId
  // );
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: amount,
  //   currency: "USD",
  //   customer: user.stripe.customerId,
  //   payment_method_types: ["card"],
  //   description: "test1",
  //   metadata: {
  //     userId: JSON.stringify(userId),
  //     amount: amount1,
  //     designerId: JSON.stringify(designerId),
  //     // plan: plan,
  //   },
  // });

  const session = await stripe.checkout.sessions.create({
    customer: user.stripe.customerId,
    payment_method_types: ["card"],
    metadata: {
      userId: JSON.stringify(userId),
      amount: amount1,
      designerId: JSON.stringify(designerId),
      consultationId: JSON.stringify(consultationId),
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "consultation",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],

    mode: "payment",
    success_url: `https://client.tald.co/designers/${designerId}`,
    cancel_url: `${process.env.API_BASE_URL}/cancel`,
  });
  //return { ephemeralKey, paymentIntent };
  return session;
};
export const webhook = async (body, sig, stripeSecret) => {
  console.log(
    body,
    "hbhdfihviufboifgiubhifuhuifghbuifghbifhbngjigfkjbjidfbjkbjknjknjfnjcfbhbhjbjhbhjbhbjbljkblhj"
  );
  if (body.type == "checkout.session.completed") {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      body.data.object.payment_intent
    );
    console.log(
      body.data.object.metadata,
      "jbijhiuhiughuighrikhikhiughiuhgipuh"
    );
    const user = await User.findOne({
      _id: JSON.parse(body.data.object.metadata.userId),
      isDeleted: false,
    });
    // //const plan = paymentIntent.metadata.plan;
    const amount = body.data.object.metadata.amount;
    // var date = new Date();
    // date = new Date(moment(date).utc().format());
    const createOrder = await Payment.create({
      user: JSON.parse(body.data.object.metadata.userId),
      designer: JSON.parse(body.data.object.metadata.designerId),
      amount: amount,
      consultationId: JSON.parse(body.data.object.metadata.consultationId),
      transitionId: body.data.object.payment_intent,
    });
    const consultation = await Consultations.findOneAndUpdate(
      {
        _id: JSON.parse(body.data.object.metadata.consultationId),
        isDeleted: false,
      },
      { isPayment: true },
      { new: true }
    );
    console.log(createOrder, consultation);
  }
};
export const createSubscription = async (sig, stripeSecret, body) => {
  //   let event;
  //console.log(sig, stripeSecret, body);
  if (body.type === "invoice.payment_succeeded") {
    const subscriptionId = body.data.object.subscription;
    console.log("jvhjvvkvvvv,");

    //console.log(valueof(subscriptionId),"jjhsugdfugbfdjkhbvhjxbchsbvhjsbvhjsbvhjdbvjkhdbvkhjdbvhkjbvkhjxbhjfxbvbjnfbjhfxbldfhjvbfsdkhjvb")
    const isSecondPayment =
      body.data.object.billing_reason === "subscription_cycle";
    if (body.data.object.billing_reason === "subscription_create") {
      const userId = body.data.object.customer;
      console.log(userId, "gfufguhfuierhfurhiuhugheruheiuhuihghiuhguihuihuih");
      const customer = await stripe.customers.retrieve(userId);
      const user = customer.metadata.userId;
      const userData = await User.findOne({ _id: user, isDeleted: false });
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      console.log(subscription);
      if (userData && subscription) {
        await User.findOneAndUpdate(
          { _id: user, isDeleted: false },
          {
            subscription: {
              transitionId: body.data.object.id,
              startDate: moment
                .unix(subscription.current_period_start)
                .format("YYYY-MM-DD"),
              expireDate: moment
                .unix(subscription.current_period_end)
                .format("YYYY-MM-DD"),
              amount: subscription.plan.amount / 100,
              currentPlan: `${subscription.plan.interval}  $${
                subscription.plan.amount / 100
              }`,
              billingCycle: subscription.plan.interval,
            },
            isSubscription: true,
          },
          { new: true }
        );
        await Subscriptions.create({
          designer: user,
          transitionId: body.data.object.id,
          startDate: moment
            .unix(subscription.current_period_start)
            .format("YYYY-MM-DD"),
          expireDate: moment
            .unix(subscription.current_period_end)
            .format("YYYY-MM-DD"),
          amount: subscription.plan.amount / 100,
          currentPlan: `${subscription.plan.interval}  $${
            subscription.plan.amount / 100
          }`,
          billingCycle: subscription.plan.interval,
        });
      }
    }
    if (isSecondPayment) {
      const userId = body.data.object.customer;
      console.log(userId, "gfufguhfuierhfurhiuhugheruheiuhuihghiuhguihuihuih");
      const customer = await stripe.customers.retrieve(userId);
      const user = customer.metadata.userId;
      const userData = await User.findOne({ _id: user, isDeleted: false });
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      if (userData && subscription) {
        await User.findOneAndUpdate(
          { _id: user, isDeleted: false },
          {
            subscription: {
              transitionId: body.data.object.id,
              startDate: moment
                .unix(subscription.current_period_start)
                .format("YYYY-MM-DD"),
              expireDate: moment
                .unix(subscription.current_period_end)
                .format("YYYY-MM-DD"),
              amount: subscription.plan.amount / 100,
              currentPlan: `${subscription.plan.interval}  $${
                subscription.plan.amount / 100
              }`,
              billingCycle: subscription.plan.interval,
            },
          },
          { new: true }
        );
        await Subscriptions.create({
          designer: user,
          transitionId: body.data.object.id,
          startDate: moment
            .unix(subscription.current_period_start)
            .format("YYYY-MM-DD"),
          expireDate: moment
            .unix(subscription.current_period_end)
            .format("YYYY-MM-DD"),
          amount: subscription.plan.amount / 100,
          currentPlan: `${subscription.plan.interval}  $${
            subscription.plan.amount / 100
          }`,
          billingCycle: subscription.plan.interval,
        });
      }
    }
  }
};
export const getSubscription = async () => {
  const plan = {
    id: "price_1OAZYXKs8Y4Y2av4zq7HQPHO",
    object: "price",
    active: true,
    billing_scheme: "per_unit",
    created: 1699541405,
    currency: "usd",
    custom_unit_amount: null,
    livemode: false,
    lookup_key: null,
    metadata: {},
    nickname: null,
    product: "prod_OyWb7z0QuWTk3w",
    recurring: {
      aggregate_usage: null,
      interval: "year",
      interval_count: 1,
      trial_period_days: null,
      usage_type: "licensed",
    },
    tax_behavior: "unspecified",
    tiers_mode: null,
    transform_quantity: null,
    type: "recurring",
    unit_amount: 110000,
    unit_amount_decimal: "110000",
  };
  return plan;
};
export const getDesignerSubscription = async (userId) => {
  const check = await User.findOne({ _id: userId, isDeleted: false });
  if (check?.subscription?.expireDate > currentDate) {
    await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { isSubscription: false }
    );
  }
  const designer = await User.findOne({ _id: userId, isDeleted: false });

  return {
    subscription: designer?.subscription,
    isSubscription: designer?.isSubscription,
  };
};
export const checkOutSession = async (userId, priceId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false });
  const currentDate = new Date();

  if (user?.isSubscription && user?.subscription?.expireDate > currentDate) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.SUBSCRIPTION_ALLREADY
    );
  }
  // if (user.stripe.status != STRIPE_STATUS.ENABLE) {
  //   throw new OperationalError(
  //     STATUS_CODES.ACTION_FAILED,
  //     ERROR_MESSAGES.ACCOUNT_DOES_NOT_CONNECT
  //   );
  // }
  //  const subscriptionId = 'sub_1OAXfpKs8Y4Y2av4GzAEoXtn'
  //  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  //  console.log(subscription)

  // const transfer = await stripe.transfers.create({
  //   amount: 1,
  //   currency: 'usd',
  //   destination: user.stripe.accountId,
  // });

  // const product = await stripe.products.create({
  //   name: "tald",
  //   type: "service",
  // });

  // const product = stripe.prices.list({
  //   limit:10
  // });
  // console.log(product)

  // const price = await stripe.prices.create({
  //   unit_amount: 110000, // Replace with the amount in cents (e.g., $9.99 is 999 cents)
  //   currency: "usd", // Replace with your desired currency
  //  // recurring: { interval: 'day', interval_count: 1 },
  //   recurring: { interval: "year" }, // Set the billing interval
  //   product: product.id,
  // });
  //  console.log(price)

  // console.log(price);

  //const customer = await stripe.customers.retrieve("cus_OyUuEfWs3C32c8");

  const session = await stripe.checkout.sessions.create({
    customer: user.stripe.customerId,
    client_reference_id: userId.toString(),
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId, // Replace with your actual plan ID
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: "https://designer.tald.co",
    cancel_url: "https://your-website.com/cancel",
    metadata: {
      userId: userId.toString(),
    },
  });

  return session;
};
export const getProfile = async (userId) => {
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
    // type: type,
    //isVerify: true,
  }).lean();

  if (user.type == "User") {
    formatVendor(user);
    return user;
  } else {
    formatUser(user);
    return user;
  }
};

export const profile = async (token, name, email) => {
  const check = await Token.findOne({ token: token, isDeleted: false }).lean();
  if (check) {
    const user = await User.findOne({
      _id: check.user,
      //isVerify: true,
      isDeleted: false,
    });
    if (user) {
      const data = await User.findOneAndUpdate(
        { _id: user._id, isDeleted: false },
        { email: email, name: name }
      );
      return data;
    }
  }
};
export const verifyEmails = async (token) => {
  const user = await Token.findOne({ token: token, isDeleted: false });
  const data = await User.findOneAndUpdate(
    { _id: user.user, isDeleted: false },
    { isVerify: true },
    { new: true }
  );
  return data;
};
export const createService = async (userId, data) => {
  const check = await User.findOne({
    _id: userId,
    // isVerify: true,
    isDeleted: false,
  });

  console.log(data.long, data.lat);
  if (!check) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      // isVerify: true,
      isDeleted: false,
    },
    {
      companyName: data.companyName,
      location: {
        type: "Point",
        coordinates: [data.long, data.lat],
      },
      address: data.address,
      instagramLink: data.instagramLink,
      pinterestLink: data.pinterestLink,
      about: data.about,
      projectType: data.projectType,
      virtual_Consultations: data.virtual_Consultations,
      newClientProjects: data.newClientProjects,
      destinationProject: data.destinationProject,
      feeStructure: data.feeStructure,
      tradeDiscount: data.tradeDiscount,
      minBudget: data.minBudget,
      maxBudget: data.maxBudget,
      preferences: data.preferences,
      projectSize: data.projectSize,
      styles: data.styles,
      goals: data.goals,
      needHelp: data.needHelp,
      fullServiceClients: data.fullServiceClients,
      isSignUp: true,
    },
    { new: true }
  ).lean();
  await Request.create({
    sender: userId,
  });
  await formatUser(user);
  return user;
};
export const userLogin = async (data) => {
  let user = await User.findOne({
    email: data.email,
    type: data.type,
    // isVerify: true,
    isDeleted: false,
  }).lean();

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_NOT_FOUND
    );
  }

  if (user.isBlocked) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.ACCOUNT_BLOCKED
    );
  }
  if (!(await bcrypt.compare(data.password, user.password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }
  await formatVendor(user);

  return user;
};

export const userSocialLogin = async (data) => {
  const user = await User.findOneAndUpdate(
    {
      googleId: data.socialId,
      type: data.type,
      isDeleted: false,
    },
    {
      $setOnInsert: {
        name: data.name,
      },
      $set: { googleId: data.socialId, isVerify: true, type: data.type },
    },
    { upsert: true, new: true }
  );

  return user;
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }

  return user;
};

export const userLogout = async (tokenId) => {
  const token = await Token.findOne({
    _id: tokenId,
    isDeleted: false,
  });

  if (!token) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.AUTHENTICATION_FAILED
    );
  }
  if (token.isDeleted) {
    throw new OperationalError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.LOG_OUT);
  }
  await Token.findByIdAndUpdate(
    { _id: tokenId },
    { isDeleted: true },
    { new: true }
  );
  return;
};

export const resetPassword = async (tokenData, newPassword) => {
  let query = tokenData.user;
  newPassword = await bcrypt.hash(newPassword, 8);
  if (tokenData.role === USER_TYPE.USER) {
    const userdata = await User.findOneAndUpdate(
      { _id: query },
      { $set: { password: newPassword } }
    );
    console.log(userdata);
    const tokenvalue = await Token.findByIdAndUpdate(tokenData._id, {
      isDeleted: true,
    });
    return { userdata, tokenvalue };
  }

  const adminvalue = await Admin.findOneAndUpdate(
    { _id: query },
    { $set: { password: newPassword } }
  );
  const tokenvalue = await Token.findByIdAndUpdate(tokenData._id, {
    isDeleted: true,
  });

  return { tokenvalue, adminvalue };
};
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).lean();
  console.log(user);
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.OLD_PASSWORD
    );
  }
  let updatedPassword = { password: newPassword };
  Object.assign(user, updatedPassword);
  await user.save();
  return user;
};
