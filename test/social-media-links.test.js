import { describe, it, expect, beforeEach } from 'vitest'
import { getAppData } from '../index.js'

describe('Social Media Links Plugin', () => {
    const mockAppData = {
        app: {
            title: 'Test Site',
        },
    }

    beforeEach(() => {
        // Reset app data for each test
        mockAppData.app = {
            title: 'Test Site',
        }
    })

    it('should add social media links to app data', () => {
        const result = getAppData(mockAppData)

        expect(result).toHaveProperty('socialMediaLinks')
        expect(Array.isArray(result.socialMediaLinks)).toBe(true)
        expect(result.socialMediaLinks.length).toBeGreaterThan(0)
    })

    it('should preserve existing app data', () => {
        const result = getAppData(mockAppData)

        expect(result.title).toBe('Test Site')
    })

    it('should include required properties for each social media link', () => {
        const result = getAppData(mockAppData)

        result.socialMediaLinks.forEach((link) => {
            expect(link).toHaveProperty('name')
            expect(link).toHaveProperty('href')
            expect(link).toHaveProperty('icon')
            expect(typeof link.name).toBe('string')
            expect(typeof link.href).toBe('string')
            expect(typeof link.icon).toBe('string')
        })
    })

    it('should include default social media platforms', () => {
        const result = getAppData(mockAppData)

        const platforms = result.socialMediaLinks.map((link) =>
            link.name.toLowerCase()
        )
        expect(platforms).toContain('facebook')
        expect(platforms).toContain('linkedin')
        expect(platforms).toContain('instagram')
    })

    it('should generate valid URLs', () => {
        const result = getAppData(mockAppData)

        result.socialMediaLinks.forEach((link) => {
            expect(link.href).toMatch(/^https?:\/\//)
        })
    })

    it('should include FontAwesome icons', () => {
        const result = getAppData(mockAppData)

        result.socialMediaLinks.forEach((link) => {
            expect(link.icon).toMatch(/<i class="fab fa-/)
            expect(link.icon).toMatch(/aria-hidden="true"/)
        })
    })

    it('should handle missing config gracefully', () => {
        // Test with empty mock data to simulate missing config
        const emptyData = { app: {} }
        const result = getAppData(emptyData)

        // Should return app data without throwing
        expect(result).toBeDefined()
    })
})
