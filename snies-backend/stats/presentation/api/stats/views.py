from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from stats.application.use_cases.get_dashboard_stats import GetDashboardStatsUseCase
from stats.infraestructure.persistence.django.stats_repository import DjangoStatsRepository
from users.presentation.permissions import IsRootUser


class StatsDashboardAPIView(APIView):
    """
    GET /api/stats/dashboard/?year=2026&semester=1&top_n=10
    Filtros (opcionales):
      - year: str
      - semester: int
      - top_n: int (default 10, max 50)
    """

    permission_classes = [IsAuthenticated, IsRootUser]

    def get(self, request):
        year = request.query_params.get("year")
        semester_raw = request.query_params.get("semester")
        top_n_raw = request.query_params.get("top_n", "10")

        semester = None
        if semester_raw is not None and semester_raw != "":
            try:
                semester = int(semester_raw)
            except ValueError:
                return Response({"error": "semester must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            top_n = int(top_n_raw)
        except ValueError:
            return Response({"error": "top_n must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        use_case = GetDashboardStatsUseCase(stats_repository=DjangoStatsRepository())
        data = use_case.execute(year=year, semester=semester, top_n=top_n)
        return Response(data, status=status.HTTP_200_OK)

