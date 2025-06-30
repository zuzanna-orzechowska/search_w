<!--toggle from https://www.w3schools.com/howto/howto_css_switch.asp -->
<template>
    <header class="header">
        <label class="switch">
          <input type="checkbox">
          <span class="slider"></span>
        </label>
        <div class="dropdown">
          <span class="material-symbols-outlined">account_circle</span>
          <div class="dropdown-content">
            <div class="dropdown-section">
              <p>Come back to word searching’s journey</p>
              <button class="dropdown-btn">Sign in</button>
            </div>
            <div class="dropdown-section">
              <p>Don’t have an account?</p>
              <button class="dropdown-btn white">Sign up</button>
              <div class="otherRegister">
                <p>or</p>
                <div class="linksRegister">
                    <img src="../assets/google-icon.svg" alt="Google icon">
                    <img src="../assets/apple-icon.svg" alt="Apple icon">
                    <img src="../assets/facebook-icon.svg" alt="Facebook icon">
                </div>
              </div>
            </div>
          </div>
        </div>
    </header>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.header {
  /*top: 0;
  position: static; */
  display: flex;
  justify-content: flex-end;
  gap: 2%;
  margin: 12px 36px;
  align-items: center;

  .switch {
    position: relative;
    display: inline-block;
    width: 54px;
    height: 32px;
    margin-top: 36px;

    input { 
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #0077b6;
      -webkit-transition: .4s;
      transition: .4s;
      border-radius: 34px
    }
    
    .slider:before {
      position: absolute;
      content: "";
      height: 24px;
      width: 24px;
      left: 4px;
      bottom: 4px;
      background-color: #000;
      -webkit-transition: .4s;
      transition: .4s;
      border-radius: 50%;
    }
    
    input:checked + .slider {
      background-color: #000;
    }
    
    input:focus + .slider {
      box-shadow: 0 0 1px #0077b6;
    }
    
    input:checked + .slider:before {
      -webkit-transform: translateX(20px);
      -ms-transform: translateX(20px);
      transform: translateX(20px);
      background-color: #0077b6;
    }
  }

  .dropdown {
    position: relative;
    display: inline-block;

    .material-symbols-outlined {
      background-color: #0077b6;
      border-radius: 50%;
      font-size: 54px;
      cursor: pointer;
      margin-top: 36px;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      width: 300px;
      height: 292px;
      z-index: 1;
      right: 20px;
      margin-top: 8px;
      border-radius: 6px;
      background-color: rgba(174, 210, 229,0.5);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);

      .dropdown-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        p { 
          text-align: center;
          width: 224px;
        }
  
        .dropdown-btn {
          font-size: 18px;
          padding: 1% 6%;
          font-weight: 500;
          width: 100px;
          background-color: #2A8DC1;
          border: 2px solid black;
          border-radius: 6px;
          cursor: pointer;
          transform: perspective(1px) translateZ(0);
          box-shadow: 0 0 1px transparent;
          transition-duration: 0.3s;
          transition-property: box-shadow, transform;
        }

        .dropdown-btn:hover {
          box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
          transform: scale(1.1);
        }

        .white {
          background-color: #f9f9f9;
        }

        .otherRegister {
          p {
            text-align: center;
            overflow: hidden;
          }

           p:before, p:after {
            background-color: #000;
            content: "";
            display: inline-block;
            height: 2px;
            position: relative;
            vertical-align: middle;
            width: 40%;
           }

           p:before {
            right: 0.5em;
            margin-left: -50%;
          }

            p:after {
            left: 0.5em;
            margin-right: -50%;
        }

            .linksRegister {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 36px;
              margin-top: 12px;

              img {
                width: 24px;
                 cursor: pointer;
              }
            }
        }
      }

    }
  }

  .dropdown:hover {
    .dropdown-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 40px;
    }
  }

}

</style>
