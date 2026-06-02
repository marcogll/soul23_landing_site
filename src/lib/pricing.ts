import catalog from '../data/pricingCatalog.json'

export type DiscountType = 'onboarding' | 'early_adopter' | 'annual_commitment' | 'referral'

export interface PricingItem {
  id: string
  name: string
  slug: string
  description: string
  includes: string[]
  listMxn: number
  listUsd: number
  onboardingMxn?: number
  onboardingUsd?: number
  earlyAdopterMxn?: number
  earlyAdopterUsd?: number
  annualMxn?: number
  annualUsd?: number
  type: 'retainer' | 'project' | 'hardware' | 'license'
  recommended?: boolean
  note?: string
}

export function getRetainers(): PricingItem[] {
  return catalog.catalog.retainers.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    includes: item.includes,
    listMxn: item.pricing.list_mxn,
    listUsd: item.pricing.list_usd,
    onboardingMxn: item.pricing.onboarding_mxn,
    onboardingUsd: item.pricing.onboarding_usd,
    earlyAdopterMxn: item.pricing.early_adopter_mxn,
    earlyAdopterUsd: item.pricing.early_adopter_usd,
    annualMxn: item.pricing.annual_mxn,
    annualUsd: item.pricing.annual_usd,
    type: item.type,
    recommended: item.recommended,
    note: item.note,
  }))
}

export function getProjects(): PricingItem[] {
  return catalog.catalog.projects.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    includes: item.includes,
    listMxn: item.pricing.list_mxn,
    listUsd: item.pricing.list_usd,
    onboardingMxn: item.pricing.onboarding_mxn,
    onboardingUsd: item.pricing.onboarding_usd,
    earlyAdopterMxn: item.pricing.early_adopter_mxn,
    earlyAdopterUsd: item.pricing.early_adopter_usd,
    type: item.type,
    note: item.note,
  }))
}

export function getTimeAttendanceHardware(): PricingItem[] {
  return catalog.catalog.time_attendance.hardware.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    includes: item.includes,
    listMxn: item.pricing.list_mxn,
    listUsd: item.pricing.list_usd,
    onboardingMxn: item.pricing.onboarding_mxn,
    onboardingUsd: item.pricing.onboarding_usd,
    earlyAdopterMxn: item.pricing.early_adopter_mxn,
    earlyAdopterUsd: item.pricing.early_adopter_usd,
    type: item.type,
    note: item.capacity_note,
  }))
}

export function getTimeAttendanceLicenses(): PricingItem[] {
  return catalog.catalog.time_attendance.licenses.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    includes: [],
    listMxn: item.pricing.list_mxn,
    listUsd: item.pricing.list_usd,
    onboardingMxn: item.pricing.onboarding_mxn,
    onboardingUsd: item.pricing.onboarding_usd,
    earlyAdopterMxn: item.pricing.early_adopter_mxn,
    earlyAdopterUsd: item.pricing.early_adopter_usd,
    type: item.type,
    recommended: item.recommended,
  }))
}

export function getTimeAttendanceSelfHosted(): PricingItem {
  const sh = catalog.catalog.time_attendance.self_hosted
  return {
    id: sh.id,
    name: 'Self-hosted',
    slug: sh.slug,
    description: sh.description,
    includes: sh.includes,
    listMxn: sh.pricing.license_one_time_mxn,
    listUsd: sh.pricing.license_one_time_usd,
    onboardingMxn: sh.pricing.onboarding_mxn,
    onboardingUsd: sh.pricing.onboarding_usd,
    earlyAdopterMxn: sh.pricing.early_adopter_mxn,
    earlyAdopterUsd: sh.pricing.early_adopter_usd,
    type: 'license',
    note: `Infraestructura estimada ~$${sh.infrastructure_cost_estimate.total_estimated_annual_mxn} MXN/año`,
  }
}

export function getDiscounts() {
  return catalog.discounts
}

export function getAllServices() {
  return [
    {
      category: 'Retainers Mensuales',
      description: catalog.catalog.retainers.description,
      items: getRetainers(),
    },
    {
      category: 'Proyectos Cerrados',
      description: catalog.catalog.projects.description,
      items: getProjects(),
    },
    {
      category: 'Time & Attendance',
      description: catalog.catalog.time_attendance.description,
      items: [
        ...getTimeAttendanceHardware(),
        ...getTimeAttendanceLicenses(),
        getTimeAttendanceSelfHosted(),
      ],
    },
  ]
}
