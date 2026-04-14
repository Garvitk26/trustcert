import { describe, it, expect } from 'vitest'
import { generateCertId, calculateCertHash, cn } from '../utils'

describe('TrustCert Utils', () => {
  describe('generateCertId', () => {
    it('should generate an ID starting with the default prefix TC', () => {
      const id = generateCertId()
      expect(id.startsWith('TC-')).toBe(true)
    })

    it('should generate an ID with a custom prefix', () => {
      const id = generateCertId('TEST')
      expect(id.startsWith('TEST-')).toBe(true)
    })

    it('should generate unique IDs', () => {
      const id1 = generateCertId()
      const id2 = generateCertId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('calculateCertHash', () => {
    it('should generate a consistent SHA-256 hash for the same input', async () => {
      const data = {
        studentName: 'John Doe',
        courseName: 'Blockchain 101',
        issueDate: '2024-01-01',
        institutionName: 'Stellar Academy'
      }
      const hash1 = await calculateCertHash(data)
      const hash2 = await calculateCertHash(data)
      expect(hash1).toBe(hash2)
      expect(hash1.length).toBe(64) // 256 bits in hex
    })

    it('should generate different hashes for different data', async () => {
      const data1 = { studentName: 'Alice', courseName: 'Course 1', issueDate: '2024-01-01', institutionName: 'I1' }
      const data2 = { studentName: 'Bob', courseName: 'Course 1', issueDate: '2024-01-01', institutionName: 'I1' }
      const hash1 = await calculateCertHash(data1)
      const hash2 = await calculateCertHash(data2)
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('cn', () => {
    it('should merge tailwind classes correctly', () => {
      const result = cn('text-red-500', 'text-blue-500')
      expect(result).toBe('text-blue-500') // twMerge should prefer the last one
    })

    it('should handle conditional classes', () => {
      const result = cn('p-4', true && 'bg-black', false && 'text-white')
      expect(result).toContain('p-4')
      expect(result).toContain('bg-black')
      expect(result).not.toContain('text-white')
    })
  })
})
