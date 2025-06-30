// src/api/auth.ts
import api from "./axiosInstance";

export interface LoginApiResponse {
  id: number;
  email: string;
  role: String;
  jwtToken: string;
  refreshToken: string;
  emailVerified: boolean;
}

export async function loginProvider(email: string, password: string): Promise<LoginApiResponse> {
  const res = await api.post<{ data: LoginApiResponse }>("/auth/login", { email, password });
  return res.data.data;
}


export async function getLoggedUser(): Promise<LoginApiResponse> {
  const res = await api.get<{ data: LoginApiResponse }>("/auth/logged-user");
  return res.data.data;
}

export async function logoutProvider(): Promise<void> {
  await api.post("/auth/logout");
}