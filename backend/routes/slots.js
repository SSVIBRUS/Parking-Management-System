const express = require('express');
const router = express.Router();
const { collegeMapInfo, slots } = require('../data/parkingData');
const { sendEmailNotification } = require('../services/mailer');

// Daily logs in-memory store
const dailyLogs = [
  {
    logId: 'LOG-1001',
    slotId: 'tw-1',
    slotName: 'TW-001',
    vehicleNo: 'MH-12-AB-1234',
    driverName: 'Aarav Sharma',
    vehicleType: 'two_wheeler',
    entryTime: new Date(Date.now() - 3600000 * 3).toISOString(),
    exitTime: new Date(Date.now() - 3600000 * 1).toISOString(),
    durationMinutes: 120,
    status: 'EXITED',
    gate: 'Main Gate 1'
  },
  {
    logId: 'LOG-1002',
    slotId: 'fw-1',
    slotName: 'FW-001',
    vehicleNo: 'MH-14-CD-5678',
    driverName: 'Prof. R. K. Verma',
    vehicleType: 'four_wheeler',
    entryTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    exitTime: null,
    durationMinutes: null,
    status: 'PARKED',
    gate: 'Main Gate 1'
  }
];

// Helper to log entry
function logVehicleEntry(slot, driverName, vehicleNo, userEmail, gate = 'Main Gate 1') {
  const logEntry = {
    logId: `LOG-${1000 + dailyLogs.length + 1}`,
    slotId: slot.id,
    slotName: slot.name,
    vehicleNo: vehicleNo || 'MH-12-UNKNOWN',
    driverName: driverName || 'Campus User',
    vehicleType: slot.type,
    userEmail: userEmail || null,
    entryTime: new Date().toISOString(),
    exitTime: null,
    durationMinutes: null,
    status: 'PARKED',
    gate
  };
  dailyLogs.unshift(logEntry);
  return logEntry;
}

// Helper to log exit
function logVehicleExit(slotId) {
  const logEntry = dailyLogs.find(l => l.slotId === slotId && l.status === 'PARKED');
  if (logEntry) {
    logEntry.exitTime = new Date().toISOString();
    logEntry.status = 'EXITED';
    const mins = Math.max(1, Math.round((new Date(logEntry.exitTime) - new Date(logEntry.entryTime)) / (1000 * 60)));
    logEntry.durationMinutes = mins;
    return logEntry;
  }
  return null;
}

// GET /api/slots/map - Full map configuration and live slot states
router.get('/map', (req, res) => {
  const totalSlots = slots.length;
  const occupiedSlots = slots.filter(s => s.status === 'occupied').length;
  const freeSlots = totalSlots - occupiedSlots;

  const stats = {
    total: totalSlots,
    occupied: occupiedSlots,
    available: freeSlots,
    twoWheelerTotal: slots.filter(s => s.type === 'two_wheeler').length,
    twoWheelerAvailable: slots.filter(s => s.type === 'two_wheeler' && s.status === 'available').length,
    guestTotal: slots.filter(s => s.type === 'guest').length,
    guestAvailable: slots.filter(s => s.type === 'guest' && s.status === 'available').length,
    fourWheelerTotal: slots.filter(s => s.type === 'four_wheeler').length,
    fourWheelerAvailable: slots.filter(s => s.type === 'four_wheeler' && s.status === 'available').length
  };

  return res.json({
    success: true,
    mapInfo: collegeMapInfo,
    stats,
    slots
  });
});

// GET /api/slots/available - Free Slot Locator with Proximity to Gate 2 Sorting
router.get('/available', (req, res) => {
  const { type, sortByGate2 } = req.query;

  let freeSlots = slots.filter(s => s.status === 'available');

  if (type && type !== 'all') {
    freeSlots = freeSlots.filter(s => s.type === type);
  }

  if (sortByGate2 !== 'false') {
    freeSlots.sort((a, b) => a.distanceToGate2 - b.distanceToGate2);
  }

  return res.json({
    success: true,
    count: freeSlots.length,
    recommendedSlot: freeSlots[0] || null,
    slots: freeSlots
  });
});

