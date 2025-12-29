// Mock uuid module
jest.mock('uuid', () => ({
  v1: jest.fn(() => '00000000-0000-1000-8000-000000000000'),
  v4: jest.fn(() => '00000000-0000-4000-8000-000000000000'),
}))

import { generateHash, generateUUIDs, decodeJWT } from '@/lib/utils/generators'

describe('Generators', () => {
  describe('Hash Generator', () => {
    it('should generate MD5 hash', () => {
      const text = 'test'
      const hash = generateHash(text, 'MD5')
      
      expect(hash).toBe('098f6bcd4621d373cade4e832627b4f6')
      expect(hash.length).toBe(32)
    })

    it('should generate SHA-256 hash', () => {
      const text = 'test'
      const hash = generateHash(text, 'SHA-256')
      
      expect(hash).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
      expect(hash.length).toBe(64)
    })

    it('should generate different hashes for different algorithms', () => {
      const text = 'test'
      const md5 = generateHash(text, 'MD5')
      const sha256 = generateHash(text, 'SHA-256')
      
      expect(md5).not.toBe(sha256)
    })
  })

  describe('UUID Generator', () => {
    it('should generate UUID v4', () => {
      const uuids = generateUUIDs('4', 1)
      
      expect(uuids).toHaveLength(1)
      expect(uuids[0]).toBe('00000000-0000-4000-8000-000000000000')
    })

    it('should generate multiple UUIDs', () => {
      const uuids = generateUUIDs('4', 5)
      
      expect(uuids).toHaveLength(5)
      uuids.forEach(uuid => {
        expect(uuid).toBe('00000000-0000-4000-8000-000000000000')
      })
    })

    it('should generate UUID v1', () => {
      const uuids = generateUUIDs('1', 1)
      
      expect(uuids).toHaveLength(1)
      expect(uuids[0]).toBe('00000000-0000-1000-8000-000000000000')
    })
  })

  describe('JWT Decoder', () => {
    it('should decode valid JWT', () => {
      // This is a test JWT (header.payload.signature)
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ sub: '1234567890', name: 'Test User', iat: 1516239022 }))
      const signature = 'test-signature'
      const token = `${header}.${payload}.${signature}`
      
      const decoded = decodeJWT(token)
      
      expect(decoded.header).toHaveProperty('alg', 'HS256')
      expect(decoded.header).toHaveProperty('typ', 'JWT')
      expect(decoded.payload).toHaveProperty('sub', '1234567890')
      expect(decoded.payload).toHaveProperty('name', 'Test User')
      expect(decoded.signature).toBe(signature)
    })

    it('should detect expired tokens', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const expiredTime = Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
      const payload = btoa(JSON.stringify({ exp: expiredTime }))
      const signature = 'test-signature'
      const token = `${header}.${payload}.${signature}`
      
      const decoded = decodeJWT(token)
      
      expect(decoded.expired).toBe(true)
    })

    it('should throw error for invalid JWT format', () => {
      expect(() => {
        decodeJWT('invalid.jwt')
      }).toThrow('Invalid JWT format')
    })
  })
})

