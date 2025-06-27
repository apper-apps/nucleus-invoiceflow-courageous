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
}

export const settingsService = new SettingsService()