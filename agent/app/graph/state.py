from __future__ import annotations

from typing import Any, TypedDict


class FamilyOSGraphState(TypedDict, total=False):
    user_request: str
    intent: str
    tool_input: dict[str, Any]
    result: Any
