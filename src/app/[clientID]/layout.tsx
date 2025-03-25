import type { ReactNode } from "react"

export default function ClientLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { clientID: string }
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold">Client Portal</h1>
          <p className="text-sm text-slate-500">Client ID: {params.clientID}</p>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

