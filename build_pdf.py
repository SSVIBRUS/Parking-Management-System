import os
import sys
from reportlab.lib.pagesizes import landscape
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Custom Canvas class for drawing slide backgrounds, headers, borders, footers, and page numbers
class PresentationCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self.pages)
        for page_idx, page in enumerate(self.pages):
            self.__dict__.update(page)
            self.draw_slide_decorations(page_idx + 1)
            super().showPage()
        super().save()

    def draw_slide_decorations(self, page_num):
        W, H = 13.333 * inch, 7.5 * inch
        
        # Colors
        PEACH_BANNER = HexColor("#F4A47C")
        DARK_TEXT = HexColor("#000000")
        PURPLE_FOOTER = HexColor("#7030A0")
        ORANGE_CIRCLE = HexColor("#D9531E")
        BORDER_GRAY = HexColor("#787878")

        # Slide Outer Border Frame (all slides)
        self.setStrokeColor(BORDER_GRAY)
        self.setLineWidth(1)
        self.roundRect(0.15 * inch, 0.15 * inch, 13.033 * inch, 7.2 * inch, 8, fill=0, stroke=1)

        # Footer Text (all slides)
        self.setFont("Times-Roman", 11)
        self.setFillColor(PURPLE_FOOTER)
        footer_text = "Department of Information Technology | PVG’s COE&SSDIOM Nashik"
        self.drawCentredString(W / 2.0, 0.3 * inch, footer_text)

        # Bottom Left Slide Number Badge Circle (slides > 1)
        if page_num > 1:
            self.setFillColor(ORANGE_CIRCLE)
            self.setStrokeColor(ORANGE_CIRCLE)
            badge_x = 0.55 * inch
            badge_y = 0.45 * inch
            radius = 0.25 * inch
            self.circle(badge_x, badge_y, radius, fill=1, stroke=0)
            
            self.setFont("Times-Bold", 13)
            self.setFillColor(HexColor("#FFFFFF"))
            self.drawCentredString(badge_x, badge_y - 4, str(page_num))

