const environment = {
  rickAndMortyApiBaseUrl: "https://rickandmortyapi.com/api"
};
class HttpClientError extends Error {
  status;
  statusText;
  url;
  responseBody;
  data;
  constructor({
    message,
    status,
    statusText,
    url,
    responseBody,
    data
  }) {
    super(message);
    this.name = "HttpClientError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.responseBody = responseBody;
    this.data = data;
  }
}
function createQueryString(query) {
  if (!query) {
    return "";
  }
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === void 0 || value === null || value === "") {
      continue;
    }
    searchParams.set(key, String(value));
  }
  const result = searchParams.toString();
  return result ? `?${result}` : "";
}
function mergeHeaders(defaultHeaders, overrides) {
  const headers = new Headers(defaultHeaders);
  const mergedOverrides = new Headers(overrides);
  mergedOverrides.forEach((value, key) => {
    headers.set(key, value);
  });
  headers.set("accept", "application/json");
  return headers;
}
const responseCache = /* @__PURE__ */ new Map();
function getCachedResponse(key) {
  const entry = responseCache.get(key);
  if (!entry) {
    return void 0;
  }
  if (entry.expiresAt <= Date.now()) {
    responseCache.delete(key);
    return void 0;
  }
  return entry.value;
}
function memoizeResponse(key, value, ttlMs) {
  responseCache.set(key, {
    expiresAt: Date.now() + ttlMs,
    value
  });
  value.catch(() => {
    responseCache.delete(key);
  });
  return value;
}
function createHttpClient(baseUrl, fetchImpl, defaultInit = {}) {
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return {
    async get(path, init = {}) {
      const url = new URL(path.replace(/^\//, ""), normalizedBaseUrl);
      const queryString = createQueryString(init.query);
      const memoize = typeof init.memoize === "object" ? init.memoize : init.memoize ? { ttlMs: 3e4 } : void 0;
      if (queryString) {
        url.search = queryString.slice(1);
      }
      const cacheKey = `GET:${url.toString()}`;
      if (memoize) {
        const cachedResponse = getCachedResponse(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
      const request = (async () => {
        const response = await fetchImpl(url, {
          ...defaultInit,
          ...init,
          headers: mergeHeaders(defaultInit.headers, init.headers)
        });
        if (!response.ok) {
          const responseText = await response.text().catch(() => "");
          let data;
          try {
            data = responseText ? JSON.parse(responseText) : void 0;
          } catch {
            data = responseText || void 0;
          }
          throw new HttpClientError({
            message: `HTTP ${response.status} calling ${url.pathname}${url.search}`,
            status: response.status,
            statusText: response.statusText,
            url: url.toString(),
            responseBody: responseText || void 0,
            data
          });
        }
        return await response.json();
      })();
      if (!memoize) {
        return request;
      }
      return memoizeResponse(cacheKey, request, memoize.ttlMs ?? 3e4);
    }
  };
}
function mapCharacter(apiCharacter) {
  return {
    id: apiCharacter.id,
    name: apiCharacter.name,
    status: apiCharacter.status,
    species: apiCharacter.species,
    gender: apiCharacter.gender,
    image: apiCharacter.image,
    originName: apiCharacter.origin.name,
    locationName: apiCharacter.location.name
  };
}
function mapEpisode(apiEpisode) {
  return {
    id: apiEpisode.id,
    name: apiEpisode.name,
    airDate: apiEpisode.air_date,
    episode: apiEpisode.episode,
    characterCount: apiEpisode.characters.length
  };
}
function mapLocation(apiLocation) {
  return {
    id: apiLocation.id,
    name: apiLocation.name,
    type: apiLocation.type,
    dimension: apiLocation.dimension,
    residentCount: apiLocation.residents.length
  };
}
function createRickAndMortyHttp(fetchImpl) {
  return createHttpClient(environment.rickAndMortyApiBaseUrl, fetchImpl);
}
function toCharacterFilters(filters) {
  return {
    page: filters?.page && filters.page > 0 ? filters.page : void 0,
    name: filters?.name?.trim() || void 0,
    status: filters?.status?.trim() || void 0,
    species: filters?.species?.trim() || void 0,
    type: filters?.type?.trim() || void 0,
    gender: filters?.gender?.trim() || void 0
  };
}
function toEpisodeFilters(filters) {
  return {
    page: filters?.page && filters.page > 0 ? filters.page : void 0,
    name: filters?.name?.trim() || void 0,
    episode: filters?.episode?.trim() || void 0
  };
}
function toLocationFilters(filters) {
  return {
    page: filters?.page && filters.page > 0 ? filters.page : void 0,
    name: filters?.name?.trim() || void 0,
    type: filters?.type?.trim() || void 0,
    dimension: filters?.dimension?.trim() || void 0
  };
}
function mapListResponse(response, mapper) {
  return {
    items: response.results.map(mapper),
    pagination: response.info,
    total: response.info.count
  };
}
function createCharacterService(fetchImpl) {
  const http = createRickAndMortyHttp(fetchImpl);
  return {
    async listCharacters(filters = {}) {
      const normalizedFilters = toCharacterFilters(filters);
      const response = await http.get("/character", {
        query: normalizedFilters,
        memoize: true
      });
      const list = mapListResponse(response, mapCharacter);
      return {
        characters: list.items,
        total: list.total,
        pagination: list.pagination,
        filters: normalizedFilters
      };
    },
    async getCharacterById(id) {
      const response = await http.get(`/character/${id}`, {
        memoize: true
      });
      return mapCharacter(response);
    }
  };
}
function createEpisodeService(fetchImpl) {
  const http = createRickAndMortyHttp(fetchImpl);
  return {
    async listEpisodes(filters = {}) {
      const normalizedFilters = toEpisodeFilters(filters);
      const response = await http.get("/episode", {
        query: normalizedFilters,
        memoize: true
      });
      const list = mapListResponse(response, mapEpisode);
      return {
        episodes: list.items,
        total: list.total,
        pagination: list.pagination,
        filters: normalizedFilters
      };
    },
    async getEpisodeById(id) {
      const response = await http.get(`/episode/${id}`, {
        memoize: true
      });
      return mapEpisode(response);
    }
  };
}
function createLocationService(fetchImpl) {
  const http = createRickAndMortyHttp(fetchImpl);
  return {
    async listLocations(filters = {}) {
      const normalizedFilters = toLocationFilters(filters);
      const response = await http.get("/location", {
        query: normalizedFilters,
        memoize: true
      });
      const list = mapListResponse(response, mapLocation);
      return {
        locations: list.items,
        total: list.total,
        pagination: list.pagination,
        filters: normalizedFilters
      };
    },
    async getLocationById(id) {
      const response = await http.get(`/location/${id}`, {
        memoize: true
      });
      return mapLocation(response);
    }
  };
}
function createRickAndMortyService(fetchImpl) {
  const characters = createCharacterService(fetchImpl);
  const episodes = createEpisodeService(fetchImpl);
  const locations = createLocationService(fetchImpl);
  return {
    listCharacters: characters.listCharacters,
    getCharacterById: characters.getCharacterById,
    listEpisodes: episodes.listEpisodes,
    getEpisodeById: episodes.getEpisodeById,
    listLocations: locations.listLocations,
    getLocationById: locations.getLocationById
  };
}
async function listCharacters(fetchImpl, filters = {}) {
  return createRickAndMortyService(fetchImpl).listCharacters(filters);
}
function readFilters(url) {
  const query = url.searchParams.get("q") ?? url.searchParams.get("name") ?? "";
  const pageParam = url.searchParams.get("page");
  const page = pageParam ? Number(pageParam) : void 0;
  return {
    page: page && Number.isFinite(page) ? page : void 0,
    name: query,
    status: url.searchParams.get("status") ?? void 0,
    species: url.searchParams.get("species") ?? void 0,
    type: url.searchParams.get("type") ?? void 0,
    gender: url.searchParams.get("gender") ?? void 0
  };
}
const load = async ({ fetch, url }) => {
  const filters = readFilters(url);
  const query = filters.name ?? "";
  try {
    const result = await listCharacters(fetch, filters);
    return {
      characters: result.characters,
      total: result.total,
      pagination: result.pagination,
      filters: result.filters,
      query
    };
  } catch (error) {
    return {
      characters: [],
      total: 0,
      pagination: void 0,
      filters,
      query,
      error: error instanceof Error ? error.message : "No se pudo cargar la API de Rick and Morty."
    };
  }
};
export {
  load
};
