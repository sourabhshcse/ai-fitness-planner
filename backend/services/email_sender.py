import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date

from services.challenge_logic import active_challenges, get_daily_content
from services.pdf_generator import generate_daily_pdf

# ─── Config ──────────────────────────────────────────────────────────────────

SENDER_EMAIL    = os.getenv("EMAIL_ADDRESS") or "sourabhsh.cse@gmail.com"
SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD") or "qiww vqsc tyno jwzh"

# ─── Send to Single User ─────────────────────────────────────────────────────

def send_daily_plan(to_email: str, day: int, goal: str, pdf_path: str) -> dict:
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        return {"status": "error", "message": "Email credentials not set"}

    try:
        msg = MIMEMultipart()
        msg["From"]    = SENDER_EMAIL
        msg["To"]      = to_email
        msg["Subject"] = f"💪 FitAI — Day {day} {goal} Plan is Ready!"

        body = f"""
        <html><body style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: white;
                      border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <div style="background: #0f172a; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0;">💪 FitAI Planner</h1>
              <p style="color: #86efac; margin: 6px 0 0;">Day {day} · {goal}</p>
            </div>

            <div style="padding: 24px;">
              <p style="color: #374151;">Hey Champion! 🔥</p>
              <p style="color: #374151;">
                Your <strong>Day {day}</strong> plan is attached as a PDF.<br>
                Open it, follow the meals and workout, and stay consistent!
              </p>

              <div style="background: #f0fdf4; border-left: 4px solid #22c55e;
                          padding: 12px 16px; border-radius: 6px; margin: 16px 0;">
                <p style="color: #166534; margin: 0;">
                  ✅ Stay hydrated · 🍱 Follow the meal plan · 🏋️ Complete your workout
                </p>
              </div>

              <p style="color: #6b7280; font-size: 13px;">
                Keep going — every day counts! 💪
              </p>
            </div>

            <div style="background: #f9fafb; padding: 12px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                FitAI Planner · Stay consistent, stay strong 🔥
              </p>
            </div>

          </div>
        </body></html>
        """
        msg.attach(MIMEText(body, "html"))

        # ── Attach PDF ──
        with open(pdf_path, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f"attachment; filename=Day{day}_Plan.pdf"
            )
            msg.attach(part)

        # ── Send ──
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, to_email, msg.as_string())

        return {"status": "success", "message": f"Day {day} plan sent to {to_email}"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

# ─── Send to All Active Users ─────────────────────────────────────────────────

def send_to_all_users():
    print(f"⏰ Scheduler running — sending emails to {len(active_challenges)} users...")

    for email, challenge in active_challenges.items():
        if not challenge["active"]:
            continue

        start       = date.fromisoformat(challenge["start_date"])
        today       = date.today()
        current_day = (today - start).days + 1

        if current_day > challenge["duration"]:
            challenge["active"] = False
            print(f"✅ {email} completed their challenge!")
            continue

        goal    = challenge["goal"]
        content = get_daily_content(goal, current_day)

        pdf_path = generate_daily_pdf(
            email     = email,
            day       = current_day,
            goal      = content["goal"],
            meal_plan = content["meal_plan"],
            workout   = content["workout"],
            tip       = content["tip"],
        )

        result = send_daily_plan(email, current_day, content["goal"], pdf_path)
        print(f"📧 {email} → Day {current_day} → {result['status']}")

# ─── Scheduler ───────────────────────────────────────────────────────────────

def start_scheduler(preferred_time: str = "08:00"):
    hour, minute = map(int, preferred_time.split(":"))
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        send_to_all_users,
        trigger = "cron",
        hour    = hour,
        minute  = minute,
    )
    scheduler.start()
    print(f"✅ Scheduler started — emails will send daily at {preferred_time}")
    return scheduler