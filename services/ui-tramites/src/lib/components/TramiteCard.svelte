<script>
  export let title;
  export let description;
  export let link;
</script>

<div
  class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col justify-between"
>
  <h3 class="text-lg font-semibold mb-2">{title}</h3>

  <p class="text-gray-600 text-sm flex-grow">{description}</p>

  <a
    href={link}
    target="_blank"
    class="mt-4 inline-block text-center bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition"
  >
    Ir al trámite
  </a>
</div>
