"""
Image enrichment for events: fetch og:image from source_url via requests + regex.
No Firecrawl credits. Optional; all exceptions are caught.
"""
import re
import requests
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError

OG_IMAGE_RE = re.compile(
    r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
    re.IGNORECASE,
)

REQUEST_TIMEOUT = 5
MAX_WORKERS = 3
MAX_EVENTS_TO_ENRICH = 5


def _fetch_og_image(url: str) -> str | None:
    """Fetch URL with 5s timeout; parse HTML for og:image; return content URL or None."""
    try:
        resp = requests.get(url, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        match = OG_IMAGE_RE.search(resp.text)
        return match.group(1).strip() if match else None
    except Exception:
        return None


def enrich_events_images(events: list) -> None:
    """
    For up to the first 5 events with image_url is None, fetch source_url HTML
    and set event.image_url from <meta property="og:image" content="...">.
    Uses ThreadPoolExecutor(max_workers=3), 5s timeout per request. Mutates events in place.
    """
    to_enrich = [e for e in events[:MAX_EVENTS_TO_ENRICH] if getattr(e, "image_url", None) is None]
    if not to_enrich:
        return
    urls = [getattr(e, "source_url", None) for e in to_enrich]
    results = [None] * len(to_enrich)
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            executor.submit(_fetch_og_image, u) if u else None
            for u in urls
        ]
        for i, fut in enumerate(futures):
            if fut is None:
                continue
            try:
                results[i] = fut.result(timeout=REQUEST_TIMEOUT)
            except Exception:
                pass
    for event, url in zip(to_enrich, results):
        if url:
            try:
                event.image_url = url
            except Exception:
                pass
