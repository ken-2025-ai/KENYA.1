import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Kyanda status code → user-friendly message
const kyandaErrors: Record<string, string> = {
  '1101': 'Invalid merchant account. Please contact support.',
  '1102': 'Authentication failed. Please contact support.',
  '1103': 'Payment service access denied. Please contact support.',
  '1106': 'Payment service unavailable. Please try again shortly.',
  '1109': 'Missing payment details. Please check the form.',
  '3101': 'Invalid phone prefix. Please check the phone number.',
  '4000': 'Insufficient funds to complete this payment.',
  '8002': 'Invalid phone format. Use 07XXXXXXXX.',
  '9001': 'Invalid phone format. Use 07XXXXXXXX.',
  '8003': 'Unsupported payment channel.',
  '8004': 'Invalid amount format.',
  '9003': 'Invalid amount format.',
  '8005': 'Amount outside the allowed limits.',
  '9004': 'Amount outside the allowed limits.',
  '8006': 'Duplicate payment request. Please wait a moment and try again.',
  '9005': 'Duplicate payment request. Please wait a moment and try again.',
  '9002': 'Unsupported payment channel.',
};

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Normalize to the 10-digit 07XXXXXXXX format Kyanda requires.
function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('254')) digits = '0' + digits.slice(3);
  if (digits.startsWith('7') && digits.length === 9) digits = '0' + digits;
  if (/^07\d{8}$/.test(digits)) return digits;
  return null;
}

interface KyandaResponse {
  status?: string;
  status_code?: string;
  statusCode?: string;
  transactiontxt?: string;
  transactionText?: string;
  transactionId?: string;
  transactionRef?: string;
  merchant_reference?: string;
  merchantReference?: string;
  receiptNumber?: string;
  mpesa_receipt?: string;
  receipt?: string;
}

function fail(resp: KyandaResponse): { code: string; message: string } | null {
  const code = resp.status_code ?? resp.statusCode ?? resp.status ?? '';
  if (code === '0000' || code === '1100') return null;
  const message = resp.transactiontxt ?? resp.transactionText ?? '';
  if (code && kyandaErrors[code]) return { code, message: kyandaErrors[code] };
  return { code: code || 'unknown', message: message || 'Payment request failed. Please try again.' };
}

function refOf(resp: KyandaResponse): string | null {
  return resp.transactionId ?? resp.transactionRef ?? resp.merchant_reference ?? resp.merchantReference ?? null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const apiKey = Deno.env.get('KYANDA_API_KEY');
  const merchantId = (Deno.env.get('KYANDA_MERCHANT_ID') ?? '').trim();
  const baseUrl = (Deno.env.get('KYANDA_BASE_URL') ?? '').trim().replace(/\/+$/, '');

  if (!apiKey || !merchantId || !baseUrl) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Kyanda payment service is not configured yet. Please add the KYANDA_API_KEY, KYANDA_MERCHANT_ID and KYANDA_BASE_URL secrets.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid request body.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // ---------- CREATE: fire M-Pesa STK push ----------
    if (body.action === 'create') {
      const phone = normalizePhone(String(body.phone ?? ''));
      const amount = Math.floor(Number(body.amount));
      const name = String(body.name ?? '').trim().slice(0, 100);
      const message = String(body.message ?? '').trim().slice(0, 500);

      if (!phone) {
        return new Response(JSON.stringify({ ok: false, error: 'Enter a valid Safaricom/Airtel number, e.g. 0712345678.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (!Number.isFinite(amount) || amount < 10 || amount > 1000000) {
        return new Response(JSON.stringify({ ok: false, error: 'Amount must be between KSh 10 and KSh 1,000,000 (whole shillings).' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const signature = await hmacSha256Hex(apiKey, `${amount}${phone}MPESA${merchantId}`);
      const kyandaResp = await fetch(`${baseUrl}/billing/v1/checkout/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apiKey },
        body: JSON.stringify({
          MerchantID: merchantId,
          phoneNumber: phone,
          amount: String(amount),
          channel: 'MPESA',
          metadata: { source: 'kenya-pulse-donation', donorName: name || 'Anonymous', note: message },
          signature,
        }),
      });
      const resp: KyandaResponse = await kyandaResp.json().catch(() => ({}));
      const failed = fail(resp);
      if (failed) {
        return new Response(JSON.stringify({ ok: false, error: failed.message }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const ref = refOf(resp);
      const { data, error } = await supabase
        .from('donations')
        .insert({
          donor_name: name || null,
          phone,
          amount,
          message: message || null,
          status: 'pending',
          kyanda_ref: ref,
        })
        .select('id')
        .single();
      if (error) throw error;

      return new Response(JSON.stringify({ ok: true, donationId: data.id, ref, message: 'M-Pesa request sent. Check your phone to enter your PIN.' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ---------- STATUS: poll Kyanda transaction-check ----------
    if (body.action === 'status') {
      const donationId = String(body.donationId ?? '');
      if (!/^[0-9a-fA-F-]{36}$/.test(donationId)) {
        return new Response(JSON.stringify({ ok: false, error: 'Invalid donation reference.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { data: donation, error: fetchErr } = await supabase
        .from('donations')
        .select('id, status, kyanda_ref, mpesa_receipt')
        .eq('id', donationId)
        .single();
      if (fetchErr || !donation) {
        return new Response(JSON.stringify({ ok: false, error: 'Donation not found.' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (donation.status === 'success' || donation.status === 'failed' || !donation.kyanda_ref) {
        return new Response(JSON.stringify({ ok: true, status: donation.status, receipt: donation.mpesa_receipt }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const signature = await hmacSha256Hex(apiKey, `${merchantId}${donation.kyanda_ref}`);
      const kyandaResp = await fetch(`${baseUrl}/billing/v1/transaction-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apiKey },
        body: JSON.stringify({ MerchantID: merchantId, transactionRef: donation.kyanda_ref, signature }),
      });
      const resp: KyandaResponse = await kyandaResp.json().catch(() => ({}));
      const code = resp.status_code ?? resp.statusCode ?? resp.status ?? '';
      const receipt = resp.receiptNumber ?? resp.mpesa_receipt ?? resp.receipt ?? null;

      let newStatus = donation.status;
      if (code === '0000') newStatus = 'success';
      else if (code === '1100') newStatus = 'pending';
      else if (code) {
        newStatus = 'failed';
        await supabase.from('donations').update({ failure_reason: resp.transactiontxt ?? resp.transactionText ?? `status ${code}` }).eq('id', donation.id);
      }

      if (newStatus !== donation.status) {
        await supabase
          .from('donations')
          .update({ status: newStatus, mpesa_receipt: receipt })
          .eq('id', donation.id);
      }
      return new Response(JSON.stringify({ ok: true, status: newStatus, receipt }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: 'Unknown action.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('donate-kyanda error:', err);
    return new Response(JSON.stringify({ ok: false, error: 'Payment service error. Please try again.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
