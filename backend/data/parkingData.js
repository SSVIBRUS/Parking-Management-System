// Layout dataset matching college parking sketch: 170ft x 120ft dimensions

const collegeMapInfo = {
  title: "College Smart Parking Layout (170ft x 120ft)",
  dimensions: { lengthFeet: 170, widthFeet: 120 },
  mainGate1: { name: "Main Gate 1", type: "vehicle_entry_exit", x: 950, y: 90, description: "Vehicle Entry & Exit Gate (East Edge)" },
  gate2: { name: "Gate 2", type: "college_entry", x: 300, y: 150, description: "Pedestrian Direct Entry to College Building (West Edge)" },
  collegeBuilding: { name: "College Main Building", x: 30, y: 40, width: 250, height: 600 }
};

// Calculate Euclidean distance to Gate-2 (300, 150) converted to meters approx
function getGate2Distance(x, y) {
  const dx = x - 300;
  const dy = y - 150;
  return Math.max(5, Math.round(Math.sqrt(dx * dx + dy * dy) * 0.15));
}

const slots = [];

// 1. TWO-WHEELER PARKING: EXACTLY 175 SLOTS (ARRANGED IN TWO LONG DOUBLE ROWS/LINES)
// Line 1: North Row (88 slots), Line 2: South Row (87 slots)
for (let i = 1; i <= 175; i++) {
  const isRow1 = i <= 88;
  const col = isRow1 ? i - 1 : i - 89;
  
  // 170ft length mapped across SVG width from x=340 to x=940
  const x = 340 + (col % 22) * 27;
  const subRow = Math.floor(col / 22);
  const y = isRow1 ? 45 + subRow * 28 : 140 + subRow * 28;

  const isOccupied = (i * 7) % 5 === 0;

  slots.push({
    id: `TW-${100 + i}`,
    name: `TW-${100 + i}`,
    type: "two_wheeler",
    zone: isRow1 ? "Two-Wheeler Line 1 (North)" : "Two-Wheeler Line 2 (South)",
    status: isOccupied ? "occupied" : "available",
    x,
    y,
    width: 24,
    height: 24,
    distanceToGate2: getGate2Distance(x, y),
    occupiedBy: isOccupied ? {
      driverName: `Student ${i}`,
      vehicleNo: `MH-12-TW-${1000 + i}`,
      entryTime: new Date(Date.now() - (i * 8 * 60000)).toISOString()
    } : null
  });
}

// 2. GUEST PARKING: EXACTLY 15 SLOTS (NEAR GATE 2)
for (let i = 1; i <= 15; i++) {
  const col = (i - 1) % 5;
  const row = Math.floor((i - 1) / 5);
  const x = 340 + col * 75;
  const y = 245 + row * 45;
  
  const isOccupied = i === 2 || i === 7;

  slots.push({
    id: `GS-${i < 10 ? '0' + i : i}`,
    name: `Guest GS-${i < 10 ? '0' + i : i}`,
    type: "guest",
    zone: "VIP Guest Zone (Direct Gate 2 Access)",
    status: isOccupied ? "occupied" : "available",
    x,
    y,
    width: 68,
    height: 38,
    distanceToGate2: getGate2Distance(x, y),
    occupiedBy: isOccupied ? {
      driverName: `Guest VIP ${i}`,
      vehicleNo: `MH-14-VIP-0${i}`,
      entryTime: new Date(Date.now() - (30 * 60000)).toISOString()
    } : null
  });
}

// 3. FOUR-WHEELER PARKING: EXACTLY 30 SLOTS
for (let i = 1; i <= 30; i++) {
  const col = (i - 1) % 6;
  const row = Math.floor((i - 1) / 6);
  const x = 340 + col * 95;
  const y = 390 + row * 52;
  const isEv = i % 5 === 0;
  const isOccupied = (i * 3) % 4 === 0;

  slots.push({
    id: `FW-${200 + i}`,
    name: `FW-${200 + i}${isEv ? " (EV)" : ""}`,
    type: "four_wheeler",
    isEv,
    zone: `Four-Wheeler Zone Row ${row + 1}`,
    status: isOccupied ? "occupied" : "available",
    x,
    y,
    width: 88,
    height: 44,
    distanceToGate2: getGate2Distance(x, y),
    occupiedBy: isOccupied ? {
      driverName: `Faculty/Staff ${i}`,
      vehicleNo: `MH-12-FW-${2000 + i}`,
      entryTime: new Date(Date.now() - (i * 12 * 60000)).toISOString()
    } : null
  });
}

// Predefined users
const users = [
  { id: 1, name: "Admin Officer", email: "admin@college.edu", role: "admin", vehicleType: "four_wheeler", vehicleNo: "MH-12-AD-01" },
  { id: 2, name: "Head Security Watchman", email: "watchman@college.edu", role: "watchman", vehicleType: "two_wheeler", vehicleNo: "MH-12-SEC-01" },
  { id: 3, name: "Prof. Rajesh Kumar", email: "rajesh@college.edu", role: "faculty", vehicleType: "four_wheeler", vehicleNo: "MH-12-FK-99" }
];

const outbox = [];
const guestBookings = [];

module.exports = {
  collegeMapInfo,
  slots,
  users,
  outbox,
  guestBookings
};
