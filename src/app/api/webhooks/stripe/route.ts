import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe, PLAN_PRICES } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type Stripe from "stripe"

function getPlanFromPriceId(priceId: string): "FREE" | "PRO" | "PREMIUM" {
  if (priceId === PLAN_PRICES.PRO_MONTHLY) return "PRO"
  if (priceId === PLAN_PRICES.PREMIUM_MONTHLY) return "PREMIUM"
  return "FREE"
}

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe-Signature header" },
        { status: 400 }
      )
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case "checkout.session.completed": {
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          { expand: ["subscription"] }
        )

        const userId = session.metadata?.userId
        const plan = session.metadata?.plan as "PRO" | "PREMIUM"

        if (!userId || !plan) break

        const subscription = session.subscription as any

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: session.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : new Date(),
            podcastsGeneratedThisMonth: 0,
          },
        })

        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as any
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId
        )) as any

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        })

        if (!user) break

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeCurrentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : new Date(),
            podcastsGeneratedThisMonth: 0,
          },
        })

        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        const priceId = subscription.items.data[0].price.id
        const plan = getPlanFromPriceId(priceId)

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (!user) break

        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : new Date(),
          },
        })

        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (!user) break

        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: "FREE",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        })

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    )
  }
}
