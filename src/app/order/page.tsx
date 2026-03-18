'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft, Plus, Minus, Trash2,
  ShoppingBag, X, MessageCircle, Truck, ChevronRight, Scale, Loader2
} from 'lucide-react'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80'

// Cloudinary image resize helper
const getOptimizedImageUrl = (url: string | null, width: number = 400, height: number = 400) => {
  if (!url) return FALLBACK_IMAGE
  
  // Check if it's a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    // Extract base URL and add resize parameters
    const baseUrl = url.split('/upload/')[0] + '/upload/'
    const publicId = url.split('/upload/')[1]?.replace(/^v\d+/, '')
    
    if (publicId) {
      // Add resize parameters: w_400,h_400,c_fill,f_auto,q_auto
      return `${baseUrl}w_${width},h_${height},c_fill,f_auto,q_auto/${publicId}`
    }
  }
  
  // For non-Cloudinary URLs, return as-is
  return url
}

const KURIR_OPTIONS = [
  { id: 'cod',     label: 'COD (Cash on Delivery)',     estimate: 'Gratis', days: 'Hari ini', desc: 'Bayar saat barang diterima' },
  { id: 'ahsan',     label: 'Ahsan Express',     estimate: 'Rp 10.000 – Rp 12.000', days: 'Hari ini', desc: 'Khusus Bandung dan sekitarnya' },
  { id: 'spx',     label: 'Shopee Express',      estimate: 'Rp 9.000 – Rp 22.000', days: '2 Jam', desc: 'Untuk pengiriman < 5KM' },
  { id: 'tiki', label: 'Tiki',           estimate: 'Rp 10.000 – Rp 20.000', days: '1-3 hari', desc: 'Pengiriman Luar Kota' },
  { id: 'ncs',  label: 'NCS',   estimate: 'Rp 15.000 – Rp 35.000', days: '1-3 hari' , desc: 'Pengiriman Frozen Food ke Luar Kota'},
]

const inputClass =
  'w-full bg-white border border-[#E8D5B7] px-4 py-3 font-lato text-sm text-[#2C1A0E] placeholder-[#C8956C]/50 focus:outline-none focus:border-[#C8956C] focus:ring-1 focus:ring-[#C8956C]/30 rounded-lg'

