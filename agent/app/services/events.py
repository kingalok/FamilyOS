from __future__ import annotations

from datetime import datetime
from typing import Any

from app.db import Database
from app.schemas import Event


class EventsService:
    def __init__(self, db: Database) -> None:
        self._db = db

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
    ) -> Event:
        with self._db.connection() as conn:
            row = conn.execute(
                """
                insert into public.events (
                  title, description, category, status, event_start, event_end,
                  location, owner_person_id, tags, metadata
                )
                values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                returning id, title, description, category, status, event_start, event_end,
                  location, owner_person_id, tags, metadata, created_at, updated_at
                """,
                (
                    title,
                    description,
                    category,
                    status,
                    event_start,
                    event_end,
                    location,
                    owner_person_id,
                    tags or [],
                    metadata or {},
                ),
            ).fetchone()
            conn.commit()
        return Event(**row)

    def get_upcoming_events(self, limit: int = 10) -> list[Event]:
        with self._db.connection() as conn:
            rows = conn.execute(
                """
                select id, title, description, category, status, event_start, event_end,
                  location, owner_person_id, tags, metadata, created_at, updated_at
                from public.events
                where event_start is not null and event_start >= now()
                order by event_start asc
                limit %s
                """,
                (limit,),
            ).fetchall()
        return [Event(**row) for row in rows]
