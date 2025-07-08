<template>
    <img src="../assets/linesTopBottom.png" alt="drawing of lines" class="lines-top-bottom-login">
    <main>
        <div class="wrapper-login">
            <h2>Login</h2>
            <form>
                <label for="userLogin">
                    <img src="../assets/user-icon.svg" alt="user icon" class="user-icon">
                    <input type="text" id="userLogin" name="userLogin" placeholder="Username or email" v-model="userLogin" required>
                </label>
                <label for="passwordLogin">
                    <img src="../assets/password-icon.svg" alt="password-icon" class="user-icon">
                    <input type="password" id="passwordLogin" name="Password" placeholder="Password" required>
                </label>
                <div class="bottom-form-txt">
                    <label for="rememberLogin">
                        <input type="checkbox" name="Remember-me" id="rememberLogin">
                        Remember me
                    </label>
                    <label for="">Forgot password?</label>
                </div>
                <button type="submit" class="userButton">Login</button>
            </form>
            <div class="otherRegister">
                <p>or</p>
                <div class="linksRegister">
                    <img src="../assets/google-icon.svg" alt="Google icon">
                    <img src="../assets/apple-icon.svg" alt="Apple icon">
                    <img src="../assets/facebook-icon.svg" alt="Facebook icon">
                </div>
            </div>
            <p>Don't have an account? Sign up <router-link to="/register" id="register-link">here</router-link></p>
        </div>
    </main>
</template>

<script>
export default {
    name: 'LoginUser'
}
</script>

<style lang="scss">
.lines-top-bottom-login {
  position: absolute;
  height: 95%;
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
    
    .wrapper-login {
        width: 600px;
        background-color: rgba(174, 210, 229,0.5);
        //backdrop-filter: blur(20px); ???
        //-webkit-backdrop-filter: blur(100px);
        height: 700px;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);
        z-index: 0;

        h2 {
            font-size: 64px;
            text-align: center;
            margin-top: 116px;
            margin-bottom: 44px;
            font-weight: 450;
        }

        form {
            display: flex;
            flex-direction: column;
            align-items: center;
            //background-color: aqua;
            gap: 22px;

            .user-icon, .password-icon {
                position: relative;
                left: 40px;
                top: 6px;
                width: 30px;
            }

            input[type="text"], input[type="password"] {
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

            input[type="text"]::placeholder, input[type="password"]::placeholder {
                color: #f9f9f9d1;
                //padding-left: 30px;
                font-weight: 300px;
            }

            input[type="text"]:focus, input[type="password"]:focus {
                border: 3px solid #2A8DC1;
                outline: none;
            }

            .bottom-form-txt {
                margin-top: 12px;
                display: flex;
                width: 364px;
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

        p {
            text-align: center;
            margin-top: 32px;

          }

          a {
            color: #000;
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
    }
}
</style>