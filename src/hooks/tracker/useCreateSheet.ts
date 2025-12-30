import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { createSheet, addAttribute } from '@/lib/tracker/db'
import type { Attribute } from '@/lib/tracker/types'

export interface CreateSheetFormData {
  name: string
  additionalAttributes?: Array<{
    name: string
    type: Attribute['type']
    currencyValue?: number
    options?: string[]
  }>
}

export function useCreateSheet() {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const createNewSheet = async (data: CreateSheetFormData) => {
    setIsCreating(true)
    setError(null)

    try {
      // Create sheet with default "Điểm danh" attribute
      const sheet = await createSheet(data.name)

      // Add any additional attributes
      if (data.additionalAttributes && data.additionalAttributes.length > 0) {
        for (const attr of data.additionalAttributes) {
          await addAttribute(sheet.id, attr.name, attr.type, {
            currencyValue: attr.currencyValue,
            dropdownOptions: attr.options,
          })
        }
      }

      // Navigate to the sheet view
      router.navigate({
        to: '/tracker/$sheetId',
        params: { sheetId: sheet.id },
      })

      return sheet
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create sheet'
      setError(errorMessage)
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createSheet: createNewSheet,
    isCreating,
    error,
  }
}
