'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { StoreInfo } from '@/types'

type StoreInfoContextValue = {
  storeInfo: StoreInfo | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const StoreInfoContext = createContext<StoreInfoContextValue | undefined>(undefined)

export function StoreInfoProvider({ children }: { children: React.ReactNode }) {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: qError } = await supabase
        .from('store_info')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (qError) {
        setError(qError.message)
        setStoreInfo(null)
        return
      }

      setStoreInfo((data as StoreInfo | null) ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setStoreInfo(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(
    () => ({ storeInfo, loading, error, refresh }),
    [storeInfo, loading, error]
  )

  return <StoreInfoContext.Provider value={value}>{children}</StoreInfoContext.Provider>
}

export function useStoreInfo() {
  const ctx = useContext(StoreInfoContext)
  if (!ctx) throw new Error('useStoreInfo must be used within StoreInfoProvider')
  return ctx
}

