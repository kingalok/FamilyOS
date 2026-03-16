from __future__ import annotations

from contextlib import contextmanager
from typing import Iterator

from psycopg import Connection
from psycopg.rows import dict_row

from app.config import Settings


class Database:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    @contextmanager
    def connection(self) -> Iterator[Connection]:
        conn = Connection.connect(self._settings.database_url, row_factory=dict_row)
        try:
            yield conn
        finally:
            conn.close()
