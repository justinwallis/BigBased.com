"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  getUserRecoveryMethods,
  addSecurityQuestions,
  addRecoveryEmail,
  addRecoveryPhone,
  deleteRecoveryMethod,
  setPrimaryRecoveryMethod,
} from "@/app/actions/recovery-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Shield,
  Star,
  Trash2,
  HelpCircle,
  ArrowLeft,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { redirect } from "next/navigation"
import Link from "next/link"

export function RecoveryMethodsClientPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [recoveryMethods, setRecoveryMethods] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("existing")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Security questions form state
  const [questions, setQuestions] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ])
  const [isAddingQuestions, setIsAddingQuestions] = useState(false)

  // Recovery email form state
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [isAddingEmail, setIsAddingEmail] = useState(false)

  // Recovery phone form state
  const [recoveryPhone, setRecoveryPhone] = useState("")
  const [isAddingPhone, setIsAddingPhone] = useState(false)

  // Load recovery methods
  useEffect(() => {
    async function loadRecoveryMethods() {
      if (!user) return

      try {
        setIsLoading(true)
        const result = await getUserRecoveryMethods()
        if (result.success) {
          setRecoveryMethods(result.data || [])
        } else {
          setError(result.error || "Failed to load recovery methods")
        }
      } catch (err) {
        console.error("Error loading recovery methods:", err)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadRecoveryMethods()
    } else if (!authLoading) {
      // Redirect to home if not logged in
      redirect("/")
    }
  }, [user, authLoading])

  // Handle security questions form submission
  const handleAddSecurityQuestions = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate questions and answers
    const isValid = questions.every((q) => q.question.trim() && q.answer.trim())
    if (!isValid) {
      setError("Please fill in all questions and answers")
      return
    }

    try {
      setIsAddingQuestions(true)
      const result = await addSecurityQuestions(questions)
      if (result.success) {
        setSuccess("Security questions added successfully")
        // Refresh recovery methods
        const methodsResult = await getUserRecoveryMethods()
        if (methodsResult.success) {
          setRecoveryMethods(methodsResult.data || [])
        }
        setActiveTab("existing")
        // Reset form
        setQuestions([
          { question: "", answer: "" },
          { question: "", answer: "" },
          { question: "", answer: "" },
        ])
      } else {
        setError(result.error || "Failed to add security questions")
      }
    } catch (err) {
      console.error("Error adding security questions:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsAddingQuestions(false)
    }
  }

  // Handle recovery email form submission
  const handleAddRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate email
    if (!recoveryEmail.trim() || !recoveryEmail.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setIsAddingEmail(true)
      const result = await addRecoveryEmail(recoveryEmail)
      if (result.success) {
        setSuccess("Recovery email added successfully")
        // Refresh recovery methods
        const methodsResult = await getUserRecoveryMethods()
        if (methodsResult.success) {
          setRecoveryMethods(methodsResult.data || [])
        }
        setActiveTab("existing")
        // Reset form
        setRecoveryEmail("")
      } else {
        setError(result.error || "Failed to add recovery email")
      }
    } catch (err) {
      console.error("Error adding recovery email:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsAddingEmail(false)
    }
  }

  // Handle recovery phone form submission
  const handleAddRecoveryPhone = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate phone
    if (!recoveryPhone.trim()) {
      setError("Please enter a valid phone number")
      return
    }

    try {
      setIsAddingPhone(true)
      const result = await addRecoveryPhone(recoveryPhone)
      if (result.success) {
        setSuccess("Recovery phone added successfully")
        // Refresh recovery methods
        const methodsResult = await getUserRecoveryMethods()
        if (methodsResult.success) {
          setRecoveryMethods(methodsResult.data || [])
        }
        setActiveTab("existing")
        // Reset form
        setRecoveryPhone("")
      } else {
        setError(result.error || "Failed to add recovery phone")
      }
    } catch (err) {
      console.error("Error adding recovery phone:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsAddingPhone(false)
    }
  }

  // Handle delete recovery method
  const handleDeleteMethod = async (methodId: number) => {
    if (!confirm("Are you sure you want to delete this recovery method?")) {
      return
    }

    setError(null)
    setSuccess(null)

    try {
      const result = await deleteRecoveryMethod(methodId)
      if (result.success) {
        setSuccess("Recovery method deleted successfully")
        // Refresh recovery methods
        const methodsResult = await getUserRecoveryMethods()
        if (methodsResult.success) {
          setRecoveryMethods(methodsResult.data || [])
        }
      } else {
        setError(result.error || "Failed to delete recovery method")
      }
    } catch (err) {
      console.error("Error deleting recovery method:", err)
      setError("An unexpected error occurred")
    }
  }

  // Handle set primary recovery method
  const handleSetPrimary = async (methodId: number) => {
    setError(null)
    setSuccess(null)

    try {
      const result = await setPrimaryRecoveryMethod(methodId)
      if (result.success) {
        setSuccess("Primary recovery method updated successfully")
        // Refresh recovery methods
        const methodsResult = await getUserRecoveryMethods()
        if (methodsResult.success) {
          setRecoveryMethods(methodsResult.data || [])
        }
      } else {
        setError(result.error || "Failed to update primary recovery method")
      }
    } catch (err) {
      console.error("Error setting primary recovery method:", err)
      setError("An unexpected error occurred")
    }
  }

  // Update question or answer
  const handleQuestionChange = (index: number, field: "question" | "answer", value: string) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  if (authLoading || (isLoading && user)) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading recovery methods...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Account Recovery Methods</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Set up recovery methods to regain access to your account if you lose your password or can't access your
          authenticator app.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Methods</TabsTrigger>
            <TabsTrigger value="add">Add Method</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="mt-4">
            {recoveryMethods.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Recovery Methods</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't set up any account recovery methods yet. We recommend setting up at least one method.
                    </p>
                    <Button onClick={() => setActiveTab("add")}>Add Recovery Method</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recoveryMethods.map((method) => (
                  <Card key={method.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {method.method_type === "security_questions" && (
                            <HelpCircle className="h-5 w-5 text-primary" />
                          )}
                          {method.method_type === "recovery_email" && <Mail className="h-5 w-5 text-primary" />}
                          {method.method_type === "phone_number" && <Phone className="h-5 w-5 text-primary" />}
                          <CardTitle className="text-lg">
                            {method.method_type === "security_questions" && "Security Questions"}
                            {method.method_type === "recovery_email" && "Recovery Email"}
                            {method.method_type === "phone_number" && "Recovery Phone"}
                            {method.is_primary && (
                              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Primary
                              </span>
                            )}
                          </CardTitle>
                        </div>
                        <div className="flex gap-2">
                          {!method.is_primary && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetPrimary(method.id)}
                              title="Set as primary"
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMethod(method.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        {method.method_type === "security_questions" &&
                          `${method.details.questions.length} security questions set`}
                        {method.method_type === "recovery_email" && method.details.email}
                        {method.method_type === "phone_number" && method.details.phone_number}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {method.method_type === "security_questions" && (
                        <div className="text-sm">
                          <p className="font-medium mb-2">Your questions:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {method.details.questions.map((q: any) => (
                              <li key={q.id}>{q.question_text}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {method.method_type === "recovery_email" && !method.is_verified && (
                        <div className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Not verified. Please check your email for verification instructions.
                        </div>
                      )}
                      {method.method_type === "phone_number" && !method.is_verified && (
                        <div className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Not verified. Please check your phone for verification instructions.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="questions">Security Questions</TabsTrigger>
                <TabsTrigger value="email">Recovery Email</TabsTrigger>
                <TabsTrigger value="phone">Recovery Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Set Up Security Questions</CardTitle>
                    <CardDescription>
                      Create security questions and answers that only you would know. These will be used to verify your
                      identity if you need to recover your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddSecurityQuestions} className="space-y-4">
                      {questions.map((q, index) => (
                        <div key={index} className="space-y-2">
                          <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                          <Input
                            id={`question-${index}`}
                            value={q.question}
                            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                            placeholder="Enter your security question"
                            required
                          />
                          <Label htmlFor={`answer-${index}`}>Answer</Label>
                          <Input
                            id={`answer-${index}`}
                            value={q.answer}
                            onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                            placeholder="Enter your answer"
                            required
                          />
                        </div>
                      ))}

                      <div className="pt-2">
                        <Button type="submit" disabled={isAddingQuestions} className="w-full">
                          {isAddingQuestions ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Security Questions"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Recovery Email</CardTitle>
                    <CardDescription>
                      Add a secondary email address that can be used to recover your account. This should be different
                      from your primary email.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddRecoveryEmail} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recovery-email">Recovery Email</Label>
                        <Input
                          id="recovery-email"
                          type="email"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          placeholder="Enter a different email address"
                          required
                        />
                      </div>

                      <div className="pt-2">
                        <Button type="submit" disabled={isAddingEmail} className="w-full">
                          {isAddingEmail ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Add Recovery Email"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="phone" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Recovery Phone</CardTitle>
                    <CardDescription>
                      Add a phone number that can be used to recover your account. We'll send a verification code to
                      this number.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddRecoveryPhone} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recovery-phone">Recovery Phone</Label>
                        <Input
                          id="recovery-phone"
                          type="tel"
                          value={recoveryPhone}
                          onChange={(e) => setRecoveryPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>

                      <div className="pt-2">
                        <Button type="submit" disabled={isAddingPhone} className="w-full">
                          {isAddingPhone ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Add Recovery Phone"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
