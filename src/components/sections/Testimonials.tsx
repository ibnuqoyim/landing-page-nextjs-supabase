'use client'

import { useState, useEffect } from 'react'
import { Star, Loader2, Quote } from 'lucide-react'
import { Testimonial } from '@/types'

const avatarColors = [
  'bg-[#C8956C]',
  'bg-[#8B5A2B]',
  'bg-[#5C3317]',
  'bg-[#A0722A]',
]

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const mockTestimonials: Testimonial[] = [
        {
          id: '1',
          name: 'Sarah W.',
          content: 'Sourdough-nya luar biasa! Crust-nya renyah dan teksturnya sempurna. Sudah jadi langganan rutin setiap minggu untuk keluarga saya.',
          rating: 5
        },
        {
          id: '2',
          name: 'Budi K.',
          content: 'Kombucha Berry favorit keluarga saya. Segar, tidak terlalu manis, dan benar-benar membantu pencernaan anak-anak.',
          rating: 5
        },
        {
          id: '3',
          name: 'Maya L.',
          content: 'Kimchi-nya authentic banget! Rasanya pedas pas dan fermentasinya sempurna. Cocok banget untuk masakan rumahan.',
          rating: 5
        },
        {
          id: '4',
          name: 'Andi P.',
          content: 'Pelayanan cepat dan produk selalu fresh. Harga worth it untuk kualitas artisan seperti ini. Highly recommended!',
          rating: 4
        }
      ]
      setTestimonials(mockTestimonials)
    } catch {
      // error handled
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#8B5A2B]" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5EAD0] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F5EAD0] rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-lato text-xs tracking-[0.3em] uppercase text-[#C8956C] mb-4 block">
            Kata Mereka
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#2C1A0E] mb-4">
            Testimoni <span className="italic text-[#8B5A2B]">Pelanggan</span>
          </h2>
          <div className="ornament-divider max-w-xs mx-auto mb-6">
            <span className="text-[#C8956C] text-lg">✦</span>
          </div>
          <p className="font-lato text-base text-[#8B5A2B] max-w-xl mx-auto">
            Apa kata mereka tentang produk Kudapanmu_ya
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-[#FDF8F0] border border-[#E8D5B7] rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-20">
                <Quote className="h-10 w-10 text-[#8B5A2B] fill-[#8B5A2B]" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'text-[#C8956C] fill-[#C8956C]'
                        : 'text-[#E8D5B7]'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="font-lato text-sm text-[#5C3317] leading-relaxed mb-6 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${avatarColors[index % avatarColors.length]} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="font-playfair text-white font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-playfair font-semibold text-[#2C1A0E] text-sm">
                    {testimonial.name}
                  </p>
                  <p className="font-lato text-xs text-[#C8956C]">Pelanggan Setia</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-4 bg-[#F5EAD0] border border-[#E8D5B7] rounded-full px-8 py-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-[#C8956C] fill-[#C8956C]" />
              ))}
            </div>
            <div className="h-4 w-px bg-[#E8D5B7]" />
            <p className="font-playfair text-[#2C1A0E] font-bold text-lg">4.9</p>
            <p className="font-lato text-xs text-[#8B5A2B]">dari 500+ ulasan</p>
          </div>
        </div>
      </div>
    </section>
  )
}
