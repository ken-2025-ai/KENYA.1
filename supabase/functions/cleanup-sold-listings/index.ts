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

    console.log('Starting cleanup of sold listings older than 2 hours...')

    // Delete listings marked as sold more than 2 hours ago
    const { count, error } = await supabaseClient
      .from('market_listings')
      .delete({ count: 'exact' })
      .lte('sold_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
      .not('sold_at', 'is', null)

    if (error) {
      console.error('Error cleaning up sold listings:', error)
      throw error
    }

    const deletedCount = count || 0
    console.log(`Successfully cleaned up ${deletedCount} sold listings`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        deletedCount,
        message: `Cleaned up ${deletedCount} sold listings older than 2 hours`
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