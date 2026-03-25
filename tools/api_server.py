"""
Pipeline API server. After normalize_all() produces the events list,
image enrichment runs (requests + regex for og:image, no Firecrawl).
"""
from enrich_event_images import enrich_events_images

# ---------------------------------------------------------------------------
# Your pipeline here: e.g. events = normalize_all(...) or from your pipeline:
#   events = get_recommended_events(...)  # list of objects with .source_url, .image_url
# ---------------------------------------------------------------------------

def get_plan_events():
    # Replace this with your real pipeline that returns a list of event objects
    # (each with .source_url, .image_url, and other NormalizedEvent fields).
    events = []  # e.g. normalize_all(...) or similar
    return events


def build_plan():
    events = get_plan_events()
    # Image enrichment: for up to 5 events with no image_url, fetch og:image from source_url
    enrich_events_images(events)
    # ... build and return plan dict with recommended_events=events
    return {"recommended_events": events, "phases": [], "recommended_experts": []}
