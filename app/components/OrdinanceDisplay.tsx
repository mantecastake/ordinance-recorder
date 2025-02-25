"use client"

import { useState, useEffect } from "react"
import { getOrdinanceData } from "../actions"
import { supabase } from "@/utils/supabase"

export function OrdinanceDisplay() {
  const [ordinanceData, setOrdinanceData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
     //setIsLoading(true)
      const data = await getOrdinanceData()
      setOrdinanceData(data)
      setIsLoading(false)
    }

    fetchData()

    const channel1 = supabase
      .channel("ord_history_updates_2")
      .on("postgres_changes", { event: "*", schema: "public", table: "ordinance_history" }, (payload) => {
        fetchData()
      })
      .subscribe()

    const channel2 = supabase
      .channel("ward_updates_2")
      .on("postgres_changes", { event: "*", schema: "public", table: "wards" }, (payload) => {
        fetchData()
      })
      .subscribe()

    return () => {
      channel1.unsubscribe()
      channel2.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return <div className="text-center mt-8">Loading ward progress...</div>
  }

  return (
    <div className="mt-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ordinanceData.map((ward) => (
          <div key={ward.ward} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-light text-navy mb-4">{ward.ward}</h3>
            <div className="space-y-2">
              <div className="h-2 bg-gray-100">
                <div
                  className="h-2 bg-copper transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (ward.ordinances_performed / ward.ordinance_goal) * 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-gray-form text-sm">
                {ward.ordinances_performed} / {ward.ordinance_goal} ordinances performed
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

