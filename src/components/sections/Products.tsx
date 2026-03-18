'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, ShoppingCart, Loader2, Scale } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import Image from 'next/image'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_ready', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      setProducts(data && data.length > 0 ? data : [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="products" className="py-20 bg-[#F5EAD0]">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#8B5A2B]" />
          <p className="mt-4 font-lato text-[#8B5A2B]">Memuat produk...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-20 bg-[#F5EAD0]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-lato text-xs tracking-[0.3em] uppercase text-[#C8956C] mb-4 block">
            Pilihan Terbaik
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#2C1A0E] mb-4">
            Produk <span className="italic text-[#8B5A2B]">Kami</span>
          </h2>
          <div className="ornament-divider max-w-xs mx-auto mb-6">
            <span className="text-[#C8956C] text-lg">✦</span>
          </div>
          <p className="font-lato text-base text-[#8B5A2B] max-w-xl mx-auto">
            Pilihan produk fermentasi berkualitas tinggi untuk kesehatan dan kenikmatan keluarga Anda
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#E8D5B7] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden bg-[#F5EAD0]">
                <Image
                  src={product.image_url ?? FALLBACK_IMAGE}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A0E]/20 to-transparent" />

                {/* Ready badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-lato rounded-sm ${
                  product.is_ready
                    ? 'bg-[#5C3317] text-[#F5EAD0]'
                    : 'bg-[#E8D5B7] text-[#8B5A2B]'
                }`}>
                  {product.is_ready ? 'Tersedia' : 'Habis'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-playfair text-xl font-semibold text-[#2C1A0E] mb-2">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between pt-4 border-t border-[#F5EAD0]">
                  <p className="font-playfair text-2xl font-bold text-[#5C3317]">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </p>
                  <Button
                    onClick={() => addToCart(product)}
                    className="bg-[#5C3317] hover:bg-[#2C1A0E] text-[#F5EAD0] font-lato text-sm rounded-none px-5 py-2 h-auto transition-all duration-300 disabled:bg-[#E8D5B7] disabled:text-[#C8956C] disabled:cursor-not-allowed"
                    disabled={!product.is_ready}
                  >
                    {!product.is_ready ? (
                      'Habis'
                    ) : (
                      <>
                        <Plus className="mr-1 h-4 w-4" />
                        Tambah
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="#kontak"
            className="inline-flex items-center gap-2 font-lato text-sm tracking-widest uppercase text-[#8B5A2B] hover:text-[#5C3317] border-b border-[#C8956C] pb-1 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Pesan
          </Link>
        </div>
      </div>
    </section>
  )
}
