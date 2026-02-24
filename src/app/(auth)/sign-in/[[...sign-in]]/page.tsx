import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar sesión",
}

export default function SignInPage() {
  return <SignIn />
}
