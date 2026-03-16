from __future__ import annotations

from app.graph.state import FamilyOSGraphState
from app.tools.familyos_tools import FamilyOSTools


def route_request(state: FamilyOSGraphState) -> FamilyOSGraphState:
    request = state.get("user_request", "").lower()

    if "upcoming" in request and "event" in request:
        return {"intent": "get_upcoming_events", "tool_input": {"limit": 5}}
    if "open" in request and "task" in request:
        return {"intent": "list_open_tasks", "tool_input": {"limit": 5}}
    if "knowledge" in request or "note" in request:
        return {
            "intent": "search_knowledge_items",
            "tool_input": {"query": state.get("user_request", ""), "limit": 5},
        }

    return {"intent": "list_open_tasks", "tool_input": {"limit": 5}}


def run_tool(state: FamilyOSGraphState, tools: FamilyOSTools) -> FamilyOSGraphState:
    intent = state.get("intent")
    tool_input = state.get("tool_input", {})

    if not intent:
        return {"result": {"error": "No intent routed."}}

    handler = getattr(tools, intent, None)
    if handler is None:
        return {"result": {"error": f"Unknown tool intent: {intent}"}}

    return {"result": handler(**tool_input)}
