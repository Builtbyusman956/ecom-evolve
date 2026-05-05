const express    = require('express')
const router     = express.Router()
const axios      = require('axios')
const { Resend } = require('resend')

const resend     = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null
const FLW_SECRET = process.env.FLW_SECRET_KEY
const FLW_BASE   = 'https://api.flutterwave.com/v3'

/* ── EcomEvolve Shopify Packages only ────────────────────────── */
const PACKAGES = {
  launchpad: {
    name:     'Launchpad',
    amount:   495,
    currency: 'USD',
  },
  accelerator: {
    name:     'Accelerator',
    amount:   789,
    currency: 'USD',
  },
  dominance: {
    name:     'Dominance',
    amount:   1200,
    currency: 'USD',
  },
}

/* ── Brand constants ─────────────────────────────────────────── */
const BRAND = {
  name:      'EcomEvolve',
  instagram: 'https://www.instagram.com/ecom_evolve?igsh=a2pqenJpMHY1Z2Vx&utm_source=qr',
  whatsapp:  'https://wa.me/23408154084093',
  linkedin:  'https://www.linkedin.com/in/ecom-evolve-10aa3a377',
  tiktok:    'https://www.tiktok.com/@akandeayomide05',
  accentColor: '#6C47FF',
}

/* ══════════════════════════════════════════════════════════════
   POST /api/payments/initiate
══════════════════════════════════════════════════════════════ */
router.post('/initiate', async (req, res) => {
  try {
    const { packageId, customerName, customerEmail, businessName } = req.body

    const pkg = PACKAGES[packageId]
    if (!pkg)
      return res.status(400).json({ error: 'Invalid package selected' })
    if (!customerName || !customerEmail)
      return res.status(400).json({ error: 'Name and email are required' })

    const txRef = `ECOMEVOLVE-${packageId.toUpperCase()}-${Date.now()}`

    const payload = {
      tx_ref:       txRef,
      amount:       pkg.amount,
      currency:     pkg.currency,
      redirect_url: `${process.env.FRONTEND_URL}/thank-you?type=payment`,
      customer: {
        email: customerEmail,
        name:  customerName,
      },
      customizations: {
        title:       BRAND.name,
        description: `${pkg.name} Package`,
        logo:        `${process.env.FRONTEND_URL}/favicon.ico`,
      },
      meta: {
        packageId,
        packageName:  pkg.name,
        businessName: businessName || '',
      },
    }

    const response = await axios.post(`${FLW_BASE}/payments`, payload, {
      headers: {
        Authorization:  `Bearer ${FLW_SECRET}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.data.status === 'success') {
      res.json({ paymentLink: response.data.data.link, txRef })
    } else {
      throw new Error('Failed to create payment link')
    }

  } catch (err) {
    console.error('Initiate error:', err.response?.data || err.message)
    res.status(500).json({ error: err.response?.data?.message || err.message })
  }
})

/* ══════════════════════════════════════════════════════════════
   POST /api/payments/webhook
══════════════════════════════════════════════════════════════ */
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['verif-hash']
    if (!signature || signature !== process.env.FLW_WEBHOOK_SECRET)
      return res.status(401).json({ error: 'Invalid signature' })

    const event = req.body

    if (
      event.event === 'charge.completed' &&
      event.data.status === 'successful'
    ) {
      const { customer, meta, amount, currency } = event.data
      const { packageName, businessName } = meta || {}

      console.log(`Payment confirmed: ${packageName} from ${customer.email}`)

      await sendClientEmail({
        customerName:  customer.name,
        customerEmail: customer.email,
        packageName:   packageName || 'Package',
        businessName:  businessName || '',
        amount,
        currency,
      })

      await sendOwnerEmail({
        customerName:  customer.name,
        customerEmail: customer.email,
        packageName:   packageName || 'Package',
        businessName:  businessName || '',
        amount,
        currency,
      })
    }

    res.json({ status: 'success' })
  } catch (err) {
    console.error('Webhook error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

/* ══════════════════════════════════════════════════════════════
   GET /api/payments/verify
══════════════════════════════════════════════════════════════ */
router.get('/verify', async (req, res) => {
  try {
    const { transaction_id } = req.query
    if (!transaction_id)
      return res.status(400).json({ error: 'Transaction ID required' })

    const response = await axios.get(
      `${FLW_BASE}/transactions/${transaction_id}/verify`,
      { headers: { Authorization: `Bearer ${FLW_SECRET}` } }
    )

    const data = response.data.data

    if (data.status === 'successful') {
      res.json({
        success:     true,
        amount:      data.amount,
        currency:    data.currency,
        customer:    data.customer,
        packageName: data.meta?.packageName || '',
        txRef:       data.tx_ref,
      })
    } else {
      res.json({ success: false, status: data.status })
    }
  } catch (err) {
    console.error('Verify error:', err.response?.data || err.message)
    res.status(500).json({ error: err.message })
  }
})

/* ══════════════════════════════════════════════════════════════
   POST /api/payments/booking   (free call / contact form)
══════════════════════════════════════════════════════════════ */
router.post('/booking', async (req, res) => {
  try {
    const {
      name, email, phone, business,
      service, budget, preferredTime, message,
    } = req.body

    if (!name || !email || !service)
      return res.status(400).json({ error: 'Name, email and service are required' })

    /* Notify owner */
    await resend.emails.send({
      from:    process.env.EMAIL_FROM,
      to:      process.env.EMAIL_FROM,
      subject: `New Call Booking from ${name}`,
      html: `
        <h2 style="font-family:sans-serif">New Discovery Call Request</h2>
        <table style="font-family:sans-serif;border-collapse:collapse">
          <tr><td style="padding:6px 16px 6px 0"><b>Name</b></td><td>${name}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Email</b></td><td>${email}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Phone</b></td><td>${phone || 'Not provided'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Business</b></td><td>${business || 'Not provided'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Service</b></td><td>${service}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Budget</b></td><td>${budget || 'Not specified'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Preferred Time</b></td><td>${preferredTime || 'Flexible'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Message</b></td><td>${message || 'No message'}</td></tr>
        </table>
      `,
    })

    /* Confirm to client */
    await resend.emails.send({
      from:    process.env.EMAIL_FROM,
      to:      email,
      subject: `We received your request, ${name.split(' ')[0]}!`,
      html: bookingConfirmHtml(name.split(' ')[0], service),
    })

    res.json({ success: true })
  } catch (err) {
    console.error('Booking error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

/* ══════════════════════════════════════════════════════════════
   EMAIL HELPERS
══════════════════════════════════════════════════════════════ */
async function sendClientEmail({
  customerName, customerEmail, packageName, businessName, amount, currency,
}) {
  try {
    await resend.emails.send({
      from:    process.env.EMAIL_FROM,
      to:      customerEmail,
      subject: `Payment Confirmed — ${packageName}`,
      html: paymentConfirmHtml({
        firstName: customerName.split(' ')[0],
        packageName,
        businessName,
        amount,
        currency,
      }),
    })
  } catch (err) {
    console.error('Client email error:', err.message)
  }
}

async function sendOwnerEmail({
  customerName, customerEmail, packageName, businessName, amount, currency,
}) {
  try {
    await resend.emails.send({
      from:    process.env.EMAIL_FROM,
      to:      process.env.EMAIL_FROM,
      subject: `New Payment — ${packageName} (${currency} ${amount})`,
      html: `
        <h2 style="font-family:sans-serif">New Order Received</h2>
        <table style="font-family:sans-serif;border-collapse:collapse">
          <tr><td style="padding:6px 16px 6px 0"><b>Package</b></td><td>${packageName}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Amount</b></td><td>${currency} ${amount}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Customer</b></td><td>${customerName}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Email</b></td><td>${customerEmail}</td></tr>
          <tr><td style="padding:6px 16px 6px 0"><b>Business</b></td><td>${businessName || 'Not provided'}</td></tr>
        </table>
        <p style="font-family:sans-serif">
          <a href="https://dashboard.flutterwave.com" style="color:${BRAND.accentColor}">View in Flutterwave Dashboard</a>
        </p>
      `,
    })
  } catch (err) {
    console.error('Owner email error:', err.message)
  }
}

/* ── Email templates ─────────────────────────────────────────── */
function paymentConfirmHtml({ firstName, packageName, businessName, amount, currency }) {
  return `
    <div style="font-family:sans-serif;max-width:540px;margin:0 auto;background:#F7F8FF;padding:32px;border-radius:16px">

      <div style="background:linear-gradient(135deg,#4C2ECC,#6C47FF,#2563EB);padding:36px 32px;border-radius:12px;text-align:center;margin-bottom:28px">
        <h1 style="color:#fff;margin:0;font-size:24px">Payment Confirmed!</h1>
        <p style="color:rgba(255,255,255,0.80);margin:10px 0 0;font-size:15px">${BRAND.name}</p>
      </div>

      <p style="color:#1a1a2e;font-size:15px">Hi ${firstName},</p>

      <p style="color:#444;font-size:14px;line-height:1.7">
        Your payment of <strong>${currency} ${amount}</strong> for the
        <strong>${packageName}</strong> package has been received and confirmed.
        ${businessName ? `We will be building for <strong>${businessName}</strong>.` : ''}
      </p>

      <div style="background:#fff;border-left:4px solid #6C47FF;padding:18px 20px;margin:24px 0;border-radius:8px">
        <p style="margin:0;font-weight:700;color:#1a1a2e;font-size:14px">What happens next?</p>
        <p style="margin:10px 0 0;color:#555;font-size:13px;line-height:1.65">
          Our team will reach out within <strong>24 hours</strong> to kick off your project.
          Keep an eye on your inbox and WhatsApp.
        </p>
      </div>

      <p style="color:#444;font-size:13px;line-height:1.7">
        You can also reach us directly on
        <a href="${BRAND.whatsapp}" style="color:#6C47FF">WhatsApp</a> or follow our journey on
        <a href="${BRAND.instagram}" style="color:#6C47FF">Instagram</a>.
      </p>

      <p style="color:#444;font-size:14px;margin-top:28px">
        Talk soon,<br/>
        <strong>The ${BRAND.name} Team</strong>
      </p>

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7f0;display:flex;gap:16px">
        <a href="${BRAND.instagram}" style="color:#6C47FF;font-size:12px">Instagram</a>
        <a href="${BRAND.tiktok}"    style="color:#6C47FF;font-size:12px">TikTok</a>
        <a href="${BRAND.linkedin}"  style="color:#6C47FF;font-size:12px">LinkedIn</a>
        <a href="${BRAND.whatsapp}"  style="color:#6C47FF;font-size:12px">WhatsApp</a>
      </div>
    </div>
  `
}

function bookingConfirmHtml(firstName, service) {
  return `
    <div style="font-family:sans-serif;max-width:540px;margin:0 auto;background:#F7F8FF;padding:32px;border-radius:16px">

      <div style="background:linear-gradient(135deg,#4C2ECC,#6C47FF,#2563EB);padding:36px 32px;border-radius:12px;text-align:center;margin-bottom:28px">
        <h1 style="color:#fff;margin:0;font-size:24px">Request Received!</h1>
        <p style="color:rgba(255,255,255,0.80);margin:10px 0 0;font-size:15px">${BRAND.name}</p>
      </div>

      <p style="color:#1a1a2e;font-size:15px">Hi ${firstName},</p>

      <p style="color:#444;font-size:14px;line-height:1.7">
        We have received your request for a <strong>${service}</strong> discovery call.
        Our team will be in touch within <strong>24 hours</strong> to confirm your slot.
      </p>

      <div style="background:#fff;border-left:4px solid #6C47FF;padding:18px 20px;margin:24px 0;border-radius:8px">
        <p style="margin:0;font-weight:700;color:#1a1a2e;font-size:14px">While you wait</p>
        <p style="margin:10px 0 0;color:#555;font-size:13px;line-height:1.65">
          Check out our work on <a href="${BRAND.instagram}" style="color:#6C47FF">Instagram</a>
          or send us a message directly on
          <a href="${BRAND.whatsapp}" style="color:#6C47FF">WhatsApp</a> if you have questions.
        </p>
      </div>

      <p style="color:#444;font-size:14px;margin-top:28px">
        Talk soon,<br/>
        <strong>The ${BRAND.name} Team</strong>
      </p>

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7f0">
        <a href="${BRAND.instagram}" style="color:#6C47FF;font-size:12px;margin-right:16px">Instagram</a>
        <a href="${BRAND.tiktok}"    style="color:#6C47FF;font-size:12px;margin-right:16px">TikTok</a>
        <a href="${BRAND.linkedin}"  style="color:#6C47FF;font-size:12px;margin-right:16px">LinkedIn</a>
        <a href="${BRAND.whatsapp}"  style="color:#6C47FF;font-size:12px">WhatsApp</a>
      </div>
    </div>
  `
}

module.exports = router