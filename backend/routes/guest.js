const express = require('express');
const router = express.Router();
const { guestBookings, slots } = require('../data/parkingData');
const { sendEmailNotification } = require('../services/mailer');

// POST /api/guest/request - Request Guest Parking Allotment
router.post('/request', async (req, res) => {
  const { guestName, guestEmail, vehicleNo, hostFaculty, purpose, expectedTime } = req.body;

  if (!guestName || !vehicleNo) {
    return res.status(400).json({ success: false, message: "Guest Name and Vehicle No are required." });
  }

  // Find free guest slot near Gate 2
  const freeGuestSlot = slots.find(s => s.type === 'guest' && s.status === 'available');

  const passCode = `GUEST-PASS-${Math.floor(100000 + Math.random() * 900000)}`;

  const booking = {
    id: guestBookings.length + 1,
    passCode,
    guestName,
    guestEmail: guestEmail || "guest@external.org",
    vehicleNo,
    hostFaculty: hostFaculty || "College Administration",
    purpose: purpose || "Official College Visit",
    expectedTime: expectedTime || "Today",
    assignedSlot: freeGuestSlot ? freeGuestSlot.name : "GS-VIP-Priority",
    assignedSlotId: freeGuestSlot ? freeGuestSlot.id : "GS-01",
    status: "APPROVED",
    createdAt: new Date().toISOString()
  };

  guestBookings.push(booking);

  // Auto occupy guest slot if available
  if (freeGuestSlot) {
    freeGuestSlot.status = 'occupied';
    freeGuestSlot.occupiedBy = {
      driverName: `[GUEST] ${guestName}`,
      vehicleNo,
      entryTime: new Date().toISOString(),
      passCode
    };
  }

  // Dispatch Guest VIP Digital Pass Email
  if (guestEmail) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #38bdf8;">
        <h2 style="color: #38bdf8; margin-top: 0;">🎫 VIP Guest Parking Allotment Pass</h2>
        <p>Dear <strong>${guestName}</strong>,</p>
        <p>Your college guest parking allotment pass has been approved by <strong>${booking.hostFaculty}</strong>.</p>
        
        <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px dashed #38bdf8; text-align: center;">
          <p style="font-size: 1.3em; font-weight: bold; color: #38bdf8; letter-spacing: 2px; margin: 5px 0;">PASS CODE: ${passCode}</p>
          <p style="margin: 5px 0;"><strong>Assigned Slot:</strong> ${booking.assignedSlot} (Directly near Gate-2)</p>
          <p style="margin: 5px 0;"><strong>Vehicle No:</strong> ${vehicleNo}</p>
          <p style="margin: 5px 0;"><strong>Entry Gate:</strong> Main Gate 1</p>
          <p style="margin: 5px 0;"><strong>Destination:</strong> Gate 2 -> College Main Building</p>
        </div>

        <p style="color: #94a3b8; font-size: 0.85em;">Please present this digital pass or pass code at <strong>Main Gate 1</strong> upon entry.</p>
      </div>
    `;
    sendEmailNotification({
      to: guestEmail,
      subject: `🎫 College VIP Guest Pass: ${passCode}`,
      htmlContent,
      textContent: `Guest Pass ${passCode} assigned to slot ${booking.assignedSlot}.`,
      emailType: "GUEST_PASS"
    });
  }

  return res.json({
    success: true,
    message: "Guest Parking Allotted Successfully!",
    booking
  });
});

// GET /api/guest/list
router.get('/list', (req, res) => {
  return res.json({
    success: true,
    count: guestBookings.length,
    bookings: guestBookings
  });
});

module.exports = router;
