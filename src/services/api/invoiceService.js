import mockInvoices from '@/services/mockData/invoices.json'

class InvoiceService {
  constructor() {
    this.invoices = [...mockInvoices]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.invoices]
  }

  async getById(id) {
    await this.delay()
    const invoice = this.invoices.find(inv => inv.Id === id)
    if (!invoice) {
      throw new Error('Invoice not found')
    }
    return { ...invoice }
  }

  async create(invoice) {
    await this.delay()
    const newId = Math.max(...this.invoices.map(inv => inv.Id), 0) + 1
    const newInvoice = {
      ...invoice,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.invoices.push(newInvoice)
    return { ...newInvoice }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.invoices.findIndex(inv => inv.Id === id)
    if (index === -1) {
      throw new Error('Invoice not found')
    }
    
    this.invoices[index] = {
      ...this.invoices[index],
      ...updates,
      Id: id,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.invoices[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.invoices.findIndex(inv => inv.Id === id)
    if (index === -1) {
      throw new Error('Invoice not found')
    }
    
    this.invoices.splice(index, 1)
    return true
  }
}

export const invoiceService = new InvoiceService()