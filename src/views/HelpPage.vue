<template>
  <div class="help-page-container">
    <h1>Help</h1>

    <section class="section">
      <h2>Game Objective</h2>
      <p>The main goal of the puzzle is to find all the words hidden in the grid. The words you need to find are listed on the right side of the screen and will be crossed off as you find them.</p>
    </section>

    <hr />

    <section class="section">
      <h2>How to Play</h2>
      <p>Words are placed in all directions: horizontally, vertically, and diagonally. They can be spelled both forwards and backwards.</p>
      
      <h3>Finding and Selecting Words</h3>
      <ol>
        <li>Click on the first letter of the word you want to select.</li>
        <li>Drag your mouse to the last letter of the word.</li>
        <li>Release the mouse to confirm your selection. If the word is correct, it will be highlighted in the grid and marked off your list.</li>
      </ol>
      <div class="image-placeholder">
        <p></p>
      </div>
    </section>

    <hr />

    <section class="section">
      <h2>Special Features</h2>
      <div class="feature-item">
        <img src="your-hint-icon.svg" alt="Hint Icon" class="feature-icon" />
        <div>
          <h3>Hints</h3>
          <p>If you get stuck, you can use a hint. Clicking the hint icon will highlight the first letter of a random unfound word in the grid. Hints are unlimited, so use them whenever you need!</p>
        </div>
      </div>

      <div class="feature-item">
        <h3>Game Progress</h3>
        <p>If you're signed in, your progress will be saved. As a guest, your progress is saved locally in your browser for three puzzles. After that, you'll be prompted to create an account to unlock more puzzles.</p>
      </div>

      <div class="feature-item">
        <h3>Game Completion</h3>
        <p>When you've found all the words, a "Puzzle Completed" message will appear, giving you the option to play another puzzle or return to the home page.</p>
      </div>
    </section>

    <hr />

    <section class="section faq">
      <h2>Frequently Asked Questions</h2>
      <dl>
        <dt>Q: What if the hint button isn't working?</dt>
        <dd>A: The hint button will only work if there are unfound words remaining in the puzzle. If you have already found all the words, it will not activate.</dd>

        <dt>Q: Can I turn off the background music or sound effects?</dt>
        <dd>A: (Add instructions here for your specific sound controls.)</dd>

        <dt>Q: How do I play a different puzzle?</dt>
        <dd>A: After completing a puzzle, you can click the "Next" button to start a new, random puzzle from the same category. You can also go back to the home page to select a different category.</dd>
      </dl>
    </section>

    <hr />

    <section class="section about">
      <h2>About This Game</h2>
      <p>This game was designed to be a fun and relaxing way to challenge your mind and improve your vocabulary. It's a passion project built with [Your Technology Stack, e.g., Vue.js, SCSS, Appwrite]. We hope you enjoy playing!</p>
    </section>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
$primary-text: #333;
$secondary-text: #666;
$background-color: #aed2e5;;
$border-color: #e9ecef;
$link-color: #007bff;

.help-page-container {
  margin: 0 auto;
  padding: 40px 20px;
  background-color: $background-color;
  color: $primary-text;
  width: 100%;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 1rem;
  color: $primary-text;
}

h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: $primary-text;
}

p, li, dd {
  font-size: 1rem;
  line-height: 1.6;
  color: $secondary-text;
  margin-bottom: 1rem;
}

.section {
  margin-bottom: 2rem;
}

hr {
  border: none;
  border-top: 1px solid $border-color;
  margin: 2rem 0;
}

ol, ul {
  padding-left: 20px;
}

.image-placeholder {
  border: 1px dashed $border-color;
  padding: 20px;
  text-align: center;
  margin-top: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  img {
    width: 40px;
    height: 40px;
    margin-right: 15px;
  }
}

.faq dt {
  font-weight: 700;
  color: $primary-text;
  margin-top: 1rem;
}

.faq dd {
  margin-left: 20px;
}
</style>