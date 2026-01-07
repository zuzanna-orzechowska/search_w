<template>
  <div class="wrapper-words-text">
    <h4>Words to find:</h4>
    <div class="wrapper-words-list" :class="{ 'two-columns': twoColumns }">
      <div class="words-list">
        <ul>
          <li v-for="word in firstHalf" :key="word" :class="{ foundWord: foundWords.includes(word) }">
            {{ word }}
          </li>
        </ul>
      </div>
      <div v-if="twoColumns" class="words-list">
        <ul>
          <li v-for="word in secondHalf" :key="word" :class="{ foundWord: foundWords.includes(word) }">
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

<style lang="scss" scoped>
    .wrapper-words-text {
         h4 { font-size: 36px; font-weight: 500; margin-bottom: 4px; }
        
        .wrapper-words-list { display: flex; gap: 24px; justify-content: center; }
        .words-list 
        ul { list-style: none; padding: 0; text-align: center; 
          li { font-size: 24px; line-height: 2.2; }
        }
        .foundWord { color: rgba(0, 0, 0, 0.5); text-decoration: line-through; text-decoration-thickness: 3px; }
    }
@media (max-width: 600px) { .words-list li { font-size: 16px; line-height: 1.2; } }
</style>