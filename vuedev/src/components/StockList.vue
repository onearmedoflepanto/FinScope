<template>
  <div class="stock-list-container">
    <h2 class="mb-4">🔥 이번 주 핫한 주식</h2>
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="stock in hotStocks" :key="stock.name" class="col">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ stock.name }}</h5>
            <p class="card-text">💵 {{ stock.price }}</p>
            <p class="card-text">📈 {{ stock.change }}</p>
            <router-link :to="`/detail/${stock.name}`" class="btn btn-primary">자세히</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isAuthenticated" class="mt-5">
      <h2 class="mb-4">✨ 내가 좋아요한 주식</h2>
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div v-for="stock in favoriteStocks" :key="stock.name" class="col">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ stock.name }}</h5>
              <p class="card-text">💵 {{ stock.price }}</p>
              <p class="card-text">📈 {{ stock.change }}</p>
              <button class="btn btn-outline-danger" @click="toggleFavorite(stock.name)">💔 즐겨찾기 취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useAuthStore } from "@/stores"
import api from "@/api/axios"

const hotStocks = ref([])
const favoriteStocks = ref([])
const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.accessToken)

const loadStocks = async () => {
  try {
    const { data: hotData } = await api.get("/stocks/hot/")
    hotStocks.value = hotData

    if (isAuthenticated.value) {
      const { data: favoriteData } = await api.get("/stocks/favorites/")
      favoriteStocks.value = favoriteData
    }
  } catch (error) {
    console.error("주식 데이터 로드 실패:", error)
  }
}

const toggleFavorite = async (stockName) => {
  if (!isAuthenticated.value) {
    alert("로그인이 필요합니다.")
    return
  }

  try {
    const { data } = await api.post(`/stocks/${stockName}/favorite/`)
    alert(data.message)
    loadStocks()
  } catch (error) {
    console.error("즐겨찾기 처리 실패:", error)
  }
}

onMounted(loadStocks)
</script>

<style scoped>
.stock-list-container {
  padding: 20px;
}
</style>
