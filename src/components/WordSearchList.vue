<template>
  <div class="text-center">
    <h4 class="mb-1 text-[36px] font-medium">Words to find:</h4>
    <div class="flex justify-center gap-6" :class="{ 'flex-row': twoColumns }">
      <div class="words-list">
        <ul class="p-0 list-none text-center">
          <li v-for="word in firstHalf" :key="word" class="text-[16px] leading-[1.2] min-[601px]:text-[24px] min-[601px]:leading-[2.2]" :class="{ 'text-black/50 line-through decoration-[3px]': foundWords.includes(word) }">
            {{ word }}
          </li>
        </ul>
      </div>
      <div v-if="twoColumns" class="words-list">
        <ul class="p-0 list-none text-center">
          <li v-for="word in secondHalf" :key="word" class="text-[16px] leading-[1.2] min-[601px]:text-[24px] min-[601px]:leading-[2.2]" :class="{ 'text-black/50 line-through decoration-[3px]': foundWords.includes(word) }">
            {{ word }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { defineProps } from 'vue';
    import { computed } from 'vue';

    const props = defineProps({
        wordsToFind: Array,
        foundWords: Array,
        twoColumns: Boolean
    });

const firstHalf = computed(() => {
  if (!props.twoColumns) return props.wordsToFind;
  return props.wordsToFind.slice(0, Math.ceil(props.wordsToFind.length / 2));
});

const secondHalf = computed(() => {
  if (!props.twoColumns) return [];
  return props.wordsToFind.slice(Math.ceil(props.wordsToFind.length / 2));
});
</script>