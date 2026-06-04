import { describe, it, expect } from 'vitest'

describe('Environment Setup', () => {
    it('should have Vitest working', () => {
        expect(1 + 1).toBe(2)
    })

    it('should have access to JSDOM', () => {
        const div = document.createElement('div')
        div.innerHTML = 'Hello'
        expect(div.innerHTML).toBe('Hello')
    })
})
