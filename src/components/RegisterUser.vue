<template>
    <main>
        <div class="wrapper-register">
            <h2>Register</h2>
            <form>
                <div class="wrapper-avatars">
                    <!--v-bind is a directive that cooperate with JS - change avatar icon depending on a choice - default is "+", any other is user choice
                    v-on (short is @) is a directive that handles DOM events and run handlers when triggered - in this case via click event ;
                    showing/hidding pannel with avatars when clicked-->
                    <img v-bind:src="selectedAvatar || require('../assets/avatar-icon.svg')" v-on:click="avatars = !avatars" alt="plus" class="avatar-icon">

                    <!--v-if is a directive that checks if given condition is met - if yes then the div is visible-->
                    <div v-if="avatars" class="container-avatars">
                        <p>Choose an avatar</p>
                        <div class="images">
                            <!-- v-for is a directive that renders a list - in this case it presents all of avatars from array - the key is their indexes
                             :key attribute is used so Vue can tell the elements apart properly, unique identifying
                             v:bind takes proper img url - the chosen one, v-of uses chooseAvatar method that replace default plus icon with selected image-->
                            <img v-for="(av,ind) in avatarsArr" :key="ind"  v-bind:src="av" v-on:click="chooseAvatar(av)">
                        </div>
                    </div>
                </div>
                <label for="usernameRegister">
                    <img src="../assets/user-icon.svg" alt="user icon" class="icon">
                    <input type="text" id="usernameRegister" name="Username" placeholder="Username" required>
                </label>
                <label for="emailRegister">
                    <img src="../assets/email-icon.svg" alt="email icon" class="icon">
                    <input type="email" id="usernameRegister" name="Email" placeholder="Email" required>
                </label>
                <label for="passwordRegister">
                    <img src="../assets/password-icon.svg" alt="password-icon" class="icon">
                    <input type="password" id="passwordRegister" name="Password" placeholder="Password" required>
                </label>
                <div class="bottom-form-txt">
                    <label for="accPrivacyPolicy">
                        <input type="checkbox" name="Accept-Privacy-Policy" id="accPrivacyPolicy" required>
                        Accept <router-link> Privacy Policy</router-link>
                    </label>
                    <label for="accTermsofUse">
                        <input type="checkbox" name="Remember-me" id="accTermsofUse" required>
                        Accept <router-link> Terms of Use</router-link>
                    </label>
                </div>
                <button type="submit" class="userButton">Register</button>
            </form>
            <div class="otherRegister">
                <p>or</p>
                <div class="linksRegister">
                    <img src="../assets/google-icon.svg" alt="Google icon">
                    <img src="../assets/apple-icon.svg" alt="Apple icon">
                    <img src="../assets/facebook-icon.svg" alt="Facebook icon">
                </div>
            </div>
            <p id="sign-in-p">Already have an account? Sign in <router-link to="/login" id="login-link">here</router-link></p>
            <img src="../assets/linesTopBottom.png" alt="drawing of lines" class="lines-top-bottom">
        </div>
    </main>
</template>

<script>
export default {
  name: 'RegisterUser',
  //this function has all needed data that will be used - visibility of avatars, selected avatar and array of avatars to choose from
  data() {
    return {
        avatars : false,
        selectedAvatar : '',
        avatarsArr: [
            //require is used to import other modules - in this case svg images
            require('../assets/avatars/av1.svg'),
            require('../assets/avatars/av2.svg'),
            require('../assets/avatars/av3.svg'),
            require('../assets/avatars/av4.svg'),
            require('../assets/avatars/av5.svg'),
            require('../assets/avatars/av6.svg'),
            require('../assets/avatars/av7.svg'),
            require('../assets/avatars/av8.svg')
        ]
    };
  },

  //used to handle events, it's using data from data() function
  methods: {
    chooseAvatar(imgSrc) {
        this.selectedAvatar = imgSrc;
        this.avatars = false;
    }
  }
}
</script>
<style lang="scss">
.lines-top-bottom {
  position: absolute;
  //bottom: 12px;
  top: -44px;
  left: -164px;
  height: 110%;
  object-fit: contain;
  z-index: 1;
  pointer-events: none;
}

main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f9f9f9;
    
    .wrapper-register {
        position: relative;
        width: 600px;
        background-color: rgba(174, 210, 229,0.5);
        height: 800px;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);
        z-index: 0;

        h2 {
            position: relative;
            z-index: 10;
            font-size: 64px;
            text-align: center;
            margin-top: 52px;
            margin-bottom: 22px;
            font-weight: 450;
        }

        form {
            display: flex;
            flex-direction: column;
            align-items: center;
            //background-color: aqua;
            gap: 22px;

            .wrapper-avatars {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                .avatar-icon {
                    width: 100px;
                    cursor: pointer;
                }

                .container-avatars {
                    width: 700px;
                    background-color: #6AAED3;
                    position: absolute;
                    bottom: 216px;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    gap: 24px;
                    padding: 24px 0px;
                    border-radius: 24px;

                    p {
                        font-size: 24px;
                        color: #f9f9f9;
                        font-weight: 300px;
                    }

                    .images {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 24px;

                        img {
                            width: 100px;
                            height: 100px;
                            border-radius: 50%;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        }

                        img:hover {
                            transform: scale(1.1);
                        }
                    }
                }
            }


            .icon {
                position: relative;
                left: 40px;
                top: 6px;
                width: 30px;
            }

            input[type="text"], input[type="password"], input[type="email"] {
                width: 364px;
                font-size: 24px;
                background-color: #6AAED3;
                border: none;
                border-radius: 16px;
                height: 34px;
                padding: 24px 0 24px 48px;
                color: #f9f9f9;
                transition: all 0.3s ease;
            }

            input[type="text"]::placeholder, input[type="password"]::placeholder, input[type="email"]::placeholder {
                color: #f9f9f9d1;
                //padding-left: 30px;
                font-weight: 300px;
            }

            input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus {
                border: 3px solid #2A8DC1;
                outline: none;
            }

            .bottom-form-txt {
                margin-top: 12px;
                display: flex;
                width: 396px;
                justify-content: space-between;
                align-items: center;
                font-size: 16px;
                text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);

                input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                label {
                  cursor: pointer;
                }

                input[type="checkbox"]:checked {
                    accent-color: #0077b6;
                }

                label{
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
            }
            
            .userButton {
                margin-top: 22px;
                font-size: 24px;
                padding: 1% 6%;
                font-weight: 500;
                background-color: #2A8DC1;
                border: 2px solid black;
                border-radius: 6px;
                cursor: pointer;
                transform: perspective(1px) translateZ(0);
                box-shadow: 0 0 1px transparent;
                transition-duration: 0.3s;
                transition-property: box-shadow, transform;
            }

            .userButton:hover {
                box-shadow: 0px 8px 30px -4px rgba(8, 73, 111, 0.86);
                transform: scale(1.1);
            }
        }

        .otherRegister {
           p {
            text-align: center;
            overflow: hidden;
            margin-top: 32px;
           }

           p:before, p:after {
            background-color: #000;
            content: "";
            display: inline-block;
            height: 2px;
            position: relative;
            vertical-align: middle;
            width: 20%;
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
                margin-top: 24px;

                img {
                    width: 40px;
                    cursor: pointer;
                }
            }
        }

        #sign-in-p {
            text-align: center;
            margin-top: 32px;

          }

          a {
            color: #000;
          }
    }
}
</style>