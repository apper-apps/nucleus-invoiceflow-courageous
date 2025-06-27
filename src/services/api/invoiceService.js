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
this.invoices.splice(index, 1)
    return true
  }

  async generatePDF(id) {
    await this.delay()
    const invoice = await this.getById(id)
    
    // Import jsPDF dynamically
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    // Set up PDF styling
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', 20, 30)
    
    // Invoice details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice #: ${invoice.number}`, 20, 50)
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 20, 60)
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 70)
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 80)
    
    // Client info
    doc.setFont('helvetica', 'bold')
    doc.text('Bill To:', 20, 100)
    doc.setFont('helvetica', 'normal')
    // Note: Client details would need to be fetched separately in real implementation
    doc.text('Client Details', 20, 110)
    
    // Line items
    let yPos = 140
    doc.setFont('helvetica', 'bold')
    doc.text('Description', 20, yPos)
    doc.text('Qty', 120, yPos)
    doc.text('Rate', 140, yPos)
    doc.text('Amount', 170, yPos)
    
    yPos += 10
    doc.setFont('helvetica', 'normal')
    
    invoice.items.forEach(item => {
      doc.text(item.description, 20, yPos)
      doc.text(item.quantity.toString(), 120, yPos)
      doc.text(`$${item.rate.toFixed(2)}`, 140, yPos)
      doc.text(`$${item.amount.toFixed(2)}`, 170, yPos)
      yPos += 10
    })
    
    // Totals
    yPos += 10
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 140, yPos)
    yPos += 10
    if (invoice.tax > 0) {
      doc.text(`Tax: $${invoice.tax.toFixed(2)}`, 140, yPos)
      yPos += 10
    }
    doc.setFont('helvetica', 'bold')
    doc.text(`Total: $${invoice.total.toFixed(2)}`, 140, yPos)
    
    // Notes
    if (invoice.notes) {
      yPos += 20
      doc.setFont('helvetica', 'normal')
      doc.text('Notes:', 20, yPos)
      yPos += 10
      const splitNotes = doc.splitTextToSize(invoice.notes, 170)
      doc.text(splitNotes, 20, yPos)
    }
    
    return doc
  }

  async emailInvoice(id, clientEmail) {
    await this.delay()
    
    try {
      const invoice = await this.getById(id)
      const pdfDoc = await this.generatePDF(id)
      const pdfBase64 = pdfDoc.output('datauristring')
      
      // Import emailjs dynamically
      const emailjs = await import('emailjs-com')
      
      const templateParams = {
        to_email: clientEmail,
        invoice_number: invoice.number,
        invoice_total: invoice.total.toFixed(2),
        pdf_attachment: pdfBase64,
        message: `Please find attached invoice ${invoice.number} for $${invoice.total.toFixed(2)}.`
      }
      
      // Note: This requires EmailJS configuration in a real implementation
      // For now, we'll simulate the email sending
      console.log('Email would be sent with:', templateParams)
      
      return {
        success: true,
        message: `Invoice ${invoice.number} emailed successfully to ${clientEmail}`
      }
    } catch (error) {
      throw new Error(`Failed to email invoice: ${error.message}`)
    }
  }
}