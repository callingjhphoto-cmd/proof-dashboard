/**
 * Square API Integration Module for Proof
 * ========================================
 * Foundation connector for Square POS — the primary data source for Proof's
 * closed-loop operations intelligence platform.
 *
 * Square API Endpoints Used:
 * --------------------------
 * 1. Transactions / Orders API
 *    - POST /v2/orders/search — Search orders by date, location, state
 *    - GET  /v2/orders/{order_id} — Get individual order detail
 *    - Webhooks: order.created, order.updated, payment.completed
 *    Docs: https://developer.squareup.com/reference/square/orders-api
 *
 * 2. Customers API
 *    - POST /v2/customers/search — Search/filter customer records
 *    - GET  /v2/customers/{customer_id} — Individual customer profile
 *    - POST /v2/customers — Create customer record
 *    Docs: https://developer.squareup.com/reference/square/customers-api
 *
 * 3. Inventory API
 *    - POST /v2/inventory/changes/batch-retrieve — Get current stock counts
 *    - GET  /v2/inventory/counts — List inventory counts by item
 *    - Webhooks: inventory.count.updated
 *    Docs: https://developer.squareup.com/reference/square/inventory-api
 *
 * 4. Labor API (Team / Shifts)
 *    - POST /v2/labor/shifts/search — Search shift records
 *    - GET  /v2/labor/shifts/{shift_id} — Individual shift detail
 *    - GET  /v2/team-members/search — List team members
 *    Docs: https://developer.squareup.com/reference/square/labor-api
 *
 * 5. Catalog API (Menu / Items)
 *    - POST /v2/catalog/search — Search catalog items
 *    - GET  /v2/catalog/object/{object_id} — Get item detail with variations
 *    Docs: https://developer.squareup.com/reference/square/catalog-api
 *
 * 6. Locations API
 *    - GET /v2/locations — List all venue locations
 *    Docs: https://developer.squareup.com/reference/square/locations-api
 *
 * OAuth 2.0 Flow:
 * ---------------
 * 1. Venue owner clicks "Connect Square POS" in Proof Settings
 * 2. Redirect to Square OAuth authorization URL:
 *      https://connect.squareup.com/oauth2/authorize
 *      ?client_id={SQUARE_APP_ID}
 *      &scope=ORDERS_READ CUSTOMERS_READ CUSTOMERS_WRITE INVENTORY_READ EMPLOYEES_READ ITEMS_READ MERCHANT_PROFILE_READ
 *      &session=false
 *      &state={csrf_token}
 * 3. User authorises on Square's consent screen
 * 4. Square redirects back to Proof callback URL with authorization code
 * 5. Proof backend exchanges code for access + refresh tokens:
 *      POST https://connect.squareup.com/oauth2/token
 *      { client_id, client_secret, code, grant_type: 'authorization_code' }
 * 6. Store tokens securely (encrypted in DB, never client-side)
 * 7. Access token expires after 30 days — use refresh token to renew
 * 8. Webhook endpoint registered for real-time data push
 *
 * Environment Variables (backend):
 * --------------------------------
 * SQUARE_APP_ID        — Application ID from Square Developer Dashboard
 * SQUARE_APP_SECRET    — Application secret (NEVER expose client-side)
 * SQUARE_ENVIRONMENT   — 'sandbox' | 'production'
 * SQUARE_WEBHOOK_SIG   — Webhook signature key for verification
 *
 * Rate Limits:
 * - Standard: 20 requests/second per location
 * - Burst: 40 requests/second
 * - Webhooks: return 2xx within 10 seconds, offload to background queue
 */

// ─── Configuration ───────────────────────────────────────────────────────────

const SQUARE_CONFIG = {
  baseUrl: {
    sandbox: 'https://connect.squareupsandbox.com',
    production: 'https://connect.squareup.com',
  },
  apiVersion: '2024-01-18',
  oauthScopes: [
    'ORDERS_READ',
    'CUSTOMERS_READ',
    'CUSTOMERS_WRITE',
    'INVENTORY_READ',
    'EMPLOYEES_READ',
    'ITEMS_READ',
    'MERCHANT_PROFILE_READ',
  ],
}

