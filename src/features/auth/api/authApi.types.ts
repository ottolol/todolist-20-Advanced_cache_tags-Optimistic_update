import type { Inputs } from "@/features/auth/lib/schemas"

export type LoginArgs = Inputs & {
  captcha: string
}

export type CaptchaResponse = {
  url: string
} 