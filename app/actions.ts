"use server"

import { supabase } from "@/utils/supabase"

export async function submitOrdinance(formData: FormData) {
  const ward = formData.get("ward") as string
  const ordinances = Number.parseInt(formData.get("ordinances") as string)
  const { data } = await supabase.from("ward_ordinances").select("id").eq("ward", ward).single()

  if(data == null) {
    console.error("data returned is null!")
    return { success: false, message: "Failed to get ward ordinance data" }
  }

  const { error } = await supabase.from("ordinance_history").insert({ ward_id: data.id, quantity: ordinances })

  if (error) {
    //console.log(`${ward}  ${ordinances}   ${data.id}`)
    console.error("Error submitting ordinance:", error)
    return { success: false, message: "Failed to submit ordinance" }
  }

  return { success: true, message: "Ordinance submitted successfully" }
}

export async function getOrdinanceData() {
  const { data, error } = await supabase.from("ward_ordinances").select("*").order("ward")

  if (error) {
    console.error("Error fetching ordinance data:", error)
    return []
  }

  return data
}

export async function getWards() {
  const { data, error } = await supabase.from("ward_ordinances").select("ward").order("ward")

  if (error) {
    console.error("Error fetching wards:", error)
    return []
  }

  return data.map((item) => item.ward)
}

