import google.generativeai as genai
from app.core.config import settings
import json
import random

class GeminiService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel("gemini-2.0-flash", generation_config={"temperature": 0.8})
        else:
            self.model = None

    async def generate_whatsapp_messages(self, count: int = 5) -> list:
        """
        Generate WhatsApp conversation messages including both client inquiries and Yuno responses.
        """
        if not self.model:
            return self._generate_fallback_whatsapp_conversation(count)

        scenarios = [
    """
Context: General inquiries from mixed industries.
Topics: Payment integration for Colombia/Mexico, Credit card + PSE, Risk management, Basic API questions, Pricing.
Client Persona: Business owners and PMs from various mid-sized companies.
Yuno Responder Personality: Colombian Stand-up Comedian (inspired by Peter Albeiro and Aurelio “Cheveroni”; style only, no exact imitation)
- Keeps everything in English with a warm Colombian flavor; uses light, universal humor (no Spanish slang or catchphrases).
- Playful, self-deprecating analogies for complex topics (“PSE is like the bank transfer’s express lane”).
- Varies greetings and openings to avoid repetition; never repeats the same joke structure.
- Punchy but helpful: jokes never replace concrete guidance (docs, next steps, timelines).
- Avoids copying any real comedian’s signature lines; all wording must be original.
    """,
    """
Context: High-growth Startups focusing on speed.
Topics: Quick integration, Developer SDKs, Sandbox access, "Go live" timeline, Startup-friendly pricing.
Client Persona: CTOs and Founders of new tech startups (e.g., "FoodieApp", "RideFast"). Tone is urgent and informal.
Yuno Responder Personality: Cleopatra VII (Last Pharaoh of Egypt, 69-30 BC)
- Responds with political savvy and strategic vision, treats integrations like alliance building.
- Uses dramatic, charismatic language with occasional references to conquest and expansion.
- Positions features as "forming powerful alliances" or "commanding the payment realm".
- Flirtatious but professional, makes clients feel like the most important kingdom.
- References building empires, securing territories (markets), and strategic dominance.
- Signs off with royal confidence and grand promises of merchant success.
    """,
    """
Context: Enterprise/Corporate clients focusing on compliance.
Topics: PCI-DSS compliance, Security, SLAs, High availability, Dedicated support, Contract terms.
Client Persona: IT Directors and Enterprise Architects from large firms. Tone is formal and demanding.
Yuno Responder Personality: Marie Curie (Physicist and Chemist, 1867-1934)
- Ruthlessly precise, data-driven, no tolerance for imprecision or vagueness.
- Responds with scientific rigor, citing exact specifications and measurements.
- Cold but competent, treats compliance like laboratory protocols.
- Uses chemistry/physics analogies for security ("encryption is like radioactive decay—irreversible").
- Dismissive of "soft" concerns, focuses purely on technical facts and certifications.
- Signs off with clinical efficiency, sometimes barely acknowledging pleasantries.
    """,
    """
Context: Technical integration details.
Topics: Webhooks, API signatures, Idempotency, Error handling, Postman collections, Specific parameter questions.
Client Persona: Developers and Tech Leads. Tone is technical and specific.
Yuno Responder Personality: Leonardo da Vinci (Polymath, 1452-1519)
- Approaches APIs as artistic and engineering masterpieces, obsessed with design elegance.
- Asks probing questions back to understand the "whole system" like sketching anatomy.
- References his own inventions when explaining webhooks ("like my flying machine, but for data").
- Poetic about code architecture, sees webhooks as mechanical symphonies.
- Sometimes goes on tangents about the beauty of REST design or JSON structure.
- Sketches ASCII diagrams in responses, signs off with Renaissance flourish.
    """,
    """
Context: Operations and Finance focus.
Topics: Reconciliation reports, Dashboard access, Refunds, Chargebacks, Settlement timelines, Multi-currency reporting.
Client Persona: Finance Managers and Ops Leads. Tone is focused on money flow and reporting.
Yuno Responder Personality: Winston Churchill (Prime Minister, 1874-1965)
- Treats financial operations like wartime strategy, dramatically urgent about cash flow.
- Uses militaristic language: "defending against chargebacks", "conquering reconciliation challenges".
- Motivational and bombastic, makes settlement timelines sound like D-Day operations.
- Never surrenders to mundane finance questions, elevates them to epic struggles.
- References historical battles when discussing dispute resolution.
- Signs off with rousing speeches about merchant victory and financial triumph.
    """,
    """
Context: Misinformation / noise stress-test thread (intentionally off-topic client).
Topics: None required from the standard list; the client derails with bizarre conspiracy claims about payments, routing, and “hidden actors”.
Client Persona: A single client who posts nonsensical conspiracy chatter, jumps between topics, and makes irrational demands. Messages are absurd and clearly fictional (no real-world accusations or harmful claims).
Yuno Responder Personality: Calm Reality-Anchor (Support/Triage)
- Stays polite and professional, does not validate conspiracies, and repeatedly redirects to concrete requirements.
- Asks short clarifying questions (country, payment methods, volumes, timeline) and proposes actionable steps (sandbox, docs, webhooks).
- If the client continues derailing, sets boundaries and offers to schedule a technical call with an agenda.
    """
]
        
        selected_scenario = random.choice(scenarios)

        prompt = f"""
You are generating synthetic WhatsApp chat data for testing. Create a WhatsApp conversation between potential clients and Yuno (a payment integration/orchestration company).

Generate exactly {count} messages total as one continuous chat thread.
Message mix: ~60% client messages (is_yuno=false) and ~40% Yuno responses (is_yuno=true). Ensure the final counts match as closely as possible (difference of at most 1 from the 60/40 split).

Topics (must all appear at least once across the dataset, and none should dominate more than ~30% of messages):
- Payment integration for Colombia and Mexico
- Credit card processing + PSE (Colombian bank transfers)
- Risk management + fraud prevention
- API capabilities: webhooks + sandbox environment
- Pricing + implementation timelines

Output format:
Return ONLY a valid JSON array. Each element must be exactly:
{{"text": "message content", "is_yuno": true|false}}
No extra keys. No markdown. No commentary. No trailing commas.

Language and tone rules:
- All messages MUST be in English.
- WhatsApp-style: casual but professional, short and natural (typically 1–2 sentences, aim for < 200 characters unless necessary).
- No placeholders like [Name], <NAME>, or bracketed text.

Client-message rules (is_yuno=false):
- Every client message must include a fictional company name inline (not as metadata).
- Use a LARGE and varied pool of company names (e.g., TechFlow, PayMaster, QuickBuy, NovaPay, AndesCart, CloudKiosk, RutaMarket, PixelRetail, CobrePay, SelvaTravel, MonoEats, BrightSub, TerraShop, QuantaPOS, LlamaLogistics, MarlinTickets).
- Avoid repetition: do not use the same client company name in more than 2 messages total unless {count} > 60 (then max 3).
- Vary the speaker style: some messages are direct questions, some provide context (volumes, launch date, current PSP pain), some ask for docs, some ask for a call.

Yuno-message rules (is_yuno=true):
- Vary Yuno responders to avoid a single “voice”. Rotate names and roles naturally inside the message (no extra fields), e.g.:
  - “Ana from Yuno (Solutions Engineer)”
  - “Mateo at Yuno (Implementation)”
  - “Sofia from Yuno (Partnerships)”
  - “Daniel at Yuno (Support)”
Use each Yuno name at most 2 times (unless {count} > 60, then max 3).
- Do not start responses with the same greeting repeatedly. Across all Yuno messages, do not reuse an identical opening (first 3 words) more than once.
- Be helpful and specific but not overly long: propose next steps (sandbox, API docs, webhooks), ask clarifying questions (countries, payment methods, volumes), mention typical timelines at a high level, and keep pricing responses realistic (e.g., “depends on volume and methods; we can share a proposal”).

Anti-duplication and realism constraints:
- No two messages may be identical.
- Avoid repeating the same sentence template (e.g., “Hi, we are X and want Y”) more than twice across the entire dataset.
- Maintain conversational continuity: client questions should usually be followed soon by a relevant Yuno answer, but allow occasional client follow-ups.
- Do not mention the same provider brand (Stripe/Adyen/etc.) in more than 2 messages total (and it’s okay to mention none).

Now generate the JSON array with exactly {count} messages.
"""




        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            # Clean up response
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            messages = json.loads(text.strip())
            return messages
        except Exception as e:
            print(f"Gemini error: {e}")
            return self._generate_fallback_whatsapp_conversation(count)

    def _generate_fallback_whatsapp_conversation(self, count: int) -> list:
        """Fallback WhatsApp conversation when Gemini is not available."""
        fallback = [
            {"text": "Hey! This is Mike from TechFlow. We need to integrate payments for our Colombia launch. Can you help?", "is_yuno": False},
            {"text": "Hi Mike! Absolutely, we'd love to help TechFlow. We have full support for Colombia including PSE and card payments. What's your timeline?", "is_yuno": True},
            {"text": "Hi there, Sarah from PayMaster here. Quick question - do you guys support fraud prevention out of the box?", "is_yuno": False},
            {"text": "Hey Sarah! Yes, our platform includes real-time fraud detection and customizable risk rules. Want me to send you the docs?", "is_yuno": True},
            {"text": "QuickBuy team here. How long does a typical integration take?", "is_yuno": False},
            {"text": "Usually 2-4 weeks depending on complexity. We give you sandbox access right away so you can start testing immediately!", "is_yuno": True},
            {"text": "NovaPay checking in. Do you have webhooks for transaction updates?", "is_yuno": False},
            {"text": "Yep! Full webhook support for all events - payments, refunds, chargebacks. Real-time notifications.", "is_yuno": True},
            {"text": "Hey, FinTech Solutions here. What about PCI compliance?", "is_yuno": False},
            {"text": "We're PCI DSS Level 1 certified. With our tokenization, you won't need to handle card data directly. Makes compliance much easier for you!", "is_yuno": True},
        ]
        return random.sample(fallback, min(count, len(fallback)))

    def _generate_fallback_messages(self, count: int) -> list:
        """Fallback messages when Gemini is not available."""
        fallback = [
            "Hello, I am interested in integrating Yuno’s payment solutions for operations in Colombia and Mexico.",
            "What is the estimated timeline for a full PSE integration?",
            "Which card networks do you support in Mexico? Does that include Visa, Mastercard, and Amex?",
            "We also require robust risk management. Do you offer a built-in fraud prevention engine?",
            "Could you detail your transaction fees and pricing structure?",
            "Do you provide a Sandbox environment for development and testing?",
            "Is your technical support team available in Spanish?",
            "Does your platform support recurring payments and subscription billing?",
            "What compliance documentation is required to begin the onboarding process?",
            "Do you offer a RESTful API and Webhooks for real-time notifications?"
        ]
        return random.sample(fallback, min(count, len(fallback)))

    async def generate_linkedin_conversation(self, count: int = 5) -> list:
        """
        Generate LinkedIn conversation messages including both client inquiries and Yuno responses.
        """
        if not self.model:
            return self._generate_fallback_linkedin_conversation(count)

        prompt = f"""Generate a LinkedIn conversation between potential clients and Yuno (a payment integration company).
        
Generate {count} messages total. Mix of client inquiries AND Yuno responses. About 60% should be client messages, 40% should be Yuno responses.

Topics to cover:
- Payment integration for Colombia and Mexico
- Credit card processing, PSE (Colombian bank transfers)
- Risk management and fraud prevention
- API capabilities, webhooks, sandbox environment
- Pricing and implementation timelines

Return ONLY a valid JSON array with this exact format:
[
  {{"text": "message content", "is_yuno": false}},
  {{"text": "response from Yuno", "is_yuno": true}}
]

Rules:
- All messages MUST be in English
- Professional LinkedIn tone
- Client messages should include their company name (use fictional names like TechFlow, PayMaster, QuickBuy, NovaPay)
- Yuno responses should be helpful and professional
- Do NOT use placeholders like [Name] or bracketed text
- Make it feel like a real conversation thread

Only return the JSON array, nothing else."""

        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            # Clean up response
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            
            messages = json.loads(text.strip())
            return messages
        except Exception as e:
            print(f"Gemini error: {e}")
            return self._generate_fallback_linkedin_conversation(count)

    def _generate_fallback_linkedin_conversation(self, count: int) -> list:
        """Fallback LinkedIn conversation when Gemini is not available."""
        fallback = [
            {"text": "Hi! I'm the CTO at TechFlow. We're exploring payment solutions for our expansion to Latin America. Does Yuno support both Colombia and Mexico?", "is_yuno": False},
            {"text": "Hello! Yes, Yuno provides comprehensive payment solutions across Latin America, including Colombia and Mexico. We support local payment methods like PSE in Colombia and OXXO in Mexico, alongside international card processing.", "is_yuno": True},
            {"text": "That's great to hear. At PayMaster, we're particularly interested in your fraud prevention capabilities. Can you tell me more?", "is_yuno": False},
            {"text": "Absolutely! Our risk management platform includes real-time fraud detection, customizable rules, and machine learning models. We can reduce chargeback rates significantly.", "is_yuno": True},
            {"text": "QuickBuy here. What's the typical integration timeline for a full implementation?", "is_yuno": False},
            {"text": "Most integrations can be completed within 2-4 weeks depending on complexity. We provide sandbox access immediately and dedicated technical support throughout.", "is_yuno": True},
            {"text": "Hi from NovaPay! Do you offer webhooks for real-time transaction notifications?", "is_yuno": False},
            {"text": "Yes! We have a robust webhook system for all transaction events. You'll receive real-time notifications for payments, refunds, and chargebacks.", "is_yuno": True},
            {"text": "I'm from FinTech Solutions. What about PCI DSS compliance? Do we need to handle card data ourselves?", "is_yuno": False},
            {"text": "We're fully PCI DSS Level 1 compliant. With our hosted checkout and tokenization services, you won't need to handle raw card data, simplifying your compliance requirements.", "is_yuno": True},
        ]
        return random.sample(fallback, min(count, len(fallback)))

gemini_service = GeminiService()
