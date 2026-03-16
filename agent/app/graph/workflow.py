from __future__ import annotations

from app.graph.nodes import route_request, run_tool
from app.graph.state import FamilyOSGraphState
from app.tools.familyos_tools import FamilyOSTools


def build_graph(tools: FamilyOSTools):
    """
    LangGraph-ready scaffold for future orchestration.

    The graph is intentionally thin. Domain behavior stays in services and tools,
    which makes it straightforward to reuse here, in a CLI, or behind an MCP server.
    """
    try:
        from langgraph.graph import END, START, StateGraph
    except ImportError as exc:  # pragma: no cover
        raise RuntimeError("langgraph is not installed. Run `uv sync` in `agent/`.") from exc

    graph = StateGraph(FamilyOSGraphState)
    graph.add_node("route_request", route_request)
    graph.add_node("run_tool", lambda state: run_tool(state, tools))
    graph.add_edge(START, "route_request")
    graph.add_edge("route_request", "run_tool")
    graph.add_edge("run_tool", END)
    return graph.compile()
