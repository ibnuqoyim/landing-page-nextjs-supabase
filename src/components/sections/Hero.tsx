'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useStoreInfo } from '@/context/StoreInfoContext'

export default function Hero() {
  const { storeInfo } = useStoreInfo()
  const images = useMemo(() => storeInfo?.hero_images?.filter(Boolean) ?? [], [storeInfo?.hero_images])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (!images || images.length <= 1) return
    const t = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % images.length)
    }, 4500)
    return () => window.clearInterval(t)
  }, [images])

  const heroTitle = storeInfo?.hero_title ?? 'Kudapanmu_ya'
  const heroKicker = storeInfo?.hero_kicker ?? 'Artisan & Fermented'
  const heroTagline = storeInfo?.hero_tagline ?? 'Fermented with Love, Baked with Passion'
  const heroDescription =
    storeInfo?.hero_description ??
    'Temukan kelezatan autentik sourdough, kombucha segar, kimchi homemade dan kudapan sehat lainnya yang dibuat dengan resep tradisional dan fermentasi alami — untuk keluarga yang Anda cintai.'

  const stats =
    storeInfo?.hero_stats ?? [
      { value: '100%', label: 'Bahan Alami' },
      { value: '3+', label: 'Tahun Pengalaman' },
      { value: '100+', label: 'Pelanggan Puas' },
    ]

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {(images.length ? images : ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1920&q=85']).map((src, i) => (
          <Image
            key={`${src}-${i}`}
            src={src}
            alt="Hero background"
            fill
            className={[
              'object-cover object-center transition-opacity duration-1000',
              i === activeIdx ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            priority={i === 0}
            unoptimized
          />
        ))}
        {/* Warm overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C1A0E]/85 via-[#5C3317]/60 to-[#2C1A0E]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A0E]/60 via-transparent to-transparent" />
      </div>

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8956C] via-[#E8D5B7] to-[#C8956C] z-10" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Ornament */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#C8956C]" />
            <span className="font-lato text-xs tracking-[0.3em] uppercase text-[#E8D5B7]">
              {heroKicker}
            </span>
          </div>

          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            {heroTitle}
          </h1>

          <p className="font-lato text-lg md:text-xl text-[#E8D5B7] mb-4 font-light tracking-wide italic">
            {heroTagline}
          </p>

          <p className="font-lato text-base text-[#F5EAD0]/80 mb-10 leading-relaxed max-w-lg">
            {heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#products">
              <Button
                size="lg"
                className="bg-[#C8956C] hover:bg-[#8B5A2B] text-white font-lato tracking-widest uppercase text-sm px-8 py-6 rounded-none border border-[#C8956C] hover:border-[#8B5A2B] transition-all duration-300"
              >
                Jelajahi Produk
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border border-[#E8D5B7] text-[#E8D5B7] hover:bg-[#E8D5B7]/10 font-lato tracking-widest uppercase text-sm px-8 py-6 rounded-none transition-all duration-300"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Lihat Keranjang
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex gap-8 mt-14 pt-8 border-t border-[#E8D5B7]/20">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-playfair text-2xl font-bold text-[#E8D5B7]">{stat.value}</p>
                <p className="font-lato text-xs text-[#F5EAD0]/60 tracking-wide uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="#FDF8F0"/>
        </svg>
      </div>
    </section>
  )
}
