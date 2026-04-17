import { validateStellarAddress, parseStellarError, buildContractIssuanceXDR, server } from '../stellar'
import { vi } from 'vitest'
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

  describe('Contract Helpers', () => {
    it('should build issuance XDR correctly (mocked)', async () => {
      const institution = Keypair.random().publicKey()
      const student = Keypair.random().publicKey()
      
      // Mock server.loadAccount
      vi.spyOn(server, 'loadAccount').mockResolvedValue({
        sequenceNumber: () => "1",
        accountId: () => institution,
        sequence: "1",
      } as any)

      const xdr = await buildContractIssuanceXDR(
        institution,
        student,
        'hash123',
        '{}'
      )
      
      expect(xdr).toBeDefined()
      expect(typeof xdr).toBe('string')
    })
  })
})
