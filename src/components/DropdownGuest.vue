<template>
    <div v-if="dropdownActive" class="dropdown-content">
        <div class="dropdown-section">
            <p>Come back to word searching’s journey</p>
            <button class="dropdown-btn" @click="toLogin">Sign in</button>
        </div>
        <div class="dropdown-section">
            <p>Don’t have an account?</p>
            <button class="dropdown-btn white" @click="toRegister">Sign up</button>
            <div class="otherRegister">
                <p>or</p>
                <div class="linksRegister">
                    <img src="../assets/google-icon.svg" alt="Google icon">
                    <img src="../assets/apple-icon.svg" alt="Apple icon">
                    <img src="../assets/microsoft-icon.svg" alt="Microsoft icon">    
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>
