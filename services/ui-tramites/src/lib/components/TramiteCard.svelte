<!-- src/lib/components/TramiteCard.svelte -->
<script lang="ts">
	import type { IButton } from '$lib/ui';

	export let title: string;
	export let description: string;
	export let link: string;
	export let button: IButton;
</script>

<div
	class="flex h-full flex-col justify-between rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
>
	<div>
		<h3 class="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
		<p class="mb-4 text-sm text-gray-600">{description}</p>
	</div>

	<div class="mt-auto">
		<svelte:component this={button.component} {...button.props} href={link} target="_blank" />
	</div>
</div>
