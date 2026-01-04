import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    console.log('Starting cleanup of listings...')
    console.log(`Current date: ${today}`)

    // 1. Delete listings that have expired (expiry_date has passed)
    console.log('Cleaning up expired listings...')
    const { count: expiredCount, error: expiredError } = await supabaseClient
      .from('market_listings')
      .delete({ count: 'exact' })
      .lt('expiry_date', today)
      .not('expiry_date', 'is', null)

    if (expiredError) {
      console.error('Error cleaning up expired listings:', expiredError)
      throw expiredError
    }

    const deletedExpiredCount = expiredCount || 0
    console.log(`Successfully cleaned up ${deletedExpiredCount} expired listings`)

    // 2. Delete listings marked as sold more than 2 hours ago
    console.log('Cleaning up sold listings older than 2 hours...')
    const { count: soldCount, error: soldError } = await supabaseClient
      .from('market_listings')
      .delete({ count: 'exact' })
      .lte('sold_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
      .not('sold_at', 'is', null)

    if (soldError) {
      console.error('Error cleaning up sold listings:', soldError)
      throw soldError
    }

    const deletedSoldCount = soldCount || 0
    console.log(`Successfully cleaned up ${deletedSoldCount} sold listings`)

    const totalDeleted = deletedExpiredCount + deletedSoldCount

    return new Response(
      JSON.stringify({ 
        success: true, 
        deletedExpiredCount,
        deletedSoldCount,
        totalDeleted,
        message: `Cleaned up ${deletedExpiredCount} expired listings and ${deletedSoldCount} sold listings`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Cleanup function error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500 
      }
    )
  }
})