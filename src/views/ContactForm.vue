<template>
  <main class="flex min-h-screen w-full items-center justify-center bg-[#f9f9f9] p-4 max-[600px]:p-2">
    <div class="flex h-auto min-h-[672px] w-full max-w-[800px] flex-col items-center rounded-xl bg-[#aecde5]/50 p-8 shadow-[4px_4px_10px_3px_rgba(0,0,0,0.2)] backdrop-blur-sm max-[600px]:min-h-[642px] max-[600px]:p-4 max-[600px]:shadow-none">
      
      <h2 class="mb-8 mt-4 text-center text-[48px] font-medium text-[#333] max-[600px]:mt-6 max-[600px]:text-[36px]">
        Contact
      </h2>

      <form action="https://formspree.io/f/xvgbngva" method="post" class="flex w-full flex-col items-center gap-5">
        
        <div class="flex w-[85%] flex-col gap-2 max-[600px]:w-full">
          <label for="userName" class="text-[1rem] font-semibold text-[#333]">Name or username *</label>
          <input type="text" id="userName" name="userName" placeholder="Your name" autocomplete="off" required
            class="h-12 w-full rounded-xl border-2 border-transparent bg-[#6AAED3] px-4 py-2 text-[1.1rem] text-white placeholder:text-white/70 transition-all duration-300 focus:border-[#2A8DC1] focus:bg-[#5da0c5] focus:outline-none focus:ring-2 focus:ring-[#2A8DC1]/30">
        </div>

        <div class="flex w-[85%] flex-col gap-2 max-[600px]:w-full">
          <label for="userEmail" class="text-[1rem] font-semibold text-[#333]">E-mail *</label>
          <input type="email" id="userEmail" name="userEmail" placeholder="Your email address" autocomplete="off" required
            class="h-12 w-full rounded-xl border-2 border-transparent bg-[#6AAED3] px-4 py-2 text-[1.1rem] text-white placeholder:text-white/70 transition-all duration-300 focus:border-[#2A8DC1] focus:bg-[#5da0c5] focus:outline-none focus:ring-2 focus:ring-[#2A8DC1]/30">
        </div>

        <div class="flex w-[85%] flex-col gap-2 max-[600px]:w-full">
          <label for="topic" class="text-[1rem] font-semibold text-[#333]">Topic</label>
          <input type="text" id="topic" name="topic" placeholder="What is this about?" autocomplete="off"
            class="h-12 w-full rounded-xl border-2 border-transparent bg-[#6AAED3] px-4 py-2 text-[1.1rem] text-white placeholder:text-white/70 transition-all duration-300 focus:border-[#2A8DC1] focus:bg-[#5da0c5] focus:outline-none focus:ring-2 focus:ring-[#2A8DC1]/30">
        </div>

        <div class="flex w-[85%] flex-col gap-2 max-[600px]:w-full">
          <label for="message" class="text-[1rem] font-semibold text-[#333]">Message</label>
          <textarea id="message" name="message" placeholder="How can I help you?" rows="4"
            class="min-h-[120px] w-full resize-y rounded-xl border-2 border-transparent bg-[#6AAED3] px-4 py-3 text-[1.1rem] text-white placeholder:text-white/70 transition-all duration-300 focus:border-[#2A8DC1] focus:bg-[#5da0c5] focus:outline-none focus:ring-2 focus:ring-[#2A8DC1]/30"></textarea>
        </div>

        <div class="flex w-[85%] items-start gap-3 pt-2 max-[600px]:w-full">
          <input type="checkbox" name="userAgreed" id="agreement" required 
            class="mt-1 h-5 w-5 cursor-pointer accent-[#2A8DC1]">
          <label for="agreement" class="cursor-pointer text-[0.9rem] leading-tight text-[#444]">
            I consent to the storage and use of the information I provide for contact purposes.
          </label>
        </div>

        <button type="submit" 
          class="mt-6 w-[180px] cursor-pointer rounded-lg border-2 border-black/10 bg-[#2A8DC1] py-3 text-[1.2rem] font-bold text-black shadow-md transition-all duration-300 hover:scale-105 hover:bg-[#1e74a3] hover:shadow-lg active:scale-95 max-[600px]:w-full">
          Send Message
        </button>
      </form>
    </div>
  </main>
</template>