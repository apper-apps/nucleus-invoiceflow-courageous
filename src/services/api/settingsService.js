import mockSettings from '@/services/mockData/settings.json'

class SettingsService {
  constructor() {
    this.settings = { ...mockSettings }
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

async get() {
    await this.delay()
    return { ...this.settings }
  }

  async update(updates) {
    await this.delay()
    this.settings = {
      ...this.settings,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return { ...this.settings }
  }

  async uploadLogo(file) {
    await this.delay()
    
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file')
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      throw new Error('File size must be less than 2MB')
    }
    
    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result
        this.settings.branding.logo = base64
        resolve(base64)
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }
}

export const settingsService = new SettingsService()