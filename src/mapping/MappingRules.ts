export const LanguageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Unknown: '#cccccc',
};

export const MappingConfig = {
  // Size (Repository Size in KB)
  MIN_PLANET_SIZE: 1.0,
  MAX_PLANET_SIZE: 10.0,
  MAX_REPO_SIZE_KB_FOR_SCALE: 1000000, // 1GB

  // Mass (Stars)
  MIN_PLANET_MASS: 1.0,
  MAX_PLANET_MASS: 100.0,
  MAX_STARS_FOR_SCALE: 50000,

  // Moons (Forks)
  MAX_MOONS: 10,
  FORKS_PER_MOON: 50,

  // Satellites (Contributors)
  MAX_SATELLITES: 20,
  CONTRIBUTORS_PER_SATELLITE: 5,

  // Surface Damage / Cracks (Issues)
  MAX_CRATER_DENSITY: 1.0,
  ISSUES_FOR_MAX_CRATERS: 500,

  // Atmosphere / Energy Pulses (Releases)
  MAX_ENERGY_INTENSITY: 1.0,
  RELEASES_FOR_MAX_ENERGY: 30,

  // Rotation Speed (Activity / Commits / Updates)
  MIN_ROTATION_SPEED: 0.001,
  MAX_ROTATION_SPEED: 0.02,
  MAX_ACTIVITY_SCORE: 100, // Normalized score based on recent activity
};
