from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import KeepTogether
import os

# ─── Color Palette ───────────────────────────────────────────────────────────

PRIMARY     = colors.HexColor("#22c55e")   # Green
SECONDARY   = colors.HexColor("#16a34a")   # Dark Green
DARK        = colors.HexColor("#0f172a")   # Almost Black
CARD        = colors.HexColor("#1e293b")   # Card Background
GRAY        = colors.HexColor("#64748b")   # Gray
LIGHT_GRAY  = colors.HexColor("#f1f5f9")   # Light Background
WHITE       = colors.white
ACCENT      = colors.HexColor("#fbbf24")   # Yellow/Gold
DANGER      = colors.HexColor("#f97316")   # Orange

# ─── Styles ──────────────────────────────────────────────────────────────────

def _styles():
    return {
        "hero_title": ParagraphStyle("hero_title",
            fontSize=28, textColor=WHITE,
            fontName="Helvetica-Bold",
            alignment=TA_CENTER, spaceAfter=4, leading=32),

        "hero_sub": ParagraphStyle("hero_sub",
            fontSize=12, textColor=colors.HexColor("#86efac"),
            fontName="Helvetica", alignment=TA_CENTER, spaceAfter=2),

        "hero_day": ParagraphStyle("hero_day",
            fontSize=13, textColor=ACCENT,
            fontName="Helvetica-Bold", alignment=TA_CENTER),

        "section_title": ParagraphStyle("section_title",
            fontSize=14, textColor=DARK,
            fontName="Helvetica-Bold",
            spaceBefore=16, spaceAfter=8, leading=18),

        "tip_text": ParagraphStyle("tip_text",
            fontSize=10, textColor=colors.HexColor("#92400e"),
            fontName="Helvetica-Oblique", leading=16, spaceAfter=4),

        "footer": ParagraphStyle("footer",
            fontSize=8, textColor=GRAY,
            fontName="Helvetica", alignment=TA_CENTER),

        "badge": ParagraphStyle("badge",
            fontSize=9, textColor=WHITE,
            fontName="Helvetica-Bold", alignment=TA_CENTER),

        "stats_num": ParagraphStyle("stats_num",
            fontSize=20, textColor=PRIMARY,
            fontName="Helvetica-Bold", alignment=TA_CENTER, leading=24),

        "stats_label": ParagraphStyle("stats_label",
            fontSize=8, textColor=GRAY,
            fontName="Helvetica", alignment=TA_CENTER),
    }

# ─── Hero Banner ─────────────────────────────────────────────────────────────

def _hero(day: int, goal: str, email: str, s: dict) -> Table:
    goal_label  = "🔥 Fat Loss" if goal == "Fat Loss" else "💪 Muscle Gain"
    user        = email.split("@")[0].title()

    inner = Table([
        [Paragraph("💪 FitAI Planner", s["hero_title"])],
        [Paragraph(f"Personal Fitness & Diet Plan for {user}", s["hero_sub"])],
        [Spacer(1, 0.2 * cm)],
        [Paragraph(f"DAY {day}  ·  {goal_label}", s["hero_day"])],
    ], colWidths=[17 * cm])

    inner.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (-1, -1), DARK),
        ("PADDING",     (0, 0), (-1, -1), 20),
        ("ROUNDEDCORNERS", [12]),
    ]))
    return inner

# ─── Stats Bar ───────────────────────────────────────────────────────────────

def _stats_bar(day: int, goal: str, s: dict) -> Table:
    duration    = 30
    progress    = min(int((day / duration) * 100), 100)
    remaining   = duration - day

    data = [[
        Table([[Paragraph(f"{day}",        s["stats_num"])],
               [Paragraph("Day",           s["stats_label"])]], colWidths=[5*cm]),
        Table([[Paragraph(f"{remaining}",  s["stats_num"])],
               [Paragraph("Days Left",     s["stats_label"])]], colWidths=[5*cm]),
        Table([[Paragraph(f"{progress}%",  s["stats_num"])],
               [Paragraph("Complete",      s["stats_label"])]], colWidths=[5*cm]),
    ]]

    table = Table(data, colWidths=[5.6 * cm, 5.6 * cm, 5.6 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (-1, -1), LIGHT_GRAY),
        ("PADDING",     (0, 0), (-1, -1), 12),
        ("LINEAFTER",   (0, 0), (1, 0),   0.5, colors.HexColor("#cbd5e1")),
        ("ROUNDEDCORNERS", [8]),
    ]))
    return table

