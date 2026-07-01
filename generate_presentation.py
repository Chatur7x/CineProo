import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# ── Color Palette ──
BG       = RGBColor(18, 18, 24)
GOLD     = RGBColor(228, 179, 99)
WHITE    = RGBColor(245, 245, 250)
GRAY     = RGBColor(180, 180, 190)
MUTED    = RGBColor(120, 120, 135)
PURPLE   = RGBColor(124, 107, 255)
TEAL     = RGBColor(78, 205, 196)
RED      = RGBColor(255, 107, 107)
CODE_BG  = RGBColor(12, 12, 18)

def bg(slide):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = BG

def tag(slide, text, left=0.7, top=0.35):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(4), Inches(0.3))
    p = box.text_frame.paragraphs[0]
    p.text = text.upper()
    p.font.name = 'Arial'
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = GOLD
    box.text_frame.word_wrap = False

def title(slide, text, left=0.7, top=0.6, size=28):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(11.5), Inches(0.9))
    p = box.text_frame.paragraphs[0]
    p.text = text
    p.font.name = 'Arial'
    p.font.size = Pt(size)
    p.font.bold = True
    p.font.color.rgb = WHITE
    box.text_frame.word_wrap = True

def subtitle(slide, text, left=0.7, top=1.45, width=10):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(0.6))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.name = 'Arial'
    p.font.size = Pt(14)
    p.font.color.rgb = GRAY

def add_text_block(slide, left, top, width, height, items, header=None, header_color=GOLD):
    """items = list of (bold_title, body_text) tuples"""
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0

    if header:
        p = tf.paragraphs[0]
        p.text = header.upper()
        p.font.name = 'Arial'
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = header_color
        p.space_after = Pt(14)
        first = False
    else:
        first = True

    for btitle, body in items:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        # bullet title
        r1 = p.add_run()
        r1.text = "•  " + btitle + "  "
        r1.font.name = 'Arial'
        r1.font.size = Pt(12)
        r1.font.bold = True
        r1.font.color.rgb = WHITE
        # body
        r2 = p.add_run()
        r2.text = body
        r2.font.name = 'Arial'
        r2.font.size = Pt(11)
        r2.font.bold = False
        r2.font.color.rgb = GRAY
        p.space_after = Pt(12)
        p.space_before = Pt(4)

