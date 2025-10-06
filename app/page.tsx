import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Users, BarChart3, Shield, Clock, Smartphone } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AttendEase</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-chart-1 rounded-full animate-pulse"></span>
            Trusted by 500+ schools worldwide
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Modern Attendance Management for Schools</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Streamline attendance tracking, reduce administrative burden, and gain real-time insights into student
            presence with our intuitive platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage attendance</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for educational institutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
              <p className="text-muted-foreground">
                Mark attendance instantly with our intuitive interface. Updates sync across all devices in real-time.
              </p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-chart-1" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Class Management</h3>
              <p className="text-muted-foreground">
                Manage multiple classes, teachers, and students from a single dashboard with role-based access.
              </p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Generate detailed reports and visualize attendance patterns with interactive charts and graphs.
              </p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-chart-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with data encryption and compliance with educational data protection
                standards.
              </p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Optimized</h3>
              <p className="text-muted-foreground">
                Works seamlessly on tablets and smartphones. Perfect for teachers on the go.
              </p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
              <p className="text-muted-foreground">
                Get started in minutes. Import your student data and start tracking attendance immediately.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your school's needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">Perfect for small schools</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Up to 100 students</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">5 teachers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Basic reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              <Link href="/register?plan=starter">
                <Button variant="outline" className="w-full bg-transparent">
                  Get Started
                </Button>
              </Link>
            </Card>
            <Card className="p-8 border-primary shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$149</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">For growing institutions</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Up to 500 students</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited teachers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Custom branding</span>
                </li>
              </ul>
              <Link href="/register?plan=professional">
                <Button className="w-full">Get Started</Button>
              </Link>
            </Card>
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <p className="text-muted-foreground mb-6">For large organizations</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited students</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited teachers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Custom integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                  <span className="text-sm">SLA guarantee</span>
                </li>
              </ul>
              <Link href="/register?plan=enterprise">
                <Button variant="outline" className="w-full bg-transparent">
                  Contact Sales
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your attendance tracking?</h2>
          <p className="text-lg text-muted-foreground mb-8">Join hundreds of schools already using AttendEase</p>
          <Link href="/register">
            <Button size="lg">Start Your Free Trial</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">AttendEase</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern attendance management for educational institutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 AttendEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
