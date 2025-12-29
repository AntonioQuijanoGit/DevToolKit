import { encodeBase64, decodeBase64, encodeURL, decodeURL } from '@/lib/utils/encoders'

describe('Encoders', () => {
  describe('Base64', () => {
    it('should encode text to Base64', () => {
      const text = 'Hello World'
      const encoded = encodeBase64(text)
      
      expect(encoded).toBe('SGVsbG8gV29ybGQ=')
    })

    it('should decode Base64 to text', () => {
      const encoded = 'SGVsbG8gV29ybGQ='
      const decoded = decodeBase64(encoded)
      
      expect(decoded).toBe('Hello World')
    })

    it('should handle round-trip encoding/decoding', () => {
      const original = 'Test String 123!@#'
      const encoded = encodeBase64(original)
      const decoded = decodeBase64(encoded)
      
      expect(decoded).toBe(original)
    })
  })

  describe('URL', () => {
    it('should encode URL', () => {
      const url = 'https://example.com/test?q=hello world'
      const encoded = encodeURL(url)
      
      expect(encoded).toContain('hello%20world')
    })

    it('should decode URL', () => {
      const encoded = 'https%3A%2F%2Fexample.com%2Ftest'
      const decoded = decodeURL(encoded)
      
      expect(decoded).toBe('https://example.com/test')
    })

    it('should handle round-trip encoding/decoding', () => {
      const original = 'https://example.com/test?q=hello world'
      const encoded = encodeURL(original)
      const decoded = decodeURL(encoded)
      
      expect(decoded).toBe(original)
    })
  })
})

