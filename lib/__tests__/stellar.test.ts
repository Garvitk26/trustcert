import { describe, it, expect } from 'vitest'
import { validateStellarAddress, parseStellarError } from '../stellar'
import { Keypair } from '@stellar/stellar-sdk'

describe('TrustCert Stellar Helpers', () => {
  describe('validateStellarAddress', () => {
    it('should return valid for a correct G-address', () => {
      const address = 'GCCX2LJQ6EQT33SATIITWBFSZIJIYDYJU33MCKHBAK3YG6UQ6JRUYABA'
      const result = validateStellarAddress(address)
      expect(result.valid).toBe(true)
    })

    it('should return invalid for an incorrect format', () => {
      const address = 'INVALID_ADDRESS'
      const result = validateStellarAddress(address)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Invalid Stellar address format')
    })

    it('should return invalid for an empty address', () => {
      const result = validateStellarAddress('')
      expect(result.valid).toBe(false)
    })
  })

  describe('parseStellarError', () => {
    it('should parse underfunded error correctly', () => {
      const mockError = {
        response: {
          data: {
            extras: {
              result_codes: {
                operations: ['op_underfunded']
              }
            }
          }
        }
      }
      expect(parseStellarError(mockError)).toBe('Insufficient XLM balance for this transaction')
    })

    it('should handle custom error messages', () => {
      const mockError = { message: 'Something went wrong' }
      expect(parseStellarError(mockError)).toBe('Something went wrong')
    })
  })
})
