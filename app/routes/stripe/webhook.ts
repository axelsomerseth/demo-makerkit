import type { Stripe } from 'stripe';
import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import getStripeInstance from '~/core/stripe/get-stripe';
import StripeWebhooks from '~/core/stripe/stripe-webhooks.enum';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';

import {
  activatePendingSubscription,
  deleteOrganizationSubscription,
  setOrganizationSubscription,
  updateSubscriptionById,
} from '~/lib/server/organizations/subscriptions';

import { OrganizationPlanStatus } from '~/lib/organizations/types/organization-subscription';
import { buildOrganizationSubscription } from '~/lib/stripe/build-organization-subscription';
import getLogger from '~/core/logger';

const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET as string;

/**
 * @description Handle the webhooks from Stripe related to checkouts
 */
export async function action(props: ActionArgs) {
  const req = props.request;
  const signature = req.headers.get(STRIPE_SIGNATURE_HEADER);

  if (!webhookSecretKey) {
    return throwInternalServerErrorException(
      `The variable STRIPE_WEBHOOK_SECRET is unset. Please add the STRIPE_WEBHOOK_SECRET environment variable`
    );
  }

  // verify signature header is not missing
  if (!signature) {
    return throwBadRequestException();
  }

  const logger = getLogger();
  const rawBody = await req.text();
  const stripe = await getStripeInstance();

  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    webhookSecretKey
  );

  logger.info(
    {
      type: event.type,
    },
    `[Stripe] Received Stripe Webhook`
  );

  try {
    switch (event.type) {
      case StripeWebhooks.Completed: {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        await onCheckoutCompleted(session, subscription);

        break;
      }

      case StripeWebhooks.AsyncPaymentSuccess: {
        const session = event.data.object as Stripe.Checkout.Session;
        const organizationId = session.client_reference_id as string;

        await activatePendingSubscription(organizationId);

        break;
      }

      case StripeWebhooks.SubscriptionDeleted: {
        const subscription = event.data.object as Stripe.Subscription;

        await deleteOrganizationSubscription(subscription.id);

        break;
      }

      case StripeWebhooks.SubscriptionUpdated: {
        const subscription = event.data.object as Stripe.Subscription;

        await onSubscriptionUpdated(subscription);

        break;
      }
    }

    return json({ success: true });
  } catch (e) {
    logger.error(
      {
        type: event.type,
      },
      `[Stripe] Webhook handling failed`
    );

    logger.debug(e);

    return throwInternalServerErrorException();
  }
}

/**
 * @description When the checkout is completed, we store the order. The
 * subscription is only activated if the order was paid successfully.
 * Otherwise, we have to wait for a further webhook
 */
async function onCheckoutCompleted(
  session: Stripe.Checkout.Session,
  subscription: Stripe.Subscription
) {
  const organizationId = session.client_reference_id as string;
  const customerId = session.customer as string;
  const status = getOrderStatus(session.payment_status);

  // build organization subscription and set on the organization document
  // we add just enough data in the DB, so we do not query
  // Stripe for every bit of data
  // if you need your DB record to contain further data
  // add it to {@link buildOrganizationSubscription}
  const subscriptionData = buildOrganizationSubscription(subscription, status);

  return setOrganizationSubscription({
    organizationId,
    customerId,
    subscription: subscriptionData,
  });
}

async function onSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionData = buildOrganizationSubscription(subscription);

  await updateSubscriptionById(subscription.id, subscriptionData);
}

function getOrderStatus(paymentStatus: string) {
  const isPaid = paymentStatus === 'paid';

  return isPaid
    ? OrganizationPlanStatus.Paid
    : OrganizationPlanStatus.AwaitingPayment;
}
