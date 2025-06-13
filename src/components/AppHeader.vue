<!--changed toggle from https://dev.to/madza/12-creative-toggle-designs-for-your-inspiration-with-code-50bn-->
<template>
    <header class="header">
        <label for="theme" class="theme">
        <span class="theme__toggle-wrap">
            <input id="theme" class="theme__toggle" type="checkbox" role="switch" name="theme" value="dark">
            <span class="theme__fill"></span>
            <span class="theme__icon">
                <span class="theme__icon-part"></span>
                <span class="theme__icon-part"></span>
                <span class="theme__icon-part"></span>
                <span class="theme__icon-part"></span>
                <span class="theme__icon-part"></span>
                <span class="theme__icon-part"></span>
                <span class="theme__icon-part"></span>
                <span class="theme__icon-part"></span>
                <span class="theme__icon-part"></span>
                </span>
            </span>
        </label>
    </header>
</template>

<script>
export default {
}
</script>

<style lang="scss">
$hue: 223;
$bg: hsl($hue, 10%, 100%);
$fg: hsl($hue, 10%, 0%);
$primary: hsl($hue, 90%, 55%);
$primaryT: hsla($hue, 90%, 55%, 0);
$trans_time: 0.6s;

:root {
  font-size: calc(6px + (32 - 16) * (30vw - 320px) / (1280 - 320));
}

html,
body {
  background-color: #f9f9f9;
}

body,
input {
  font: 1em Fredoka, sans-serif;
}

// .header z Twojego kodu
.header {
  top: 0;
  position: static;
}

.theme {
  display: flex;
  align-items: center;
}

.theme__fill,
.theme__icon {
  transition: transform $trans_time ease-in-out;
}

.theme__fill {
  background-color: pink; // DO ZMIANY
  display: block;
  mix-blend-mode: difference; //TO TUTAj PSUJE!!!
  position: fixed;
  inset: 0;
  height: 100%;
  transform: translateX(-100%);
}

.theme__icon,
.theme__toggle {
  z-index: 1;
}

.theme__icon,
.theme__icon-part {
  position: absolute;
}

.theme__icon {
  display: block;
  top: 0.75em;
  left: 0.75em;
  width: 1.5em;
  height: 1.5em;
}

.theme__icon-part {
  border-radius: 50%;
  box-shadow: 0.4em -0.4em 0 0.5em hsl(0, 0%, 100%) inset;
  top: calc(50% - 0.5em);
  left: calc(50% - 0.5em);
  width: 1em;
  height: 1em;
  transition:
    box-shadow $trans_time ease-in-out,
    opacity $trans_time ease-in-out,
    transform $trans_time ease-in-out;
  transform: scale(0.5);
}

.theme__icon-part ~ .theme__icon-part {
  background-color: hsl(50, 0%, 100%);
  border-radius: 0.05em;
  box-shadow: none;
  top: 50%;
  left: calc(50% - 0.05em);
  transform: rotate(0deg) translateY(0.5em);
  transform-origin: 50% 0;
  width: 0.1em;
  height: 0.2em;
}

@for $i from 3 through 9 {
  .theme__icon-part:nth-child(#{$i}) {
    transform: rotate(#{($i - 2) * 45}deg) translateY(0.5em);
  }
}

.theme__label,
.theme__toggle,
.theme__toggle-wrap {
  position: relative;
}

.theme__toggle,
.theme__toggle:before {
  display: block;
}

.theme__toggle {
  background-color: #AED2E5;
  border-radius: 25% / 50%;
  box-shadow: 0 0 0 0.125em $primaryT;
  padding: 0.25em;
  width: 6em;
  height: 3em;
  appearance: none;
  transition:
    background-color $trans_time ease-in-out,
    box-shadow 0.15s ease-in-out,
    transform $trans_time ease-in-out;
}

.theme__toggle:before {
  background-color: #0077b6;
  border-radius: 50%;
  content: "";
  width: 2.5em;
  height: 2.5em;
  transition:
    background-color $trans_time ease-in-out,
    transform $trans_time ease-in-out;
}

.theme__toggle:focus {
  box-shadow: 0 0 0 0.125em $primary;
  outline: transparent;
}

.theme__toggle:checked {
  background-color: #0077b6;
}

.theme__toggle:checked:before,
.theme__toggle:checked ~ .theme__icon {
  transform: translateX(3em);
}

.theme__toggle:checked:before {
  background-color: #AED2E5;
}

.theme__toggle:checked ~ .theme__fill {
  transform: translateX(0);
}

.theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(1) {
  box-shadow: 0.2em -0.2em 0 0.2em hsl(0, 0%, 100%) inset;
  transform: scale(1);
}

.theme__toggle:checked ~ .theme__icon .theme__icon-part ~ .theme__icon-part {
  opacity: 0;
}

@for $i from 2 through 9 {
  .theme__toggle:checked ~ .theme__icon .theme__icon-part:nth-child(#{$i}) {
    transform: rotate(#{($i - 1) * 45}deg) translateY(0.8em);
  }
}

.theme__toggle-wrap {
  margin: 0 0.75em;
}

@supports selector(:focus-visible) {
  .theme__toggle:focus {
    box-shadow: 0 0 0 0.125em $primaryT;
  }

  .theme__toggle:focus-visible {
    box-shadow: 0 0 0 0.125em $primary;
  }
}
</style>
