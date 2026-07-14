'use client'

import ProfileClient from '../profile/ProfileClient'
import type { Motorcycle } from '@/components/catalog-home/types'

const base: Omit<Motorcycle, 'id' | 'model' | 'brand'> = {
  name: 'Test Bike',
  brandGradient: 'linear-gradient(135deg, #b91c1c, #7f1d1d)',
  year: 2024,
  color: 'red',
  powerKw: 150,
  engine: '1103cc V4',
  price: 25990,
  inStock: true,
  licenseCategories: ['A'],
  silhouetteCategory: 'sport',
  photoUrls: [],
}

const mock: Motorcycle[] = [
  { ...base, id: '1', brand: 'Ducati', model: 'Panigale V4', matriculate: 'CA1234AB' },
  { ...base, id: '2', brand: 'Triumph', model: 'Street Triple RS' },
  { ...base, id: '3', brand: 'Harley-Davidson', model: 'LiveWire One Special Edition Long Name' },
  { ...base, id: '4', brand: 'Honda', model: 'CB650R', matriculate: 'SO9988ZZ' },
  { ...base, id: '5', brand: 'Kawasaki', model: 'Ninja ZX-6R' },
  { ...base, id: '6', brand: 'Yamaha', model: 'MT-09' },
]

export default function TestFavCardPage() {
  return <ProfileClient favoriteMotorcycles={mock} />
}
