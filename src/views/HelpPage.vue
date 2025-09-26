<template>
  <div class="background-container">
    <div class="help-page-container">
      <h2>Help</h2>

      <section class="section">
        <h4>Game Objective</h4>
        <p>The main goal of the puzzle is to find all the words hidden in the grid. The words you need to find are listed on the right side of the screen and will be crossed off as you find them.</p>
      </section>

      <hr />

      <section class="section">
        <h4>How to Play</h4>
        <p>Words are placed in all directions: horizontally, vertically, and diagonally. They can be spelled both forwards and backwards.</p>
        
        <h3>Finding and Selecting Words</h3>
        <ol>
          <li>Click on the first letter of the word you want to select.</li>
          <li>Drag your mouse to the last letter of the word.</li>
          <li>Release the mouse to confirm your selection. If the word is correct, it will be highlighted in the grid and marked off your list.</li>
        </ol>
        <div class="image-placeholder">
          <img src="../assets/help1.png" alt="help 1">
          <img src="../assets/help2.png" alt="help 2">
        </div>
      </section>

      <hr />

      <section class="section">
        <h4>Special Features</h4>
        <div class="feature-item">
          <img src="../assets/hint-icon.svg" alt="Hint Icon" class="feature-icon" />
          <div>
            <h3>Hints (Cost: 20 Coins)</h3>
            <p>If you get stuck, you can purchase a hint for <span>20 coins</span>. Using a hint will highlight the first letter of a random unfound word in the grid with a <span>red border</span>. You have an unlimited number of hints available, provided you have the coins to buy them!</p>
          </div>
        </div>

        <div class="feature-item">
          <div>
            <h3>Game Progress and Star Ratings</h3>
            <p>Your progress is always saved as long as you are signed in. A <span>Category</span> is marked as completed only when <span>all 5 of its stages</span> are finished.</p>
            <h3>Challenge Completion: Earning Stars</h3>
            <p>Challenges award 1 to 3 stars. A challenge is marked as <span>completed</span>only if you achieve <span>3 stars</span>. Stars are awarded based on your completion time:</p>
            <ul>
                <li><span>3 Stars</span> - Finish in 4:00 (four minutes) or less.</li>
                <li><span>2 Stars</span> - Finish between 4:01 and 6:00 (six minutes).</li>
                <li><span>1 Star</span> - Finish between 6:01 and 10:00 (ten minutes).</li>
                <li><span>0 Stars</span> - Finish in over 10:00.</li>
            </ul>
          </div>
        </div>

        <div class="feature-item">
          <div>
            <h3>Customization, Profile, and Settings</h3>
            <p>
                Visit the <span>Shop</span> to purchase avatars, which you can then change in your <span>Profile</span>. There you can update your <span>name</span>. The Profile also displays your current <span>title, level, xp</span> to the next level, and <span>Achievements</span> The Achievements page shows all available Avatars; the ones you own are <span>colorful</span>, while the rest remain <span>grey</span>.<br><br>
                In <span>Settings</span>you can change your <span>password</span>, and request to <span>delete you account</span>.
            </p>
            <p>When you've found all the words, a "Puzzle Completed" message will appear, giving you the option to play another puzzle or return to the home page.</p>
          </div>
        </div>
      </section>

      <hr />
      
      <section class="section about">
        <h4>About This Game</h4>
        <p>This game was designed to be a fun and relaxing way to challenge your mind and improve your vocabulary. It's a passion project built with Vue.js, SCSS, Appwrite and Pinia. I hope you enjoy playing!</p>
      </section>

      <div class="bottom">
        <img @click="goBack" src="../assets/home-icon.svg" alt="home icon">
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

<style lang="scss" scoped>
$main-bg: rgb(174, 210, 229);
$button-bg: #57A4CD;
$primary-blue: #2A8DC1;
$text-color: #333;

.background-container {
    background-color: $main-bg;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 40px 0;
}

.help-page-container {
    background-color: $main-bg;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 90%;
    max-width: 800px;
    padding: 0 12px;
    margin: 0 auto;

    h2 {
        font-size: 56px; 
        font-weight: 500;
        margin-bottom: 16px;
        margin-top: 12px;
        text-align: center;
    }

    h4 { 
        font-size: 32px;
        font-weight: 450;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        color: black;
    }
    
    h3 {
        font-size: 20px;
        font-weight: 500;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        color: $text-color;
    }

    p, li {
        font-size: 18px; 
        line-height: 1.6;
        color: $text-color;
        margin-bottom: 1rem;
    }

    .section {
        width: 100%;
        max-width: 650px;
        margin-bottom: 1rem;

        span {
          font-weight: 550;
        }
    }

    hr {
        border: none;
        border-top: 2px solid #88BCD9;
        width: 100%;
        max-width: 650px;
        margin: 2rem 0;
    }

    ol {
        padding-left: 25px;
    }

    .image-placeholder {
        border: 2px dashed $primary-blue;
        padding: 20px;
        text-align: center;
        margin-top: 1rem;
        background-color: #C2DDEB;
        border-radius: 6px;
        
        img {
            max-width: 50%;

            border-radius: 4px;
        }
    }

    .feature-item {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        margin-bottom: 1.5rem;
        padding: 10px;
        border-left: 4px solid $primary-blue;
        background-color: #C2DDEB;
        border-radius: 0 6px 6px 0;

        ul {
          list-style-type: none;
        }
        
        .feature-icon {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            margin-top: 5px;
        }
        
        div {
            flex-grow: 1;
        }
    }
    
  .bottom{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 16px;
        background-color: #57A4CD;
        width: 280px;
        height: auto;
        border: 4px solid black;
        border-radius: 24px;
        gap: 24px;

        img{
            width: 44px;
            cursor: pointer;
            margin-top: 0;
        }
    }
}
</style>
