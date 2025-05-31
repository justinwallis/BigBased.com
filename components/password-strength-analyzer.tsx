"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle, Zap } from "lucide-react"

export function PasswordStrengthAnalyzer() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [analysis, setAnalysis] = useState({
    score: 0,
    strength: "Very Weak",
    color: "red",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      common: true,
      repeated: false,
    },
    timeToCrack: "Instantly",
    suggestions: [],
  })

  useEffect(() => {
    analyzePassword(password)
  }, [password])

  const analyzePassword = (pwd: string) => {
    const checks = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      symbols: /[^A-Za-z0-9]/.test(pwd),
      common: !isCommonPassword(pwd),
      repeated: !hasRepeatedPatterns(pwd),
    }

    const score = calculateScore(pwd, checks)
    const strength = getStrengthLabel(score)
    const color = getStrengthColor(score)
    const timeToCrack = estimateTimeToCrack(pwd, score)
    const suggestions = generateSuggestions(checks, pwd)

    setAnalysis({
      score,
      strength,
      color,
      checks,
      timeToCrack,
      suggestions,
    })
  }

  const calculateScore = (pwd: string, checks: any) => {
    let score = 0

    // Length scoring
    if (pwd.length >= 8) score += 20
    if (pwd.length >= 12) score += 10
    if (pwd.length >= 16) score += 10

    // Character variety
    if (checks.uppercase) score += 10
    if (checks.lowercase) score += 10
    if (checks.numbers) score += 10
    if (checks.symbols) score += 15

    // Bonus points
    if (checks.common) score += 10
    if (checks.repeated) score += 5

    // Entropy bonus for longer passwords
    if (pwd.length > 20) score += 10

    return Math.min(score, 100)
  }

  const getStrengthLabel = (score: number) => {
    if (score >= 80) return "Very Strong"
    if (score >= 60) return "Strong"
    if (score >= 40) return "Moderate"
    if (score >= 20) return "Weak"
    return "Very Weak"
  }

  const getStrengthColor = (score: number) => {
    if (score >= 80) return "green"
    if (score >= 60) return "blue"
    if (score >= 40) return "yellow"
    if (score >= 20) return "orange"
    return "red"
  }

  const estimateTimeToCrack = (pwd: string, score: number) => {
    if (score >= 80) return "Centuries"
    if (score >= 60) return "Years"
    if (score >= 40) return "Months"
    if (score >= 20) return "Days"
    return "Minutes"
  }

  const isCommonPassword = (pwd: string) => {
    const common = [
      "password",
      "123456",
      "password123",
      "admin",
      "qwerty",
      "letmein",
      "welcome",
      "monkey",
      "dragon",
      "master",
    ]
    return common.some((c) => pwd.toLowerCase().includes(c))
  }

  const hasRepeatedPatterns = (pwd: string) => {
    // Check for repeated characters (3+ in a row)
    if (/(.)\1{2,}/.test(pwd)) return true

    // Check for keyboard patterns
    const patterns = ["qwerty", "asdf", "zxcv", "123456", "abcdef"]
    return patterns.some((pattern) => pwd.toLowerCase().includes(pattern))
  }

  const generateSuggestions = (checks: any, pwd: string) => {
    const suggestions = []

    if (!checks.length) suggestions.push("Use at least 12 characters")
    if (!checks.uppercase) suggestions.push("Add uppercase letters")
    if (!checks.lowercase) suggestions.push("Add lowercase letters")
    if (!checks.numbers) suggestions.push("Include numbers")
    if (!checks.symbols) suggestions.push("Add special characters (!@#$%)")
    if (!checks.common) suggestions.push("Avoid common passwords")
    if (!checks.repeated) suggestions.push("Avoid repeated patterns")

    return suggestions
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Password Strength Analyzer
        </CardTitle>
        <CardDescription>Test your password strength and get improvement suggestions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="test-password">Test Password</Label>
          <div className="relative">
            <Input
              id="test-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password to analyze..."
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {password && (
          <>
            {/* Strength Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold text-${analysis.color}-600`}>{analysis.score}/100</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{analysis.strength}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Time to crack:</div>
                  <div className={`text-lg font-bold text-${analysis.color}-600`}>{analysis.timeToCrack}</div>
                </div>
              </div>
              <Progress value={analysis.score} className="h-3" />
            </div>

            {/* Security Checks */}
            <div className="space-y-3">
              <h4 className="font-medium">Security Checks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(analysis.checks).map(([key, passed]) => (
                  <div key={key} className="flex items-center gap-2">
                    {passed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Suggestions
                </h4>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
