<template>
  <div class="flex min-h-screen w-full justify-center bg-[#aed2e5] py-10">
    <div class="mx-auto flex w-[90%] max-w-[800px] flex-col items-center px-3 bg-[#aed2e5]">
      <h2 class="mt-3 mb-4 text-center text-[40px] md:text-[56px] font-medium text-black">Help</h2>

      <section class="w-full max-w-[650px] mb-4">
        <h4 class="mt-6 mb-4 text-[28px] md:text-[32px] font-[450] text-black">Game Objective</h4>
        <p class="mb-4 text-[18px] leading-[1.6] text-[#333]">
          The main goal of the puzzle is to find all the words hidden in the grid. The words you need to find are listed on the right side of the screen and will be crossed off as you find them.
        </p>
      </section>

      <hr class="w-full max-w-[650px] border-none border-t-2 border-[#88BCD9] my-8" />

      <section class="w-full max-w-[650px] mb-4">
        <h4 class="mt-6 mb-4 text-[28px] md:text-[32px] font-[450] text-black">How to Play</h4>
        <p class="mb-4 text-[18px] leading-[1.6] text-[#333]">
          Words are placed in all directions: horizontally, vertically, and diagonally. They can be spelled both forwards and backwards.
        </p>
        
        <h3 class="mt-4 mb-2 text-[20px] font-medium text-[#333]">Finding and Selecting Words</h3>
        <ol class="pl-6 mb-4 list-decimal text-[18px] leading-[1.6] text-[#333]">
          <li>Click on the first letter of the word you want to select.</li>
          <li>Drag your mouse to the last letter of the word.</li>
          <li>Release the mouse to confirm your selection. If the word is correct, it will be highlighted in the grid and marked off your list.</li>
        </ol>
        <div class="mt-4 rounded-md border-2 border-dashed border-[#2A8DC1] bg-[#C2DDEB] p-5 text-center">
          <div class="flex justify-center gap-2">
            <img src="../assets/help1.png" alt="help 1" class="max-w-[48%] rounded-[4px]">
            <img src="../assets/help2.png" alt="help 2" class="max-w-[48%] rounded-[4px]">
          </div>
        </div>
      </section>

      <hr class="w-full max-w-[650px] border-none border-t-2 border-[#88BCD9] my-8" />

      <section class="w-full max-w-[650px] mb-4">
        <h4 class="mt-6 mb-4 text-[28px] md:text-[32px] font-[450] text-black">Special Features</h4>
        
        <div class="mb-6 flex items-start gap-4 rounded-r-md border-l-4 border-[#2A8DC1] bg-[#C2DDEB] p-[10px]">
          <img src="../assets/hint-icon.svg" alt="Hint Icon" class="mt-1 h-10 w-10 flex-shrink-0" />
          <div class="grow">
            <h3 class="mb-2 text-[20px] font-medium text-[#333]">Hints (Cost: 20 Coins)</h3>
            <p class="mb-4 text-[18px] leading-[1.6] text-[#333]">
              If you get stuck, you can purchase a hint for <span class="font-[550]">20 coins</span>. Using a hint will highlight the first letter of a random unfound word in the grid with a <span class="font-[550]">red border</span>. You have an unlimited number of hints available, provided you have the coins to buy them!
            </p>
          </div>
        </div>

        <div class="mb-6 flex items-start gap-4 rounded-r-md border-l-4 border-[#2A8DC1] bg-[#C2DDEB] p-[10px]">
          <div class="grow">
            <h3 class="mb-2 text-[20px] font-medium text-[#333]">Game Progress and Star Ratings</h3>
            <p class="mb-4 text-[18px] leading-[1.6] text-[#333]">
              Your progress is always saved as long as you are signed in. A <span class="font-[550]">Category</span> is marked as completed only when <span class="font-[550]">all 5 of its stages</span> are finished.
            </p>
            <h3 class="mb-2 text-[20px] font-medium text-[#333]">Challenge Completion: Earning Stars</h3>
            <p class="mb-4 text-[18px] leading-[1.6] text-[#333]">
              Challenges award 1 to 3 stars. A challenge is marked as <span class="font-[550]">completed</span> only if you achieve <span class="font-[550]">3 stars</span>. Stars are awarded based on your completion time:
            </p>
            <ul class="list-none text-[18px] leading-[1.6] text-[#333]">
                <li><span class="font-[550]">3 Stars</span> - Finish in 4:00 (four minutes) or less.</li>
                <li><span class="font-[550]">2 Stars</span> - Finish between 4:01 and 6:00 (six minutes).</li>
                <li><span class="font-[550]">1 Star</span> - Finish between 6:01 and 10:00 (ten minutes).</li>
                <li><span class="font-[550]">0 Stars</span> - Finish in over 10:00.</li>
            </ul>
          </div>
        </div>

        <div class="mb-6 flex items-start gap-4 rounded-r-md border-l-4 border-[#2A8DC1] bg-[#C2DDEB] p-[10px]">
          <div class="grow">
            <h3 class="mb-2 text-[20px] font-medium text-[#333]">Customization, Profile, and Settings</h3>
            <p class="mb-4 text-[18px] leading-[1.6] text-[#333]">
                Visit the <span class="font-[550]">Shop</span> to purchase avatars, which you can then change in your <span class="font-[550]">Profile</span>. There you can update your <span class="font-[550]">name</span>. The Profile also displays your current <span class="font-[550]">title, level, xp</span> to the next level, and <span class="font-[550]">Achievements</span>. The Achievements page shows all available Avatars; the ones you own are <span class="font-[550]">colorful</span>, while the rest remain <span class="font-[550]">grey</span>.<br><br>
                In <span class="font-[550]">Settings</span> you can change your <span class="font-[550]">password</span>, and request to <span class="font-[550]">delete you account</span>.
            </p>
            <p class="mb-4 text-[18px] leading-[1.6] text-[#333]">
              When you've found all the words, a "Puzzle Completed" message will appear, giving you the option to play another puzzle or return to the home page.
            </p>
          </div>
        </div>
      </section>

      <hr class="w-full max-w-[650px] border-none border-t-2 border-[#88BCD9] my-8" />
      
      <section class="w-full max-w-[650px] mb-4">
        <h4 class="mt-6 mb-4 text-[28px] md:text-[32px] font-[450] text-black">About This Game</h4>
        <p class="mb-4 text-[18px] leading-[1.6] text-[#333]">
          This game was designed to be a fun and relaxing way to challenge your mind and improve your vocabulary. It's a passion project built with Vue.js, SCSS, Appwrite and Pinia. I hope you enjoy playing!
        </p>
      </section>

      <div class="mt-4 flex h-auto w-[280px] items-center justify-center gap-6 rounded-[24px] border-4 border-black bg-[#57A4CD] py-1">
        <img @click="goBack" src="../assets/home-icon.svg" alt="home icon" class="mt-0 w-[44px] cursor-pointer" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
function goBack() {
    router.back();
}
</script>