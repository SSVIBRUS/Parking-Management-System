import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    # Set slide dimensions to Widescreen 16:9 (13.333 x 7.5 inches)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6] # blank slide layout

    # Colors
    PEACH_BANNER = RGBColor(244, 164, 124) # #F4A47C
    DARK_TEXT = RGBColor(0, 0, 0)
    PURPLE_FOOTER = RGBColor(112, 48, 160)
    RED_ACCENT = RGBColor(220, 38, 38)
    ORANGE_CIRCLE = RGBColor(217, 83, 30)
    BORDER_GRAY = RGBColor(200, 200, 200)

    def add_slide_decorations(slide, slide_num, title_text):
        # Top Header Banner Box
        header = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE,
            Inches(0.4), Inches(0.3), Inches(12.533), Inches(0.9)
        )
        header.fill.solid()
        header.fill.fore_color.rgb = PEACH_BANNER
        header.line.color.rgb = DARK_TEXT
        header.line.width = Pt(1.5)

        tf = header.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.alignment = PP_ALIGN.CENTER
        p.font.name = 'Arial'
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = DARK_TEXT

        # Slide Outer Border Frame
        border = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(0.15), Inches(0.15), Inches(13.033), Inches(7.2)
        )
        border.fill.background()
        border.line.color.rgb = RGBColor(120, 120, 120)
        border.line.width = Pt(1)

        # Bottom Footer Text
        footer = slide.shapes.add_textbox(Inches(2.5), Inches(7.0), Inches(8.333), Inches(0.4))
        tf_f = footer.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = "Department of Information Technology | PVG’s COE&SSDIOM Nashik"
        p_f.alignment = PP_ALIGN.CENTER
        p_f.font.name = 'Times New Roman'
        p_f.font.size = Pt(12)
        p_f.font.color.rgb = PURPLE_FOOTER

        # Bottom Left Slide Number Badge Circle
        if slide_num > 1:
            circle = slide.shapes.add_shape(
                MSO_SHAPE.OVAL,
                Inches(0.3), Inches(6.8), Inches(0.55), Inches(0.55)
            )
            circle.fill.solid()
            circle.fill.fore_color.rgb = ORANGE_CIRCLE
            circle.line.fill.background()
            p_c = circle.text_frame.paragraphs[0]
            p_c.text = str(slide_num)
            p_c.alignment = PP_ALIGN.CENTER
            p_c.font.name = 'Times New Roman'
            p_c.font.size = Pt(14)
            p_c.font.bold = True
            p_c.font.color.rgb = RGBColor(255, 255, 255)

    # ==================== SLIDE 1: TITLE SLIDE ====================
    slide1 = prs.slides.add_slide(blank_layout)
    
    # Outer Border
    b1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.15), Inches(0.15), Inches(13.033), Inches(7.2))
    b1.fill.background()
    b1.line.color.rgb = RGBColor(120, 120, 120)

    # Top Header Subtitle
    tb_top = slide1.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(12.333), Inches(0.5))
    p_t = tb_top.text_frame.paragraphs[0]
    p_t.text = "Community Engagement Project Presentation on"
    p_t.alignment = PP_ALIGN.CENTER
    p_t.font.name = 'Times New Roman'
    p_t.font.size = Pt(20)
    p_t.font.bold = True
    p_t.font.color.rgb = DARK_TEXT

    # Main Title Banner
    h1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.4), Inches(0.85), Inches(12.533), Inches(0.9))
    h1.fill.solid()
    h1.fill.fore_color.rgb = PEACH_BANNER
    h1.line.color.rgb = DARK_TEXT
    h1.line.width = Pt(1.5)
    p_h1 = h1.text_frame.paragraphs[0]
    p_h1.text = '“Parking Management System”'
    p_h1.alignment = PP_ALIGN.CENTER
    p_h1.font.name = 'Times New Roman'
    p_h1.font.size = Pt(32)
    p_h1.font.bold = True
    p_h1.font.color.rgb = DARK_TEXT

    # Submission info
    tb_sub = slide1.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(11.333), Inches(1.2))
    tf_sub = tb_sub.text_frame
    p_s1 = tf_sub.paragraphs[0]
    p_s1.text = "Submitted to Savitribai Phule Pune University"
    p_s1.alignment = PP_ALIGN.CENTER
    p_s1.font.name = 'Times New Roman'
    p_s1.font.size = Pt(18)
    p_s1.font.color.rgb = DARK_TEXT

    p_s2 = tf_sub.add_paragraph()
    p_s2.text = "for the partial fulfillment of Under Graduate Degree in"
    p_s2.alignment = PP_ALIGN.CENTER
    p_s2.font.name = 'Times New Roman'
    p_s2.font.size = Pt(18)
    p_s2.font.color.rgb = DARK_TEXT

    p_s3 = tf_sub.add_paragraph()
    p_s3.text = "Department of Information Technology"
    p_s3.alignment = PP_ALIGN.CENTER
    p_s3.font.name = 'Times New Roman'
    p_s3.font.size = Pt(20)
    p_s3.font.bold = True
    p_s3.font.color.rgb = DARK_TEXT

    # Presented By
    tb_pres = slide1.shapes.add_textbox(Inches(1.0), Inches(3.1), Inches(11.333), Inches(1.2))
    tf_pres = tb_pres.text_frame
    p_p1 = tf_pres.paragraphs[0]
    p_p1.text = "Presented By"
    p_p1.alignment = PP_ALIGN.CENTER
    p_p1.font.name = 'Times New Roman'
    p_p1.font.size = Pt(18)
    p_p1.font.bold = True
    p_p1.font.color.rgb = DARK_TEXT

    p_p2 = tf_pres.add_paragraph()
    p_p2.text = "Somnath Sonar | Tanishka Suryawanshi | Tulika Rajput"
    p_p2.alignment = PP_ALIGN.CENTER
    p_p2.font.name = 'Times New Roman'
    p_p2.font.size = Pt(20)
    p_p2.font.bold = True
    p_p2.font.color.rgb = RED_ACCENT

    # Guided By
    tb_guide = slide1.shapes.add_textbox(Inches(1.0), Inches(4.3), Inches(11.333), Inches(1.0))
    tf_g = tb_guide.text_frame
    p_g1 = tf_g.paragraphs[0]
    p_g1.text = "Guided By"
    p_g1.alignment = PP_ALIGN.CENTER
    p_g1.font.name = 'Times New Roman'
    p_g1.font.size = Pt(18)
    p_g1.font.bold = True
    p_g1.font.color.rgb = DARK_TEXT

    p_g2 = tf_g.add_paragraph()
    p_g2.text = "Dr S.R.Lahane"
    p_g2.alignment = PP_ALIGN.CENTER
    p_g2.font.name = 'Times New Roman'
    p_g2.font.size = Pt(20)
    p_g2.font.bold = True
    p_g2.font.color.rgb = RED_ACCENT

    # Bottom Dept Info
    tb_bot = slide1.shapes.add_textbox(Inches(0.5), Inches(6.1), Inches(12.333), Inches(1.1))
    tf_b = tb_bot.text_frame
    p_b1 = tf_b.paragraphs[0]
    p_b1.text = "Department of Information Technology"
    p_b1.alignment = PP_ALIGN.CENTER
    p_b1.font.name = 'Times New Roman'
    p_b1.font.size = Pt(18)
    p_b1.font.bold = True
    p_b1.font.color.rgb = DARK_TEXT

    p_b2 = tf_b.add_paragraph()
    p_b2.text = "PVG’s College of Engineering & S. S. Dhamankar Institute of Management, Nashik"
    p_b2.alignment = PP_ALIGN.CENTER
    p_b2.font.name = 'Times New Roman'
    p_b2.font.size = Pt(18)
    p_b2.font.bold = True
    p_b2.font.color.rgb = DARK_TEXT

    p_b3 = tf_b.add_paragraph()
    p_b3.text = "Academic Year 2025 - 26"
    p_b3.alignment = PP_ALIGN.CENTER
    p_b3.font.name = 'Times New Roman'
    p_b3.font.size = Pt(18)
    p_b3.font.bold = True
    p_b3.font.color.rgb = PURPLE_FOOTER


    # Helper to add standard bullet content slide
    def create_bullet_slide(slide_num, title, points):
        slide = prs.slides.add_slide(blank_layout)
        add_slide_decorations(slide, slide_num, title)

        tb = slide.shapes.add_textbox(Inches(0.6), Inches(1.4), Inches(12.1), Inches(5.3))
        tf = tb.text_frame
        tf.word_wrap = True

        for i, point in enumerate(points):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.text = point[0]
            p.font.name = 'Times New Roman'
            p.font.size = Pt(point[1])
            p.font.bold = point[2]
            if len(point) > 3 and point[3]:
                p.font.color.rgb = point[3]
            p.space_after = Pt(12)
        return slide

    # ==================== SLIDE 2: OUTLINE (Part 1) ====================
    create_bullet_slide(2, "Outline", [
        ("1.  Introduction", 22, True, DARK_TEXT),
        ("     • Overview of urban & campus parking challenges and real-world context", 20, False, DARK_TEXT),
        ("     • Field visit insights from D-Mart parking lot & community impact", 20, False, DARK_TEXT),
        ("2.  Problem Statement", 22, True, DARK_TEXT),
        ("     • Inefficient manual slot searching, vehicle congestion, & watchmen fatigue", 20, False, DARK_TEXT),
        ("     • Lack of real-time slot visibility and automated digital record-keeping", 20, False, DARK_TEXT),
        ("3.  Objectives", 22, True, DARK_TEXT),
        ("     • Develop real-time free slot locator (175 TW, 30 FW, 15 Guest)", 20, False, DARK_TEXT),
        ("     • Implement live optical ALPR camera barrier & QR digital pass", 20, False, DARK_TEXT),
        ("4.  Related Work / Literature Survey", 22, True, DARK_TEXT),
        ("     • Comparative analysis of existing parking systems vs Proposed System", 20, False, DARK_TEXT),
        ("5.  Proposed Solution", 22, True, DARK_TEXT),
        ("     • Unified single-link web application architecture & gate proximity sorting", 20, False, DARK_TEXT),
    ])

    # ==================== SLIDE 3: OUTLINE (Part 2) ====================
    create_bullet_slide(3, "Outline", [
        ("6.  Implementation Details / Methodology", 22, True, DARK_TEXT),
        ("     • Step-by-step development & deployment using React, Node.js, & Express", 20, False, DARK_TEXT),
        ("     • D-Mart field visit data collection & watchman operational pain-point mapping", 20, False, DARK_TEXT),
        ("     • System architecture, live map grid, & automatic ALPR camera scanner", 20, False, DARK_TEXT),
        ("7.  Outcome & Impact", 22, True, DARK_TEXT),
        ("     • Quantitative & qualitative results: entry time reduced from 3 mins to 5 sec", 20, False, DARK_TEXT),
        ("     • Environmental benefits: reduced fuel waste, zero paper logs, lower stress", 20, False, DARK_TEXT),
        ("8.  Future Work", 22, True, DARK_TEXT),
        ("     • IoT sensor integration & mobile app push notification expansion", 20, False, DARK_TEXT),
        ("9.  Conclusion", 22, True, DARK_TEXT),
        ("10. References", 22, True, DARK_TEXT),
    ])

    # ==================== SLIDE 4: 1. INTRODUCTION ====================
    create_bullet_slide(4, "1. Introduction", [
        ("▪ Rapid urbanization and growing vehicle ownership have made parking management a critical challenge in commercial hubs and academic institutions.", 21, False, DARK_TEXT),
        ("▪ D-Mart Field Visit Insight: Field observations at D-Mart parking revealed severe traffic choke points at entry gates due to manual vehicle registration.", 21, False, DARK_TEXT),
        ("▪ Drivers spend 10–15 minutes circling around parking lots searching for open slots, causing frustration and wasted fuel.", 21, False, DARK_TEXT),
        ("▪ Security guards (watchmen) face high stress managing entry barrier queues while manually maintaining paper registers.", 21, False, DARK_TEXT),
        ("▪ Community Impact: Implementing a digital smart parking system significantly reduces traffic congestion, carbon emissions, and entry delays for citizens.", 21, False, DARK_TEXT),
    ])

    # ==================== SLIDE 5: 2. PROBLEM STATEMENT ====================
    create_bullet_slide(5, "2. Problem Statement", [
        ("▪ Current Scenario: Conventional parking management relies entirely on manual security watchmen, paper registers, and physical inspection.", 21, False, DARK_TEXT),
        ("▪ Key Problems Faced by Watchmen (D-Mart Field Visit Observations):", 21, True, DARK_TEXT),
        ("     • Manual Entry Queue Delays: Watchmen spend 2–3 minutes per vehicle writing down license plates in physical logbooks.", 20, False, DARK_TEXT),
        ("     • Lack of Live Slot Visibility: Guards inside gate booths cannot see which inner slots are empty, leading to misdirection.", 20, False, DARK_TEXT),
        ("     • Dispute & Glitch Management: When vehicles park in wrong slots or glitches occur, guards have no tool to reset or override slot statuses.", 20, False, DARK_TEXT),
        ("▪ Community Significance: Resolving these operational bottlenecks via an automated web-based parking management system ensures smooth traffic flow and digital accountability.", 21, False, DARK_TEXT),
    ])

    # ==================== SLIDE 6: OBJECTIVES ====================
    create_bullet_slide(6, "Objectives", [
        ("1. Real-Time Spatial Mapping", 24, True, DARK_TEXT),
        ("     • Build a live interactive web map managing 220 total slots (175 Two-Wheeler, 30 Four-Wheeler, 15 Guest) with green/red status indicators.", 21, False, DARK_TEXT),
        ("2. Automated ALPR Camera Scanner", 24, True, DARK_TEXT),
        ("     • Integrate optical license plate recognition to automatically scan incoming vehicles and open entry barriers without manual typing.", 21, False, DARK_TEXT),
        ("3. Watchman Empowerment & Override Panel", 24, True, DARK_TEXT),
        ("     • Provide a dedicated Watchman Control Panel with single-click manual slot override and a 'Mark All Slots Empty' reset feature.", 21, False, DARK_TEXT),
        ("4. Automated QR Pass & Daily Reporting", 24, True, DARK_TEXT),
        ("     • Deliver automatic QR code passes via email and exportable daily CSV parking log reports.", 21, False, DARK_TEXT),
    ])

    # ==================== SLIDE 7: RELATED WORK / LITERATURE SURVEY ====================
    slide7 = prs.slides.add_slide(blank_layout)
    add_slide_decorations(slide7, 7, "Related Work / Literature Survey")
    
    # Table of Related Work
    rows, cols = 5, 5
    left, top, width, height = Inches(0.5), Inches(1.5), Inches(12.333), Inches(5.0)
    table_shape = slide7.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    # Column widths
    table.columns[0].width = Inches(2.2)
    table.columns[1].width = Inches(2.2)
    table.columns[2].width = Inches(2.2)
    table.columns[3].width = Inches(2.5)
    table.columns[4].width = Inches(3.233)

    headers = ["System Type", "Slot Detection", "Entry Barrier", "Watchman Control", "Limitations / Gaps"]
    data = [
        ["Manual Paper Register", "Visual Inspection", "Manual Rope / Gate", "Paper Logbook", "Slow entry (3 mins/veh), high human error, lost records"],
        ["RFID Card System", "RFID Reader", "Card Tap Barrier", "None", "Card loss risk, card issuing delay, high hardware cost"],
        ["Ultrasonic Sensor System", "Hardware Sensors", "Fixed Timer Barrier", "Minimal", "High sensor maintenance cost, no manual override panel"],
        ["Proposed Campus Park", "Live Web Map & ALPR", "Automated ALPR Camera", "Dedicated Control Panel", "Low cost, instant gate clearance, full watchman control"]
    ]

    for c, h in enumerate(headers):
        cell = table.cell(0, c)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PEACH_BANNER
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = 'Times New Roman'
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = DARK_TEXT
        p.alignment = PP_ALIGN.CENTER

    for r, row_data in enumerate(data):
        for c, val in enumerate(row_data):
            cell = table.cell(r + 1, c)
            cell.fill.solid()
            cell.fill.fore_color.rgb = RGBColor(250, 250, 250) if r % 2 == 0 else RGBColor(240, 245, 250)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = 'Times New Roman'
            p.font.size = Pt(14)
            if r == 3:
                p.font.bold = True
                p.font.color.rgb = RGBColor(16, 185, 129)
            else:
                p.font.color.rgb = DARK_TEXT

    # ==================== SLIDE 8: 2. RELATED WORK / LITERATURE SURVEY (Contd) ====================
    create_bullet_slide(8, "2. Related Work / Literature Survey", [
        ("▪ Literature Survey Analysis: Existing smart parking research focuses heavily on hardware sensors (ultrasonic/geomagnetic), which are expensive and prone to physical damage.", 21, False, DARK_TEXT),
        ("▪ Identified Research Gaps:", 21, True, DARK_TEXT),
        ("     • Absence of Watchman-Centric Tools: Existing solutions ignore security guard workflows and fail to provide manual override capabilities during system glitches.", 20, False, DARK_TEXT),
        ("     • Gate Proximity Ignored: Traditional systems assign arbitrary slots without considering walking distance to main destination buildings (Gate 2).", 20, False, DARK_TEXT),
        ("▪ Our Contribution: Campus Park introduces a unified web architecture combining live spatial map visualization, optical ALPR camera barrier automation, and a dedicated Watchman Panel.", 21, False, DARK_TEXT),
    ])

    # ==================== SLIDE 9: PROPOSED SOLUTION ====================
    create_bullet_slide(9, "Proposed Solution", [
        ("▪ Architecture & Core Innovation: A unified single-link Web-based Smart Parking System accessible across desktop, mobile, and watchman tablets.", 21, False, DARK_TEXT),
        ("▪ Key System Features & Technical Workflow:", 21, True, DARK_TEXT),
        ("     1. Interactive Spatial Map: Real-time rendering of 175 Two-Wheeler, 30 Four-Wheeler, and 15 Guest slots with green (free) / red (occupied) dot indicators.", 20, False, DARK_TEXT),
        ("     2. ALPR Camera Scanner: Automatic optical license plate recognition that reads vehicle plates and opens entry/exit boom barriers automatically.", 20, False, DARK_TEXT),
        ("     3. Watchman Control Panel: Solves field-observed watchmen issues with 1-click status overrides and 'Mark All Slots Empty' glitch recovery.", 20, False, DARK_TEXT),
        ("     4. Persistent Device Login & QR Pass: Automatic session retention via localStorage and QR pass email notifications.", 20, False, DARK_TEXT),
    ])

    # ==================== SLIDE 10: IMPLEMENTATION DETAILS / METHODOLOGY ====================
    create_bullet_slide(10, "Implementation Details / Methodology", [
        ("▪ Phase 1: D-Mart Field Visit & Problem Identification", 22, True, DARK_TEXT),
        ("     • Data Collection: Observed peak-hour vehicle arrival rates, manual registration delays, and watchman operational struggles.", 20, False, DARK_TEXT),
        ("▪ Phase 2: Frontend & Backend Development", 22, True, DARK_TEXT),
        ("     • Frontend: Built with React 18, Vite, Tailwind CSS, and Lucide Icons for responsive, zero-layout-shift map interactions.", 20, False, DARK_TEXT),
        ("     • Backend: Node.js & Express REST API handling live slot allocations, daily logs, and Nodemailer email pass dispatch.", 20, False, DARK_TEXT),
        ("▪ Phase 3: Gate Barrier & Daily Reporting Integration", 22, True, DARK_TEXT),
        ("     • Implemented live webcam optical ALPR scanning and instant exportable CSV daily parking log reports.", 20, False, DARK_TEXT),
    ])

    # ==================== SLIDE 11: OUTCOME & IMPACT ====================
    create_bullet_slide(11, "Outcome & Impact", [
        ("Hardware Requirements", 22, True, DARK_TEXT),
        ("▪ Security Gate Computer / Laptop / Tablet for Watchman Panel & ALPR Scanner", 20, False, DARK_TEXT),
        ("▪ Standard WebCam or IP Camera for Optical License Plate Scanning", 20, False, DARK_TEXT),
        ("Software Requirements", 22, True, DARK_TEXT),
        ("▪ Operating System: Windows / Linux / macOS", 20, False, DARK_TEXT),
        ("▪ Runtime & Frameworks: Node.js v18+, Express.js, React 18, Vite, Tailwind CSS", 20, False, DARK_TEXT),
        ("Community & Watchman Benefits (Impact)", 22, True, DARK_TEXT),
        ("▪ Entry Time Reduction: Reduced gate entry clearance from 3 minutes to under 5 seconds per vehicle.", 20, False, DARK_TEXT),
        ("▪ Watchman Relief: 100% elimination of manual paper logbooks and instant glitch recovery capability.", 20, False, DARK_TEXT),
    ])

    # ==================== SLIDE 12: CONCLUSION ====================
    create_bullet_slide(12, "Conclusion", [
        ("▪ The Campus Park - Smart Parking Management System successfully addresses the real-world parking challenges identified during our field visit to D-Mart parking.", 21, False, DARK_TEXT),
        ("▪ By combining live spatial maps, optical ALPR camera barriers, QR passes, and watchman override tools, the system streamlines campus traffic and eliminates gate bottlenecks.", 21, False, DARK_TEXT),
        ("▪ Watchman Pain-Points Resolved: Manual log writing is replaced by automatic camera scanning, and operational glitches can be fixed in one click.", 21, False, DARK_TEXT),
        ("▪ The web application delivers a cost-effective, scalable, and community-friendly smart parking solution for modern campuses and commercial centers.", 21, False, DARK_TEXT),
    ])

    # ==================== SLIDE 13: REFERENCES ====================
    create_bullet_slide(13, "References", [
        ("[1] Waites Michael J., Morgan Neil L., Rockey John S., and Higton Gary. 2001. Industrial Microbiology: An Introduction. Blackwell Science, Oxford. 219-223.", 15, False, DARK_TEXT),
        ("[2] Stanbury Peter F., Whitaker Allan, and Hall Stephen J. 1995. Principles Of Fermentation Technology. 2nd edition. Butterworth-Heinemann, Oxford. 93, 123-125.", 15, False, DARK_TEXT),
        ("[3] IEEE Transactions on Intelligent Transportation Systems, 'Smart Parking Systems: A Real-Time Sensor and Web Application Survey,' 2022.", 15, False, DARK_TEXT),
        ("[4] Savitribai Phule Pune University, 'Community Engagement Project Guidelines for IT Department,' 2025-26.", 15, False, DARK_TEXT),
        ("[5] Campus Park Development Documentation, Department of Information Technology, PVG’s COE & SSDIOM, Nashik, Academic Year 2025-26.", 15, False, DARK_TEXT),
    ])

    # ==================== SLIDE 14: THANK YOU ! ====================
    slide14 = prs.slides.add_slide(blank_layout)
    add_slide_decorations(slide14, 14, "Thank You !")

    tb14 = slide14.shapes.add_textbox(Inches(3.0), Inches(3.0), Inches(7.333), Inches(2.0))
    tf14 = tb14.text_frame
    p14 = tf14.paragraphs[0]
    p14.text = "Any Questions?"
    p14.alignment = PP_ALIGN.CENTER
    p14.font.name = 'Times New Roman'
    p14.font.size = Pt(44)
    p14.font.bold = True
    p14.font.italic = True
    p14.font.color.rgb = DARK_TEXT

    # Save presentation
    output_path = "Campus_Park_CEP_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at {os.path.abspath(output_path)}")

if __name__ == "__main__":
    build_presentation()
