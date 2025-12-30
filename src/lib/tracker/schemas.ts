import { z } from 'zod'

export const AttributeTypeSchema = z.enum([
  'boolean',
  'boolean-currency',
  'number',
  'text',
  'dropdown',
])

export const TrackingSheetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const AttributeSchema = z
  .object({
    id: z.string().uuid(),
    sheetId: z.string().uuid(),
    name: z.string().min(1).max(50),
    type: AttributeTypeSchema,
    currencyValue: z.number().positive().optional(),
    options: z.array(z.string().min(1)).optional(),
    position: z.number().int().min(0),
  })
  .refine(
    (data) => {
      // currencyValue required for boolean-currency
      if (
        data.type === 'boolean-currency' &&
        data.currencyValue === undefined
      ) {
        return false
      }
      // options required for dropdown
      if (data.type === 'dropdown' && (!data.options || data.options.length === 0)) {
        return false
      }
      return true
    },
    { message: 'Invalid attribute configuration' }
  )

export const EntitySchema = z.object({
  id: z.string().uuid(),
  sheetId: z.string().uuid(),
  name: z.string().min(1).max(100),
  position: z.number().int().min(0),
})

export const CellValueSchema = z.object({
  id: z.string().uuid(),
  entityId: z.string().uuid(),
  attributeId: z.string().uuid(),
  value: z.union([z.boolean(), z.number(), z.string(), z.null()]),
})

export const BackupDataSchema = z.object({
  version: z.number().int().positive(),
  timestamp: z.string().datetime(),
  sheets: z.array(TrackingSheetSchema),
  attributes: z.array(AttributeSchema),
  entities: z.array(EntitySchema),
  cellValues: z.array(CellValueSchema),
})

// Input schemas for creating new records
export const CreateSheetInputSchema = z.object({
  name: z.string().min(1).max(100),
})

export const CreateAttributeInputSchema = z.object({
  sheetId: z.string().uuid(),
  name: z.string().min(1).max(50),
  type: AttributeTypeSchema,
  currencyValue: z.number().positive().optional(),
  options: z.array(z.string().min(1)).optional(),
})

export const CreateEntityInputSchema = z.object({
  sheetId: z.string().uuid(),
  name: z.string().min(1).max(100),
})

export const BulkCreateEntitiesInputSchema = z.object({
  sheetId: z.string().uuid(),
  names: z.array(z.string().min(1).max(100)).min(1),
})

export const UpdateCellValueInputSchema = z.object({
  entityId: z.string().uuid(),
  attributeId: z.string().uuid(),
  value: z.union([z.boolean(), z.number(), z.string(), z.null()]),
})
