import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">Check Your Email</h1>
          <p className="text-muted-foreground mb-8">
            We've sent you a confirmation email. Please click the link in the email to verify your account and complete
            the registration.
          </p>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Didn't receive the email? Check your spam folder or contact support.
          </p>
        </Card>
      </div>
    </div>
  )
}
