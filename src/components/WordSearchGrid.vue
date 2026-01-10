<template>
  <div class="flex flex-col border-2 border-[#57A4CD] min-[601px]:border-4 w-full bg-[#f9f9f9] shadow-lg touch-none max-h-[70vh] aspect-square mx-auto" ref="gridRef">
    <div class="flex flex-1" v-for="(row, indRow) in grid" :key="indRow">
      <span v-for="(cell, indCell) in row" :key="indCell" class="flex-1 aspect-square flex items-center justify-center cursor-pointer border-[0.5px] border-blue-100/20  uppercase transition-colors select-none"
        :class="['text-[4.5vw] min-[601px]:text-[min(2.5vw,28px)]']" :style="getCellStyle(indRow, indCell)" @mousedown.prevent="$emit('start', indRow, indCell)" @mouseover="$emit('extend', indRow, indCell)" 
        @mouseup="$emit('end')" @touchstart.prevent="$emit('start', indRow, indCell)" @touchmove="handleTouchMove" @touchend="$emit('end')">
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