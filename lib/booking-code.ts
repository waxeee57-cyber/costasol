import { randomInt } from 'crypto'

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

export const generateBookingCode = (): string => {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)]
  }
  return `CSR-${code}`
}
