"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  CalendarIcon,
  Plus,
  X,
  Eye,
  EyeOff,
  Home,
  Award,
  Music,
  Quote,
} from "lucide-react"

interface ExpandedProfileFormProps {
  formData: any
  onInputChange: (field: string, value: any) => void
  onSave: (e: React.FormEvent) => void
  isSaving: boolean
  saveMessage: string
}

export function ExpandedProfileForm({
  formData,
  onInputChange,
  onSave,
  isSaving,
  saveMessage,
}: ExpandedProfileFormProps) {
  const [activeSection, setActiveSection] = useState("basic")
  const [showPrivacySettings, setShowPrivacySettings] = useState(false)

  // Helper function to handle nested object updates
  const handleNestedChange = (section: string, field: string, value: any) => {
    onInputChange(section, {
      ...formData[section],
      [field]: value,
    })
  }

  // Helper function to add items to arrays
  const addArrayItem = (section: string, field: string, newItem: any) => {
    const currentArray = formData[section]?.[field] || []
    handleNestedChange(section, field, [...currentArray, newItem])
  }

  // Helper function to remove items from arrays
  const removeArrayItem = (section: string, field: string, index: number) => {
    const currentArray = formData[section]?.[field] || []
    handleNestedChange(
      section,
      field,
      currentArray.filter((_: any, i: number) => i !== index),
    )
  }

  // Helper function to update array items
  const updateArrayItem = (section: string, field: string, index: number, newItem: any) => {
    const currentArray = formData[section]?.[field] || []
    const updatedArray = [...currentArray]
    updatedArray[index] = newItem
    handleNestedChange(section, field, updatedArray)
  }

  const sections = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "contact", label: "Contact & Location", icon: MapPin },
    { id: "work", label: "Work & Education", icon: Briefcase },
    { id: "personal", label: "Personal Details", icon: Heart },
    { id: "interests", label: "Interests & Hobbies", icon: Music },
    { id: "life_events", label: "Life Events", icon: Award },
    { id: "quotes", label: "Favorite Quotes", icon: Quote },
  ]

  const relationshipOptions = [
    "Single",
    "In a relationship",
    "Engaged",
    "Married",
    "It's complicated",
    "In an open relationship",
    "Widowed",
    "Separated",
    "Divorced",
    "In a civil union",
    "In a domestic partnership",
  ]

  const politicalViews = [
    "Conservative",
    "Liberal",
    "Moderate",
    "Libertarian",
    "Progressive",
    "Independent",
    "Apolitical",
    "Other",
  ]

  const religiousViews = [
    "Christian",
    "Catholic",
    "Protestant",
    "Orthodox",
    "Jewish",
    "Muslim",
    "Hindu",
    "Buddhist",
    "Atheist",
    "Agnostic",
    "Spiritual",
    "Other",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Complete Profile Information</span>
          <Button variant="outline" size="sm" onClick={() => setShowPrivacySettings(!showPrivacySettings)}>
            {showPrivacySettings ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            Privacy
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSave} className="space-y-6">
          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Button
                  key={section.id}
                  type="button"
                  variant={activeSection === section.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSection(section.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </Button>
              )
            })}
          </div>

          {/* Basic Information */}
          {activeSection === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.personal_info?.first_name || ""}
                    onChange={(e) => handleNestedChange("personal_info", "first_name", e.target.value)}
                    placeholder="Your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.personal_info?.last_name || ""}
                    onChange={(e) => handleNestedChange("personal_info", "last_name", e.target.value)}
                    placeholder="Your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    value={formData.personal_info?.middle_name || ""}
                    onChange={(e) => handleNestedChange("personal_info", "middle_name", e.target.value)}
                    placeholder="Your middle name (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    value={formData.personal_info?.nickname || ""}
                    onChange={(e) => handleNestedChange("personal_info", "nickname", e.target.value)}
                    placeholder="What people call you"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.personal_info?.birthday
                        ? format(new Date(formData.personal_info.birthday), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        formData.personal_info?.birthday ? new Date(formData.personal_info.birthday) : undefined
                      }
                      onSelect={(date) => handleNestedChange("personal_info", "birthday", date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.personal_info?.gender || ""}
                    onValueChange={(value) => handleNestedChange("personal_info", "gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(formData.personal_info?.languages || []).map((language: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {language}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeArrayItem("personal_info", "languages", index)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a language"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value) {
                          addArrayItem("personal_info", "languages", value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a language"]') as HTMLInputElement
                      const value = input?.value.trim()
                      if (value) {
                        addArrayItem("personal_info", "languages", value)
                        input.value = ""
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Contact & Location */}
          {activeSection === "contact" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.contact_info?.phone || ""}
                    onChange={(e) => handleNestedChange("contact_info", "phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt_email">Alternative Email</Label>
                  <Input
                    id="alt_email"
                    type="email"
                    value={formData.contact_info?.alt_email || ""}
                    onChange={(e) => handleNestedChange("contact_info", "alt_email", e.target.value)}
                    placeholder="alternative@email.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Current Location
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_city">City</Label>
                    <Input
                      id="current_city"
                      value={formData.location?.current_city || ""}
                      onChange={(e) => handleNestedChange("location", "current_city", e.target.value)}
                      placeholder="Current city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_state">State/Province</Label>
                    <Input
                      id="current_state"
                      value={formData.location?.current_state || ""}
                      onChange={(e) => handleNestedChange("location", "current_state", e.target.value)}
                      placeholder="State or province"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_country">Country</Label>
                    <Input
                      id="current_country"
                      value={formData.location?.current_country || ""}
                      onChange={(e) => handleNestedChange("location", "current_country", e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP/Postal Code</Label>
                    <Input
                      id="zip_code"
                      value={formData.location?.zip_code || ""}
                      onChange={(e) => handleNestedChange("location", "zip_code", e.target.value)}
                      placeholder="ZIP or postal code"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Hometown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hometown_city">City</Label>
                    <Input
                      id="hometown_city"
                      value={formData.location?.hometown_city || ""}
                      onChange={(e) => handleNestedChange("location", "hometown_city", e.target.value)}
                      placeholder="Where you grew up"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hometown_state">State/Province</Label>
                    <Input
                      id="hometown_state"
                      value={formData.location?.hometown_state || ""}
                      onChange={(e) => handleNestedChange("location", "hometown_state", e.target.value)}
                      placeholder="Hometown state/province"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Work & Education */}
          {activeSection === "work" && (
            <div className="space-y-6">
              {/* Work Experience */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Work Experience
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addArrayItem("work_education", "work_experience", {
                        company: "",
                        position: "",
                        start_date: "",
                        end_date: "",
                        current: false,
                        description: "",
                        location: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Job
                  </Button>
                </div>

                {(formData.work_education?.work_experience || []).map((job: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">Job {index + 1}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem("work_education", "work_experience", index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Company name"
                          value={job.company || ""}
                          onChange={(e) =>
                            updateArrayItem("work_education", "work_experience", index, {
                              ...job,
                              company: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Position/Title"
                          value={job.position || ""}
                          onChange={(e) =>
                            updateArrayItem("work_education", "work_experience", index, {
                              ...job,
                              position: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Location"
                          value={job.location || ""}
                          onChange={(e) =>
                            updateArrayItem("work_education", "work_experience", index, {
                              ...job,
                              location: e.target.value,
                            })
                          }
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`current-${index}`}
                            checked={job.current || false}
                            onCheckedChange={(checked) =>
                              updateArrayItem("work_education", "work_experience", index, {
                                ...job,
                                current: checked,
                              })
                            }
                          />
                          <Label htmlFor={`current-${index}`}>Current job</Label>
                        </div>
                      </div>
                      <Textarea
                        placeholder="Job description"
                        value={job.description || ""}
                        onChange={(e) =>
                          updateArrayItem("work_education", "work_experience", index, {
                            ...job,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                      />
                    </div>
                  </Card>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addArrayItem("work_education", "education", {
                        school: "",
                        degree: "",
                        field_of_study: "",
                        start_year: "",
                        end_year: "",
                        current: false,
                        description: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add School
                  </Button>
                </div>

                {(formData.work_education?.education || []).map((school: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="font-medium">Education {index + 1}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem("work_education", "education", index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="School name"
                          value={school.school || ""}
                          onChange={(e) =>
                            updateArrayItem("work_education", "education", index, {
                              ...school,
                              school: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Degree"
                          value={school.degree || ""}
                          onChange={(e) =>
                            updateArrayItem("work_education", "education", index, {
                              ...school,
                              degree: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Field of study"
                          value={school.field_of_study || ""}
                          onChange={(e) =>
                            updateArrayItem("work_education", "education", index, {
                              ...school,
                              field_of_study: e.target.value,
                            })
                          }
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`current-edu-${index}`}
                            checked={school.current || false}
                            onCheckedChange={(checked) =>
                              updateArrayItem("work_education", "education", index, {
                                ...school,
                                current: checked,
                              })
                            }
                          />
                          <Label htmlFor={`current-edu-${index}`}>Currently attending</Label>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Professional Skills</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(formData.work_education?.skills || []).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeArrayItem("work_education", "skills", index)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value) {
                          addArrayItem("work_education", "skills", value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a skill"]') as HTMLInputElement
                      const value = input?.value.trim()
                      if (value) {
                        addArrayItem("work_education", "skills", value)
                        input.value = ""
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Personal Details */}
          {activeSection === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relationship_status">Relationship Status</Label>
                  <Select
                    value={formData.personal_details?.relationship_status || ""}
                    onValueChange={(value) => handleNestedChange("personal_details", "relationship_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipOptions.map((option) => (
                        <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, "_")}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="looking_for">Looking For</Label>
                  <Input
                    id="looking_for"
                    value={formData.personal_details?.looking_for || ""}
                    onChange={(e) => handleNestedChange("personal_details", "looking_for", e.target.value)}
                    placeholder="e.g., Friendship, Networking, Dating"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="political_views">Political Views</Label>
                  <Select
                    value={formData.personal_details?.political_views || ""}
                    onValueChange={(value) => handleNestedChange("personal_details", "political_views", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select political views" />
                    </SelectTrigger>
                    <SelectContent>
                      {politicalViews.map((view) => (
                        <SelectItem key={view} value={view.toLowerCase()}>
                          {view}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religious_views">Religious Views</Label>
                  <Select
                    value={formData.personal_details?.religious_views || ""}
                    onValueChange={(value) => handleNestedChange("personal_details", "religious_views", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select religious views" />
                    </SelectTrigger>
                    <SelectContent>
                      {religiousViews.map((view) => (
                        <SelectItem key={view} value={view.toLowerCase()}>
                          {view}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_me">About Me</Label>
                <Textarea
                  id="about_me"
                  value={formData.personal_details?.about_me || ""}
                  onChange={(e) => handleNestedChange("personal_details", "about_me", e.target.value)}
                  placeholder="Tell people about yourself, your interests, and what makes you unique..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Family Members</Label>
                <div className="space-y-2">
                  {(formData.personal_details?.family || []).map((member: any, index: number) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Name"
                        value={member.name || ""}
                        onChange={(e) =>
                          updateArrayItem("personal_details", "family", index, {
                            ...member,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Relationship"
                        value={member.relationship || ""}
                        onChange={(e) =>
                          updateArrayItem("personal_details", "family", index, {
                            ...member,
                            relationship: e.target.value,
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem("personal_details", "family", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("personal_details", "family", { name: "", relationship: "" })}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Family Member
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Interests & Hobbies */}
          {activeSection === "interests" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Interests & Hobbies
                </h4>

                {/* Music */}
                <div className="space-y-2">
                  <Label>Favorite Music</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.interests?.music || []).map((genre: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {genre}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeArrayItem("interests", "music", index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add music genres, artists, or songs"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value) {
                          addArrayItem("interests", "music", value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                </div>

                {/* Movies & TV */}
                <div className="space-y-2">
                  <Label>Movies & TV Shows</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.interests?.movies || []).map((movie: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {movie}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeArrayItem("interests", "movies", index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add favorite movies, TV shows, or genres"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value) {
                          addArrayItem("interests", "movies", value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                </div>

                {/* Books */}
                <div className="space-y-2">
                  <Label>Books & Reading</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.interests?.books || []).map((book: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {book}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeArrayItem("interests", "books", index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add favorite books, authors, or genres"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value) {
                          addArrayItem("interests", "books", value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                </div>

                {/* Sports & Activities */}
                <div className="space-y-2">
                  <Label>Sports & Activities</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.interests?.sports || []).map((sport: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {sport}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeArrayItem("interests", "sports", index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add sports, fitness activities, or outdoor hobbies"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value) {
                          addArrayItem("interests", "sports", value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                </div>

                {/* Games */}
                <div className="space-y-2">
                  <Label>Games & Gaming</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.interests?.games || []).map((game: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {game}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeArrayItem("interests", "games", index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add video games, board games, or gaming platforms"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value) {
                          addArrayItem("interests", "games", value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                </div>

                {/* Other Interests */}
                <div className="space-y-2">
                  <Label>Other Interests</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.interests?.other || []).map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {interest}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeArrayItem("interests", "other", index)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add any other interests or hobbies"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const value = (e.target as HTMLInputElement).value.trim()
                        if (value) {
                          addArrayItem("interests", "other", value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Life Events */}
          {activeSection === "life_events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Life Events & Milestones
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    addArrayItem("life_events", "events", {
                      title: "",
                      description: "",
                      date: "",
                      category: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </div>

              {(formData.life_events?.events || []).map((event: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium">Event {index + 1}</h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem("life_events", "events", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Event title"
                        value={event.title || ""}
                        onChange={(e) =>
                          updateArrayItem("life_events", "events", index, {
                            ...event,
                            title: e.target.value,
                          })
                        }
                      />
                      <Select
                        value={event.category || ""}
                        onValueChange={(value) =>
                          updateArrayItem("life_events", "events", index, {
                            ...event,
                            category: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="achievement">Achievement</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      placeholder="Event description"
                      value={event.description || ""}
                      onChange={(e) =>
                        updateArrayItem("life_events", "events", index, {
                          ...event,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Favorite Quotes */}
          {activeSection === "quotes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Quote className="h-4 w-4" />
                  Favorite Quotes
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    addArrayItem("quotes", "favorite_quotes", {
                      quote: "",
                      author: "",
                      context: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Quote
                </Button>
              </div>

              {(formData.quotes?.favorite_quotes || []).map((quote: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium">Quote {index + 1}</h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem("quotes", "favorite_quotes", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Enter the quote..."
                      value={quote.quote || ""}
                      onChange={(e) =>
                        updateArrayItem("quotes", "favorite_quotes", index, {
                          ...quote,
                          quote: e.target.value,
                        })
                      }
                      rows={3}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Author"
                        value={quote.author || ""}
                        onChange={(e) =>
                          updateArrayItem("quotes", "favorite_quotes", index, {
                            ...quote,
                            author: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Context (optional)"
                        value={quote.context || ""}
                        onChange={(e) =>
                          updateArrayItem("quotes", "favorite_quotes", index, {
                            ...quote,
                            context: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Save Message */}
          {saveMessage && (
            <div
              className={`p-3 rounded-md text-sm ${
                saveMessage.includes("Error")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {saveMessage}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" disabled={isSaving} size="lg">
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
