import { OrdinanceDisplay } from "../components/OrdinanceDisplay"
import { BottomNav } from "../components/BottomNav"

export default function Progress() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-navy text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-light">Ward Progress</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 mb-20">
        <OrdinanceDisplay />
      </main>
      <BottomNav />
    </div>
  )
}