// ─── Connection Status ───────────────────────────────────────────────────────

/**
 * Connection status enum used across the UI.
 * Stored in localStorage for persistence between sessions.
 */
export const CONNECTION_STATUS = {
  NOT_CONNECTED: 'not_connected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
}

/**
 * Get the current Square connection status.
 * In production, this would check the backend for valid OAuth tokens.
 * @returns {{ status: string, merchantId: string|null, locationName: string|null, connectedAt: string|null }}
 */
export function getConnectionStatus() {
  const stored = localStorage.getItem('proof_square_connection')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { status: CONNECTION_STATUS.NOT_CONNECTED, merchantId: null, locationName: null, connectedAt: null }
    }
  }
  return { status: CONNECTION_STATUS.NOT_CONNECTED, merchantId: null, locationName: null, connectedAt: null }
}

/**
 * Set the Square connection status (used after OAuth callback or disconnect).
 * @param {{ status: string, merchantId?: string, locationName?: string }} connectionInfo
 */
export function setConnectionStatus(connectionInfo) {
  const data = {
    ...connectionInfo,
    connectedAt: connectionInfo.status === CONNECTION_STATUS.CONNECTED ? new Date().toISOString() : null,
  }
  localStorage.setItem('proof_square_connection', JSON.stringify(data))
  return data
}

// ─── OAuth Flow ──────────────────────────────────────────────────────────────

/**
 * Initiate the Square OAuth flow.
 * Generates a CSRF state token, stores it, and redirects the user
 * to Square's authorization page. On return, the backend exchanges
 * the auth code for access + refresh tokens.
 *
 * In production:
 * - The redirect URL would point to your backend (e.g. /api/integrations/square/callback)
 * - The backend handles token exchange securely
 * - Tokens are stored encrypted in the database, never exposed to the client
 *
 * @param {string} clientId - Square Application ID
 * @param {string} redirectUri - OAuth callback URL (backend endpoint)
 * @returns {string} The authorization URL to redirect to
 */
export function initiateOAuth(clientId, redirectUri) {
  const state = crypto.randomUUID()
  sessionStorage.setItem('square_oauth_state', state)

  const scopes = SQUARE_CONFIG.oauthScopes.join('+')
  const authUrl = `${SQUARE_CONFIG.baseUrl.production}/oauth2/authorize` +
    `?client_id=${clientId}` +
    `&scope=${scopes}` +
    `&session=false` +
    `&state=${state}`

  return authUrl
}

/**
 * Handle the OAuth callback (would be called by the backend).
 * Exchanges the authorization code for access and refresh tokens.
 *
 * THIS RUNS SERVER-SIDE ONLY — included here for documentation.
 *
 * @param {string} code - Authorization code from Square callback
 * @param {string} clientId - Square Application ID
 * @param {string} clientSecret - Square Application Secret
 * @returns {Promise<{ access_token: string, refresh_token: string, merchant_id: string, expires_at: string }>}
 */
export async function exchangeCodeForTokens(code, clientId, clientSecret) {
  // Server-side only — this is the flow outline:
  //
  // const response = await fetch('https://connect.squareup.com/oauth2/token', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     client_id: clientId,
  //     client_secret: clientSecret,
  //     code: code,
  //     grant_type: 'authorization_code',
  //   }),
  // })
  // const data = await response.json()
  // return {
  //   access_token: data.access_token,
  //   refresh_token: data.refresh_token,
  //   merchant_id: data.merchant_id,
  //   expires_at: data.expires_at,
  // }

  throw new Error('exchangeCodeForTokens must run server-side. See Proof backend API.')
}

// ─── Data Fetchers (Placeholders) ────────────────────────────────────────────

