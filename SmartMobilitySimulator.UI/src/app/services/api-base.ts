export const getApiBase = (): string => {
  const configured = (window as any).__API_BASE__ as string | undefined;
  if (configured) {
    return configured;
  }

  // Default to local backend ports
  return "http://localhost:54247";
};
