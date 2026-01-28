from dataclasses import dataclass


@dataclass(frozen=True)
class Role:
    id: int | None
    name: str
    description: str | None = None

