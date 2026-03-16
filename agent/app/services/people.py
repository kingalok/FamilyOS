from __future__ import annotations

from app.db import Database
from app.schemas import Person


class PeopleService:
    def __init__(self, db: Database) -> None:
        self._db = db

    def list_people(self) -> list[Person]:
        with self._db.connection() as conn:
            rows = conn.execute(
                """
                select id, full_name, role, relationship, email, phone, notes, metadata, created_at, updated_at
                from public.people
                order by full_name asc
                """
            ).fetchall()
        return [Person(**row) for row in rows]
