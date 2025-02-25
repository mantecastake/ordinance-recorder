"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { submitOrdinance, getWards, getOrdinanceData } from "../actions"
import { supabase } from "@/utils/supabase"

export function OrdinanceForm() {
  const [message, setMessage] = useState("")
  const [wards, setWards] = useState([])
  const [selectedWard, setSelectedWard] = useState("")
  const [wardProgress, setWardProgress] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchWardProgress() {
      if (selectedWard) {
        const ordinanceData = await getOrdinanceData()
        const wardData = ordinanceData.find((ward) => ward.ward === selectedWard)
        setWardProgress(wardData)
      }
    }
    fetchWardProgress()

    async function fetchWards() {
      const wardsData = await getWards()
      setWards(wardsData)
      if (wardsData.length > 0) {
        setSelectedWard(wardsData[0])
      }
    }
    fetchWards()

    const channel1 = supabase
      .channel("ord_history_updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "ordinance_history" }, (payload) => {
        console.log("Change received!", payload)
        fetchWardProgress()
      })
      .subscribe()

    const channel2 = supabase
      .channel("ward_updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "wards" }, (payload) => {
        console.log("Change received!", payload)
        fetchWardProgress()
      })
      .subscribe()

    return () => {
      channel1.unsubscribe()
      channel2.unsubscribe()
    }
  }, [selectedWard])

  async function handleSubmit(event) {
    // event.preventDefault() // Prevents page refresh
    const formData = new FormData(event.target)
    console.log(formData)
    const result = await submitOrdinance(formData)
    setMessage(result.message)
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ward" className="block text-xl mb-4 text-navy font-light">
              Select Ward <span className="text-gray-form">(required)</span>
            </label>
            <select
              id="ward"
              name="ward"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-none text-navy focus:outline-none focus:border-copper transition-colors"
            >
              {wards.map((ward) => (
                <option key={ward} value={ward}>
                  {ward}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ordinances" className="block text-xl mb-4 text-navy font-light">
              Number of Ordinances <span className="text-gray-form">(required)</span>
            </label>
            <input
              type="number"
              id="ordinances"
              name="ordinances"
              min="0"
              required
              className="w-full p-3 border border-gray-300 rounded-none text-navy focus:outline-none focus:border-copper transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-copper hover:bg-copper-light text-white transition-colors text-lg font-light uppercase tracking-wider"
          >
            Submit
          </button>
        </form>
      </div>

      {message && (
        <p className={`text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</p>
      )}

      {wardProgress && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-light text-navy mb-4">{selectedWard} Progress</h3>
          <div className="space-y-2">
            <div className="h-2 bg-gray-100">
              <div
                className="h-2 bg-copper transition-all duration-500"
                style={{
                  width: `${Math.min(100, (wardProgress.ordinances_performed / wardProgress.ordinance_goal) * 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-gray-form text-sm">
              {wardProgress.ordinances_performed} / {wardProgress.ordinance_goal} ordinances performed
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

