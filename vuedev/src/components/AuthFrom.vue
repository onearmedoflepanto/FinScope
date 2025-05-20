<template>
  <div class="auth-container">
    <h2>{{ formType === 'login' ? '로그인' : '회원가입' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="username" class="form-label">아이디</label>
        <input v-model="formData.username" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">비밀번호</label>
        <input v-model="formData.password" type="password" class="form-control" required />
      </div>
      <div v-if="formType === 'signup'" class="mb-3">
        <label for="nickname" class="form-label">닉네임</label>
        <input v-model="formData.nickname" type="text" class="form-control" required />
      </div>
      <div v-if="formType === 'signup'" class="mb-3">
        <label for="email" class="form-label">이메일</label>
        <input v-model="formData.email" type="email" class="form-control" required />
      </div>
      <button class="btn btn-primary w-100">{{ formType === 'login' ? '로그인' : '회원가입' }}</button>
    </form>
    <p class="mt-3">
      <a href="#" @click.prevent="switchFormType">
        {{ formType === 'login' ? '회원가입 하기' : '로그인 하기' }}
      </a>
    </p>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue"
import { useAuthStore } from "@/stores"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formType = computed(() => route.query.type || 'login')
const formData = reactive({
  username: '',
  password: '',
  nickname: '',
  email: ''
})

const handleSubmit = async () => {
  try {
    if (formType.value === 'login') {
      await authStore.login(formData.username, formData.password)
      router.push("/")
    } else {
      await authStore.signup(formData)
      router.push("/mypage")
    }
  } catch (error) {
    console.log(error)
    alert(error.request.response)
  }
}

const switchFormType = () => {
  const nextType = formType.value === 'login' ? 'signup' : 'login'
  router.push({ path: '/auth', query: { type: nextType } })
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
