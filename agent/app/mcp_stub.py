from __future__ import annotations

from app.tools.familyos_tools import FamilyOSTools


def register_familyos_mcp_tools(tools: FamilyOSTools) -> dict[str, object]:
    """
    Minimal placeholder showing the intended seam for MCP integration.

    A future custom MCP server should register high-level tool handlers from here,
    such as `create_task` or `search_knowledge_items`, instead of exposing raw tables
    or SQL execution.
    """
    return {
        "create_task": tools.create_task,
        "list_open_tasks": tools.list_open_tasks,
        "create_event": tools.create_event,
        "get_upcoming_events": tools.get_upcoming_events,
        "save_knowledge_item": tools.save_knowledge_item,
        "search_knowledge_items": tools.search_knowledge_items,
    }
