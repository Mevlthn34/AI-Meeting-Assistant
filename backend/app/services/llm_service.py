import json
import re

import ollama


def analyze_meeting(transcript: str) -> dict:
    prompt = f"""
Aşağıdaki toplantı metnini Türkçe analiz et.

Yalnızca geçerli JSON döndür.
Markdown kod bloğu kullanma.
JSON dışında hiçbir açıklama yazma.

Kurallar:
- summary alanı toplantının kısa ve net özeti olsun.
- action_items yalnızca gerçekten yapılması gereken işleri içersin.
- key_decisions yalnızca toplantıda açıkça alınmış kararları içersin.
- Metinde açık bir karar yoksa key_decisions boş liste olsun.
- Metinden karar veya görev uydurma.
- action_items ve key_decisions maddeleri kısa ve anlaşılır olsun.
- Boş veya anlamsız maddeler ekleme.
- Aynı bilgiyi tekrar etme.

Şu yapıyı kullan:

{{
  "summary": "Toplantının kısa özeti",
  "action_items": [
    "Yapılacak iş 1",
    "Yapılacak iş 2"
  ],
  "key_decisions": [
    "Önemli karar 1",
    "Önemli karar 2"
  ]
}}

Toplantı metni:
{transcript}
"""

    response = ollama.chat(
        model="phi4-mini",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        format="json",
    )

    raw_content = response["message"]["content"].strip()

    cleaned_content = re.sub(
        r"^```(?:json)?\s*|\s*```$",
        "",
        raw_content,
        flags=re.IGNORECASE,
    ).strip()

    try:
        data = json.loads(cleaned_content)

        action_items = data.get("action_items", [])
        key_decisions = data.get("key_decisions", [])

        if not isinstance(action_items, list):
            action_items = []

        if not isinstance(key_decisions, list):
            key_decisions = []

        action_items = [
            str(item).strip()
            for item in action_items
            if str(item).strip()
        ]

        key_decisions = [
            str(item).strip()
            for item in key_decisions
            if str(item).strip()
        ]

        return {
            "summary": str(data.get("summary", "")).strip(),
            "action_items": action_items,
            "key_decisions": key_decisions,
        }

    except (json.JSONDecodeError, TypeError):
        return {
            "summary": cleaned_content,
            "action_items": [],
            "key_decisions": [],
        }