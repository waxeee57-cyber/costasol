const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

export const generateBookingCode = (): string => {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return `CSR-${code}`
}
