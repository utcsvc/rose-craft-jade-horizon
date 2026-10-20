import { createServerFn } from "@tanstack/react-start";

function asText(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export const getHome = createServerFn({ method: "GET" }).handler(async () => {
  const { loadHome } = await import("./outage.server");
  return loadHome();
});

export const getQueue = createServerFn({ method: "GET" })
  .validator((input: { slug: string }) => {
    const slug = asText(input?.slug, 32);
    if (!/^[0-9]+(?:-[0-9]+)+$/.test(slug)) {
      throw new Error("Невідома черга");
    }
    return { slug };
  })
  .handler(async ({ data }) => {
    const { loadQueue } = await import("./outage.server");
    return loadQueue(data.slug);
  });

export const searchCities = createServerFn({ method: "GET" })
  .validator((input: { term?: string }) => ({ term: asText(input?.term, 80) }))
  .handler(async ({ data }) => {
    const { findCities } = await import("./outage.server");
    return findCities(data.term);
  });

export const searchStreets = createServerFn({ method: "GET" })
  .validator((input: { city?: string; term?: string }) => ({
    city: asText(input?.city, 80),
    term: asText(input?.term, 80),
  }))
  .handler(async ({ data }) => {
    const { findStreets } = await import("./outage.server");
    if (!data.city) return [];
    return findStreets(data.city, data.term);
  });

export const searchHouses = createServerFn({ method: "GET" })
  .validator((input: { city?: string; street?: string; term?: string }) => ({
    city: asText(input?.city, 80),
    street: asText(input?.street, 80),
    term: asText(input?.term, 32),
  }))
  .handler(async ({ data }) => {
    const { findHouses } = await import("./outage.server");
    if (!data.city || !data.street) return [];
    return findHouses(data.city, data.street, data.term);
  });

export const lookupAddress = createServerFn({ method: "POST" })
  .validator((input: { city?: string; street?: string; house?: string }) => ({
    city: asText(input?.city, 80),
    street: asText(input?.street, 80),
    house: asText(input?.house, 32),
  }))
  .handler(async ({ data }) => {
    const { resolveQueue } = await import("./outage.server");
    if (!data.city || !data.street || !data.house) return { slug: null as string | null };
    const slug = await resolveQueue(data.city, data.street, data.house);
    return { slug };
  });