/**
 * Fetch transactions/orders from Square for a given date range and location.
 *
 * When connected, this will:
 * 1. Call POST /v2/orders/search with date filters and location_ids
 * 2. Return itemised transaction data: items sold, quantities, payment methods, timestamps
 * 3. Data feeds into Proof's Revenue dashboard, Live Trading view, and P&L calculations
 * 4. Pagination handled via cursor — Square returns max 500 orders per request
 *
 * Used by: Dashboard, LiveTrading, PnL, MorningBriefing, MenuEngineering
 *
 * @param {string} locationId - Square Location ID
 * @param {string} startDate - ISO date string (e.g. '2026-03-01T00:00:00Z')
 * @param {string} endDate - ISO date string
 * @param {string} [cursor] - Pagination cursor for large result sets
 * @returns {Promise<{ orders: Array, cursor: string|null, totalMoney: number }>}
 */
export async function fetchTransactions(locationId, startDate, endDate, cursor = null) {
  // Placeholder — returns mock structure
  console.log(`[Square] fetchTransactions called: location=${locationId}, ${startDate} to ${endDate}`)
  return {
    orders: [],
    cursor: null,
    totalMoney: 0,
    _note: 'Connect Square POS in Settings to receive live transaction data',
  }
}

/**
 * Fetch customer records from Square CRM.
 *
 * When connected, this will:
 * 1. Call POST /v2/customers/search with optional filters (created_at, email, phone)
 * 2. Return customer profiles: name, email, phone, visit count, total spend, notes
 * 3. Auto-links customers to their transaction history for spend analysis
 * 4. Feeds Proof's CRM module: segmentation, loyalty tiers, campaign targeting
 *
 * Used by: CustomerDirectory, CustomerProfile, Campaigns, Loyalty, MorningBriefing
 *
 * @param {Object} [filters] - Optional search filters
 * @param {string} [filters.query] - Search by name/email/phone
 * @param {string} [filters.createdAfter] - ISO date string
 * @param {string} [filters.sortField] - 'CREATED_AT' | 'DEFAULT'
 * @param {string} [cursor] - Pagination cursor
 * @returns {Promise<{ customers: Array, cursor: string|null, totalCount: number }>}
 */
export async function fetchCustomers(filters = {}, cursor = null) {
  // Placeholder — returns mock structure
  console.log('[Square] fetchCustomers called:', filters)
  return {
    customers: [],
    cursor: null,
    totalCount: 0,
    _note: 'Connect Square POS in Settings to sync customer data',
  }
}

/**
 * Fetch inventory counts from Square for all or specific catalog items.
 *
 * When connected, this will:
 * 1. Call POST /v2/inventory/changes/batch-retrieve or GET /v2/inventory/counts
 * 2. Return current stock levels per item variation per location
 * 3. Compare against par levels set in Proof to generate reorder alerts
 * 4. Track usage rates to predict stock-out dates
 * 5. Feed GP% calculations by linking item costs to sales volumes
 *
 * Used by: Stock, StockCount, Suppliers, MenuEngineering, MorningBriefing
 *
 * @param {string} locationId - Square Location ID
 * @param {string[]} [catalogItemIds] - Optional: specific items to check
 * @returns {Promise<{ counts: Array<{ itemId: string, itemName: string, quantity: number, locationId: string }>, lastUpdated: string }>}
 */
export async function fetchInventory(locationId, catalogItemIds = []) {
  // Placeholder — returns mock structure
  console.log(`[Square] fetchInventory called: location=${locationId}, items=${catalogItemIds.length || 'all'}`)
  return {
    counts: [],
    lastUpdated: null,
    _note: 'Connect Square POS in Settings to sync inventory data',
  }
}

