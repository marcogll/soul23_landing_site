import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export type Currency = 'MXN' | 'USD'

const FALLBACK_RATE = 17.32

interface CurrencyContextType {
  currency: Currency
  setCurrency: (c: Currency) => void
  rate: number
  isLoading: boolean
  error: string | null
  fmt: (priceStr: string | number) => string
  formatPrice: (usd: number) => ReactNode
  toggle: () => void
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('MXN')
  const [rate, setRate] = useState(FALLBACK_RATE)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchRate() {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        if (!res.ok) throw new Error('Primary API failed')
        const data = await res.json()
        if (!cancelled && data?.rates?.MXN) {
          setRate(data.rates.MXN)
          setError(null)
        }
      } catch {
        try {
          const res2 = await fetch('https://open.er-api.com/v6/latest/USD')
          if (!res2.ok) throw new Error('Fallback API failed')
          const data2 = await res2.json()
          if (!cancelled && data2?.rates?.MXN) {
            setRate(data2.rates.MXN)
            setError(null)
          }
        } catch {
          if (!cancelled) {
            setError('No se pudo obtener la tasa del día. Usando estimado.')
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchRate()
    return () => { cancelled = true }
  }, [])

  const toggle = () => setCurrency(c => (c === 'MXN' ? 'USD' : 'MXN'))

  const formatPrice = useCallback((usd: number): ReactNode => {
    if (currency === 'USD') {
      return (
        <>
          ${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-[11px] font-mono uppercase tracking-wider text-gold/70 ml-1">USD</span>
        </>
      )
    }
    const mxn = usd * rate
    return (
      <>
        ${mxn.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <span className="text-[11px] font-mono uppercase tracking-wider text-gold/70 ml-1">MXN</span>
      </>
    )
  }, [currency, rate])

  const fmt = useCallback((priceStr: string | number): string => {
    const str = String(priceStr)
    if (currency === 'USD') return str
    return str.replace(/\$([\d,]+(?:\.\d{2})?)/g, (_m, amt) => {
      const n = parseFloat(amt.replace(/,/g, ''))
      if (isNaN(n)) return _m
      const mxn = n * rate
      return `$${mxn.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
    })
  }, [currency, rate])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, isLoading, error, fmt, formatPrice, toggle }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be inside CurrencyProvider')
  return ctx
}