def add_code(slide, left, top, width, height, code_text):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = Pt(16)
    tf.margin_right = Pt(16)
    tf.margin_top = Pt(14)
    tf.margin_bottom = Pt(14)
    p = tf.paragraphs[0]
    p.text = code_text
    p.font.name = 'Consolas'
    p.font.size = Pt(10.5)
    p.font.color.rgb = RGBColor(220, 220, 230)
    p.line_spacing = Pt(17)
    # dark bg rectangle behind it
    from pptx.util import Emu
    shape = slide.shapes.add_shape(
        1, Inches(left), Inches(top), Inches(width), Inches(height)  # MSO_SHAPE.RECTANGLE = 1
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = CODE_BG
    shape.line.fill.background()
    shape.shadow.inherit = False
    # move code box to front
    sp = box._element
    sp.getparent().append(sp)

def add_img(slide, path, left, top, width):
    if os.path.exists(path):
        slide.shapes.add_picture(path, Inches(left), Inches(top), width=Inches(width))

def main():
    prs = Presentation()
    prs.slide_width  = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # ═══════════════════════════════════════════════════════════
    # SLIDE 1 — COVER
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)

    # Main title
    box = s.shapes.add_textbox(Inches(1), Inches(1.6), Inches(11), Inches(4))
    tf = box.text_frame; tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "CINEBOOK PRO"
    p.font.name = 'Arial'; p.font.size = Pt(54); p.font.bold = True; p.font.color.rgb = GOLD
    p.space_after = Pt(8)

    p2 = tf.add_paragraph()
    p2.text = "An Integrated Multi-Language Movie Ticketing\n& Security Architecture"
    p2.font.name = 'Arial'; p2.font.size = Pt(24); p2.font.color.rgb = WHITE
    p2.space_after = Pt(28)

    p3 = tf.add_paragraph()
    p3.text = "Internship Project Presentation  •  Department of Cyber Security"
    p3.font.name = 'Arial'; p3.font.size = Pt(13); p3.font.color.rgb = MUTED

    # Student info
    box2 = s.shapes.add_textbox(Inches(8), Inches(5.4), Inches(4.5), Inches(1.2))
    tf2 = box2.text_frame; tf2.word_wrap = True
    pi = tf2.paragraphs[0]
    pi.text = "Submitted by"
    pi.font.name = 'Arial'; pi.font.size = Pt(10); pi.font.bold = True; pi.font.color.rgb = GOLD
    pi.space_after = Pt(6)
    pi2 = tf2.add_paragraph()
    pi2.text = "Kolluri Chaturvedhi Narsimha  •  24EG109A28\nAnurag University, Hyderabad"
    pi2.font.name = 'Arial'; pi2.font.size = Pt(12); pi2.font.color.rgb = GRAY

    # ═══════════════════════════════════════════════════════════
    # SLIDE 2 — TECH STACK
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)
    tag(s, "Overview")
    title(s, "Project Overview & Technology Stack")
    subtitle(s, "Four distinct technology layers orchestrated into a unified cinema ticketing platform.")

    add_text_block(s, 0.7, 2.2, 5.4, 4.5, [
        ("React (Host SPA)", "Manages global state via Context API, hash-change routing, and interactive 3D seat animations with frosted-glass UI panels."),
        ("Vue.js (Widgets)", "Micro-containers mounted inside React DOM refs for modular card checkout forms and password audit consoles."),
        ("Java (Security)", "Luhn's card validation, private-field OOP encapsulation, ArrayList memory tracking, BufferedWriter logging, and synchronized thread locks."),
        ("Python (Auditor)", "Password audit layer deriving concrete rules from an abstract base class. CLI console emulator with Matplotlib stats."),
        ("AI & Prompt Engineering", "Utilized AI prompts for code debugging, architecture design optimization, and automated documentation generation.")
    ], header="Technology Details")

    add_img(s, "captures/screenshots/01_home_screen.png", 6.8, 2.2, 5.5)

    # ═══════════════════════════════════════════════════════════
    # SLIDE 3 — SYSTEM ARCHITECTURE
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)
    tag(s, "Architecture")
    title(s, "System Component Architecture")

    add_img(s, "captures/system_architecture.png", 0.7, 1.8, 6.0)

    # Caption
    cap = s.shapes.add_textbox(Inches(0.7), Inches(6.4), Inches(6), Inches(0.3))
    pc = cap.text_frame.paragraphs[0]
    pc.text = "Fig 2.1 — CineBook Multi-Language Component Architecture"
    pc.font.name = 'Arial'; pc.font.size = Pt(9); pc.font.italic = True; pc.font.color.rgb = MUTED
    pc.alignment = PP_ALIGN.CENTER

    add_text_block(s, 7.2, 1.8, 5.4, 5.0, [
        ("Frontend Client Layer", "React SPA with hash routing and context store. Vue containers mounted dynamically for checkout and audit widgets."),
        ("Java Security Layer", "OOP encapsulation with Luhn's checksum validation, ArrayList object tracking, BufferedWriter disk logging, and mutex seat locks."),
        ("Python Audit Layer", "Abstract PasswordCheck base class with polymorphic rule derivation. CLI parser and Matplotlib canvas charts."),
        ("Data & Storage", "Browser LocalStorage for bookings and sessions. Java file I/O writes card validation logs to cards.dat on disk.")
    ], header="Component Layers")

    # ═══════════════════════════════════════════════════════════
    # SLIDE 4 — SEQUENCE FLOW
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)
    tag(s, "Architecture")
    title(s, "End-to-End Booking Sequence Flow")

    add_img(s, "captures/booking_sequence_flow.png", 0.7, 1.8, 6.0)

    cap2 = s.shapes.add_textbox(Inches(0.7), Inches(6.4), Inches(6), Inches(0.3))
    pc2 = cap2.text_frame.paragraphs[0]
    pc2.text = "Fig 2.2 — End-to-End Booking Validation & Security Flow"
    pc2.font.name = 'Arial'; pc2.font.size = Pt(9); pc2.font.italic = True; pc2.font.color.rgb = MUTED
    pc2.alignment = PP_ALIGN.CENTER

    add_text_block(s, 7.2, 1.8, 5.4, 5.0, [
        ("Phase 1 — Seat Lock", "Thread-0 acquires a synchronized mutex, locking selected seat coordinates for 5 minutes to prevent double-bookings."),
        ("Phase 2 — Card Validation", "Vue checkout collects card details. Luhn's mod-10 checksum validates digits. Valid cards tracked in ArrayList and logged to disk."),
        ("Phase 3 — Security Audit", "Dual validation: Java Weak/Strong classification + Python abstract auditor running LengthCheck, ComplexityCheck, PatternCheck rules."),
        ("Phase 4 — Ticket Issue", "6-digit OTP verification → booking saved to LocalStorage → 3D parallax ticket with SVG QR code and scan verification generated.")
    ], header="Transaction Phases")

    # ═══════════════════════════════════════════════════════════
    # SLIDE 5 — REACT + VUE CODE
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)
    tag(s, "Code Walkthrough")
    title(s, "React & Vue Interoperability")

    add_text_block(s, 0.7, 1.8, 5.0, 4.5, [
        ("React DOM Wrapper", "A ref-backed container div is rendered by React, holding the mount point for Vue instances."),
        ("Vue Lifecycle", "Inside useEffect, createApp() initializes the Vue widget and mounts it. On cleanup, app.unmount() frees memory."),
        ("State Bridge", "Custom browser events (dispatchEvent) synchronize seat counts and invoice data across frameworks.")
    ], header="How It Works")

    code_react = (
        "// React component mounting a Vue widget\n"
        "const VueWrapper = () => {\n"
        "  const containerRef = useRef(null);\n"
        "\n"
        "  useEffect(() => {\n"
        "    // Create and mount Vue app instance\n"
        "    const app = createApp(CardCheckout);\n"
        "    app.mount(containerRef.current);\n"
        "\n"
        "    return () => {\n"
        "      app.unmount(); // Cleanup on unmount\n"
        "    };\n"
        "  }, []);\n"
        "\n"
        "  return <div ref={containerRef} />;\n"
        "};"
    )
    add_code(s, 6.2, 1.8, 6.4, 4.8, code_react)

    # ═══════════════════════════════════════════════════════════
    # SLIDE 6 — JAVA SECURITY
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)
    tag(s, "Code Walkthrough")
    title(s, "Java Security Engine")

    code_java = (
        "// Luhn Algorithm — Card Validation\n"
        "public boolean checkLuhn(String cardNo) {\n"
        "    int nDigits = cardNo.length();\n"
        "    int nSum = 0;\n"
        "    boolean isSecond = false;\n"
        "\n"
        "    for (int i = nDigits - 1; i >= 0; i--) {\n"
        "        int d = cardNo.charAt(i) - '0';\n"
        "        if (isSecond) d = d * 2;\n"
        "        nSum += d / 10;\n"
        "        nSum += d % 10;\n"
        "        isSecond = !isSecond;\n"
        "    }\n"
        "    return (nSum % 10 == 0);\n"
        "}"
    )
    add_code(s, 0.7, 1.8, 5.8, 4.8, code_java)

    add_text_block(s, 7.0, 1.8, 5.6, 5.0, [
        ("Luhn Check Algorithm", "Executes mod-10 double-every-second digit sum validations on inputs to prevent fake or invalid card numbers."),
        ("OOP Encapsulation", "Strictly keeps attributes private, accessing them via clean getter/setter objects to block arbitrary edits."),
        ("ArrayList Tracking", "Stores validated Card instances to memory dynamically, mapping object heap locations to console logs."),
        ("BufferedWriter I/O", "Streams transaction logs out to cards.dat on disk using Java's file output stream, securing records permanently."),
        ("Thread Synchronization", "Synchronized blocks on Thread-0 acquire mutex locks on seat coordinates, preventing concurrent double-bookings.")
    ], header="Core Java Concepts")

    # ═══════════════════════════════════════════════════════════
    # SLIDE 7 — PYTHON AUDIT
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)
    tag(s, "Code Walkthrough")
    title(s, "Python Audit Layer")

    add_text_block(s, 0.7, 1.8, 5.0, 4.5, [
        ("Abstract Base Class", "PasswordCheck defines an abstract validate() method. Concrete subclasses override it with specific checking rules."),
        ("Regex Pattern Scanning", "Regular expressions detect repeated sequences, missing character classes (uppercase, digits, specials), and dictionary words."),
        ("Matplotlib Visualization", "Audit scores compiled into a bar chart rendered as PNG, embedded into the app's HTML5 canvas for dashboard display.")
    ], header="Audit Architecture")

    code_python = (
        "from abc import ABC, abstractmethod\n"
        "\n"
        "class PasswordCheck(ABC):\n"
        "    @abstractmethod\n"
        "    def validate(self, pwd: str) -> bool:\n"
        "        pass\n"
        "\n"
        "class LengthCheck(PasswordCheck):\n"
        "    def validate(self, pwd: str) -> bool:\n"
        "        return len(pwd) >= 8\n"
        "\n"
        "class ComplexityCheck(PasswordCheck):\n"
        "    def validate(self, pwd: str) -> bool:\n"
        "        return bool(\n"
        "            re.search(r'[A-Z]', pwd) and\n"
        "            re.search(r'[0-9]', pwd) and\n"
        "            re.search(r'[!@#$%]', pwd)\n"
        "        )"
    )
    add_code(s, 6.2, 1.8, 6.4, 5.0, code_python)

    # ═══════════════════════════════════════════════════════════
    # SLIDE 8 — SCREENSHOTS
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)
    tag(s, "Live Demo")
    title(s, "Application Interface & Features")

    # 2x2 image grid
    imgs = [
        ("captures/screenshots/01_home_screen.png", 0.7, 2.0, 2.9),
        ("captures/screenshots/05_seat_map_selected_recommended.png", 3.8, 2.0, 2.9),
        ("captures/screenshots/09_vue_card_form_filled.png", 0.7, 4.3, 2.9),
        ("captures/screenshots/13_ticket_3d_modal_unscanned.png", 3.8, 4.3, 2.9),
    ]
    for path, l, t, w in imgs:
        add_img(s, path, l, t, w)

    add_text_block(s, 7.2, 2.0, 5.4, 4.8, [
        ("Home Screen", "Frosted-glass movie cards with responsive grid layout, genre badges, ratings, and Apple HIG-inspired visual design."),
        ("3D Curved Seating Map", "Interactive seat grid with quantity stepper sync, recommended seat algorithm, and 3D flip animations on selection."),
        ("Vue Card Checkout", "Real-time Luhn validation, auto-formatting, demo presets (Visa/Mastercard/RuPay), and dual password audit."),
        ("Parallax 3D Ticket", "Mouse-tracking perspective tilt, notched stub design, embedded SVG QR code, and click-to-verify scan animation.")
    ], header="Feature Highlights")

    # ═══════════════════════════════════════════════════════════
    # SLIDE 9 — CHALLENGES
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)
    tag(s, "Engineering")
    title(s, "Technical Challenges & Solutions")

    add_text_block(s, 0.7, 2.0, 11.8, 5.0, [
        ("Double-Booking Race Condition",
         "Challenge: Simultaneous booking attempts caused seat overlap conflicts.  |  Solution: Java synchronized blocks with Thread-0 mutex locks hold seats for 5 minutes, blocking concurrent access."),
        ("React-Vue DOM Collision",
         "Challenge: Independent reactive frameworks caused lifecycle conflicts when mounted side-by-side.  |  Solution: Managed mount/unmount via React useRef + useEffect. Vue apps cleaned up on component destroy."),
        ("Exception Propagation",
         "Challenge: Deep validation errors in Java/Python layers failed to surface in the frontend UI.  |  Solution: Structured custom exceptions with stack trace logging to sidebar console for real-time debugging."),
        ("Multi-Language Integration",
         "Challenge: Coordinating data flow across React, Vue, Java, and Python required careful interface design.  |  Solution: Custom browser events bridge state between frameworks; standardized JSON payloads for cross-language communication.")
    ], header="Engineering Mitigations")

    # ═══════════════════════════════════════════════════════════
    # SLIDE 10 — THANK YOU
    # ═══════════════════════════════════════════════════════════
    s = prs.slides.add_slide(blank); bg(s)

    box = s.shapes.add_textbox(Inches(2), Inches(2.0), Inches(9.3), Inches(3.5))
    tf = box.text_frame; tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Thank You"
    p.font.name = 'Arial'; p.font.size = Pt(56); p.font.bold = True; p.font.color.rgb = GOLD
    p.alignment = PP_ALIGN.CENTER
    p.space_after = Pt(18)

    p2 = tf.add_paragraph()
    p2.text = "Questions about the hybrid architecture, security modules,\ncode integration, or prompt engineering workflow?"
    p2.font.name = 'Arial'; p2.font.size = Pt(16); p2.font.color.rgb = GRAY
    p2.alignment = PP_ALIGN.CENTER
    p2.space_after = Pt(32)

    p3 = tf.add_paragraph()
    p3.text = "Kolluri Chaturvedhi Narsimha  •  24EG109A28  •  github.com/Chatur7x/CineProo"
    p3.font.name = 'Arial'; p3.font.size = Pt(12); p3.font.color.rgb = MUTED
    p3.alignment = PP_ALIGN.CENTER

    # ── SAVE ──
    out = "CineBook_Pro_Presentation.pptx"
    prs.save(out)
    print(f"SUCCESS — Saved: {out}")

if __name__ == '__main__':
    main()
