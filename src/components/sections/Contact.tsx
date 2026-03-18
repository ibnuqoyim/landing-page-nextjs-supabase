'use client'

import { Button } from '@/components/ui/button'
import { Instagram, MessageCircle, Mail, Send } from 'lucide-react'
import Link from 'next/link'

export default function Contact() {
  const contacts = [
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@sourdoughmu_ya',
      href: 'https://instagram.com/sourdoughmu_ya',
      bg: 'bg-[#F5EAD0]',
      iconColor: 'text-[#8B5A2B]',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+62 821-1564-5571',
      href: 'https://wa.me/6282115645571',
      bg: 'bg-[#F5EAD0]',
      iconColor: 'text-[#8B5A2B]',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@sourdoughmu.id',
      href: 'mailto:hello@sourdoughmu.id',
      bg: 'bg-[#F5EAD0]',
      iconColor: 'text-[#8B5A2B]',
    }
  ]

  return (
    <section id="kontak" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-lato text-xs tracking-[0.3em] uppercase text-[#C8956C] mb-4 block">
            Terhubung
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#2C1A0E] mb-4">
            Hubungi <span className="italic text-[#8B5A2B]">Kami</span>
          </h2>
          <div className="ornament-divider max-w-xs mx-auto mb-6">
            <span className="text-[#C8956C] text-lg">✦</span>
          </div>
          <p className="font-lato text-base text-[#8B5A2B] max-w-xl mx-auto">
            Punya pertanyaan atau ingin pesan khusus? Silakan hubungi kami melalui:
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {contacts.map((contact) => (
            <Link
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#FDF8F0] border border-[#E8D5B7] rounded-2xl p-8 text-center hover:border-[#C8956C] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${contact.bg} border-2 border-[#E8D5B7] group-hover:border-[#C8956C] group-hover:bg-[#C8956C]/10 rounded-full flex items-center justify-center mx-auto mb-5 transition-all duration-300`}>
                <contact.icon className={`h-6 w-6 ${contact.iconColor} group-hover:text-[#5C3317] transition-colors`} />
              </div>
              <h3 className="font-playfair font-semibold text-[#2C1A0E] mb-2">
                {contact.label}
              </h3>
              <p className="font-lato text-xs text-[#8B5A2B]">
                {contact.value}
              </p>
            </Link>
          ))}
        </div>

        {/* Order CTA */}
        <div className="mt-16">
          <div className="bg-[#2C1A0E] rounded-2xl p-10 md:p-14 max-w-3xl mx-auto text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#5C3317] rounded-full translate-x-1/2 -translate-y-1/2 opacity-40" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5C3317] rounded-full -translate-x-1/2 translate-y-1/2 opacity-40" />

            <div className="relative z-10">
              <span className="font-lato text-xs tracking-[0.3em] uppercase text-[#C8956C] mb-4 block">
                Pesan Sekarang
              </span>
              <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-4">
                Siap Menikmati Produk Kami?
              </h3>
              <p className="font-lato text-sm text-[#E8D5B7]/80 mb-8 max-w-md mx-auto leading-relaxed">
                Pilih produk favorit Anda dan checkout sekarang. Siap kirim keseluruh Sumatera dan Jawa.
              </p>
              <Link href="/cart">
                <Button
                  size="lg"
                  className="bg-[#C8956C] hover:bg-[#8B5A2B] text-white font-lato tracking-widest uppercase text-sm px-10 py-6 rounded-none border-0 transition-all duration-300"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Pesan Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
