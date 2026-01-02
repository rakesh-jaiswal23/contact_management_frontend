"use client"

import { useState } from "react"
import { ContactForm } from "@/components/contact-form"
import { ContactsList } from "@/components/contacts-list"
import { Mail } from "lucide-react"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleContactAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-input bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Contact Manager</h1>
              <p className="text-sm text-muted-foreground">Manage and track your contacts efficiently</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-input rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-foreground mb-6">New Contact</h2>
              <ContactForm onContactAdded={handleContactAdded} />
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-input rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <ContactsList refreshTrigger={refreshKey} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-input bg-muted/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Built with Next.js
          </p>
        </div>
      </footer>
    </main>
  )
}
