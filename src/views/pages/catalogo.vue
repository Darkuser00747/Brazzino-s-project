<template>
  <nav class="navbar">
  <h1>BRAZZINO'S</h1>
</nav>

  <div class="carrusel-container">
    <img
      v-for="(img, index) in imagenes"
      :key="index"
      :src="img"
      :alt="`Slide ${index + 1}`"
      :class="['carrusel-slide', { activo: index === actual }]"
    />


    <div class="carrusel-botones">
      <button @click="anterior">&#10094;</button>
      <button @click="siguiente">&#10095;</button>
    </div>
  </div>
  <div class="info-section">
  <h2>Sobre Nosotros</h2>
  <p>
    En BRAZZINO'S nos apasiona ofrecer una experiencia única en bebidas. Nuestro catálogo está cuidadosamente seleccionado para complacer a los paladares más exigentes.
  </p>
  <p>
    Explora nuestra amplia variedad y descubre tu nueva favorita. ¡Salud!
  </p>
</div>
<div class="image-gallery">
  <img src="https://trexperienceperu.com/sites/default/files/2024-08/chilcano-peruvian.webp" alt="Bebida 1" />
  <img src="https://clubbin-images.s3.amazonaws.com/ph223U0BE4hY.jpeg" alt="Bebida 2" />
  <img src="https://pbs.twimg.com/media/BM_R6ZyCcAA-a-I.jpg:large" alt="Bebida 3" />
</div>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const imagenes = [
  "https://capasdelatierra.win/wp-content/uploads/bebidas-alcoholicas.jpg",
  "https://www.blasbermejo.com/wp-content/uploads/2022/12/clasificacion-bebidas-alcoholicas.jpg",
  "https://images.squarespace-cdn.com/content/v1/66e9d7dd116b1a1677dd8758/17c60a9d-89eb-44f9-9484-8989deefa578/PNG+image.jpeg"
]

const actual = ref(0)
let intervalo = null

function siguiente() {
  actual.value = (actual.value + 1) % imagenes.length
}

function anterior() {
  actual.value = (actual.value - 1 + imagenes.length) % imagenes.length
}

onMounted(() => {
  intervalo = setInterval(siguiente, 2000) // Cambia cada 2 segundos
})

onUnmounted(() => {
  clearInterval(intervalo)
})
</script>

<style scoped>
.carrusel-container {
  position: relative;
  width: 100%;
  height: 750px;
  overflow: hidden;
}

.carrusel-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease;
}

.carrusel-slide.activo {
  opacity: 1;
}

.carrusel-botones {
  position: absolute;
  top: 50%;
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.carrusel-botones button {
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 20px;
  cursor: pointer;
}
.navbar {
  background-color: #1e1e1e;
  color: white;
  padding: 1rem 1rem;
  text-align: left;
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
.info-section {
  margin-top: 2rem;
  padding: 1.5rem 2rem;
  background-color: #f5f5f5;
  border-radius: 10px;
  text-align: center;
}

.info-section h2 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.8rem;
}

.info-section p {
  margin-bottom: 0.8rem;
  color: #555;
  font-size: 1rem;
  line-height: 1.5;
}
.image-gallery {
  margin-top: 2rem;
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  flex-wrap: wrap;
}

.image-gallery img {
  width: 300px;
  height: auto;
  object-fit: cover;
  border-radius: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.image-gallery img:hover {
  transform: scale(1.2);
}

</style>

  