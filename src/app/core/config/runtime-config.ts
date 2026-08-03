type RuntimeConfig = {
  apiUrl?: string;
};

type RuntimeGlobal = typeof globalThis & {
  __ASTRO_TRACK_RUNTIME_CONFIG__?: RuntimeConfig;
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function getApiBaseUrl(fallbackApiUrl: string): string {
  const runtimeConfig = (globalThis as RuntimeGlobal).__ASTRO_TRACK_RUNTIME_CONFIG__;
  const runtimeApiUrl = runtimeConfig?.apiUrl?.trim();

  if (runtimeApiUrl) {
    return trimTrailingSlash(runtimeApiUrl);
  }

  return trimTrailingSlash(fallbackApiUrl);
}