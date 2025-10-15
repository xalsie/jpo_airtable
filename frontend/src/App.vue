<script setup>
import { RouterView } from "vue-router";

import NavBar from "./components/NavBar.vue";
</script>

<template>
    <div id="root">
        <NavBar />
        <main><RouterView /></main>
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

main {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
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

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
}

th, td {
  padding: 10px 14px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid var(--dark-gray);
}

th {
  font-weight: 700;
  letter-spacing: 0.02em;
  border-bottom: 2px solid var(--dark-gray);
}

tr:last-child td {
  border-bottom: none;
}

td {
  font-weight: 400;
  color: #222;
  vertical-align: middle;
}

tr {
  transition: background 0.15s;
}

tr:hover {
  background: #f6f6f6;
}

caption {
  caption-side: bottom;
  font-size: 13px;
  color: #888;
  padding: 8px 0 0 0;
  letter-spacing: 0.01em;
}
</style>
