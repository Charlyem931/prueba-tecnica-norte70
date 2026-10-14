export const useApi = () => {
  const config = useRuntimeConfig();

  const apiFetch = $fetch.create({
    baseURL: String(config.public.apiBase),
    headers: {
      'x-api-token': String(config.public.apiToken),
    },
  });

  return apiFetch;
};