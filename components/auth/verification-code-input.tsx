"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface VerificationCodeInputProps {
  length: number
  onChange: (code: string) => void
  onComplete?: (code: string) => void
  inputMode?: "numeric" | "text"
  disabled?: boolean
  className?: string
  inputClassName?: string
  containerClassName?: string
  autoFocus?: boolean
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  length,
  onChange,
  onComplete,
  inputMode = "numeric",
  disabled = false,
  className = "",
  inputClassName = "",
  containerClassName = "",
  autoFocus = true,
}) => {
  const [code, setCode] = useState(Array(length).fill(""))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus()
    }
  }, [autoFocus])

  const handleChange = (index: number, value: string) => {
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    onChange(newCode.join(""))

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (onComplete && newCode.every(Boolean)) {
      onComplete(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className={`flex ${containerClassName}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          inputMode={inputMode}
          disabled={disabled}
          className={`w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500 ${inputClassName} ${className}`}
          value={code[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      ))}
    </div>
  )
}

export default VerificationCodeInput
