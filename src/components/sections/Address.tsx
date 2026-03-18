'use client'

import { MapPin, Clock, Phone } from 'lucide-react'
import { useStoreInfo } from '@/context/StoreInfoContext'

export default function Address() {
  const { storeInfo } = useStoreInfo()

  const fallback = {
    name: 'Kudapanmu_ya',
    address: 'Jl. Sumber Jati No. 98, Jatiendah, Kab. Bandung, Jawa Barat 40111',
    phone: '+62 821-1564-5571',
    opening_hours: 'Senin - Sabtu: 08.00 - 18.00 WIB',
    maps_url:
      'https://www.google.com/maps/place/Jl.+Sumber+Jati+No.98,+Jatiendah,+Kec.+Cilengkrang,+Kabupaten+Bandung,+Jawa+Barat+40616/@-6.896196,107.6952811,17z/data=!3m1!4b1!4m5!3m4!1s0x2e68dd12f9be2a75:0xb74a541fb6697dc9!8m2!3d-6.896196!4d107.6952811?entry=ttu',
    maps_embed_url:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.953245200817!2d107.69528109999999!3d-6.896195999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68dd12f9be2a75%3A0xb74a541fb6697dc9!2sJl.%20Sumber%20Jati%20No.98%2C%20Jatiendah%2C%20Kec.%20Cilengkrang%2C%20Kabupaten%20Bandung%2C%20Jawa%20Barat%2040616!5e0!3m2!1sid!2sid!4v1773790913818!5m2!1sid!2sid',
  }

  const resolved = {
    name: storeInfo?.name ?? fallback.name,
    address: storeInfo?.address ?? fallback.address,
    phone: storeInfo?.phone ?? fallback.phone,
    opening_hours: storeInfo?.opening_hours ?? fallback.opening_hours,
    maps_url: storeInfo?.maps_url ?? fallback.maps_url,
    maps_embed_url: storeInfo?.maps_embed_url ?? fallback.maps_embed_url,
  }

  const infoItems = [
    {
      icon: MapPin,
      label: 'Alamat',
      value: resolved.address,
    },
    {
      icon: Clock,
      label: 'Jam Operasional',
      value: resolved.opening_hours,
    },
    {
      icon: Phone,
      label: 'Telepon',
      value: resolved.phone,
    },
  ]

  return (
    <section id="alamat" className="py-20 bg-[#F5EAD0]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-lato text-xs tracking-[0.3em] uppercase text-[#C8956C] mb-4 block">
            Temukan Kami
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#2C1A0E] mb-4">
            Lokasi <span className="italic text-[#8B5A2B]">Kami</span>
          </h2>
          <div className="ornament-divider max-w-xs mx-auto mb-6">
            <span className="text-[#C8956C] text-lg">✦</span>
          </div>
          <p className="font-lato text-base text-[#8B5A2B] max-w-xl mx-auto">
            Kunjungi toko kami untuk melihat dan mencicipi produk secara langsung
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Google Maps iframe */}
          <div className="rounded-2xl h-80 lg:h-full min-h-80 overflow-hidden border border-[#E8D5B7]">
            <iframe
              src={
                resolved.maps_embed_url
              }
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>

          {/* Store info */}
          <div className="bg-white rounded-2xl border border-[#E8D5B7] p-8">
            <h3 className="font-playfair text-2xl font-bold text-[#2C1A0E] mb-2">
              {resolved.name}
            </h3>
            <div className="h-px bg-[#F5EAD0] mb-8" />

            <div className="space-y-7">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#F5EAD0] border border-[#E8D5B7] rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-[#8B5A2B]" />
                  </div>
                  <div>
                    <h4 className="font-lato text-xs tracking-widest uppercase text-[#C8956C] mb-1">
                      {item.label}
                    </h4>
                    <p className="font-lato text-sm text-[#5C3317] leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Directions button */}
            <a
              href={resolved.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 w-full border border-[#C8956C] text-[#8B5A2B] hover:bg-[#5C3317] hover:text-[#F5EAD0] hover:border-[#5C3317] font-lato text-sm tracking-widest uppercase py-3 transition-all duration-300 rounded-none"
            >
              <MapPin className="h-4 w-4" />
              Lihat di Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
