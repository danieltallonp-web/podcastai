"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { stripe, PLAN_PRICES } from "@/lib/stripe"
import { redirect } from "next/navigation"
import type { Plan } from "@prisma/client"

async function getAuthUser() {
  const { userId: clerkId } = await auth()
  if (!clerkId) throw new Error("No autenticado")

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) throw new Error("Usuario no encontrado")

  return user
}

export async function createCheckoutSession(plan: "PRO" | "PREMIUM") {
  const user = await getAuthUser()

  const priceId =
    plan === "PRO" ? PLAN_PRICES.PRO_MONTHLY : PLAN_PRICES.PREMIUM_MONTHLY

  let stripeCustomerId = user.stripeCustomerId

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    })

    stripeCustomerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId: user.id, plan },
  })

  redirect(session.url!)
}

export async function createPortalSession() {
  const user = await getAuthUser()

  if (!user.stripeCustomerId) {
    throw new Error("No tienes una suscripcion activa")
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  })

  redirect(session.url)
}
