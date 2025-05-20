<template>
  <div class="profile-container">
    <h2>마이페이지</h2>
    <form @submit.prevent="updateUserInfo">
      <div class="mb-3">
        <label for="nickname" class="form-label">닉네임</label>
        <input v-model="userInfo.nickname" type="text" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">이메일</label>
        <input v-model="userInfo.email" type="email" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">비밀번호 (변경하려면 입력)</label>
        <input v-model="userInfo.password" type="password" class="form-control" />
      </div>
      <button class="btn btn-primary w-100">정보 수정</button>
    </form>

    <div class="mt-4">
      <h4>✨ 팔로우 중인 사용자</h4>
      <ul class="list-group">
        <li v-for="user in followings" :key="user.id" class="list-group-item d-flex justify-content-between">
          <span>{{ user.nickname }}</span>
          <button class="btn btn-sm btn-danger" @click="toggleFollow(user.id)">언팔로우</button>
        </li>
      </ul>
    </div>

    <div class="mt-4">
      <h4>👥 나를 팔로우한 사용자</h4>
      <ul class="list-group">
        <li v-for="user in followers" :key="user.id" class="list-group-item">{{ user.nickname }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuthStore } from "@/stores"
import api from "@/api/axios"

const userInfo = ref({ nickname: "", email: "", password: "" })
const followings = ref([])
const followers = ref([])
const authStore = useAuthStore()

const loadUserInfo = async () => {
  try {
    await authStore.loadUser()
    if (authStore.user) {
      userInfo.value.nickname = authStore.user.nickname
      userInfo.value.email = authStore.user.email
    }
    await loadFollowings()
    await loadFollowers()
  } catch (error) {
    console.error("사용자 정보 로드 실패:", error)
  }
}

const updateUserInfo = async () => {
  try {
    const updatedData = {
      nickname: userInfo.value.nickname,
      email: userInfo.value.email,
      password: userInfo.value.password || undefined,
    }
    await api.put("/accounts/mypage", updatedData)
    alert("정보가 수정되었습니다.")
    userInfo.value.password = ""
  } catch (error) {
    console.error("정보 수정 실패:", error)
  }
}

const loadFollowings = async () => {
  try {
    const { data } = await api.get("/accounts/followings")
    followings.value = data
  } catch (error) {
    console.error("팔로우 목록 로드 실패:", error)
  }
}

const loadFollowers = async () => {
  try {
    const { data } = await api.get("/accounts/followers")
    followers.value = data
  } catch (error) {
    console.error("팔로워 목록 로드 실패:", error)
  }
}

const toggleFollow = async (userId) => {
  try {
    await api.post(`/accounts/follow/${userId}`)
    await loadFollowings()
  } catch (error) {
    console.error("팔로우/언팔로우 실패:", error)
  }
}

onMounted(loadUserInfo)
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
