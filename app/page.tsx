import { redirect } from "next/navigation"
import dotenv from "dotenv"
dotenv.config()

export default function Home() {
  redirect("/dashboard")
}
