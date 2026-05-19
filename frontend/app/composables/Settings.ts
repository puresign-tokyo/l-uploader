export function useBackendUrl() {
  const config = useRuntimeConfig().public;
  const httpProtocol = String(config.httpProtocol);
  const backendHost = String(config.backendHost);
  const backendPort = Number(config.backendPort);
  const omitPort =
    (httpProtocol === "http" && backendPort === 80) ||
    (httpProtocol === "https" && backendPort === 443);

  return `${httpProtocol}://${backendHost}${omitPort ? "" : `:${backendPort}`}`;
}