# ─── Tip Box ─────────────────────────────────────────────────────────────────

def _tip_box(tip: str, s: dict) -> Table:
    data = [[
        Paragraph("💡", ParagraphStyle("icon", fontSize=20, alignment=TA_CENTER)),
        Paragraph(tip,  s["tip_text"]),
    ]]
    table = Table(data, colWidths=[1.2 * cm, 15.5 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (-1, -1), colors.HexColor("#fffbeb")),
        ("LINEAFTER",   (0, 0), (0, 0),   3, colors.HexColor("#fbbf24")),
        ("PADDING",     (0, 0), (-1, -1), 10),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        ("ROUNDEDCORNERS", [6]),
    ]))
    return table

# ─── Meal Table ──────────────────────────────────────────────────────────────

def _meal_table(meal_plan: dict) -> Table:
    icons = {
        "breakfast": ("🌅", "Breakfast", colors.HexColor("#fef3c7")),
        "lunch":     ("☀️", "Lunch",     colors.HexColor("#dcfce7")),
        "snack":     ("🍎", "Snack",     colors.HexColor("#fce7f3")),
        "dinner":    ("🌙", "Dinner",    colors.HexColor("#ede9fe")),
    }

    data = []
    for key, value in meal_plan.items():
        icon, label, bg = icons.get(key, ("🍽️", key.title(), LIGHT_GRAY))
        row = [
            Paragraph(f"{icon} {label}", ParagraphStyle("meal_label",
                fontSize=10, fontName="Helvetica-Bold",
                textColor=DARK, alignment=TA_CENTER)),
            Paragraph(value, ParagraphStyle("meal_value",
                fontSize=9, fontName="Helvetica",
                textColor=colors.HexColor("#374151"), leading=14)),
        ]
        data.append(row)

    table = Table(data, colWidths=[3.5 * cm, 13.2 * cm])
    
    style = [
        ("GRID",    (0, 0), (-1, -1), 0.3, colors.HexColor("#e2e8f0")),
        ("PADDING", (0, 0), (-1, -1), 10),
        ("VALIGN",  (0, 0), (-1, -1), "MIDDLE"),
        ("ROUNDEDCORNERS", [6]),
    ]

    bg_colors = [
        colors.HexColor("#fef3c7"),
        colors.HexColor("#dcfce7"),
        colors.HexColor("#fce7f3"),
        colors.HexColor("#ede9fe"),
    ]
    for i, bg in enumerate(bg_colors):
        style.append(("BACKGROUND", (0, i), (0, i), bg))
        style.append(("BACKGROUND", (1, i), (1, i), WHITE))

    table.setStyle(TableStyle(style))
    return table

# ─── Workout Table ───────────────────────────────────────────────────────────

def _workout_table(workout: list) -> Table:
    header = [[
        Paragraph("#",          ParagraphStyle("wh", fontSize=9, textColor=WHITE, fontName="Helvetica-Bold", alignment=TA_CENTER)),
        Paragraph("Exercise",   ParagraphStyle("wh", fontSize=9, textColor=WHITE, fontName="Helvetica-Bold")),
        Paragraph("Status",     ParagraphStyle("wh", fontSize=9, textColor=WHITE, fontName="Helvetica-Bold", alignment=TA_CENTER)),
    ]]

    rows = []
    for i, ex in enumerate(workout, 1):
        rows.append([
            Paragraph(str(i), ParagraphStyle("wn", fontSize=10,
                textColor=PRIMARY, fontName="Helvetica-Bold", alignment=TA_CENTER)),
            Paragraph(ex, ParagraphStyle("we", fontSize=9,
                textColor=DARK, fontName="Helvetica", leading=14)),
            Paragraph("☐ Done", ParagraphStyle("ws", fontSize=8,
                textColor=GRAY, fontName="Helvetica", alignment=TA_CENTER)),
        ])

    data = header + rows
    table = Table(data, colWidths=[1.2 * cm, 13 * cm, 2.5 * cm])
    
    style = [
        ("BACKGROUND",     (0, 0), (-1, 0),  DARK),
        ("PADDING",        (0, 0), (-1, -1), 10),
        ("GRID",           (0, 0), (-1, -1), 0.3, colors.HexColor("#e2e8f0")),
        ("VALIGN",         (0, 0), (-1, -1), "MIDDLE"),
        ("ROUNDEDCORNERS", [6]),
    ]

    for i in range(1, len(rows) + 1):
        bg = LIGHT_GRAY if i % 2 == 0 else WHITE
        style.append(("BACKGROUND", (0, i), (-1, i), bg))

    table.setStyle(TableStyle(style))
    return table

