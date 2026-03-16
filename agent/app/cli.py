from __future__ import annotations

import argparse
import json
from datetime import datetime
from typing import Any

from app.config import Settings
from app.db import Database
from app.graph.workflow import build_graph
from app.services.events import EventsService
from app.services.knowledge import KnowledgeService
from app.services.tasks import TasksService
from app.tools.familyos_tools import FamilyOSTools


def build_tools() -> FamilyOSTools:
    settings = Settings.from_env()
    db = Database(settings)
    return FamilyOSTools(
        tasks_service=TasksService(db),
        events_service=EventsService(db),
        knowledge_service=KnowledgeService(db),
    )


def parse_datetime(value: str | None) -> datetime | None:
    return datetime.fromisoformat(value) if value else None


def render(data: Any) -> None:
    print(json.dumps(data, indent=2, default=str))


def main() -> None:
    parser = argparse.ArgumentParser(description="FamilyOS agent CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("list-open-tasks")
    subparsers.add_parser("upcoming-events")

    create_task = subparsers.add_parser("create-task")
    create_task.add_argument("--title", required=True)
    create_task.add_argument("--description")
    create_task.add_argument("--category")
    create_task.add_argument("--priority", default="medium")
    create_task.add_argument("--due-at")
    create_task.add_argument("--owner-person-id")

    create_event = subparsers.add_parser("create-event")
    create_event.add_argument("--title", required=True)
    create_event.add_argument("--description")
    create_event.add_argument("--category")
    create_event.add_argument("--status", default="planned")
    create_event.add_argument("--event-start")
    create_event.add_argument("--event-end")
    create_event.add_argument("--location")
    create_event.add_argument("--owner-person-id")

    save_knowledge = subparsers.add_parser("save-knowledge")
    save_knowledge.add_argument("--title", required=True)
    save_knowledge.add_argument("--content")
    save_knowledge.add_argument("--category")
    save_knowledge.add_argument("--source")
    save_knowledge.add_argument("--owner-person-id")

    search_knowledge = subparsers.add_parser("search-knowledge")
    search_knowledge.add_argument("--query", required=True)

    graph_parser = subparsers.add_parser("run-graph")
    graph_parser.add_argument("--request", required=True)

    args = parser.parse_args()
    tools = build_tools()

    if args.command == "list-open-tasks":
        render(tools.list_open_tasks())
        return

    if args.command == "upcoming-events":
        render(tools.get_upcoming_events())
        return

    if args.command == "create-task":
        render(
            tools.create_task(
                title=args.title,
                description=args.description,
                category=args.category,
                priority=args.priority,
                due_at=parse_datetime(args.due_at),
                owner_person_id=args.owner_person_id,
            )
        )
        return

    if args.command == "create-event":
        render(
            tools.create_event(
                title=args.title,
                description=args.description,
                category=args.category,
                status=args.status,
                event_start=parse_datetime(args.event_start),
                event_end=parse_datetime(args.event_end),
                location=args.location,
                owner_person_id=args.owner_person_id,
            )
        )
        return

    if args.command == "save-knowledge":
        render(
            tools.save_knowledge_item(
                title=args.title,
                content=args.content,
                category=args.category,
                source=args.source,
                owner_person_id=args.owner_person_id,
            )
        )
        return

    if args.command == "search-knowledge":
        render(tools.search_knowledge_items(query=args.query))
        return

    if args.command == "run-graph":
        graph = build_graph(tools)
        render(graph.invoke({"user_request": args.request}))
        return


if __name__ == "__main__":
    main()
