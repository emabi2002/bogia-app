import { z } from 'zod'

// Location schema
export const locationSchema = z.object({
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  llg: z.string().min(1, 'LLG is required'),
  ward: z.string().min(1, 'Ward is required'),
  hamlet: z.string().optional(),
  gps_lat: z.number().optional(),
  gps_lng: z.number().optional(),
  gps_accuracy: z.number().optional(),
})

// Household head schema
export const householdHeadSchema = z.object({
  head_name: z.string().min(1, 'Household head name is required'),
  head_phone: z.string().optional(),
  tenure: z.enum(['owned', 'rented', 'borrowed', 'other']).refine(val => val, {
    message: 'Land tenure is required'
  }),
})

// Individual roster schema
export const individualSchema = z.object({
  name_or_initials: z.string().min(1, 'Name or initials required'),
  sex: z.enum(['male', 'female']).refine(val => val, {
    message: 'Sex is required'
  }),
  dob: z.string().optional(),
  age_years: z.number().min(0).max(120, 'Age must be between 0 and 120').optional(),
  relationship: z.enum([
    'head', 'spouse', 'child', 'parent', 'sibling',
    'grandparent', 'grandchild', 'other_relative', 'non_relative'
  ]).refine(val => val, {
    message: 'Relationship is required'
  }),
  marital_status: z.enum([
    'single', 'married', 'divorced', 'widowed', 'separated'
  ]).optional(),
  in_school: z.boolean().optional(),
  grade_current: z.string().optional(),
  highest_level: z.enum([
    'none', 'primary', 'secondary', 'tertiary', 'vocational'
  ]).optional(),
  livelihood: z.enum([
    'formal', 'informal', 'farmer', 'fisher', 'student',
    'unpaid_care', 'unemployed'
  ]).optional(),
  disability_seeing: z.enum(['none', 'some', 'a_lot', 'cannot']).default('none'),
  disability_hearing: z.enum(['none', 'some', 'a_lot', 'cannot']).default('none'),
  disability_walking: z.enum(['none', 'some', 'a_lot', 'cannot']).default('none'),
  disability_remembering: z.enum(['none', 'some', 'a_lot', 'cannot']).default('none'),
  disability_selfcare: z.enum(['none', 'some', 'a_lot', 'cannot']).default('none'),
  disability_communication: z.enum(['none', 'some', 'a_lot', 'cannot']).default('none'),
  youth_15_35: z.boolean().optional(),
  skills: z.array(z.string()).optional(),
  availability: z.enum(['full', 'part', 'seasonal']).optional(),
  training_need: z.string().optional(),
})

// WASH schema
export const washSchema = z.object({
  water_source: z.enum([
    'piped_water', 'borehole', 'protected_well', 'unprotected_well',
    'surface_water', 'rainwater', 'bottled_water', 'other'
  ]).refine(val => val, {
    message: 'Water source is required'
  }),
  sanitation: z.enum([
    'flush_toilet', 'pit_latrine', 'composting_toilet', 'bucket_toilet',
    'hanging_toilet', 'open_defecation', 'other'
  ]).refine(val => val, {
    message: 'Sanitation facility is required'
  }),
  handwashing_soap: z.boolean().refine(val => typeof val === 'boolean', {
    message: 'Handwashing with soap information is required'
  }),
})

// Energy/ICT schema
export const energyIctSchema = z.object({
  energy_lighting: z.enum([
    'electricity', 'solar', 'generator', 'kerosene', 'candles', 'other'
  ]).refine(val => val, {
    message: 'Lighting source is required'
  }),
  energy_cooking: z.enum([
    'electricity', 'gas', 'firewood', 'charcoal', 'kerosene', 'other'
  ]).refine(val => val, {
    message: 'Cooking energy source is required'
  }),
  mobile_coverage: z.enum([
    'digicel', 'bmobile', 'telikom', 'multiple', 'none'
  ]).refine(val => val, {
    message: 'Mobile coverage information is required'
  }),
  internet_access: z.enum([
    'mobile_data', 'wifi', 'both', 'none'
  ]).refine(val => val, {
    message: 'Internet access information is required'
  }),
  smartphones_count: z.number().min(0, 'Smartphone count cannot be negative').optional(),
})

// Services schema
export const servicesSchema = z.object({
  services_health_mins: z.number().min(0, 'Travel time cannot be negative').optional(),
  services_school_mins: z.number().min(0, 'Travel time cannot be negative').optional(),
  services_police_mins: z.number().min(0, 'Travel time cannot be negative').optional(),
  services_market_mins: z.number().min(0, 'Travel time cannot be negative').optional(),
  road_condition: z.enum(['good_all_year', 'good_dry_only', 'poor_all_year']).refine(val => val, {
    message: 'Road condition is required'
  }),
})

// Youth schema (for individuals aged 15-35)
export const youthSchema = z.object({
  qualifications: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  availability: z.enum(['full', 'part', 'seasonal']).optional(),
  training_need: z.string().optional(),
})

// Complete household schema
export const householdSchema = z.object({
  // Location
  ...locationSchema.shape,

  // Household head
  ...householdHeadSchema.shape,

  // WASH
  ...washSchema.shape,

  // Energy/ICT
  ...energyIctSchema.shape,

  // Services
  ...servicesSchema.shape,

  // Consent and enumerator
  consent: z.boolean().refine(val => val === true, {
    message: 'Consent is required to proceed'
  }),
  enumerator_id: z.string().optional(),

  // Individuals (validated separately)
  individuals: z.array(individualSchema).min(1, 'At least one household member is required'),
})

// Export individual step schemas for wizard
export const stepSchemas = {
  location: locationSchema,
  householdHead: householdHeadSchema,
  wash: washSchema,
  energyIct: energyIctSchema,
  services: servicesSchema,
  youth: youthSchema,
  complete: householdSchema
}

// Types derived from schemas
export type LocationFormData = z.infer<typeof locationSchema>
export type HouseholdHeadFormData = z.infer<typeof householdHeadSchema>
export type IndividualFormData = z.infer<typeof individualSchema>
export type WashFormData = z.infer<typeof washSchema>
export type EnergyIctFormData = z.infer<typeof energyIctSchema>
export type ServicesFormData = z.infer<typeof servicesSchema>
export type YouthFormData = z.infer<typeof youthSchema>
export type HouseholdFormData = z.infer<typeof householdSchema>

// Skill options for youth
export const skillOptions = [
  'carpentry', 'plumbing', 'electrical', 'masonry', 'welding',
  'computer_skills', 'accounting', 'teaching', 'nursing', 'driving',
  'cooking', 'sewing', 'agriculture', 'fishing', 'mechanics',
  'other'
] as const

// Predefined location options (can be replaced with dynamic data)
export const locationOptions = {
  provinces: ['Madang', 'East Sepik', 'West Sepik'],
  districts: {
    'Madang': ['Bogia', 'Madang', 'Middle Ramu', 'Rai Coast', 'Sumkar', 'Usino Bundi'],
    'East Sepik': ['Ambunti Drekikier', 'Angoram', 'Maprik', 'Wewak', 'Wosera Gawi', 'Yangoru Saussia'],
    'West Sepik': ['Aitape Lumi', 'Nuku', 'Telefomin', 'Vanimo Green River']
  } as Record<string, string[]>,
  llgs: {
    'Bogia': ['Almami', 'Bani', 'Bogia', 'Bunu', 'Iabu', 'Tangu'],
  } as Record<string, string[]>
}