# ─── Footer ──────────────────────────────────────────────────────────────────

def _footer(s: dict) -> Table:
    data = [[
        Paragraph("💪 FitAI Planner", ParagraphStyle("fl",
            fontSize=9, textColor=PRIMARY,
            fontName="Helvetica-Bold")),
        Paragraph("Stay Consistent · Stay Strong · You've Got This! 🔥", ParagraphStyle("fc",
            fontSize=8, textColor=GRAY,
            fontName="Helvetica", alignment=TA_CENTER)),
        Paragraph("fitai.app", ParagraphStyle("fr",
            fontSize=9, textColor=GRAY,
            fontName="Helvetica", alignment=TA_RIGHT)),
    ]]
    table = Table(data, colWidths=[5 * cm, 7 * cm, 4.7 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GRAY),
        ("PADDING",    (0, 0), (-1, -1), 10),
        ("VALIGN",     (0, 0), (-1, -1), "MIDDLE"),
        ("ROUNDEDCORNERS", [6]),
    ]))
    return table

# ─── Section Header ──────────────────────────────────────────────────────────

def _section_header(title: str, color=PRIMARY) -> Table:
    data = [[Paragraph(title, ParagraphStyle("sh",
        fontSize=12, textColor=WHITE,
        fontName="Helvetica-Bold", leading=16))]]
    table = Table(data, colWidths=[17 * cm])
    table.setStyle(TableStyle([
        ("BACKGROUND",     (0, 0), (-1, -1), color),
        ("PADDING",        (0, 0), (-1, -1), 10),
        ("ROUNDEDCORNERS", [6]),
    ]))
    return table

# ─── Main Generator ──────────────────────────────────────────────────────────

def generate_daily_pdf(email: str, day: int, goal: str,
                        meal_plan: dict, workout: list, tip: str) -> str:

    os.makedirs("pdfs", exist_ok=True)
    filename = f"pdfs/{email.split('@')[0]}_day{day}.pdf"

    doc = SimpleDocTemplate(filename, pagesize=A4,
                            leftMargin=2*cm, rightMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    s     = _styles()
    story = []

    # Hero
    story.append(_hero(day, goal, email, s))
    story.append(Spacer(1, 0.4 * cm))

    # Stats Bar
    story.append(_stats_bar(day, goal, s))
    story.append(Spacer(1, 0.4 * cm))

    # Tip
    story.append(_tip_box(tip, s))
    story.append(Spacer(1, 0.4 * cm))

    # Meal Plan
    story.append(_section_header("🥗  Today's Meal Plan"))
    story.append(Spacer(1, 0.2 * cm))
    story.append(_meal_table(meal_plan))
    story.append(Spacer(1, 0.4 * cm))

    # Workout
    story.append(_section_header("🏋️  Today's Workout  —  Check off each exercise!", CARD))
    story.append(Spacer(1, 0.2 * cm))
    story.append(_workout_table(workout))
    story.append(Spacer(1, 0.5 * cm))

    # Footer
    story.append(HRFlowable(width="100%", thickness=0.5,
                             color=colors.HexColor("#e2e8f0")))
    story.append(Spacer(1, 0.2 * cm))
    story.append(_footer(s))

    doc.build(story)
    return filename