'use client'

import { Leaf, Heart, ChefHat } from 'lucide-react'
import { useMemo } from 'react'
import { useStoreInfo } from '@/context/StoreInfoContext'

export default function Tagline() {
  const { storeInfo } = useStoreInfo()

  const features = useMemo(() => {
    const iconMap = { leaf: Leaf, heart: Heart, chefhat: ChefHat } as const

    return (
      storeInfo?.tagline_features?.map((f) => ({
        icon: iconMap[f.icon] ?? Leaf,
        title: f.title,
        description: f.description,
      })) ?? [
        {
          icon: Leaf,
          title: '100% Alami',
          description:
            'Tanpa pewarna, pemanis, dan pengawet buatan, menghadirkan makanan yang halal dan thoyyib bagi keluarga.',
        },
        {
          icon: Heart,
          title: 'Dibuat dengan Cinta',
          description: 'Setiap produk diracik dengan perhatian dan dedikasi penuh — dari dapur ke meja makan Anda.',
        },
        {
          icon: ChefHat,
          title: 'Bahan Berkualitas',
          description: 'Bahan pilihan yang berkualitas, memastikan gizi terbaik untuk keluarga.',
        },
      ]
    )
  }, [storeInfo?.tagline_features])

  const heading = storeInfo?.tagline_heading ?? 'Mengapa Memilih Kudapanmu_ya?'
  const subheading =
    storeInfo?.tagline_subheading ??
    'Kami percaya pada kekuatan makanan fermentasi yang baik untuk kesehatan dan kebahagiaan keluarga. Setiap gigitan adalah perjalanan rasa yang autentik.'
  const quote =
    storeInfo?.tagline_quote ?? '"Makanan yang baik dimulai dari bahan yang baik dan dibuat dengan hati."'

  return (
    <section className="py-20 bg-[#FDF8F0] relative overflow-hidden">
      {/* Decorative background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-playfair text-[180px] font-bold text-[#E8D5B7]/20 select-none pointer-events-none whitespace-nowrap hidden lg:block">
        Artisan
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-lato text-xs tracking-[0.3em] uppercase text-[#C8956C] mb-4 block">
            Kenapa Kami
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#2C1A0E] mb-6">{heading}</h2>
          <div className="ornament-divider max-w-xs mx-auto mb-6">
            <span className="text-[#C8956C] text-lg">✦</span>
          </div>
          <p className="font-lato text-base text-[#8B5A2B] max-w-xl mx-auto leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-2xl border border-[#E8D5B7] hover:border-[#C8956C] hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 bg-[#F5EAD0] rounded-full flex items-center justify-center border-2 border-[#E8D5B7] group-hover:border-[#C8956C] group-hover:bg-[#C8956C]/10 transition-all duration-300">
                <feature.icon className="h-7 w-7 text-[#8B5A2B] group-hover:text-[#5C3317] transition-colors" />
              </div>

              {/* Number */}
              <span className="font-playfair text-4xl font-bold text-[#E8D5B7] block mb-2">
                0{index + 1}
              </span>

              <h3 className="font-playfair text-xl font-semibold text-[#2C1A0E] mb-3">
                {feature.title}
              </h3>
              <p className="font-lato text-sm text-[#8B5A2B] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="mt-16 bg-[#5C3317] rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <p className="font-playfair text-xl md:text-2xl text-[#F5EAD0] italic leading-relaxed">
            {quote}
          </p>
          <div className="mt-4 h-px w-16 bg-[#C8956C] mx-auto" />
          <p className="font-lato text-xs tracking-widest uppercase text-[#C8956C] mt-4">
            {storeInfo?.name ?? 'Kudapanmu_ya'}
          </p>
        </div>
      </div>
    </section>
  )
}
