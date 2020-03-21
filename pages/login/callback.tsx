import { useRouter } from "next/router"
import { parse } from "querystring"
import { useEffect } from "react"

import { useStore } from "~/stores"

import SplashLayout from "~/layouts/SplashLayout"

const LoginCallbackPage = () => {
  const router = useRouter()
  const store = useStore()

  useEffect(() => {
    const parsed = parse(location.hash.substring(1))

    store.setToken(parsed["access_token"] as string)
    router.push("/filters")
  })

  return (
    <>Redirecting to application...</>
  )
}

LoginCallbackPage.Layout = SplashLayout

export default LoginCallbackPage
