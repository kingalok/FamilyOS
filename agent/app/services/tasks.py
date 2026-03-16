from __future__ import annotations

from datetime import datetime
from typing import Any

from app.db import Database
from app.schemas import Task


class TasksService:
    def __init__(self, db: Database) -> None:
        self._db = db

    def create_task(
        self,
        *,
        title: str,
        description: str | None = None,
        category: str | None = None,
        status: str = "open",
        priority: str = "medium",
        due_at: datetime | None = None,
        owner_person_id: str | None = None,
        related_event_id: str | None = None,
        tags: list[str] | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> Task:
        with self._db.connection() as conn:
            row = conn.execute(
                """
                insert into public.tasks (
                  title, description, category, status, priority, due_at,
                  owner_person_id, related_event_id, tags, metadata
                )
                values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                returning id, title, description, category, status, priority, due_at,
                  owner_person_id, related_event_id, tags, metadata, created_at, updated_at
                """,
                (
                    title,
                    description,
                    category,
                    status,
                    priority,
                    due_at,
                    owner_person_id,
                    related_event_id,
                    tags or [],
                    metadata or {},
                ),
            ).fetchone()
            conn.commit()
        return Task(**row)

    def list_open_tasks(self, limit: int = 10) -> list[Task]:
        with self._db.connection() as conn:
            rows = conn.execute(
                """
                select id, title, description, category, status, priority, due_at,
                  owner_person_id, related_event_id, tags, metadata, created_at, updated_at
                from public.tasks
                where status = 'open'
                order by due_at asc nulls last, created_at desc
                limit %s
                """,
                (limit,),
            ).fetchall()
        return [Task(**row) for row in rows]
