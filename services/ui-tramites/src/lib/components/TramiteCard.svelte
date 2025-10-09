<script>
	export let title;
	export let description;
	export let link;
</script>

<div
	class="flex flex-col justify-between rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
>
	<h3 class="mb-2 text-lg font-semibold">{title}</h3>

	<p class="flex-grow text-sm text-gray-600">{description}</p>

	<a
		href={link}
		target="_blank"
		rel="noopener noreferrer"
		data-sveltekit-reload
		data-sveltekit-preload-data="off"
		class="mt-4 inline-block rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-green-700"
	>
		Ir al trámite
	</a>
</div>
