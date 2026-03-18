'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/context/CartContext'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ChevronRight, Scale } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80'

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF8F0]">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <Link href="/">
            <button className="flex items-center gap-2 font-lato text-sm text-[#8B5A2B] hover:text-[#5C3317] transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </button>
          </Link>

          <div className="max-w-sm mx-auto text-center py-20">
            <div className="w-24 h-24 bg-[#F5EAD0] border-2 border-[#E8D5B7] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-[#C8956C]" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-[#2C1A0E] mb-3">
              Keranjang Kosong
            </h1>
            <p className="font-lato text-sm text-[#8B5A2B] mb-8 leading-relaxed">
              Anda belum menambahkan produk ke keranjang. Jelajahi produk kami dan temukan favorit Anda!
            </p>
            <Link href="/#products">
              <Button className="bg-[#5C3317] hover:bg-[#2C1A0E] text-[#F5EAD0] font-lato tracking-wide rounded-none px-8">
                Lihat Produk
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8D5B7]">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-lato text-[#C8956C]">
            <Link href="/" className="hover:text-[#5C3317] transition-colors">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#5C3317] font-semibold">Keranjang</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Title */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 font-lato text-sm text-[#8B5A2B] hover:text-[#5C3317] transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </button>
          </Link>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#2C1A0E]">
            Keranjang <span className="italic text-[#8B5A2B]">Belanja</span>
          </h1>
          <p className="font-lato text-sm text-[#8B5A2B] mt-2">
            {items.reduce((s, i) => s + i.quantity, 0)} item dalam keranjang
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-[#E8D5B7] rounded-2xl p-5 flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F5EAD0] flex-shrink-0">
                  <Image
                    src={item.image_url ?? FALLBACK_IMAGE}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-playfair font-semibold text-[#2C1A0E] truncate">
                        {item.name}
                      </h3>
                      {item.weight && (
                        <div className="flex items-center gap-1 mt-1">
                          <Scale className="h-3 w-3 text-[#C8956C]" />
                          <span className="font-lato text-xs text-[#C8956C]">{item.weight} gram</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#E8D5B7] hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty controls */}
                    <div className="flex items-center border border-[#E8D5B7] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#8B5A2B] hover:bg-[#F5EAD0] transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center font-lato text-sm font-semibold text-[#2C1A0E] border-x border-[#E8D5B7]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#8B5A2B] hover:bg-[#F5EAD0] transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <p className="font-playfair font-bold text-[#5C3317]">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <p className="font-lato text-xs text-[#C8956C] mt-1">
                    @ Rp {item.price.toLocaleString('id-ID')} / pcs
                  </p>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="flex items-center gap-2 font-lato text-xs text-red-300 hover:text-red-400 transition-colors py-2"
            >
              <Trash2 className="h-3 w-3" />
              Kosongkan Keranjang
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E8D5B7] rounded-2xl p-6 lg:sticky lg:top-24">
              <h2 className="font-playfair text-xl font-semibold text-[#2C1A0E] mb-1">
                Ringkasan
              </h2>
              <p className="font-lato text-xs text-[#C8956C] mb-5 tracking-wide uppercase">
                Detail Pesanan
              </p>

              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-lato text-xs text-[#2C1A0E] truncate">{item.name}</p>
                      <p className="font-lato text-xs text-[#C8956C]">x{item.quantity}</p>
                    </div>
                    <p className="font-lato text-xs font-semibold text-[#5C3317] flex-shrink-0">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="bg-[#F5EAD0] mb-4" />

              <div className="flex justify-between items-center mb-2">
                <p className="font-lato text-sm text-[#8B5A2B]">Subtotal</p>
                <p className="font-playfair font-bold text-[#2C1A0E]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="flex justify-between items-center mb-5">
                <p className="font-lato text-sm text-[#8B5A2B]">Ongkir</p>
                <p className="font-lato text-xs text-[#C8956C] italic">Dihitung saat order</p>
              </div>

              <Separator className="bg-[#F5EAD0] mb-5" />

              <div className="flex justify-between items-baseline mb-1">
                <p className="font-playfair font-bold text-[#2C1A0E]">Total</p>
                <p className="font-playfair text-xl font-bold text-[#5C3317]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
              <p className="font-lato text-xs text-[#C8956C] italic mb-6">
                *Belum termasuk ongkir
              </p>

              <Link href="/order" className="block">
                <Button className="w-full bg-[#5C3317] hover:bg-[#2C1A0E] text-[#F5EAD0] font-lato tracking-wide rounded-none h-12 text-sm transition-all duration-300">
                  Lanjut ke Pemesanan
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="font-lato text-xs text-[#C8956C] text-center mt-3">
                Isi data pengiriman di halaman berikutnya
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
