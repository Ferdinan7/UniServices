<script lang="ts">
	export let label: string;
	export let href: string | null = null;
	export let target: string | null = null;
	export let disabled: boolean = false;
	export let className: string = '';

	// Clases base del botón secondary
	const baseClasses =
		'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition';
	const defaultStyles = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
	const disabledClasses = disabled ? 'pointer-events-none opacity-50' : '';

	// Si className viene vacío, usar estilos por defecto
	// Si viene con contenido, significa que la factory ya definió los estilos
	$: finalClasses = className
		? `${baseClasses} ${className} ${disabledClasses}`.trim()
		: `${baseClasses} ${defaultStyles} ${disabledClasses}`.trim();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	href={href ?? undefined}
	target={target ?? undefined}
	class={finalClasses}
	aria-disabled={disabled}
	on:click
>
	{label}
</svelte:element>