def build_pdf_presentation():
    pdf_filename = "Campus_Park_CEP_Presentation.pdf"
    
    # 16:9 Widescreen dimensions: 13.333 x 7.5 inches (960 x 540 pt)
    PAGE_WIDTH = 13.333 * inch
    PAGE_HEIGHT = 7.5 * inch
    
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
        leftMargin=0.5 * inch,
        rightMargin=0.5 * inch,
        topMargin=0.4 * inch,
        bottomMargin=0.5 * inch
    )

    styles = getSampleStyleSheet()

    # Colors
    PEACH_BANNER = HexColor("#F4A47C")
    DARK_TEXT = HexColor("#000000")
    PURPLE_FOOTER = HexColor("#7030A0")
    RED_ACCENT = HexColor("#DC2626")
    GREEN_ACCENT = HexColor("#10B981")

    # Typography Styles
    style_header_banner = ParagraphStyle(
        'HeaderBanner',
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        alignment=TA_CENTER,
        textColor=DARK_TEXT,
        backColor=PEACH_BANNER,
        borderColor=DARK_TEXT,
        borderWidth=1.5,
        borderPadding=8,
        spaceAfter=15
    )

    style_title_sub = ParagraphStyle(
        'TitleSub',
        fontName='Times-Bold',
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=DARK_TEXT,
        spaceAfter=10
    )

    style_main_banner = ParagraphStyle(
        'MainBanner',
        fontName='Times-Bold',
        fontSize=30,
        leading=36,
        alignment=TA_CENTER,
        textColor=DARK_TEXT,
        backColor=PEACH_BANNER,
        borderColor=DARK_TEXT,
        borderWidth=1.5,
        borderPadding=10,
        spaceAfter=15
    )

    style_sub_text = ParagraphStyle(
        'SubText',
        fontName='Times-Roman',
        fontSize=17,
        leading=21,
        alignment=TA_CENTER,
        textColor=DARK_TEXT,
        spaceAfter=4
    )

    style_sub_bold = ParagraphStyle(
        'SubBold',
        fontName='Times-Bold',
        fontSize=19,
        leading=23,
        alignment=TA_CENTER,
        textColor=DARK_TEXT,
        spaceAfter=12
    )

    style_present_by = ParagraphStyle(
        'PresentBy',
        fontName='Times-Bold',
        fontSize=19,
        leading=23,
        alignment=TA_CENTER,
        textColor=RED_ACCENT,
        spaceAfter=12
    )

    style_purple_footer = ParagraphStyle(
        'PurpleFooter',
        fontName='Times-Bold',
        fontSize=18,
        leading=22,
        alignment=TA_CENTER,
        textColor=PURPLE_FOOTER,
        spaceAfter=4
    )

    style_bullet_main = ParagraphStyle(
        'BulletMain',
        fontName='Times-Bold',
        fontSize=20,
        leading=25,
        textColor=DARK_TEXT,
        spaceBefore=8,
        spaceAfter=4
    )

    style_bullet_sub = ParagraphStyle(
        'BulletSub',
        fontName='Times-Roman',
        fontSize=18,
        leading=23,
        textColor=DARK_TEXT,
        leftIndent=25,
        spaceAfter=6
    )

    story = []

    # ==================== SLIDE 1: TITLE SLIDE ====================
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph("Community Engagement Project Presentation on", style_title_sub))
    story.append(Spacer(1, 0.05 * inch))
    story.append(Paragraph("“Parking Management System”", style_main_banner))
    story.append(Spacer(1, 0.1 * inch))

    story.append(Paragraph("Submitted to Savitribai Phule Pune University", style_sub_text))
    story.append(Paragraph("for the partial fulfillment of Under Graduate Degree in", style_sub_text))
    story.append(Paragraph("Department of Information Technology", style_sub_bold))
    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph("Presented By", style_sub_bold))
    story.append(Paragraph("Somnath Sonar | Tanishka Suryawanshi | Tulika Rajput", style_present_by))
    story.append(Spacer(1, 0.1 * inch))

    story.append(Paragraph("Guided By", style_sub_bold))
    story.append(Paragraph("Dr S.R.Lahane", style_present_by))
    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph("Department of Information Technology", style_sub_bold))
    story.append(Paragraph("PVG’s College of Engineering & S. S. Dhamankar Institute of Management, Nashik", style_sub_bold))
    story.append(Paragraph("Academic Year 2025 - 26", style_purple_footer))

    # Helper function to generate content slides
    def add_bullet_slide(title, bullet_items):
        story.append(Paragraph(title, style_header_banner))
        story.append(Spacer(1, 0.1 * inch))
        for item, is_main, indent_level in bullet_items:
            if is_main:
                story.append(Paragraph(item, style_bullet_main))
            else:
                p_style = ParagraphStyle(
                    'CustomSub',
                    parent=style_bullet_sub,
                    leftIndent=25 * indent_level
                )
                story.append(Paragraph(item, p_style))

    from reportlab.platypus import PageBreak

    # ==================== SLIDE 2: OUTLINE (Part 1) ====================
    story.append(PageBreak())
    add_bullet_slide("Outline", [
        ("1.  Introduction", True, 0),
        ("• Overview of urban & campus parking challenges and real-world context", False, 1),
        ("• Field visit insights from D-Mart parking lot & community impact", False, 1),
        ("2.  Problem Statement", True, 0),
        ("• Inefficient manual slot searching, vehicle congestion, & watchmen fatigue", False, 1),
        ("• Lack of real-time slot visibility and automated digital record-keeping", False, 1),
        ("3.  Objectives", True, 0),
        ("• Develop real-time free slot locator (175 TW, 30 FW, 15 Guest)", False, 1),
        ("• Implement live optical ALPR camera barrier & QR digital pass", False, 1),
        ("4.  Related Work / Literature Survey", True, 0),
        ("• Comparative analysis of existing parking systems vs Proposed System", False, 1),
        ("5.  Proposed Solution", True, 0),
        ("• Unified single-link web application architecture & gate proximity sorting", False, 1),
    ])

    # ==================== SLIDE 3: OUTLINE (Part 2) ====================
    story.append(PageBreak())
    add_bullet_slide("Outline", [
        ("6.  Implementation Details / Methodology", True, 0),
        ("• Step-by-step development & deployment using React, Node.js, & Express", False, 1),
        ("• D-Mart field visit data collection & watchman operational pain-point mapping", False, 1),
        ("• System architecture, live map grid, & automatic ALPR camera scanner", False, 1),
        ("7.  Outcome & Impact", True, 0),
        ("• Quantitative & qualitative results: entry time reduced from 3 mins to 5 sec", False, 1),
        ("• Environmental benefits: reduced fuel waste, zero paper logs, lower stress", False, 1),
        ("8.  Future Work", True, 0),
        ("• IoT sensor integration & mobile app push notification expansion", False, 1),
        ("9.  Conclusion", True, 0),
        ("10. References", True, 0),
    ])

    # ==================== SLIDE 4: 1. INTRODUCTION ====================
    story.append(PageBreak())
    add_bullet_slide("1. Introduction", [
        ("▪ Rapid urbanization and growing vehicle ownership have made parking management a critical challenge in commercial hubs and academic institutions.", False, 0),
        ("▪ <b>D-Mart Field Visit Insight:</b> Field observations at D-Mart parking revealed severe traffic choke points at entry gates due to manual vehicle registration.", False, 0),
        ("▪ Drivers spend 10–15 minutes circling around parking lots searching for open slots, causing frustration and wasted fuel.", False, 0),
        ("▪ Security guards (watchmen) face high stress managing entry barrier queues while manually maintaining paper registers.", False, 0),
        ("▪ <b>Community Impact:</b> Implementing a digital smart parking system significantly reduces traffic congestion, carbon emissions, and entry delays for citizens.", False, 0),
    ])

    # ==================== SLIDE 5: 2. PROBLEM STATEMENT ====================
    story.append(PageBreak())
    add_bullet_slide("2. Problem Statement", [
        ("▪ <b>Current Scenario:</b> Conventional parking management relies entirely on manual security watchmen, paper registers, and physical inspection.", False, 0),
        ("▪ <b>Key Problems Faced by Watchmen (D-Mart Field Visit Observations):</b>", True, 0),
        ("• <b>Manual Entry Queue Delays:</b> Watchmen spend 2–3 minutes per vehicle writing down license plates in physical logbooks.", False, 1),
        ("• <b>Lack of Live Slot Visibility:</b> Guards inside gate booths cannot see which inner slots are empty, leading to misdirection.", False, 1),
        ("• <b>Dispute & Glitch Management:</b> When vehicles park in wrong slots or glitches occur, guards have no tool to reset or override slot statuses.", False, 1),
        ("▪ <b>Community Significance:</b> Resolving these operational bottlenecks via an automated web-based parking management system ensures smooth traffic flow and digital accountability.", False, 0),
    ])

    # ==================== SLIDE 6: OBJECTIVES ====================
    story.append(PageBreak())
    add_bullet_slide("Objectives", [
        ("1. Real-Time Spatial Mapping", True, 0),
        ("• Build a live interactive web map managing 220 total slots (175 Two-Wheeler, 30 Four-Wheeler, 15 Guest) with green/red status indicators.", False, 1),
        ("2. Automated ALPR Camera Scanner", True, 0),
        ("• Integrate optical license plate recognition to automatically scan incoming vehicles and open entry barriers without manual typing.", False, 1),
        ("3. Watchman Empowerment & Override Panel", True, 0),
        ("• Provide a dedicated Watchman Control Panel with single-click manual slot override and a 'Mark All Slots Empty' reset feature.", False, 1),
        ("4. Automated QR Pass & Daily Reporting", True, 0),
        ("• Deliver automatic QR code passes via email and exportable daily CSV parking log reports.", False, 1),
    ])

    # ==================== SLIDE 7: RELATED WORK / LITERATURE SURVEY ====================
    story.append(PageBreak())
    story.append(Paragraph("Related Work / Literature Survey", style_header_banner))
    story.append(Spacer(1, 0.15 * inch))

    # Table formatting
    table_data = [
        ["System Type", "Slot Detection", "Entry Barrier", "Watchman Control", "Limitations / Gaps"],
        ["Manual Paper Register", "Visual Inspection", "Manual Rope / Gate", "Paper Logbook", "Slow entry (3 mins/veh), high human error, lost records"],
        ["RFID Card System", "RFID Reader", "Card Tap Barrier", "None", "Card loss risk, card issuing delay, high hardware cost"],
        ["Ultrasonic Sensor System", "Hardware Sensors", "Fixed Timer Barrier", "Minimal", "High sensor maintenance cost, no manual override panel"],
        ["Proposed Campus Park", "Live Web Map & ALPR", "Automated ALPR Camera", "Dedicated Control Panel", "Low cost, instant gate clearance, full watchman control"]
    ]

    cell_header_style = ParagraphStyle('THeader', fontName='Times-Bold', fontSize=14, leading=17, alignment=TA_CENTER, textColor=DARK_TEXT)
    cell_body_style = ParagraphStyle('TBody', fontName='Times-Roman', fontSize=12, leading=15, textColor=DARK_TEXT)
    cell_highlight_style = ParagraphStyle('THighlight', fontName='Times-Bold', fontSize=12, leading=15, textColor=GREEN_ACCENT)

    formatted_table_data = []
    for r_idx, row in enumerate(table_data):
        formatted_row = []
        for c_idx, text in enumerate(row):
            if r_idx == 0:
                formatted_row.append(Paragraph(text, cell_header_style))
            elif r_idx == 4:
                formatted_row.append(Paragraph(text, cell_highlight_style))
            else:
                formatted_row.append(Paragraph(text, cell_body_style))
        formatted_table_data.append(formatted_row)

    col_widths = [2.2 * inch, 2.2 * inch, 2.2 * inch, 2.4 * inch, 3.2 * inch]
    t = Table(formatted_table_data, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PEACH_BANNER),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 1, HexColor("#787878")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor("#FAFAFA"), HexColor("#F0F5FA")]),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t)

    # ==================== SLIDE 8: 2. RELATED WORK / LITERATURE SURVEY (Contd) ====================
    story.append(PageBreak())
    add_bullet_slide("2. Related Work / Literature Survey", [
        ("▪ <b>Literature Survey Analysis:</b> Existing smart parking research focuses heavily on hardware sensors (ultrasonic/geomagnetic), which are expensive and prone to physical damage.", False, 0),
        ("▪ <b>Identified Research Gaps:</b>", True, 0),
        ("• <b>Absence of Watchman-Centric Tools:</b> Existing solutions ignore security guard workflows and fail to provide manual override capabilities during system glitches.", False, 1),
        ("• <b>Gate Proximity Ignored:</b> Traditional systems assign arbitrary slots without considering walking distance to main destination buildings (Gate 2).", False, 1),
        ("▪ <b>Our Contribution:</b> Campus Park introduces a unified web architecture combining live spatial map visualization, optical ALPR camera barrier automation, and a dedicated Watchman Panel.", False, 0),
    ])

    # ==================== SLIDE 9: PROPOSED SOLUTION ====================
    story.append(PageBreak())
    add_bullet_slide("Proposed Solution", [
        ("▪ <b>Architecture & Core Innovation:</b> A unified single-link Web-based Smart Parking System accessible across desktop, mobile, and watchman tablets.", False, 0),
        ("▪ <b>Key System Features & Technical Workflow:</b>", True, 0),
        ("1. <b>Interactive Spatial Map:</b> Real-time rendering of 175 Two-Wheeler, 30 Four-Wheeler, and 15 Guest slots with green (free) / red (occupied) dot indicators.", False, 1),
        ("2. <b>ALPR Camera Scanner:</b> Automatic optical license plate recognition that reads vehicle plates and opens entry/exit boom barriers automatically.", False, 1),
        ("3. <b>Watchman Control Panel:</b> Solves field-observed watchmen issues with 1-click status overrides and 'Mark All Slots Empty' glitch recovery.", False, 1),
        ("4. <b>Persistent Device Login & QR Pass:</b> Automatic session retention via localStorage and QR pass email notifications.", False, 1),
    ])

    # ==================== SLIDE 10: IMPLEMENTATION DETAILS / METHODOLOGY ====================
    story.append(PageBreak())
    add_bullet_slide("Implementation Details / Methodology", [
        ("▪ Phase 1: D-Mart Field Visit & Problem Identification", True, 0),
        ("• Data Collection: Observed peak-hour vehicle arrival rates, manual registration delays, and watchman operational struggles.", False, 1),
        ("▪ Phase 2: Frontend & Backend Development", True, 0),
        ("• Frontend: Built with React 18, Vite, Tailwind CSS, and Lucide Icons for responsive, zero-layout-shift map interactions.", False, 1),
        ("• Backend: Node.js & Express REST API handling live slot allocations, daily logs, and Nodemailer email pass dispatch.", False, 1),
        ("▪ Phase 3: Gate Barrier & Daily Reporting Integration", True, 0),
        ("• Implemented live webcam optical ALPR scanning and instant exportable CSV daily parking log reports.", False, 1),
    ])

    # ==================== SLIDE 11: OUTCOME & IMPACT ====================
    story.append(PageBreak())
    add_bullet_slide("Outcome & Impact", [
        ("Hardware Requirements", True, 0),
        ("• Security Gate Computer / Laptop / Tablet for Watchman Panel & ALPR Scanner", False, 1),
        ("• Standard WebCam or IP Camera for Optical License Plate Scanning", False, 1),
        ("Software Requirements", True, 0),
        ("• Operating System: Windows / Linux / macOS", False, 1),
        ("• Runtime & Frameworks: Node.js v18+, Express.js, React 18, Vite, Tailwind CSS", False, 1),
        ("Community & Watchman Benefits (Impact)", True, 0),
        ("• <b>Entry Time Reduction:</b> Reduced gate entry clearance from 3 minutes to under 5 seconds per vehicle.", False, 1),
        ("• <b>Watchman Relief:</b> 100% elimination of manual paper logbooks and instant glitch recovery capability.", False, 1),
    ])

    # ==================== SLIDE 12: CONCLUSION ====================
    story.append(PageBreak())
    add_bullet_slide("Conclusion", [
        ("▪ The Campus Park - Smart Parking Management System successfully addresses the real-world parking challenges identified during our field visit to D-Mart parking.", False, 0),
        ("▪ By combining live spatial maps, optical ALPR camera barriers, QR passes, and watchman override tools, the system streamlines campus traffic and eliminates gate bottlenecks.", False, 0),
        ("▪ <b>Watchman Pain-Points Resolved:</b> Manual log writing is replaced by automatic camera scanning, and operational glitches can be fixed in one click.", False, 0),
        ("▪ The web application delivers a cost-effective, scalable, and community-friendly smart parking solution for modern campuses and commercial centers.", False, 0),
    ])

    # ==================== SLIDE 13: REFERENCES ====================
    story.append(PageBreak())
    add_bullet_slide("References", [
        ("[1] Waites Michael J., Morgan Neil L., Rockey John S., and Higton Gary. 2001. Industrial Microbiology: An Introduction. Blackwell Science, Oxford. 219-223.", False, 0),
        ("[2] Stanbury Peter F., Whitaker Allan, and Hall Stephen J. 1995. Principles Of Fermentation Technology. 2nd edition. Butterworth-Heinemann, Oxford. 93, 123-125.", False, 0),
        ("[3] IEEE Transactions on Intelligent Transportation Systems, 'Smart Parking Systems: A Real-Time Sensor and Web Application Survey,' 2022.", False, 0),
        ("[4] Savitribai Phule Pune University, 'Community Engagement Project Guidelines for IT Department,' 2025-26.", False, 0),
        ("[5] Campus Park Development Documentation, Department of Information Technology, PVG’s COE & SSDIOM, Nashik, Academic Year 2025-26.", False, 0),
    ])

    # ==================== SLIDE 14: THANK YOU ! ====================
    story.append(PageBreak())
    story.append(Paragraph("Thank You !", style_header_banner))
    story.append(Spacer(1, 1.2 * inch))

    style_thanks = ParagraphStyle(
        'ThanksText',
        fontName='Times-BoldItalic',
        fontSize=44,
        leading=50,
        alignment=TA_CENTER,
        textColor=DARK_TEXT
    )
    story.append(Paragraph("Any Questions?", style_thanks))

    doc.build(story, canvasmaker=PresentationCanvas)
    print(f"PDF Presentation successfully created at {os.path.abspath(pdf_filename)}")

if __name__ == "__main__":
    build_pdf_presentation()
