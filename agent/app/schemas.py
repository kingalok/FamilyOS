from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


JsonDict = dict[str, Any]


@dataclass(slots=True)
class Person:
    id: str
    full_name: str
    role: str | None = None
    relationship: str | None = None
    email: str | None = None
    phone: str | None = None
    notes: str | None = None
    metadata: JsonDict = field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None


@dataclass(slots=True)
class Event:
    id: str
    title: str
    description: str | None = None
    category: str | None = None
    status: str | None = None
    event_start: datetime | None = None
    event_end: datetime | None = None
    location: str | None = None
    owner_person_id: str | None = None
    tags: list[str] = field(default_factory=list)
    metadata: JsonDict = field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None


@dataclass(slots=True)
class Task:
    id: str
    title: str
    description: str | None = None
    category: str | None = None
    status: str | None = None
    priority: str | None = None
    due_at: datetime | None = None
    owner_person_id: str | None = None
    related_event_id: str | None = None
    tags: list[str] = field(default_factory=list)
    metadata: JsonDict = field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None


@dataclass(slots=True)
class KnowledgeItem:
    id: str
    title: str
    content: str | None = None
    category: str | None = None
    status: str | None = None
    source: str | None = None
    owner_person_id: str | None = None
    tags: list[str] = field(default_factory=list)
    metadata: JsonDict = field(default_factory=dict)
    created_at: datetime | None = None
    updated_at: datetime | None = None
