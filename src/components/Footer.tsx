'use client'

import { Instagram, MessageCircle, Heart } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#2C1A0E] text-[#C8956C] py-16 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8956C]/50 to-transparent" />

      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#5C3317] rounded-full translate-x-1/2 -translate-y-1/2 opacity-20" />

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-2">
              Kudapanmu<span className="text-[#C8956C] italic">_ya</span>
            </h3>
            <p className="font-lato text-xs tracking-widest uppercase text-[#C8956C] mb-4">
              Fermented with Love
            </p>
            <div className="h-px w-12 bg-[#C8956C]/50 mb-4" />
            <p className="font-lato text-sm leading-relaxed text-[#E8D5B7]/60">
              Menyediakan kudapan sehat dan berkualitas dengan bahan-bahan alami dan proses fermentasi yang terjamin.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-lato text-xs tracking-[0.3em] uppercase text-[#C8956C] mb-6">
              Link Cepat
            </h4>
            <ul className="space-y-3">
              {[
                { href: '#products', label: 'Produk' },
                { href: '#alamat', label: 'Lokasi' },
                { href: '#kontak', label: 'Kontak' },
                { href: '/cart', label: 'Keranjang' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-lato text-sm text-[#E8D5B7]/60 hover:text-[#C8956C] transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-px w-4 bg-[#C8956C]/0 group-hover:bg-[#C8956C] transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Info */}
          <div>
            <h4 className="font-lato text-xs tracking-[0.3em] uppercase text-[#C8956C] mb-6">
              Ikuti Kami
            </h4>
            <div className="flex gap-3 mb-6">
              <Link
                href="https://instagram.com/sourdoughmu_ya"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#5C3317] hover:border-[#C8956C] rounded-full flex items-center justify-center text-[#E8D5B7]/60 hover:text-[#C8956C] transition-all duration-300"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="https://wa.me/6282115645571"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#5C3317] hover:border-[#C8956C] rounded-full flex items-center justify-center text-[#E8D5B7]/60 hover:text-[#C8956C] transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4" />
              </Link>
            </div>
            <p className="font-lato text-xs text-[#E8D5B7]/40 leading-relaxed">
              Senin – Sabtu<br />08.00 – 18.00 WIB<br />
              <span className="text-[#C8956C]">+62 821-1564-5571</span>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#5C3317] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-lato text-xs text-[#E8D5B7]/40">
            © {currentYear} Kudapanmu_ya. All rights reserved.
          </p>
          <p className="font-lato text-xs text-[#E8D5B7]/40 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-[#C8956C] fill-[#C8956C]" /> in Bandung
          </p>
        </div>
      </div>
    </footer>
  )
}
