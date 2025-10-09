// src/lib/api.ts
export async function getTramites(token?: string) {
	console.log('🌐 getTramites - Iniciando petición...');
	console.log('🔑 Token presente:', token ? 'Sí' : 'No');

	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};

	// Agregar token de autenticación si está disponible
	if (token) {
		headers.Authorization = `Bearer ${token}`;
		console.log('✅ Header Authorization agregado');
	}

	const url = 'http://localhost:4000/api/v1/tramites/grouped';
	console.log('📍 URL:', url);

	try {
		console.log('⏳ Haciendo fetch...');
		const res = await fetch(url, {
			method: 'GET',
			headers
		});

		console.log('📡 Respuesta recibida:', {
			status: res.status,
			statusText: res.statusText,
			ok: res.ok
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error('❌ Error en respuesta:', errorText);
			throw new Error(`Error al obtener trámites: ${res.statusText} - ${errorText}`);
		}

		const data = await res.json();
		console.log('✅ Datos recibidos:', data);
		return data;
	} catch (error) {
		console.error('❌ Error en getTramites:', error);
		throw error;
	}
}
