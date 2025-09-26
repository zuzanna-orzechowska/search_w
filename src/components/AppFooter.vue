<template>
  <footer class="footer">
    <div class="links">
      <router-link to="/privacy">Privacy Policy</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/terms">Terms of Use</router-link>
    </div>
    <div class="author">
      <p>Created with 💙 by <a href="https://github.com/zuzanna-orzechowska">Zuza</a></p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style lang="scss">
.footer {
  bottom: 0;
  height: auto;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #AED2E5;
  padding: 16px 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  
  .links {
    font-size: 24px;
    display: flex;
    justify-content: center;
    text-align: center;
    gap: 64px;
    width: 100%;
    margin-bottom: 28px;

    a {
      text-decoration: none;
      color: black;
      transition: color .35 ease;
    }

    a:hover {
      color: #0077b6;
    }

  }
  
  
  .author {
    
    p{
      margin: 0;
    }
    
    a {
      text-decoration: none;
      position: relative;
      color: #000;
      font-size: 18px;
      cursor: pointer;
      font-weight: 500;
      padding: .5rem;
    }
    
    //animation form https://www.proglobalbusinesssolutions.com/css-hover-effects/
    a:before, a:after {
      content: '';
      height: 16px;
      width: 16px;
      position: absolute;
      transition: all .35s ease;
      opacity: 0;
    }
  
    a:before {
      content: '';
      right: 0;
      top: 0;
      border-top: 3px solid #3392c5;
      border-right: 3px solid #0077b6;
      transform: translate(-100%, 50%);
    }
  
    a:after {
      content: '';
      left: 0;
      bottom: 0;
      border-bottom: 3px solid #0077b6;
      border-left: 3px solid #3392c5;
      transform: translate(100%, -50%)
    }
  
    a:hover:before, a:hover:after {
      transform: translate(0,0);
      opacity: 1;
    }
  
    a:hover {
      color: #00537f;
    }
  }

  @media (max-width: 600px) {
    .links {
      font-size: 18px;
    }

    .author {

      a{
        font-size: 18px;
      }
    }
  }
}
</style>
