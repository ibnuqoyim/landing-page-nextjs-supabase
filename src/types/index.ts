export interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  is_ready: boolean
  is_active: boolean
  weight: number | null
  dough_id: string | null
  created_at?: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Testimonial {
  id: string
  name: string
  job: string
  content: string
  rating: number
  avatar_url?: string
}

export interface StoreInfo {
  name: string
  address: string
  phone: string
  email: string
  instagram?: string
  whatsapp?: string
  opening_hours: string
}
