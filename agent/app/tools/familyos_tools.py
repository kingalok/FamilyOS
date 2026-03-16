from __future__ import annotations

from dataclasses import asdict
from datetime import datetime
from typing import Any

from app.services.events import EventsService
from app.services.knowledge import KnowledgeService
from app.services.tasks import TasksService


class FamilyOSTools:
    """
    Thin tool surface over the domain services.

    Future MCP integration should wrap these methods rather than exposing raw SQL.
    That keeps business behavior stable across the web app, local CLI, and MCP transport.
    """

    def __init__(
        self,
        *,
        tasks_service: TasksService,
        events_service: EventsService,
        knowledge_service: KnowledgeService,
    ) -> None:
        self._tasks = tasks_service
        self._events = events_service
        self._knowledge = knowledge_service

    def create_task(self, **payload: Any) -> dict[str, Any]:
        task = self._tasks.create_task(**payload)
        return asdict(task)

    def list_open_tasks(self, limit: int = 10) -> list[dict[str, Any]]:
        return [asdict(task) for task in self._tasks.list_open_tasks(limit=limit)]

    def create_event(
        self,
        *,
        title: str,
        description: str | None = None,
        category: str | None = None,
        status: str = "planned",
        event_start: datetime | None = None,
        event_end: datetime | None = None,
        location: str | None = None,
        owner_person_id: str | None = None,
        tags: list[str] | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        event = self._events.create_event(
            title=title,
            description=description,
            category=category,
            status=status,
            event_start=event_start,
            event_end=event_end,
            location=location,
            owner_person_id=owner_person_id,
            tags=tags,
            metadata=metadata,
        )
        return asdict(event)

    def get_upcoming_events(self, limit: int = 10) -> list[dict[str, Any]]:
        return [asdict(event) for event in self._events.get_upcoming_events(limit=limit)]

    def save_knowledge_item(self, **payload: Any) -> dict[str, Any]:
        item = self._knowledge.save_knowledge_item(**payload)
        return asdict(item)

    def search_knowledge_items(self, query: str, limit: int = 10) -> list[dict[str, Any]]:
        return [asdict(item) for item in self._knowledge.search_knowledge_items(query=query, limit=limit)]
