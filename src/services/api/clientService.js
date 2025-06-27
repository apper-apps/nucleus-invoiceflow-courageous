import mockClients from '@/services/mockData/clients.json'

class ClientService {
  constructor() {
    this.clients = [...mockClients]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.clients]
  }

  async getById(id) {
    await this.delay()
    const client = this.clients.find(c => c.Id === id)
    if (!client) {
      throw new Error('Client not found')
    }
    return { ...client }
  }

  async create(client) {
    await this.delay()
    const newId = Math.max(...this.clients.map(c => c.Id), 0) + 1
    const newClient = {
      ...client,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.clients.push(newClient)
    return { ...newClient }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.clients.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Client not found')
    }
    
    this.clients[index] = {
      ...this.clients[index],
      ...updates,
      Id: id,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.clients[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.clients.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Client not found')
    }
    
    this.clients.splice(index, 1)
    return true
  }
}

export const clientService = new ClientService()