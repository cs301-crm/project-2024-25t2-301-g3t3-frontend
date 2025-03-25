"use client"

import { useState, useRef, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFileChange: (file: File | null) => void
  isUploading: boolean
  setIsUploading: (isUploading: boolean) => void
  maxSizeMB?: number
  acceptedFileTypes?: string[]
}

export function FileUploader({
  onFileChange,
  isUploading,
  setIsUploading,
  maxSizeMB = 10,
  acceptedFileTypes = ["image/jpeg", "image/png", "application/pdf"],
}: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setDragActive(false)

      if (rejectedFiles.length > 0) {
        const rejectionErrors = rejectedFiles[0].errors
        if (rejectionErrors.some((e: any) => e.code === "file-too-large")) {
          setError(`File is too large. Maximum size is ${maxSizeMB}MB.`)
        } else if (rejectionErrors.some((e: any) => e.code === "file-invalid-type")) {
          setError(`Invalid file type. Please upload ${acceptedFileTypes.join(", ")} files.`)
        } else {
          setError("Invalid file. Please try again.")
        }
        return
      }

      if (acceptedFiles.length > 0) {
        setError(null)
        const file = acceptedFiles[0]
        onFileChange(file)
      }
    },
    [maxSizeMB, acceptedFileTypes, onFileChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: maxSizeBytes,
    accept: acceptedFileTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    multiple: false,
  })

  // Add a method to clear the file
  const clearFile = () => {
    onFileChange(null)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  // Replace the existing handleRemoveFile with clearFile
  const handleRemoveFile = clearFile

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-slate-300"}
          ${error ? "border-red-400 bg-red-50" : ""}
          hover:bg-slate-50 cursor-pointer flex flex-col items-center justify-center
        `}
      >
        <input {...getInputProps()} ref={inputRef} />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-slate-400 animate-spin" />
          ) : (
            <div className="p-3 bg-slate-100 rounded-full">
              <Upload className="h-6 w-6 text-slate-500" />
            </div>
          )}

          <div className="space-y-1">
            <p className="text-sm font-medium">{isUploading ? "Uploading file..." : "Drag & drop your file here"}</p>
            <p className="text-xs text-slate-500">
              {isUploading ? "Please wait while we process your file" : `PDF, JPG or PNG up to ${maxSizeMB}MB`}
            </p>
          </div>

          {!isUploading && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
            >
              Select file
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}

