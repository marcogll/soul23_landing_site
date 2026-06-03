import catalog from '../data/pricingCatalog.json'

export type DiscountType = 'onboarding' | 'early_adopter' | 'annual' | 'referral'

export interface PricingItem {
  id: string
  name: string
  slug: string
  description: string
  includes: string[]
  listUsd: number
  onboardingUsd?: number
  earlyAdopterUsd?: number
  annualMonthlyUsd?: number
  annualTotalUsd?: number
  type: 'retainer' | 'project' | 'hardware' | 'license' | 'bundle'
  recommended?: boolean
  note?: string
  display?: string
}

export interface DashboardVariableTier {
  id: string
  label: string
  description: string
  addUsd: number
  monthlyHostingUsd?: number
}

export interface DashboardVariable {
  factor: string
  label: string
  description: string
  tiers: DashboardVariableTier[]
}

export interface DashboardConfig {
  pricingModel: string
  basePrice: number
  description: string
  display: string
  includesBase: string[]
  variables: DashboardVariable[]
  examples: Array<{
    label: string
    config: Record<string, string>
    totalUsd: number
    hostingMoUsd: number
    onboardingUsd: number
    display: string
  }>
  addOns: Array<{
    id: string
    label: string
    priceUsd: number
    display: string
  }>
  note: string
}

export function getRetainers(): PricingItem[] {
  return catalog.retainers.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    includes: item.includes,
    listUsd: item.price.list,
    onboardingUsd: item.price.onboarding,
    earlyAdopterUsd: item.price.early_adopter,
    annualMonthlyUsd: item.price.annual_monthly,
    annualTotalUsd: item.price.annual_total,
    type: item.type,
    recommended: item.recommended,
    note: item.note,
    display: item.display,
  }))
}

export function getProjects(): PricingItem[] {
  return catalog.projects.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    includes: item.includes,
    listUsd: item.price.list,
    onboardingUsd: item.price.onboarding,
    earlyAdopterUsd: item.price.early_adopter,
    type: item.type,
    note: item.note,
    display: item.display,
  }))
}

export function getTimeAttendanceHardware(): PricingItem[] {
  return catalog.time_attendance.hardware.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    includes: item.includes,
    listUsd: item.price.list,
    onboardingUsd: item.price.onboarding,
    earlyAdopterUsd: item.price.early_adopter,
    type: item.type,
    note: item.capacity_note,
    display: item.display,
  }))
}

export function getTimeAttendanceLicenses(): PricingItem[] {
  return catalog.time_attendance.licenses.billing_options.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    includes: [],
    listUsd: item.price.list,
    onboardingUsd: item.price.onboarding,
    earlyAdopterUsd: item.price.early_adopter,
    type: 'license',
    recommended: item.recommended,
    display: item.display,
  }))
}

export function getTimeAttendanceSelfHosted(): PricingItem {
  const sh = catalog.time_attendance.self_hosted
  return {
    id: sh.id,
    name: 'Self-hosted',
    slug: sh.slug,
    description: sh.description,
    includes: sh.includes,
    listUsd: sh.price.license,
    onboardingUsd: sh.price.onboarding,
    earlyAdopterUsd: sh.price.early_adopter,
    type: 'license',
    note: `Infraestructura estimada ~$${sh.infrastructure_estimate_usd_annual} USD/año`,
    display: sh.display,
  }
}

export function getTimeAttendanceBundles(): PricingItem[] {
  return catalog.time_attendance.bundles.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    includes: [],
    listUsd: item.price.bundle_total,
    onboardingUsd: item.price.onboarding_total,
    type: 'bundle',
    display: item.display,
  }))
}

export function getDashboards(): DashboardConfig {
  const d = catalog.dashboards
  return {
    pricingModel: d.pricing_model,
    basePrice: d.base_price,
    description: d.description,
    display: d.display,
    includesBase: d.includes_base,
    variables: d.variables.map((v: any) => ({
      factor: v.factor,
      label: v.label,
      description: v.description,
      tiers: v.tiers.map((t: any) => ({
        id: t.id,
        label: t.label,
        description: t.description,
        addUsd: t.add_usd,
        monthlyHostingUsd: t.monthly_hosting_usd,
      })),
    })),
    examples: d.examples.map((ex: any) => ({
      label: ex.label,
      config: ex.config,
      totalUsd: ex.total_usd,
      hostingMoUsd: ex.hosting_mo_usd,
      onboardingUsd: ex.onboarding_usd,
      display: ex.display,
    })),
    addOns: d.add_ons.map((a: any) => ({
      id: a.id,
      label: a.label,
      priceUsd: a.price_usd,
      display: a.display,
    })),
    note: d.note,
  }
}

export function getDiscounts() {
  return catalog._meta.discounts
}

export function getAllServices() {
  return [
    {
      category: 'Retainers Mensuales',
      description: 'Servicios continuos con pago mensual — operación + atracción + supervisión',
      items: getRetainers(),
    },
    {
      category: 'Proyectos Cerrados',
      description: 'Entregables de precio fijo — pago único o por hitos',
      items: getProjects(),
    },
    {
      category: 'Time & Attendance',
      description: 'Control de tiempo laboral · Cumplimiento Reforma 40 hrs · Hardware + software',
      items: [
        ...getTimeAttendanceHardware(),
        ...getTimeAttendanceLicenses(),
        getTimeAttendanceSelfHosted(),
        ...getTimeAttendanceBundles(),
      ],
    },
    {
      category: 'Dashboards',
      description: getDashboards().description,
      items: [],
    },
  ]
}
