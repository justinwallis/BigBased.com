import { createClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  }

  const { error } = await supabaseAdmin.from("products").upsert([productData])

  if (error) {
    console.error("Error upserting product:", error)
    throw error
  }
}

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : price.product.id,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  }

  const { error } = await supabaseAdmin.from("prices").upsert([priceData])

  if (error) {
    console.error("Error upserting price:", error)
    throw error
  }
}

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  // Get customer's UUID from mapping table
  const { data: customerData, error: customerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (customerError) {
    console.error("Error finding customer:", customerError)
    throw customerError
  }

  const { data: subscription, error: subscriptionError } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("id", subscriptionId)
    .single()

  if (subscriptionError && !createAction) {
    console.error("Error finding subscription:", subscriptionError)
    throw subscriptionError
  }

  if (createAction && subscription) {
    console.log(`Subscription ${subscriptionId} already exists.`)
    return
  }

  // Here you would typically fetch the subscription from Stripe
  // and update your database accordingly
  console.log(`Managing subscription ${subscriptionId} for customer ${customerId}`)
}
