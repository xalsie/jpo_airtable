<script setup>
import { RouterView } from "vue-router";

import NavBar from "./components/NavBar.vue";
</script>

<template>
    <div id="root">
        <NavBar />

        <main>
            <RouterView />
        </main>
    </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap");

:root {
    --white: #ffffff;
    --light-gray: #f0f0f0;
    --gray: #e8e8e8;
    --dark-gray: #cccccc;
    --black: #000000;
}

body {
    font-family: "Inter";
    font-optical-sizing: auto;
    font-weight: normal;
    font-style: normal;
}

#root {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
}

main {
    padding-top: 36px;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 50px;
}

.center {
    align-items: center;
    gap: 20px;
}

.space {
    margin-top: 72px;
}

.text-sm {
    font-size: 14px;
}

.text-xs {
    font-size: 12px;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
    margin: 0 !important;
}

a {
    color: inherit;
    text-decoration: none;
}

input {
    padding: 6px 12px;
    border: 1px solid var(--dark-gray);
    border-radius: 6px;
    outline: none;
}

input:focus {
    outline: none;
}

button {
    border: none;
    cursor: pointer;
    padding: 8px 20px;
    border-radius: 6px;
    transition: background-color 0.2s ease-in-out;
}

button:hover {
    transition: background-color 0.2s ease-in-out;
}

button.primary {
    color: var(--light-gray);
    background-color: var(--black);
}

button.secondary {
    color: var(--black);
    background-color: var(--light-gray);
}

button.secondary:hover {
    color: var(--black);
    background-color: var(--gray);
}

nav {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 36px;
    padding: 42px 0;

    position: absolute;
    top: 0;
    right: 0;
}

nav a {
    text-transform: uppercase;
    font-size: 14px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-elements {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form input {
    border: 1px solid var(--gray);
}

.form input:focus {
    border: 1px solid var(--dark-gray);
}
</style>
