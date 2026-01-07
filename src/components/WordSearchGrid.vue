<template>
  <div class="grid" ref="gridRef">
    <div class="row" v-for="(row, indRow) in grid" :key="indRow">
      <span 
        class="cell" 
        v-for="(cell, indCell) in row" 
        :key="indCell"
        :style="getCellStyle(indRow, indCell)"
        @mousedown.prevent="$emit('start', indRow, indCell)" 
        @mouseover="$emit('extend', indRow, indCell)" 
        @mouseup="$emit('end')"
        @touchstart.prevent="$emit('start', indRow, indCell)" 
        @touchmove="handleTouchMove" 
        @touchend="$emit('end')"
      >
        {{ cell }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['grid', 'selection', 'selectionColor', 'foundWordsData', 'wordsColor', 'hintedCell']);
const emit = defineEmits(['start', 'extend', 'end']);

const gridRef = ref(null);
const cellWidth = 40; 
const cellHeight = 40;

const handleTouchMove = (event) => {
  const touch = event.touches[0];
  const gridRect = gridRef.value.getBoundingClientRect();
  const col = Math.floor((touch.clientX - gridRect.left) / cellWidth);
  const row = Math.floor((touch.clientY - gridRect.top) / cellHeight);
  emit('extend', row, col);
};

const getCellStyle = (row, col) => {
  let style = {};
  const isSelected = props.selection?.some(c => c.row === row && c.col === col);
  if (isSelected) return { backgroundColor: props.selectionColor, color: 'white' };

  const foundItem = props.foundWordsData?.find(item => item.coords?.some(c => c.row === row && c.col === col));
  if (foundItem) return { backgroundColor: props.wordsColor[foundItem.word], color: 'white' };

  if (props.hintedCell?.row === row && props.hintedCell?.col === col) return { border: '2px solid red' };
  return style;
};
</script>

<style lang="scss" scoped>
.grid {
  display: flex; flex-direction: column; border: 4px solid #57A4CD;
  .row {
    display: flex;
    .cell {
      background: #f9f9f9; width: 44px; height: 44px; text-align: center;
      line-height: 44px; font-weight: 400; font-size: 28px; cursor: pointer;
      &:hover:not(.selected):not(.found) { outline: 2px solid #ccc; outline-offset: -2px; }
    }
  }
}

@media (max-width: 600px) {
  .grid { border-width: 2px; .row .cell { width: 40px; height: 40px; font-size: 22px; } }
}
</style>