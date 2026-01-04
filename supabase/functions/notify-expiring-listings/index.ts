import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

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

    const today = new Date()
    const threeDaysFromNow = new Date(today)
    threeDaysFromNow.setDate(today.getDate() + 3)
    
    const todayStr = today.toISOString().split('T')[0]
    const threeDaysStr = threeDaysFromNow.toISOString().split('T')[0]

    console.log(`Checking for listings expiring between ${todayStr} and ${threeDaysStr}...`)

    // Get listings expiring in the next 3 days
    const { data: expiringListings, error: listingsError } = await supabaseClient
      .from('market_listings')
      .select('id, title, expiry_date, user_id, category, quantity_available, unit, price_per_unit')
      .eq('is_active', true)
      .gte('expiry_date', todayStr)
      .lte('expiry_date', threeDaysStr)

    if (listingsError) {
      console.error('Error fetching expiring listings:', listingsError)
      throw listingsError
    }

    if (!expiringListings || expiringListings.length === 0) {
      console.log('No listings expiring in the next 3 days')
      return new Response(
        JSON.stringify({ success: true, message: 'No expiring listings found', notificationsSent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    console.log(`Found ${expiringListings.length} expiring listings`)

    // Group listings by user_id
    const listingsByUser: Record<string, typeof expiringListings> = {}
    for (const listing of expiringListings) {
      if (!listingsByUser[listing.user_id]) {
        listingsByUser[listing.user_id] = []
      }
      listingsByUser[listing.user_id].push(listing)
    }

    // Get user emails from auth.users via profiles
    const userIds = Object.keys(listingsByUser)
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('user_id, full_name')
      .in('user_id', userIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      throw profilesError
    }

    // Get user emails from auth.users
    const { data: { users }, error: usersError } = await supabaseClient.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }

    const userEmailMap: Record<string, { email: string, name: string }> = {}
    for (const user of users || []) {
      if (userIds.includes(user.id)) {
        const profile = profiles?.find(p => p.user_id === user.id)
        userEmailMap[user.id] = {
          email: user.email || '',
          name: profile?.full_name || 'Farmer'
        }
      }
    }

    let notificationsSent = 0
    const errors: string[] = []

    // Send emails to each user
    for (const [userId, listings] of Object.entries(listingsByUser)) {
      const userInfo = userEmailMap[userId]
      if (!userInfo || !userInfo.email) {
        console.log(`No email found for user ${userId}, skipping`)
        continue
      }

      const listingsHtml = listings.map(listing => {
        const daysUntilExpiry = Math.ceil((new Date(listing.expiry_date!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const urgencyColor = daysUntilExpiry <= 1 ? '#dc2626' : daysUntilExpiry <= 2 ? '#f59e0b' : '#16a34a'
        
        return `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px; font-weight: 600;">${listing.title}</td>
            <td style="padding: 12px;">${listing.category}</td>
            <td style="padding: 12px;">${listing.quantity_available} ${listing.unit}</td>
            <td style="padding: 12px;">KES ${listing.price_per_unit.toLocaleString()}</td>
            <td style="padding: 12px;">
              <span style="background-color: ${urgencyColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} left
              </span>
            </td>
          </tr>
        `
      }).join('')

      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🌾 FarmConnect Kenya</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Listing Expiry Reminder</p>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hello ${userInfo.name},</p>
              
              <p style="margin-bottom: 20px;">
                We noticed that <strong>${listings.length} of your listing${listings.length > 1 ? 's are' : ' is'}</strong> 
                expiring soon. To keep your products visible to buyers, please review and update them:
              </p>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-weight: 600;">Product</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600;">Category</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600;">Quantity</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600;">Price</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600;">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  ${listingsHtml}
                </tbody>
              </table>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://lfipxpoypivbiraavtkw.lovableproject.com/dashboard" 
                   style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Review My Listings →
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                <strong>Why this matters:</strong> Expired listings are automatically removed to ensure all products on our marketplace are fresh and safe for consumers. 
                Renewing your listings helps you stay visible to potential buyers.
              </p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This is an automated message from FarmConnect Kenya.<br>
                © ${new Date().getFullYear()} FarmConnect Kenya. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `

      try {
        console.log(`Sending expiry notification to ${userInfo.email}...`)
        
        const { error: emailError } = await resend.emails.send({
          from: 'FarmConnect <onboarding@resend.dev>',
          to: [userInfo.email],
          subject: `⏰ ${listings.length} listing${listings.length > 1 ? 's' : ''} expiring soon - Action needed`,
          html: emailHtml,
        })

        if (emailError) {
          console.error(`Error sending email to ${userInfo.email}:`, emailError)
          errors.push(`Failed to send to ${userInfo.email}: ${emailError.message}`)
        } else {
          console.log(`Successfully sent notification to ${userInfo.email}`)
          notificationsSent++
        }
      } catch (emailErr) {
        console.error(`Exception sending email to ${userInfo.email}:`, emailErr)
        errors.push(`Exception for ${userInfo.email}: ${emailErr instanceof Error ? emailErr.message : 'Unknown error'}`)
      }
    }

    console.log(`Notification job complete. Sent ${notificationsSent} emails.`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationsSent,
        totalListings: expiringListings.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Sent ${notificationsSent} expiry notifications`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Notification function error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})