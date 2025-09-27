// src/lib/api.ts
export async function getTramites() {
  const res = await fetch("http://localhost:3550/tramites/grouped", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener trámites: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}
