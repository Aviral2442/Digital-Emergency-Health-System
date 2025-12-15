type CurrencyType = '₹' | '$' | '€'

export const currency: CurrencyType = '$'

export const currentYear = new Date().getFullYear()

export const appName = 'DEHS'
export const appTitle = 'DEHS - Digital Education Health System'
export const appDescription: string =
  'DEHS stands for Digital Education Health System'
export const author: string = 'DEHS'
export const authorWebsite: string = 'IME.com'
export const authorContact: string = ''

export const basePath = (import.meta as any).env?.VITE_PATH ?? "";
export const baseURL = (import.meta as any).env?.base_Path ?? "";