// GET /api/slots/daily-logs - Get full daily parking logs (Feature 7)
router.get('/daily-logs', (req, res) => {
  const activeParked = dailyLogs.filter(l => l.status === 'PARKED').length;
  const totalExits = dailyLogs.filter(l => l.status === 'EXITED').length;

  return res.json({
    success: true,
    totalEntries: dailyLogs.length,
    activeParked,
    totalExits,
    logs: dailyLogs
  });
});

// POST /api/slots/gate-scan - Main Gate 1 ALPR Barrier Entry Simulation (Feature 2)
router.post('/gate-scan', async (req, res) => {
  const { vehicleNo, driverName, vehicleType, userEmail } = req.body;

  if (!vehicleNo) {
    return res.status(400).json({ success: false, message: 'Vehicle number is required for scanner!' });
  }

  const targetType = vehicleType || 'two_wheeler';
  
  // Find closest available slot for this vehicle type
  let freeSlots = slots.filter(s => s.status === 'available' && s.type === targetType);
  if (freeSlots.length === 0) {
    // fallback to any free slot
    freeSlots = slots.filter(s => s.status === 'available');
  }

  if (freeSlots.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: `🚫 PARKING FULL! No empty ${targetType.replace('_', ' ')} slots available.` 
    });
  }

  // Sort by closest to Gate 2
  freeSlots.sort((a, b) => a.distanceToGate2 - b.distanceToGate2);
  const slot = freeSlots[0];

  // Occupy slot
  slot.status = 'occupied';
  slot.occupiedBy = {
    driverName: driverName || 'Campus Driver',
    vehicleNo: vehicleNo.toUpperCase().trim(),
    entryTime: new Date().toISOString(),
    userEmail,
    viaGate: 'Main Gate 1 ALPR Scanner'
  };

  // Add to daily log
  const logEntry = logVehicleEntry(slot, driverName, vehicleNo.toUpperCase().trim(), userEmail, 'Main Gate 1 ALPR');

  if (userEmail) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
        <h3 style="color: #10b981;">🟢 Main Gate 1 Barrier Allotment Pass</h3>
        <p>Vehicle <strong>${vehicleNo}</strong> passed Main Gate 1 Scanner.</p>
        <div style="background-color: #1e293b; padding: 12px; border-radius: 8px;">
          <p style="margin: 4px 0;"><strong>Slot Allotted:</strong> ${slot.name} (${slot.zone})</p>
          <p style="margin: 4px 0;"><strong>Distance to Gate 2:</strong> ${slot.distanceToGate2}m walk</p>
          <p style="margin: 4px 0;"><strong>Entry Ticket ID:</strong> ${logEntry.logId}</p>
        </div>
      </div>
    `;
    sendEmailNotification({
      to: userEmail,
      subject: `🟢 Gate 1 Pass: Slot ${slot.name} Allotted`,
      htmlContent,
      textContent: `Gate 1 Barrier Opened! Slot ${slot.name} allotted. Ticket: ${logEntry.logId}`,
      emailType: 'GATE_ENTRY'
    });
  }

  return res.json({
    success: true,
    message: `🟢 BARRIER OPENED! Vehicle ${vehicleNo} assigned to Slot ${slot.name} (${slot.distanceToGate2}m walk to Gate 2).`,
    slot,
    logEntry,
    barrierStatus: 'OPEN'
  });
});

// POST /api/slots/gate-exit-scan - Main Gate 1 ALPR Exit Scanner Simulation (Feature 2)
router.post('/gate-exit-scan', async (req, res) => {
  const { searchQuery } = req.body; // vehicle number or slot name

  if (!searchQuery) {
    return res.status(400).json({ success: false, message: 'Please enter Vehicle Number or Slot Name to scan for exit!' });
  }

  const query = searchQuery.trim().toLowerCase();

  // Find slot occupied by this query
  const slot = slots.find(s => 
    s.status === 'occupied' && (
      s.id.toLowerCase() === query ||
      s.name.toLowerCase() === query ||
      (s.occupiedBy && s.occupiedBy.vehicleNo && s.occupiedBy.vehicleNo.toLowerCase() === query)
    )
  );

  if (!slot) {
    return res.status(404).json({ 
      success: false, 
      message: `No active parked vehicle found matching "${searchQuery}". Please check vehicle number or slot.` 
    });
  }

  const prevOccupant = slot.occupiedBy;
  const exitTime = new Date();
  const entryTime = prevOccupant && prevOccupant.entryTime ? new Date(prevOccupant.entryTime) : new Date(Date.now() - 3600000);
  const durationMinutes = Math.max(1, Math.round((exitTime - entryTime) / (1000 * 60)));

  // Update log
  logVehicleExit(slot.id);

  // Vacate slot
  slot.status = 'available';
  slot.occupiedBy = null;

  if (prevOccupant && prevOccupant.userEmail) {
    sendEmailNotification({
      to: prevOccupant.userEmail,
      subject: `🚗 Main Gate 1 Exit Clearance - Slot ${slot.name}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px;">
          <h3 style="color: #10b981;">🚗 Exit Barrier Clearance Receipt</h3>
          <p>Vehicle <strong>${prevOccupant.vehicleNo}</strong> exited via Main Gate 1.</p>
          <p>Total Parking Duration: ${durationMinutes} mins. Slot ${slot.name} is now empty.</p>
        </div>
      `,
      textContent: `Vehicle ${prevOccupant.vehicleNo} exited via Main Gate 1. Duration: ${durationMinutes} mins.`,
      emailType: 'GATE_EXIT'
    });
  }

  return res.json({
    success: true,
    message: `🟢 EXIT BARRIER OPENED! Slot ${slot.name} released for vehicle ${prevOccupant ? prevOccupant.vehicleNo : ''}.`,
    slotName: slot.name,
    durationMinutes,
    freedOccupant: prevOccupant,
    barrierStatus: 'OPEN'
  });
});

// POST /api/slots/occupy - Reserve or Park in Slot
router.post('/occupy', async (req, res) => {
  const { slotId, driverName, vehicleNo, userEmail } = req.body;

  const slot = slots.find(s => s.id === slotId);

  if (!slot) {
    return res.status(404).json({ success: false, message: "Slot not found." });
  }

  if (slot.status === 'occupied') {
    return res.status(400).json({ success: false, message: `Slot ${slot.name} is already occupied!` });
  }

  const vNo = vehicleNo || `MH-12-XX-${Math.floor(1000 + Math.random() * 9000)}`;
  const dName = driverName || "Campus User";

  slot.status = 'occupied';
  slot.occupiedBy = {
    driverName: dName,
    vehicleNo: vNo,
    entryTime: new Date().toISOString(),
    userEmail
  };

  logVehicleEntry(slot, dName, vNo, userEmail, 'App Manual Select');

  if (userEmail) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
        <h3 style="color: #10b981;">🅿️ Parking Slot Assigned - ${slot.name}</h3>
        <p>Vehicle parked at <strong>Slot ${slot.name}</strong> (${slot.zone}).</p>
        <p>🚶 <strong>Walking distance to Gate 2 (College Building Entrance):</strong> approx ${slot.distanceToGate2} meters.</p>
        <p style="color: #4ade80;">Have a productive day at college!</p>
      </div>
    `;
    sendEmailNotification({
      to: userEmail,
      subject: `🅿️ Parking Slot Allotted: ${slot.name}`,
      htmlContent,
      textContent: `Assigned Slot ${slot.name}. Distance to Gate 2: ${slot.distanceToGate2}m.`,
      emailType: "SLOT_ALLOTMENT"
    });
  }

  return res.json({
    success: true,
    message: `Slot ${slot.name} successfully occupied!`,
    slot
  });
});

