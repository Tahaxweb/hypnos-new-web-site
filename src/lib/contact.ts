export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<'name' | 'email' | 'phone' | 'message' | 'consent', string>>
  values?: Record<string, string>
}
