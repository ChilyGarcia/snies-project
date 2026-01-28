from stats.domain.ports.stats_repository import StatsRepository


class GetDashboardStatsUseCase:
    def __init__(self, stats_repository: StatsRepository):
        self.stats_repository = stats_repository

    def execute(self, year: str | None, semester: int | None, top_n: int = 10) -> dict:
        return self.stats_repository.get_dashboard(year=year, semester=semester, top_n=top_n)

