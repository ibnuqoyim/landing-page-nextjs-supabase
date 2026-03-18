'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ShoppingCart, Menu, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Separator } from '@/components/ui/separator'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart()

  const navLinks = [
    { href: '#products', label: 'Produk' },
    { href: '#alamat', label: 'Lokasi' },
    { href: '#kontak', label: 'Kontak' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#FDF8F0]/95 backdrop-blur-sm border-b border-[#E8D5B7]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-playfair text-xl font-bold text-[#5C3317] tracking-wide">
            Kudapanmu<span className="text-[#C8956C]">_ya</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-lato text-sm tracking-widest uppercase text-[#8B5A2B] hover:text-[#5C3317] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Cart Sheet */}
            <Sheet>
              <SheetTrigger>
                <Button variant="ghost" size="icon" className="relative text-[#5C3317] hover:bg-[#F5EAD0]">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#8B5A2B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-lato">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-[#FDF8F0] border-l border-[#E8D5B7]">
                <SheetHeader>
                  <SheetTitle className="font-playfair text-[#5C3317]">Keranjang Belanja</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col h-[calc(100vh-200px)]">
                  {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#8B5A2B] gap-3">
                      <ShoppingCart className="h-12 w-12 text-[#E8D5B7]" />
                      <p className="font-lato text-sm">Keranjang masih kosong</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-auto space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 bg-[#F5EAD0] rounded-xl border border-[#E8D5B7]">
                            <div className="flex-1">
                              <h4 className="font-playfair font-semibold text-[#2C1A0E] text-sm">{item.name}</h4>
                              <p className="font-lato text-xs text-[#8B5A2B] mt-1">
                                Rp {Number(item.price).toLocaleString('id-ID')}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-[#5C3317] hover:bg-[#E8D5B7]"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-7 text-center font-lato text-sm text-[#2C1A0E]">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-[#5C3317] hover:bg-[#E8D5B7]"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[#E8D5B7] pt-4 mt-4">
                        <div className="flex justify-between mb-4">
                          <span className="font-lato font-semibold text-[#5C3317]">Total:</span>
                          <span className="font-playfair font-bold text-lg text-[#2C1A0E]">
                            Rp {Number(totalPrice).toLocaleString('id-ID')}
                          </span>
                        </div>
                        <Link href="/cart">
                          <Button className="w-full bg-[#5C3317] hover:bg-[#2C1A0E] text-[#F5EAD0] font-lato tracking-wide">
                            Lanjut ke Checkout
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="md:hidden">
                <Button variant="ghost" size="icon" className="text-[#5C3317] hover:bg-[#F5EAD0]">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#FDF8F0] border-l border-[#E8D5B7]">
                <SheetHeader>
                  <SheetTitle className="font-playfair text-[#5C3317]">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-lato text-sm tracking-widest uppercase text-[#8B5A2B] hover:text-[#5C3317] py-2 border-b border-[#E8D5B7]"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Separator className="my-2 bg-[#E8D5B7]" />
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-[#5C3317] hover:bg-[#2C1A0E] text-[#F5EAD0] font-lato">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Lihat Keranjang
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