export default function OrderPage() {
  const router = useRouter()
  const { items, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart()

  const [name, setName]               = useState('')
  const [phone, setPhone]             = useState('')
  const [address, setAddress]         = useState('')
  const [selectedKurir, setSelectedKurir] = useState('')
  const [showPicker, setShowPicker]   = useState(false)
  const [errors, setErrors]           = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Products for the picker — fetched from Supabase, fallback to mock
  const [pickerProducts, setPickerProducts] = useState<Product[]>([])
  const [pickerLoading, setPickerLoading]   = useState(false)

  useEffect(() => {
    fetchPickerProducts()
  }, [])

  const fetchPickerProducts = async () => {
    setPickerLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_ready', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      if (data && data.length > 0) setPickerProducts(data)
    } catch {
      // keep empty array as fallback
    } finally {
      setPickerLoading(false)
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim())    e.name    = 'Nama wajib diisi'
    if (!phone.trim())   e.phone   = 'No HP wajib diisi'
    if (!address.trim()) e.address = 'Alamat wajib diisi'
    if (!selectedKurir)  e.kurir   = 'Pilih kurir pengiriman'
    if (items.length === 0) e.items = 'Tambahkan minimal 1 produk'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const normalizePhone = (raw: string) => raw.replace(/[^\d]/g, '')

  const buildPhoneCandidates = (raw: string) => {
    const n = normalizePhone(raw)
    if (!n) return []
    const candidates = new Set<string>([n])
    if (n.startsWith('0')) candidates.add(`62${n.slice(1)}`)
    if (n.startsWith('62')) candidates.add(`0${n.slice(2)}`)
    return Array.from(candidates)
  }

  const formatDateYYYYMMDD = (d: Date) => {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const generateInvoiceNumber = async (): Promise<string> => {
    try {
            // Get all orders sorted by invoice_number descending to get the latest one
            const { data: orders, error } = await supabase
                .from('orders')
                .select('invoice_number')
                .order('invoice_number', { ascending: false })
                .limit(1)

            if (error) throw error

            const now = new Date()
            const currentYYYY = String(now.getFullYear())
            const currentMM = String(now.getMonth() + 1).padStart(2, '0')
            const currentYYYYMM = currentYYYY + currentMM

            // If no orders exist, start with YYYYMM00
            if (!orders || orders.length === 0) {
                return currentYYYYMM + '00'
            }

            const lastInvoiceNumber = orders[0].invoice_number
            const lastYYYYMM = lastInvoiceNumber.slice(0, 6)
            const lastXX = parseInt(lastInvoiceNumber.slice(6, 8), 10)

            console.log('Last Invoice:', lastInvoiceNumber, 'Current YYYYMM:', currentYYYYMM)

            // If YYYY``MM is the same, increment XX
            if (lastYYYYMM === currentYYYYMM) {
                const nextXX = lastXX + 1
                if (nextXX > 99) {
                    throw new Error('Invoice number counter exceeded maximum (99)')
                }
                return currentYYYYMM + String(nextXX).padStart(2, '0')
            } else {
                // If YYYYMM is different, reset to YYYYMM00
                return currentYYYYMM + '00'
            }
        } catch (error) {
            console.error('Error generating invoice number:', error)
            // Fallback: generate based on current date
            const now = new Date()
            const yyyy = String(now.getFullYear())
            const mm = String(now.getMonth() + 1).padStart(2, '0')
            return yyyy + mm + '00'
        }
  }

  const getLatestPoId = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('batch_po')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) return null
      return (data as { id?: string } | null)?.id ?? null
    } catch {
      return null
    }
  }

  const getCustomerIdByPhone = async (rawPhone: string, customerName: string, customerAddress: string): Promise<string | null> => {
    const candidates = buildPhoneCandidates(rawPhone)
    if (candidates.length === 0) return null
    try {
      // First try to find existing customer
      const { data, error } = await supabase
        .from('customers')
        .select('id')
        .in('phone', candidates)
        .limit(1)
        .maybeSingle()
      
      if (error) return null
      
      // If customer exists, return their ID
      if (data && data.id) {
        return data.id
      }
      
      // If no customer found, create new one
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          name: customerName.trim(),
          phone: normalizePhone(rawPhone),
          address: customerAddress.trim() || null,
          total_purchases: 0,
        })
        .select('id')
        .single()
      
      if (createError) {
        console.error('Error creating customer:', createError)
        return null
      }
      
      return newCustomer?.id || null
    } catch (error) {
      console.error('Error in getCustomerIdByPhone:', error)
      return null
    }
  }

  const handleSubmit = async () => {
    if (!validate()) return
    if (isSubmitting) return
    setSubmitError(null)
    setIsSubmitting(true)

    const now = new Date()
    const orderDate = formatDateYYYYMMDD(now)
    const [invoiceNumber, poId, customerId] = await Promise.all([
      generateInvoiceNumber(),
      getLatestPoId(),
      getCustomerIdByPhone(phone, name, address),
    ])

    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: name.trim(),
        phone: normalizePhone(phone) || null,
        invoice_number: invoiceNumber,
        date: orderDate,
        po_id: poId,
        customer_id: customerId,
      })
      .select('id')
      .single()

    if (orderError || !createdOrder?.id) {
      setSubmitError('Gagal menyimpan pesanan. Silakan coba lagi.')
      setIsSubmitting(false)
      return
    }

    const orderItemsPayload = items.map(i => ({
      order_id: createdOrder.id,
      product_id: i.id,
      quantity: i.quantity,
      price: Number(i.price),
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload)

    if (itemsError) {
      setSubmitError('Pesanan tersimpan, tapi gagal menyimpan item. Silakan hubungi admin.')
      setIsSubmitting(false)
      return
    }

    const kurir = KURIR_OPTIONS.find(k => k.id === selectedKurir)
    const productLines = items
      .map(i => `- ${i.name} x${i.quantity} = Rp ${(Number(i.price) * i.quantity).toLocaleString('id-ID')}`)
      .join('\n')
    const msg = [
      `*Pesanan Baru - Kudapanmu_ya* 🍞`,
      ``,
      `*Invoice:* ${invoiceNumber}`,
      `*Nama:* ${name}`,
      `*No HP:* ${phone}`,
      `*Alamat:* ${address}`,
      `*Kurir:* ${kurir?.label} (${kurir?.estimate})`,
      ``,
      `*Produk:*`,
      productLines,
      ``,
      `*Total Produk:* Rp ${totalPrice.toLocaleString('id-ID')}`,
      `_(belum termasuk ongkir)_`,
    ].join('\n')
    const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281234567890'
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank')
    window.alert(`terimakasih sudah pesan produk kami, no pesanan anda ini (${invoiceNumber})`)
    clearCart()
    router.push('/')
    setIsSubmitting(false)

    
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8D5B7]">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center gap-2 text-xs font-lato text-[#C8956C]">
            <Link href="/" className="hover:text-[#5C3317] transition-colors">Beranda</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/cart" className="hover:text-[#5C3317] transition-colors">Keranjang</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#5C3317] font-semibold">Buat Pesanan</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Title */}
        <div className="mb-8">
          <Link href="/cart">
            <button className="flex items-center gap-2 font-lato text-sm text-[#8B5A2B] hover:text-[#5C3317] transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Keranjang
            </button>
          </Link>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#2C1A0E]">
            Form <span className="italic text-[#8B5A2B]">Pesanan</span>
          </h1>
          <p className="font-lato text-sm text-[#8B5A2B] mt-2">
            Lengkapi data di bawah untuk mengirim pesanan via WhatsApp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Informasi Pengiriman */}
            <div className="bg-white border border-[#E8D5B7] rounded-2xl p-6">
              <h2 className="font-playfair text-xl font-semibold text-[#2C1A0E] mb-1">
                Informasi Pengiriman
              </h2>
              <p className="font-lato text-xs text-[#C8956C] mb-6 tracking-wide uppercase">Data Penerima</p>

              <div className="space-y-4">
                <div>
                  <label className="font-lato text-xs tracking-widest uppercase text-[#8B5A2B] mb-2 block">
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Masukkan nama lengkap Anda"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                  />
                  {errors.name && <p className="font-lato text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="font-lato text-xs tracking-widest uppercase text-[#8B5A2B] mb-2 block">
                    No HP / WhatsApp (Contoh: 628123456789) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    className={inputClass}
                    placeholder="Contoh: 628123456789"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })) }}
                  />
                  {errors.phone && <p className="font-lato text-xs text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="font-lato text-xs tracking-widest uppercase text-[#8B5A2B] mb-2 block">
                    Alamat Tujuan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Jalan, Kelurahan, Kecamatan, Kota, Kode Pos"
                    value={address}
                    onChange={e => { setAddress(e.target.value); setErrors(p => ({ ...p, address: '' })) }}
                  />
                  {errors.address && <p className="font-lato text-xs text-red-400 mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Pilihan Kurir */}
            <div className="bg-white border border-[#E8D5B7] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="h-5 w-5 text-[#C8956C]" />
                <h2 className="font-playfair text-xl font-semibold text-[#2C1A0E]">Pilihan Kurir</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {KURIR_OPTIONS.map(kurir => (
                  <button
                    key={kurir.id}
                    onClick={() => { setSelectedKurir(kurir.id); setErrors(p => ({ ...p, kurir: '' })) }}
                    className={`text-left p-4 border rounded-xl transition-all duration-200 ${
                      selectedKurir === kurir.id
                        ? 'bg-[#5C3317] border-[#5C3317] text-[#F5EAD0]'
                        : 'bg-[#FDF8F0] border-[#E8D5B7] text-[#2C1A0E] hover:border-[#C8956C]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-playfair font-semibold text-sm">{kurir.label}</p>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                        selectedKurir === kurir.id ? 'border-[#F5EAD0] bg-[#F5EAD0]' : 'border-[#C8956C]'
                      }`} />
                    </div>
                    <p className={`font-lato text-xs ${selectedKurir === kurir.id ? 'text-[#E8D5B7]' : 'text-[#C8956C]'}`}>
                      {kurir.estimate}
                    </p>
                    <p className={`font-lato text-xs mt-0.5 ${selectedKurir === kurir.id ? 'text-[#F5EAD0]/70' : 'text-[#8B5A2B]/60'}`}>
                      Estimasi: {kurir.days}
                      {kurir.desc && <span> - {kurir.desc}</span>}
                    </p>
                  </button>
                ))}
              </div>
              {errors.kurir && <p className="font-lato text-xs text-red-400 mt-3">{errors.kurir}</p>}
            </div>

            {/* Produk Dipesan */}
            <div className="bg-white border border-[#E8D5B7] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-playfair text-xl font-semibold text-[#2C1A0E]">Produk Dipesan</h2>
                <Button
                  onClick={() => setShowPicker(true)}
                  className="bg-transparent border border-[#C8956C] text-[#8B5A2B] hover:bg-[#5C3317] hover:text-[#F5EAD0] hover:border-[#5C3317] font-lato text-xs tracking-wide rounded-none h-8 px-4 transition-all duration-200"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Tambah Produk
                </Button>
              </div>
              <p className="font-lato text-xs text-[#C8956C] mb-6 tracking-wide uppercase">
                {items.length} produk dipilih
              </p>

              {errors.items && <p className="font-lato text-xs text-red-400 mb-4">{errors.items}</p>}

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <div className="w-16 h-16 bg-[#F5EAD0] rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-7 w-7 text-[#C8956C]" />
                  </div>
                  <p className="font-playfair text-[#8B5A2B] font-medium">Belum ada produk</p>
                  <p className="font-lato text-xs text-[#C8956C]">Klik &quot;Tambah Produk&quot; untuk memilih</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-[#FDF8F0] border border-[#E8D5B7] rounded-xl">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F5EAD0] flex-shrink-0">
                        <Image
                          src={getOptimizedImageUrl(item.image_url, 64, 64)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-playfair font-semibold text-sm text-[#2C1A0E] truncate">
                              {item.name}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#E8D5B7] hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
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
                          <p className="font-playfair font-bold text-[#5C3317] text-sm">
                            Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <p className="font-lato text-xs text-[#C8956C] mt-1">
                          @ Rp {Number(item.price).toLocaleString('id-ID')} / pcs
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E8D5B7] rounded-2xl p-6 lg:sticky lg:top-24">
              <h2 className="font-playfair text-xl font-semibold text-[#2C1A0E] mb-1">Ringkasan</h2>
              <p className="font-lato text-xs text-[#C8956C] mb-5 tracking-wide uppercase">Detail Pesanan</p>

              {items.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-lato text-xs text-[#2C1A0E] truncate">{item.name}</p>
                        <p className="font-lato text-xs text-[#C8956C]">x{item.quantity}</p>
                      </div>
                      <p className="font-lato text-xs font-semibold text-[#5C3317] flex-shrink-0">
                        Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-lato text-xs text-[#C8956C] mb-4 italic">Belum ada produk</p>
              )}

              <Separator className="bg-[#F5EAD0] mb-4" />

              <div className="flex justify-between items-center mb-2">
                <p className="font-lato text-sm text-[#8B5A2B]">Subtotal Produk</p>
                <p className="font-playfair font-bold text-[#2C1A0E]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="flex justify-between items-center mb-5">
                <p className="font-lato text-sm text-[#8B5A2B]">Ongkir</p>
                <p className="font-lato text-xs text-[#C8956C] italic">Tergantung kurir</p>
              </div>

              {/* Selected kurir */}
              <div className="bg-[#F5EAD0] border border-[#E8D5B7] rounded-lg p-3 mb-5">
                <p className="font-lato text-xs text-[#8B5A2B] mb-1 tracking-wide uppercase">Kurir Dipilih</p>
                {selectedKurir ? (
                  <>
                    <p className="font-playfair text-sm font-semibold text-[#2C1A0E]">
                      {KURIR_OPTIONS.find(k => k.id === selectedKurir)?.label}
                    </p>
                    <p className="font-lato text-xs text-[#C8956C] mt-0.5">
                      {KURIR_OPTIONS.find(k => k.id === selectedKurir)?.estimate}
                    </p>
                  </>
                ) : (
                  <p className="font-lato text-xs text-[#C8956C] italic">Belum dipilih</p>
                )}
              </div>

              <Separator className="bg-[#F5EAD0] mb-4" />

              <div className="flex justify-between items-baseline mb-1">
                <p className="font-playfair font-bold text-[#2C1A0E]">Total Produk</p>
                <p className="font-playfair text-xl font-bold text-[#5C3317]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
              <p className="font-lato text-xs text-[#C8956C] italic mb-6">*Belum termasuk ongkir</p>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#5C3317] hover:bg-[#2C1A0E] text-[#F5EAD0] font-lato tracking-wide text-sm rounded-none h-12 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Pesan via WhatsApp
                  </>
                )}
              </Button>
              {submitError && (
                <p className="font-lato text-xs text-red-400 text-center mt-3">
                  {submitError}
                </p>
              )}
              <p className="font-lato text-xs text-[#C8956C] text-center mt-3">
                Pesanan dikonfirmasi via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT PICKER MODAL ── */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1A0E]/60 backdrop-blur-sm p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowPicker(false) }}
        >
          <div className="bg-[#FDF8F0] border border-[#E8D5B7] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8D5B7]">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#2C1A0E]">Pilih Produk</h2>
                <p className="font-lato text-xs text-[#C8956C] mt-0.5">
                  Klik tambah untuk menambahkan ke pesanan
                </p>
              </div>
              <button
                onClick={() => setShowPicker(false)}
                className="w-8 h-8 flex items-center justify-center text-[#8B5A2B] hover:text-[#2C1A0E] hover:bg-[#F5EAD0] rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6">
              {pickerLoading ? (
                <div className="flex items-center justify-center py-12 gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-[#8B5A2B]" />
                  <p className="font-lato text-sm text-[#8B5A2B]">Memuat produk...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pickerProducts.map(product => {
                    const inCart = items.find(i => i.id === product.id)
                    return (
                      <div
                        key={product.id}
                        className={`flex gap-3 p-4 bg-white border rounded-xl transition-colors ${
                          !product.is_ready ? 'opacity-50' : 'border-[#E8D5B7] hover:border-[#C8956C]'
                        }`}
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F5EAD0] flex-shrink-0">
                          <Image
                            src={getOptimizedImageUrl(product.image_url, 64, 64)}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-playfair text-sm font-semibold text-[#2C1A0E] leading-tight">
                            {product.name}
                          </p>
                          <p className="font-lato text-xs text-[#5C3317] font-semibold mt-1">
                            Rp {Number(product.price).toLocaleString('id-ID')}
                          </p>

                          {!product.is_ready ? (
                            <span className="font-lato text-xs text-[#C8956C] italic mt-2 block">Stok habis</span>
                          ) : inCart ? (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center border border-[#E8D5B7] rounded-lg overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(product.id, inCart.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center text-[#8B5A2B] hover:bg-[#F5EAD0] transition-colors"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center font-lato text-xs font-bold text-[#2C1A0E] border-x border-[#E8D5B7]">
                                  {inCart.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(product.id, inCart.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center text-[#8B5A2B] hover:bg-[#F5EAD0] transition-colors"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="font-lato text-xs text-[#8B5A2B]">di keranjang</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="mt-2 flex items-center gap-1 bg-[#5C3317] hover:bg-[#2C1A0E] text-[#F5EAD0] font-lato text-xs px-3 py-1.5 rounded-none transition-all"
                            >
                              <Plus className="h-3 w-3" />
                              Tambah
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E8D5B7] flex items-center justify-between bg-[#FDF8F0] rounded-b-2xl">
              <p className="font-lato text-xs text-[#8B5A2B]">
                {items.length > 0
                  ? `${items.reduce((s, i) => s + i.quantity, 0)} item dipilih`
                  : 'Belum ada produk dipilih'}
              </p>
              <button
                onClick={() => setShowPicker(false)}
                className="bg-[#5C3317] hover:bg-[#2C1A0E] text-[#F5EAD0] font-lato text-sm px-6 py-2 rounded-none transition-all"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