// POST /api/slots/vacate - Vehicle Exit Simulator (Empties the Slot)
router.post('/vacate', async (req, res) => {
  const { slotId } = req.body;

  const slot = slots.find(s => s.id === slotId);

  if (!slot) {
    return res.status(404).json({ success: false, message: "Slot not found." });
  }

  if (slot.status === 'available') {
    return res.status(400).json({ success: false, message: `Slot ${slot.name} is already empty!` });
  }

  const prevOccupant = slot.occupiedBy;
  const exitTime = new Date();
  const entryTime = prevOccupant && prevOccupant.entryTime ? new Date(prevOccupant.entryTime) : new Date(Date.now() - 3600000);
  const durationMinutes = Math.max(1, Math.round((exitTime - entryTime) / (1000 * 60)));

  logVehicleExit(slot.id);

  slot.status = 'available';
  slot.occupiedBy = null;

  if (prevOccupant && prevOccupant.userEmail) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
        <h3 style="color: #10b981;">🚗 Vehicle Exit Clearance Receipt</h3>
        <p>Vehicle <strong>${prevOccupant.vehicleNo}</strong> has exited via <strong>Main Gate 1</strong>.</p>
        <div style="background-color: #1e293b; padding: 12px; border-radius: 8px;">
          <p style="margin: 4px 0;"><strong>Slot Released:</strong> ${slot.name} (Now Empty)</p>
          <p style="margin: 4px 0;"><strong>Total Duration:</strong> ${durationMinutes} minutes</p>
          <p style="margin: 4px 0;"><strong>Parking Fee:</strong> ₹0 (Free Campus Privilege)</p>
        </div>
        <p style="color: #94a3b8; font-size: 0.85em; margin-top: 15px;">Slot ${slot.name} is now marked FREE on the live locator map.</p>
      </div>
    `;
    sendEmailNotification({
      to: prevOccupant.userEmail,
      subject: `🚗 Vehicle Exit Clearance - Slot ${slot.name} Released`,
      htmlContent,
      textContent: `Vehicle ${prevOccupant.vehicleNo} exited. Slot ${slot.name} is now empty.`,
      emailType: "EXIT_CLEARANCE"
    });
  }

  return res.json({
    success: true,
    message: `Vehicle exited via Main Gate 1! Slot ${slot.name} is now EMPTY.`,
    slotId: slot.id,
    slotName: slot.name,
    freedOccupant: prevOccupant,
    durationMinutes
  });
});

// POST /api/slots/watchman-override - Security Watchman Manual Slot Override
router.post('/watchman-override', (req, res) => {
  const { slotId, newStatus, driverName, vehicleNo, notes } = req.body;

  const slot = slots.find(s => s.id === slotId);
  if (!slot) {
    return res.status(404).json({ success: false, message: "Slot not found." });
  }

  slot.status = newStatus; // 'available' | 'occupied' | 'maintenance'

  if (newStatus === 'occupied') {
    const dName = driverName || "Watchman Manual Entry";
    const vNo = vehicleNo || "MH-12-MANUAL";

    slot.occupiedBy = {
      driverName: dName,
      vehicleNo: vNo,
      entryTime: new Date().toISOString(),
      overrideBy: "Security Watchman",
      notes: notes || "Manual Watchman override"
    };

    logVehicleEntry(slot, dName, vNo, null, 'Watchman Override');
  } else {
    logVehicleExit(slot.id);
    slot.occupiedBy = null;
  }

  return res.json({
    success: true,
    message: `Watchman override applied for Slot ${slot.name}! New Status: ${newStatus.toUpperCase()}`,
    slot
  });
});

// POST /api/slots/reset-all - Watchman: Mark ALL slots as empty
router.post('/reset-all', (req, res) => {
  let resetCount = 0;
  slots.forEach(slot => {
    if (slot.status === 'occupied') {
      logVehicleExit(slot.id);
      slot.status = 'available';
      slot.occupiedBy = null;
      resetCount++;
    }
  });

  return res.json({
    success: true,
    message: `All slots reset! ${resetCount} occupied slots were marked as empty.`,
    resetCount,
    totalSlots: slots.length
  });
});

module.exports = router;
