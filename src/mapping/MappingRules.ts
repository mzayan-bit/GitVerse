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
  // Size mapping (Stars)
  MIN_PLANET_SIZE: 0.5,
  MAX_PLANET_SIZE: 5.0,
  MAX_STARS_FOR_SCALE: 100000, // e.g. 100k stars = MAX_PLANET_SIZE

  // Moons (Forks)
  MAX_MOONS: 5,
  FORKS_PER_MOON: 100, // Every 100 forks = 1 moon (up to MAX_MOONS)

  // Surface Damage / Craters (Issues)
  MAX_CRATER_DENSITY: 0.8,
  ISSUES_FOR_MAX_CRATERS: 1000,

  // Population / Density (Commits)
  MAX_POPULATION_DENSITY: 1.0,
  COMMITS_FOR_MAX_POPULATION: 10000,

  // Atmosphere / Energy (Releases)
  MAX_ENERGY_INTENSITY: 1.0,
  RELEASES_FOR_MAX_ENERGY: 50,
};
