const express = require('express');
const router = express.Router();
const { users, outbox } = require('../data/parkingData');
const { sendEmailNotification } = require('../services/mailer');

// Generate a unique parking pass ID for QR codes
function generatePassId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'PARK-';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, username, email, role, vehicleType, vehicleNo } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Name and Email are required." });
  }

  if (!vehicleNo) {
    return res.status(400).json({ success: false, message: "Vehicle Registration Number is required." });
  }

  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already registered with this email. Please login instead." });
  }

  const parkingPassId = generatePassId();

  const newUser = {
    id: users.length + 1,
    name,
    username: username || '',
    email,
    role: role || "student",
    vehicleType: vehicleType || "two_wheeler",
    vehicleNo: vehicleNo.toUpperCase(),
    parkingPassId,
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);

  // Build QR code data (all user parking info encoded)
  const qrData = JSON.stringify({
    passId: parkingPassId,
    name: newUser.name,
    email: newUser.email,
    vehicleNo: newUser.vehicleNo,
    vehicleType: newUser.vehicleType,
    role: newUser.role,
    issuedAt: newUser.registeredAt
  });

  // Send registration email with QR info
  const subject = `🅿️ Your College Parking Pass - ${parkingPassId}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="color: #059669; margin-top: 0;">Welcome to College Smart Parking!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your parking account has been created and your vehicle is now registered.</p>
      
      <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Vehicle Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #059669; font-size: 1.1em;">${newUser.vehicleNo}</span></p>
        <p style="margin: 5px 0;"><strong>Vehicle Type:</strong> ${vehicleType === 'four_wheeler' ? 'Four Wheeler' : 'Two Wheeler'}</p>
        <p style="margin: 5px 0;"><strong>Parking Pass ID:</strong> <span style="font-family: monospace; font-weight: bold; color: #2563eb;">${parkingPassId}</span></p>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <p style="font-weight: bold; color: #374151;">Your Parking QR Code:</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}" 
             alt="Parking QR Code" style="border-radius: 8px; border: 2px solid #e2e8f0;" />
        <p style="font-size: 0.85em; color: #6b7280; margin-top: 8px;">Show this QR code at Main Gate 1 for quick entry.</p>
      </div>

      <p style="color: #6b7280; font-size: 0.85em; border-top: 1px solid #e2e8f0; padding-top: 15px;">
        College Smart Parking System - Main Gate 1 (Vehicle Entry/Exit) • Gate 2 (College Building Entry)
      </p>
    </div>
  `;

  const mailRecord = await sendEmailNotification({
    to: email,
    subject,
    htmlContent,
    textContent: `Welcome ${name}! Parking Pass: ${parkingPassId}, Vehicle: ${newUser.vehicleNo}`,
    emailType: "REGISTRATION_WITH_QR"
  });

  return res.json({
    success: true,
    message: "Registration successful! Parking pass & QR code sent to your email.",
    user: newUser,
    dispatchedEmail: mailRecord
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, name, username, vehicleNo, vehicleType } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required to login." });
  }

  if (!vehicleNo) {
    return res.status(400).json({ success: false, message: "Vehicle Registration Number is required." });
  }

  let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Auto-register new user on first login
    const parkingPassId = generatePassId();
    user = {
      id: users.length + 1,
      name: name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      username: username || '',
      email,
      role: "student",
      vehicleType: vehicleType || "two_wheeler",
      vehicleNo: vehicleNo.toUpperCase(),
      parkingPassId,
      registeredAt: new Date().toISOString()
    };
    users.push(user);
  } else {
    // Update existing user's info
    if (name) user.name = name;
    if (username) user.username = username;
    if (vehicleNo) user.vehicleNo = vehicleNo.toUpperCase();
    if (vehicleType) user.vehicleType = vehicleType;
    // Ensure parking pass exists
    if (!user.parkingPassId) user.parkingPassId = generatePassId();
  }

  const loginTime = new Date().toISOString();
  user.lastLoginAt = loginTime;
  user.loginCount = (user.loginCount || 0) + 1;

  // Build QR data
  const qrData = JSON.stringify({
    passId: user.parkingPassId,
    name: user.name,
    email: user.email,
    vehicleNo: user.vehicleNo,
    vehicleType: user.vehicleType,
    role: user.role,
    lastLogin: loginTime
  });

  // Send login email with QR
  const subject = `🔐 Login Alert - College Parking System`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="color: #059669; margin-top: 0;">Login Successful</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>You have logged in to the College Smart Parking System.</p>

      <div style="background: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
        <p style="margin: 5px 0;"><strong>Vehicle Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #059669; font-size: 1.1em;">${user.vehicleNo}</span></p>
        <p style="margin: 5px 0;"><strong>Parking Pass ID:</strong> <span style="font-family: monospace; font-weight: bold; color: #2563eb;">${user.parkingPassId}</span></p>
        <p style="margin: 5px 0;"><strong>Login Time:</strong> ${new Date(loginTime).toLocaleString()}</p>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <p style="font-weight: bold; color: #374151;">Your Parking QR Code:</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}" 
             alt="Parking QR Code" style="border-radius: 8px; border: 2px solid #e2e8f0;" />
        <p style="font-size: 0.85em; color: #6b7280; margin-top: 8px;">Show this QR at Main Gate 1 for quick vehicle verification.</p>
      </div>
    </div>
  `;

  const mailRecord = await sendEmailNotification({
    to: email,
    subject,
    htmlContent,
    textContent: `Login successful. Vehicle: ${user.vehicleNo}, Pass: ${user.parkingPassId}`,
    emailType: "LOGIN_ALERT_WITH_QR"
  });

  return res.json({
    success: true,
    message: "Login successful! Your parking pass & QR code have been sent to your email.",
    user,
    dispatchedEmail: mailRecord
  });
});

// GET /api/auth/users - Record of all registered campus users
router.get('/users', (req, res) => {
  return res.json({
    success: true,
    totalUsers: users.length,
    users
  });
});

// GET /api/auth/outbox
router.get('/outbox', (req, res) => {
  return res.json({
    success: true,
    totalEmails: outbox.length,
    outbox
  });
});

// GET /api/auth/qr/:passId - Generate QR code data for a user
router.get('/qr/:passId', (req, res) => {
  const user = users.find(u => u.parkingPassId === req.params.passId);
  if (!user) {
    return res.status(404).json({ success: false, message: "Pass ID not found." });
  }

  const qrData = JSON.stringify({
    passId: user.parkingPassId,
    name: user.name,
    email: user.email,
    vehicleNo: user.vehicleNo,
    vehicleType: user.vehicleType,
    role: user.role
  });

  return res.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      vehicleNo: user.vehicleNo,
      vehicleType: user.vehicleType,
      parkingPassId: user.parkingPassId
    },
    qrData,
    qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`
  });
});

module.exports = router;
