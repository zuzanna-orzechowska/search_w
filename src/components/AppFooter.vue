<template>
  <footer class="absolute bottom-0 flex w-full flex-col items-center bg-[#AED2E5] py-4">
    <div class="mb-7 flex w-full justify-center gap-12 text-center text-[18px] min-[601px]:gap-16 min-[601px]:text-[24px]">
      <router-link to="/privacy" class="text-black no-underline transition-colors duration-350 hover:text-[#0077b6]">Privacy Policy</router-link>
      <router-link to="/contact" class="text-black no-underline transition-colors duration-350 hover:text-[#0077b6]">Contact</router-link>
      <router-link to="/terms" class="text-black no-underline transition-colors duration-350 hover:text-[#0077b6]">Terms of Use</router-link>
    </div>
    
    <div class="m-0">
      <p class="m-0 text-[18px]">
        Created with 💙 by 
        <a href="https://github.com/zuzanna-orzechowska" class="author-link relative cursor-pointer p-2 font-medium text-black no-underline transition-colors duration-350 hover:text-[#00537f]">
          Zuza
        </a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
/* animation from https://www.proglobalbusinesssolutions.com/css-hover-effects/ */
.author-link::before,
.author-link::after {
  content: '';
  height: 16px;
  width: 16px;
  position: absolute;
  transition: all 0.35s ease;
  opacity: 0;
}

.author-link::before {
  right: 0;
  top: 0;
  border-top: 3px solid #3392c5;
  border-right: 3px solid #0077b6;
  transform: translate(-100%, 50%);
}

.author-link::after {
  left: 0;
  bottom: 0;
  border-bottom: 3px solid #0077b6;
  border-left: 3px solid #3392c5;
  transform: translate(100%, -50%);
}

.author-link:hover::before,
.author-link:hover::after {
  transform: translate(0, 0);
  opacity: 1;
}
</style>