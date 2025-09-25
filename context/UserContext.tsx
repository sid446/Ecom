"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react"

// Define the UserProfile type
interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
}

// Define the shape of the context value
interface UserContextType {
  userInfo: UserProfile | null
  isAuthenticated: boolean
  authLoading: boolean // We'll use this to prevent UI flashes
  error: string | null
  loginWithOtp: (email: string, otp: string) => Promise<void>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null)
  // --- NEW: Start with loading true to check for a session ---
  const [authLoading, setAuthLoading] = useState<boolean>(true) 
  const [error, setError] = useState<string | null>(null)

  // --- NEW: useEffect to hydrate user from localStorage on initial load ---
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userInfo')
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser))
      }
    } catch (e) {
      console.error("Failed to parse user info from localStorage", e)
      // If parsing fails, ensure the stored item is cleared
      localStorage.removeItem('userInfo')
    } finally {
      // We are done checking, so set loading to false
      setAuthLoading(false)
    }
  }, []) // Empty dependency array means this runs only once on mount

  const isAuthenticated = !!userInfo

  const loginWithOtp = async (email: string, otp: string) => {
    setAuthLoading(true)
    setError(null)
    try {
      // 1. Verify the OTP
      const verifyResponse = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const verifyData = await verifyResponse.json()
      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || "Invalid OTP")
      }

      // 2. Fetch user data
      const userResponse = await fetch("/api/users")
      if (!userResponse.ok) throw new Error("Failed to fetch user data")
      const users = (await userResponse.json()) as UserProfile[]
      const user = users.find((u) => u.email === email)

      if (user) {
        setUserInfo(user)
        // --- NEW: Save user to localStorage on successful login ---
        localStorage.setItem('userInfo', JSON.stringify(user))
      } else {
        throw new Error("No account found with this email.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      throw err 
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = () => {
    setUserInfo(null)
    // --- NEW: Remove user from localStorage on logout ---
    localStorage.removeItem('userInfo')
  }
  
  const value = {
    userInfo,
    isAuthenticated,
    authLoading,
    error,
    loginWithOtp,
    logout,
  }

  // --- NEW: Don't render children until the initial auth check is complete ---
  // This prevents a "flash" of the logged-out UI for logged-in users on page refresh.
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-black">
        {/* You can put a full-page spinner here if you like */}
      </div>
    );
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}