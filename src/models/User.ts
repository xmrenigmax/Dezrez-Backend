import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // SECURITY: Never query password by default
  },
  role: {
    type: String,
    enum: [ 'admin', 'user' ],
    default: 'user'
  },
  twoFactor: {
    secret: { type: String, select: false }, // Store the TOTP secret here
    isEnabled: { type: Boolean, default: false },
    qrCodeUrl: { type: String } // Temp storage for setup (optional)
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);