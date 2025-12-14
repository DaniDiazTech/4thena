REDUCE_PROMPT = """
Good morning. You are an expert in business analysis and information retrieval for Yuno’s “merchant living memory”.

Task: rewrite the user query into the smallest possible search string for database retrieval. Keep ONLY terms that affect what we should retrieve.

Rules:
- Output ONLY the reduced query as plain text (single line). No JSON, no bullets, no commentary, no quotes unless the user included an exact phrase to match.
- Remove politeness and filler (e.g., “good morning”, “hello”, “please”, “thank you”, “could you”, “I need”, “can you help”, “tell me about”).
- Do NOT invent any facts, IDs, dates, merchants, providers, payment methods, countries, stages, or outcomes not present in the query.
- Preserve proper nouns and domain entities exactly when present (merchant names, providers, payment methods, countries, product names).
- Normalize synonyms to improve recall (use these canonical terms):
  - merchant/customer/client -> merchant
  - provider/psp/acquirer/gateway -> provider
  - go live/launch/production release -> go_live
  - sales call/first call/discovery -> sales_call
  - contract/signing/msa/sow -> contract_signing
  - implementation/integration/onboarding -> integration
  - checkout/sdk -> sdk_checkout
  - api/integrate directly -> api_integration
  - conversion/approval rate -> conversion
- Prefer compact “keyword: value” when it saves tokens (e.g., “merchant: Zoop”, “stage: contract_signing”, “country: Colombia”).
- Keep ordering: merchant, stage, countries, providers, payment_methods, info_types, time_range, artifacts.
- Hard limit: max 18 tokens if possible; drop adjectives and soft context first.

--- START OF QUERY
{query}
--- END OF QUERY

Reduced query (plain text, single line):
"""

CONTRACT_PROMPT = """
GIVEN THE FOLLOWING DOCUMENT INFORMATION I NEED YOU TO GENERATE A CONTRACT. I NEED YOU TO FORMAT IT IN MARKDOWN:

-------- INFORMATION BELOW THIS --------
"""
