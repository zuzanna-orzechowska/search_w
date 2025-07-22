<template>
    <div class="dropdown-content">
        <div class="dropdown-section">
            <p>Welcome Username</p>
            <img src="../assets/user-icon.svg" alt="">
        </div>
        <div class="dropdown-section-left">
            <div class="dropdown-option">
                <img src="../assets/profile-icon.svg" alt="Profile icon">
                <p>Profile</p>
            </div>
            <div class="dropdown-option">
                <img src="../assets/achievements-icon.svg" alt="Achievements icon">
                <p>Achievements</p>
            </div>
            <div class="dropdown-option">
                <img src="../assets/settings-icon.svg" alt="Settings icon">
                <p>Settings</p>
            </div>
            <div class="dropdown-option">
                <img src="../assets/help-icon.svg" alt="Help icon">
                <p>Help</p>
            </div>
            <div class="dropdown-option">
                <img src="../assets/sign-out-icon.svg" alt="Sign out icon">
                <p>Sign out</p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss">
.dropdown-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      position: absolute;
      width: 300px;
      height: 336px;
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
          font-size: 20px;
        }

        img {
            width: 64px;
        }

      }

    .dropdown-section-left {
        width: 254px;
        display: flex;
        flex-direction: column;
        gap: 12px;

        .dropdown-option {
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid black;

            img {
                width: 30px;
            }

            p {
                font-size: 18px;
            }
            
        }
    }
}
</style>