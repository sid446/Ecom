import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - E-commerce Store',
  description: 'Manage your e-commerce store with our comprehensive admin dashboard',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}