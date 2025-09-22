<template>
    <div class="wrapper">
        <div class="content">
            <h2>Hello! Please check your email to verify your account.</h2>
            <img src="../assets/blueFluff.svg" alt="blueFluff">
        </div>
    </div>
</template>

<style scoped>
.wrapper {
  background-color: rgb(174, 210, 229);
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}
.content {
  text-align: center;
  background-color: #f9f9f9;
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

h2 {
  font-size: 28px;
  color: #333;
  margin: 0;
  max-width: 400px;
}

img {
  width: 150px;
}
</style>