<template>
    <div class="container">
        <div class="wrapper">
            <h1>Siema elo trzy dwa zero</h1>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss">
body {
    background-image: url("../assets/background-play.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    
    .wrapper {
        background-color: rgba(174, 210, 229,0.5);
        backdrop-filter: blur(20px);
        width: 600px;
        height: 700px;
        border-radius: 6px;
        box-shadow:  4px 4px 10px 3px rgba(0,0,0,0.3);
    }
}

</style>