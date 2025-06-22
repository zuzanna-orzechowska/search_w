<template>
    <img src="../assets/linesTopBottom.png" alt="drawing of lines">
    <main>
        <div class="wrapper-login">
            <h2>Login</h2>
        </div>
    </main>
</template>

<script>
export default {
    name: 'RegisterUser'
}
</script>

<style lang="scss">
img {
  position: absolute;
  top: 16;
  left: 60;
  width: 100%;
  height: 90%;
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

    .wrapper-login {
        width: 600px;
        background-color: #AED2E5;
        height: 620px;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);
        z-index: 0;

        h2 {
            font-size: 58px;
            text-align: center;
            margin-top: 124px;
            font-weight: 500;
        }
    }
}
</style>