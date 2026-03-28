const STORAGE_KEY = 'ft_2026_config';

interface ConfigDefaults {
  salary_tool: {
    income: number;
  };
}

const DEFAULT_CONFIG: ConfigDefaults = {
  salary_tool: {
    income: 5000,
  },
};

/** Get the entire config object from localStorage */
export function getConfig(): Record<string, unknown> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Get a specific key from the config object */
export function getConfigKey<T = unknown>(key: string): T | null {
  const config = getConfig();
  if (!config || !(key in config)) return null;
  return config[key] as T;
}

/** Set a specific key in the config object (merges with existing) */
export function setConfigKey(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  const config = getConfig() ?? {};
  config[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/** Remove a specific key from the config object */
export function removeConfigKey(key: string): void {
  if (typeof window === 'undefined') return;
  const config = getConfig();
  if (!config) return;
  delete config[key];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/** Remove the entire config object from localStorage */
export function clearConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/** Initialize config with defaults if it doesn't exist yet.
 *  Merges defaults with existing config (existing keys are preserved). */
export function initConfig(): void {
  if (typeof window === 'undefined') return;
  const existing = getConfig();
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
    return;
  }
  // Merge defaults for any missing top-level keys
  let changed = false;
  const merged = { ...existing };
  for (const [key, value] of Object.entries(DEFAULT_CONFIG)) {
    if (!(key in merged)) {
      merged[key] = value;
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }
}
