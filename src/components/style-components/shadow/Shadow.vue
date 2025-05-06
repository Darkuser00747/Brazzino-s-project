<script setup lang="ts">
import UiParentCard from '@/components/shared/UiParentCard.vue'

const products = [
  { id: 1, name: 'Votka', price: 37, image: 'https://ickidunyasi.net/wp-content/uploads/2023/08/absolut-vodka.jpg'},
   {id: 2, name: 'don perignon', price: 150, image: 'https://jumbocolombiaio.vtexassets.com/arquivos/ids/186940/3.-ron.jpg?v=637813983609800000'},
  { id: 3, name: 'Agua aridente', price: 200, image: 'https://dislicoresqa.vtexassets.com/arquivos/ids/311725/220013-Aguardiente-Sin-Azucar-750ml.png?v=638048619987630000' },
  // Puedes cargar estos datos dinámicamente también
]
</script>

<template>
  <UiParentCard title="BRAZZINOS CATALOGUE">
    <v-row justify="center" class="mb-5 mt-1 px-8 px-3">
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12" sm="6" md="4"
      >
        <v-card class="d-flex flex-column align-center pa-4" elevation="4">
          <v-img :src="product.image" height="250" width="250" contain></v-img>
          <div class="text-h6 mt-2">{{ product.name }}</div>
          <v-btn
          color="warning"> 
        
           ${{ product.price }}
           
           </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </UiParentCard>
</template>

