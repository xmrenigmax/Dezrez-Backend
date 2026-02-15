import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (_.isNil(JWT_SECRET)) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing.');
}

// 1. Password Hashing
export async function hashPassword(plainText: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainText, salt);
}

// 2. Generate 2FA Secret
export async function generate2FASecret(email: string) {
  const secret = speakeasy.generateSecret({
    name: `VoiceSaaS (${ email })`
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    tempSecret: secret.base32,
    qrCode: qrCode
  };
}

// 3. Verify 2FA Token
export function verify2FAToken(token: string, secret: string) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1 // Allow 30sec drift
  });
}

// 4. Generate JWT Token
export function generateToken(userId: string, role: string) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET as string,
    { expiresIn: '1d' } // Token expires in 1 day
  );
}

// 5. Verify Password
export async function verifyPassword(plainText: string, hashed: string) {
  return await bcrypt.compare(plainText, hashed);
}