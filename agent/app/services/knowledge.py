from __future__ import annotations

from typing import Any

from app.db import Database
from app.schemas import KnowledgeItem


class KnowledgeService:
    def __init__(self, db: Database) -> None:
        self._db = db

    def save_knowledge_item(
        self,
        *,
        title: str,
        content: str | None = None,
        category: str | None = None,
        status: str = "active",
        source: str | None = None,
        owner_person_id: str | None = None,
        tags: list[str] | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> KnowledgeItem:
        with self._db.connection() as conn:
            row = conn.execute(
                """
                insert into public.knowledge_items (
                  title, content, category, status, source, owner_person_id, tags, metadata
                )
                values (%s, %s, %s, %s, %s, %s, %s, %s)
                returning id, title, content, category, status, source, owner_person_id,
                  tags, metadata, created_at, updated_at
                """,
                (
                    title,
                    content,
                    category,
                    status,
                    source,
                    owner_person_id,
                    tags or [],
                    metadata or {},
                ),
            ).fetchone()
            conn.commit()
        return KnowledgeItem(**row)

    def search_knowledge_items(self, query: str, limit: int = 10) -> list[KnowledgeItem]:
        pattern = f"%{query}%"
        with self._db.connection() as conn:
            rows = conn.execute(
                """
                select id, title, content, category, status, source, owner_person_id,
                  tags, metadata, created_at, updated_at
                from public.knowledge_items
                where title ilike %s or content ilike %s or category ilike %s
                order by updated_at desc
                limit %s
                """,
                (pattern, pattern, pattern, limit),
            ).fetchall()
        return [KnowledgeItem(**row) for row in rows]
