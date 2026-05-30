// ============================================================
// Formbricks SDK Configuration for soul:23
// ============================================================
// 
// INSTRUCTIONS TO ACTIVATE:
// 1. Create an account at https://formbricks.com
// 2. Create a new environment (Production)
// 3. Copy your Environment ID from Settings -> API Keys
// 4. Paste it below in FORMBRICKS_ENVIRONMENT_ID
// 5. Run: npm install @formbricks/js
// 6. Uncomment the import and initFormbricks() call in App.tsx
// ============================================================

// UNCOMMENT WHEN READY:
// import formbricks from '@formbricks/js'

const FORMBRICKS_ENVIRONMENT_ID = '' // Paste your Environment ID here
const FORMBRICKS_API_HOST = 'https://app.formbricks.com' // Use this when initializing the SDK
void FORMBRICKS_API_HOST

let initialized = false

export function initFormbricks() {
  if (initialized) return
  if (!FORMBRICKS_ENVIRONMENT_ID) {
    console.warn('[Formbricks] Environment ID not configured. Skipping init.')
    return
  }
  // UNCOMMENT WHEN SDK IS INSTALLED:
  // formbricks.init({
  //   environmentId: FORMBRICKS_ENVIRONMENT_ID,
  //   apiHost: FORMBRICKS_API_HOST,
  // })
  initialized = true
  console.log('[Formbricks] Would initialize with env:', FORMBRICKS_ENVIRONMENT_ID)
}

export function setFormbricksUser(userId: string) {
  if (!initialized) return
  // formbricks.setUserId(userId)
  console.log('[Formbricks] Set user:', userId)
}

export function trackFormbricksEvent(eventName: string) {
  if (!initialized) return
  // formbricks.track(eventName)
  console.log('[Formbricks] Track:', eventName)
}

// Predefined events for soul:23
export const FormbricksEvents = {
  TALIA_CONVERSATION_STARTED: 'talia_conversation_started',
  TALIA_CONVERSATION_COMPLETED: 'talia_conversation_completed',
  TALIA_LEAD_QUALIFIED: 'talia_lead_qualified',
  PAGE_VIEWED: 'page_viewed',
  SECTION_VIEWED: 'section_viewed',
  DEMO_DASHBOARD_CLICKED: 'demo_dashboard_clicked',
  DEMO_BOTS_CLICKED: 'demo_bots_clicked',
  CALENDLY_CLICKED: 'calendly_clicked',
  WHATSAPP_CLICKED: 'whatsapp_clicked',
  CONTACT_FORM_STARTED: 'contact_form_started',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  SERVICE_INTERESTED: 'service_interested',
  PACKAGE_INTERESTED: 'package_interested',
} as const

// Survey IDs - Paste your Formbricks survey IDs here
export const FormbricksSurveys = {
  NPS_TALIA: '',
  WEBSITE_SATISFACTION: '',
  NEEDS_DISCOVERY: '',
  POST_SERVICE: '',
}

export function showSurvey(surveyId: string) {
  if (!surveyId) {
    console.warn('[Formbricks] Empty survey ID.')
    return
  }
  trackFormbricksEvent('show_survey_' + surveyId)
}
