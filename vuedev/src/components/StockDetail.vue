<template>
  <div class="stock-detail-container">
    <div class="card mb-4">
      <div class="card-body">
        <h3>{{ stock.name }}</h3>
        <p>종목 코드: {{ stock.code }}</p>
        <p><strong>💵 가격:</strong> {{ stock.price }}</p>
        <p><strong>📈 등락률:</strong> {{ stock.change }}</p>
        <img :src="chartUrl" class="img-fluid rounded shadow-sm" alt="차트 이미지" v-if="chartUrl" /> <button
          class="btn btn-primary mt-2" @click="toggleFavorite">
          {{ isFavorite ? "💔 즐겨찾기 취소" : "✨ 즐겨찾기" }}
        </button>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">📊 AI 분석 요약</div>
      <div class="card-body" v-if="aiAnalysis">
        <p>🌡️ 주식 온도: <span :style="{ color: temperatureColor }">{{ aiAnalysis.temperature }}°</span></p>
        <p>📉 분석 요약: {{ aiAnalysis.summary }}</p>
      </div>
      <div v-else>
        <p>AI 분석 데이터를 불러오는 중...</p>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">💬 사용자 댓글</div>
      <div class="card-body">
        <form @submit.prevent="addComment">
          <textarea v-model="newComment" class="form-control mb-2" rows="2" placeholder="댓글을 입력하세요"></textarea>
          <button class="btn btn-primary w-100">댓글 등록</button>
        </form>

        <ul class="list-group mt-3">
          <li v-for="comment in comments" :key="comment.id" class="list-group-item d-flex justify-content-between">
            <div>
              <strong>{{ comment.user }}</strong><br />
              {{ comment.content }}
              <div class="text-muted small">{{ comment.created_at }}</div>
            </div>
            <div v-if="isAuthenticated && comment.isOwner">
              <button class="btn btn-sm btn-outline-secondary me-1" @click="editComment(comment)">수정</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteComment(comment.id)">삭제</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useAuthStore } from "@/stores"
import { useRoute } from "vue-router"
import api from "@/api/axios"

const chartUrl = computed(() => {
  console.log(stock.value)
  return stock.value && stock.value.chartUrl
    ? `http://127.0.0.1:8000${stock.value.chartUrl}`
    : ""
})
const route = useRoute()
const stockName = route.params.name
const stock = ref({})
const comments = ref([])
const aiAnalysis = ref(null)
const isFavorite = ref(false)
const newComment = ref("")
const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.accessToken)

const loadStockDetail = async () => {
  try {
    const { data } = await api.get(`/stocks/detail/${stockName}/`)
    console.log(data)
    stock.value = data.stock
    aiAnalysis.value = data.ai_analysis
    isFavorite.value = data.isFavorite
    console.log(chartUrl)
    loadComments()
  } catch (error) {
    console.error("주식 상세 로드 실패:", error)
  }
}

const toggleFavorite = async () => {
  if (!isAuthenticated.value) {
    alert("로그인이 필요합니다.")
    return
  }

  try {
    const { data } = await api.post(`/stocks/${stockName}/favorite/`)
    isFavorite.value = !isFavorite.value
    alert(data.message)
  } catch (error) {
    console.error("즐겨찾기 처리 실패:", error)
  }
}

const loadComments = async () => {
  try {
    const { data } = await api.get(`/boards/comments/${stockName}/`)
    comments.value = data.map(comment => ({
      ...comment,
      isOwner: comment.user_id === authStore.user?.id
    }))
  } catch (error) {
    console.error("댓글 로드 실패:", error)
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  if (!isAuthenticated.value) {
    alert("로그인이 필요합니다.")
    return
  }

  try {
    await api.post(`/boards/comments/${stockName}/`, { content: newComment.value })
    newComment.value = ""
    loadComments()
  } catch (error) {
    console.error("댓글 등록 실패:", error)
  }
}

const deleteComment = async (commentId) => {
  if (!confirm("댓글을 삭제하시겠습니까?")) return

  try {
    await api.delete(`/boards/comments/${commentId}/`)
    loadComments()
  } catch (error) {
    console.error("댓글 삭제 실패:", error)
  }
}

const editComment = async (comment) => {
  const newContent = prompt("수정할 내용", comment.content)
  if (newContent === null) return

  try {
    await api.put(`/boards/comments/${comment.id}/`, { content: newContent })
    loadComments()
  } catch (error) {
    console.error("댓글 수정 실패:", error)
  }
}

const temperatureColor = computed(() => {
  if (!aiAnalysis.value) return "black"
  const temp = aiAnalysis.value.temperature
  return temp >= 70 ? "red" : temp >= 40 ? "orange" : "blue"
})

onMounted(loadStockDetail)
</script>

<style scoped>
.stock-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
