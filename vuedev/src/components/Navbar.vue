<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <img src="../../public/FinScope_logo.png" alt="FinScope" width="30" height="30" />
        FinScope
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
        aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <!-- 좌측 메뉴 -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">홈</router-link>
          </li>
        </ul>

        <!-- 검색창 -->
        <form class="d-flex me-3 align-items-center" @submit.prevent="handleSearch">
          <input v-model="searchQuery" class="form-control me-2 flex-grow-1" type="search" placeholder="종목명 검색">
          <button class="btn btn-outline-success" type="submit">검색</button>
        </form>

        <!-- 우측 사용자 메뉴 -->
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/mypage">마이페이지</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <a class="nav-link" href="#" @click.prevent="handleLogout">로그아웃</a>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/auth?type=login">로그인</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" to="/auth?type=signup">회원가입</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue"
import { useAuthStore } from '@/stores'
import { useRouter } from "vue-router"

const searchQuery = ref("")
const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.accessToken)

const handleLogout = () => {
  authStore.logout()
  router.push("/")
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/detail/${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
}
</style>