/**
 * Fetch labor/shift data from Square Team Management.
 *
 * When connected, this will:
 * 1. Call POST /v2/labor/shifts/search with date range and team member filters
 * 2. Return shift records: start/end times, breaks, hourly rate, total pay
 * 3. Calculate labour cost as % of revenue (target: <30%)
 * 4. Identify overstaffed/understaffed periods against cover forecasts
 * 5. Feed Proof's Scheduling AI for optimised rota generation
 *
 * Used by: Team, Rota, Scheduling, LabourTrends, PnL, MorningBriefing
 *
 * @param {string} locationId - Square Location ID
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @param {string[]} [teamMemberIds] - Optional: filter by specific team members
 * @returns {Promise<{ shifts: Array, totalLabourCost: number, totalHours: number }>}
 */
export async function fetchShifts(locationId, startDate, endDate, teamMemberIds = []) {
  // Placeholder — returns mock structure
  console.log(`[Square] fetchShifts called: location=${locationId}, ${startDate} to ${endDate}`)
  return {
    shifts: [],
    totalLabourCost: 0,
    totalHours: 0,
    _note: 'Connect Square POS in Settings to sync shift/labor data',
  }
}

/**
 * Fetch catalog/menu items from Square.
 *
 * When connected, this will:
 * 1. Call POST /v2/catalog/search for items, variations, and modifiers
 * 2. Return full menu with pricing, cost (if set), and category groupings
 * 3. Cross-reference with sales data for menu engineering analysis (Stars/Dogs/etc.)
 * 4. Track price changes over time for margin analysis
 *
 * Used by: MenuEngineering, Stock, TodaysSpecials
 *
 * @param {string[]} [types] - Catalog object types: 'ITEM', 'CATEGORY', 'MODIFIER'
 * @returns {Promise<{ items: Array, categories: Array }>}
 */
export async function fetchCatalog(types = ['ITEM', 'CATEGORY']) {
  // Placeholder — returns mock structure
  console.log('[Square] fetchCatalog called:', types)
  return {
    items: [],
    categories: [],
    _note: 'Connect Square POS in Settings to sync menu/catalog data',
  }
}

/**
 * Fetch all locations (venues) associated with the Square merchant account.
 *
 * When connected, this will:
 * 1. Call GET /v2/locations
 * 2. Return all venue locations: name, address, timezone, currency, status
 * 3. Used to populate Proof's multi-venue selector and VenueGrid
 *
 * @returns {Promise<{ locations: Array<{ id: string, name: string, address: Object, timezone: string, currency: string }> }>}
 */
export async function fetchLocations() {
  // Placeholder — returns mock structure
  console.log('[Square] fetchLocations called')
  return {
    locations: [],
    _note: 'Connect Square POS in Settings to sync venue locations',
  }
}

// ─── Webhook Handler Outline ─────────────────────────────────────────────────

/**
 * Webhook events Proof subscribes to (configured in Square Developer Dashboard):
 *
 * - payment.completed    → Update live trading dashboard in real-time
 * - order.created        → New order notification, update covers count
 * - order.updated        → Order modifications (voids, refunds, comps)
 * - inventory.count.updated → Stock level changes, trigger reorder alerts
 * - labor.shift.created  → New shift logged, update labour cost tracker
 * - labor.shift.updated  → Shift modifications (clockin/out, breaks)
 * - customer.created     → New customer profile, add to CRM
 * - customer.updated     → Customer data changes
 *
 * Webhook endpoint: POST /api/webhooks/square
 * - Verify signature using SQUARE_WEBHOOK_SIG
 * - Return 200 immediately
 * - Offload processing to Redis/Celery background queue
 * - Update relevant Proof dashboards via WebSocket push
 */

export default {
  // Status
  CONNECTION_STATUS,
  getConnectionStatus,
  setConnectionStatus,
  // OAuth
  initiateOAuth,
  // Data fetchers
  fetchTransactions,
  fetchCustomers,
  fetchInventory,
  fetchShifts,
  fetchCatalog,
  fetchLocations,
  // Config
  SQUARE_CONFIG,
}
