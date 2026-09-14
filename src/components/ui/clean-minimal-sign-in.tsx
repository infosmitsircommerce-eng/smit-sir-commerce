"use client"

import * as React from "react"
import { useState } from "react"
import { Loader2, Lock, LogIn, Mail } from "lucide-react"

type SignIn2Props = {
  onSignIn?: (email: string, password: string) => void | Promise<void>
  onForgotPassword?: (email: string) => void | Promise<void>
  onCreateAccount?: () => void
  loading?: boolean
  externalError?: string
  successMessage?: string
  title?: string
  description?: string
  showSocial?: boolean
}

const SignIn2 = ({
  onSignIn,
  onForgotPassword,
  onCreateAccount,
  loading = false,
  externalError = "",
  successMessage = "",
  title = "Sign in with email",
  description = "Access your notes, quizzes, tests and Premium study tools in one place.",
  showSocial = true,
}: SignIn2Props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [resetMessage, setResetMessage] = useState("")

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSignIn = async () => {
    setResetMessage("")
    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }
    setError("")
    if (onSignIn) {
      await onSignIn(email, password)
      return
    }
    alert("Sign in successful! (Demo)")
  }

  const handleForgotPassword = async () => {
    setResetMessage("")
    if (!email || !validateEmail(email)) {
      setError("Enter your valid email first, then tap Forgot password.")
      return
    }
    setError("")
    if (onForgotPassword) {
      await onForgotPassword(email)
      setResetMessage("If this email is registered, a password-reset link has been sent.")
    }
  }

  const visibleError = externalError || error

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 py-10 relative z-[1]">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-blue-100 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg">
          <LogIn className="w-7 h-7 text-black" />
        </div>

        <h1 className="text-2xl font-semibold mb-2 text-center">{title}</h1>
        <p className="text-gray-500 text-sm mb-6 text-center leading-6">{description}</p>

        <form
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault()
            void handleSignIn()
          }}
        >
          <div className="w-full flex flex-col gap-3 mb-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                aria-label="Email"
                autoComplete="email"
                placeholder="Email"
                type="email"
                value={email}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                aria-label="Password"
                autoComplete="current-password"
                placeholder="Password"
                type="password"
                value={password}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="w-full flex items-start justify-between gap-3 min-h-5">
              <div className="flex-1">
                {visibleError ? <p role="alert" className="text-xs text-red-500 leading-5">{visibleError}</p> : null}
                {!visibleError && resetMessage ? <p role="status" className="text-xs text-emerald-600 leading-5">{resetMessage}</p> : null}
                {!visibleError && !resetMessage && successMessage ? <p role="status" className="text-xs text-emerald-600 leading-5">{successMessage}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => void handleForgotPassword()}
                className="text-xs hover:underline font-medium whitespace-nowrap"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2.5 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-4 mt-2 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Get Started"}
          </button>
        </form>

        {showSocial ? (
          <>
            <div className="flex items-center w-full my-2">
              <div className="flex-grow border-t border-dashed border-gray-200" />
              <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
              <div className="flex-grow border-t border-dashed border-gray-200" />
            </div>

            <div className="flex gap-3 w-full justify-center mt-2">
              <button type="button" disabled title="Google sign-in is not configured yet" className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white transition grow opacity-55 cursor-not-allowed">
                <img src="https://cdn.21st.dev/assets/mirror/38/38146bfd9eff6dbf0d74771f2e625c70d87d3770e0d080dbb6e50db1d5403f46.svg" alt="Google" className="w-6 h-6" />
              </button>
              <button type="button" disabled title="Facebook sign-in is not configured yet" className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white transition grow opacity-55 cursor-not-allowed">
                <img src="https://cdn.21st.dev/assets/mirror/49/49c99a2bb048f4c4941540ccf601621071669cdd1f51e52312a412f23bb2d5fa.svg" alt="Facebook" className="w-6 h-6" />
              </button>
              <button type="button" disabled title="Apple sign-in is not configured yet" className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white transition grow opacity-55 cursor-not-allowed">
                <img src="https://cdn.21st.dev/assets/mirror/c2/c221b3f2143cf5d8d85a3b68da84dbae21b18db4164e63ca8c07c6ffdbb922c4.svg" alt="Apple" className="w-6 h-6" />
              </button>
            </div>
          </>
        ) : null}

        {onCreateAccount ? (
          <p className="text-center text-gray-500 text-xs mt-6">
            New to Smit Sir Commerce?{" "}
            <button type="button" onClick={onCreateAccount} className="text-gray-900 hover:underline font-semibold">
              Create account
            </button>
          </p>
        ) : null}
      </div>
    </div>
  )
}

export { SignIn2 }
