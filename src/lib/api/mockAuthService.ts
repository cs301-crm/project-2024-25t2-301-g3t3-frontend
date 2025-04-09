export const login = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("[MOCK] Logging in:", email, password);
  return "fake-jwt-token";
};
