document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8001/api/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.access && data.refresh) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        alert("로그인 성공!");
        window.location.href = "/mypage/";
      } else {
        alert(data.error || "로그인 실패!");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류입니다.");
    }
  });
});
