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
  id: string
  is_active?: boolean

  name: string
  address: string
  phone: string
  email: string
  instagram?: string
  whatsapp?: string
  opening_hours: string

  maps_url?: string
  maps_embed_url?: string

  hero_kicker?: string
  hero_title?: string
  hero_tagline?: string
  hero_description?: string
  hero_images?: string[]
  hero_stats?: { value: string; label: string }[]

  tagline_heading?: string
  tagline_subheading?: string
  tagline_features?: { icon: 'leaf' | 'heart' | 'chefhat'; title: string; description: string }[]
  tagline_quote?: string

  contact_instagram_handle?: string
  contact_instagram_url?: string
  contact_whatsapp_number?: string
  contact_whatsapp_url?: string
  contact_email?: string

  created_at?: string
  updated_at?: string
}
