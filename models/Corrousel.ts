import mongoose from 'mongoose'

const CorrouselSchema = new mongoose.Schema({
  mobileimages: [{ type: String, required: true }],
desktopimages: [{ type: String, required: true }],
  Text: { type: String, required: true }
})

const Corrousel = mongoose.models.Corrousel || mongoose.model('Corrousel', CorrouselSchema)

export default Corrousel