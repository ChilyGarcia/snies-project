module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",     // Nueva funcionalidad
        "fix",      // Corrección de bugs
        "docs",     // Documentación
        "style",    // Cambios de formato (no afectan el código)
        "refactor", // Refactorización
        "perf",     // Mejoras de rendimiento
        "test",     // Tests
        "build",    // Cambios en el build
        "ci",       // Cambios en CI/CD
        "chore",    // Tareas de mantenimiento
        "revert",   // Revertir commits
      ],
    ],
    "subject-case": [0],
    "subject-full-stop": [0],
  },
};
