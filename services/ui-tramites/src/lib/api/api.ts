// src/lib/api.ts
export async function getTramites(token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Agregar token de autenticación si está disponible
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch("http://localhost:4000/api/v1/tramites/grouped", {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Error al obtener trámites: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}
