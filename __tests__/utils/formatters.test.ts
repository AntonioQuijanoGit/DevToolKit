import { formatJSON, minifyJSON, validateJSON } from '@/lib/utils/formatters'

describe('JSON Formatters', () => {
  describe('formatJSON', () => {
    it('should format valid JSON with proper indentation', () => {
      const input = '{"name":"test","value":123}'
      const result = formatJSON(input)
      
      expect(result.success).toBe(true)
      expect(result.result).toContain('"name"')
      expect(result.result).toContain('"test"')
      expect(result.result).toContain('\n')
    })

    it('should return error for invalid JSON', () => {
      const input = '{invalid json}'
      const result = formatJSON(input)
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should return error for empty input', () => {
      const result = formatJSON('')
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Input is empty')
    })
  })

  describe('minifyJSON', () => {
    it('should minify valid JSON', () => {
      const input = '{\n  "name": "test",\n  "value": 123\n}'
      const result = minifyJSON(input)
      
      expect(result.success).toBe(true)
      expect(result.result).not.toContain('\n')
      expect(result.result).not.toContain(' ')
    })

    it('should return error for invalid JSON', () => {
      const input = '{invalid json}'
      const result = minifyJSON(input)
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('validateJSON', () => {
    it('should validate correct JSON', () => {
      const input = '{"name":"test"}'
      const result = validateJSON(input)
      
      expect(result.success).toBe(true)
    })

    it('should return error for invalid JSON', () => {
      const input = '{invalid}'
      const result = validateJSON(input)
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})



