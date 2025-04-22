document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sign_up-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const nickname = document.getElementById("nickname").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!username || !password || !nickname || !email) {
      alert("입력란을 전부 채우세요.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8001/api/accounts/sign_up/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, nickname, email })
      });

      const data = await response.json();

      if (response.ok && data.access && data.refresh) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        alert("회원가입 하셨습니다. 축하합니다!");
        window.location.href = "127.0.0.1:8000/mypage/";
      } else {
        alert(data.error || "입력값이 유효하지 않습니다. 다시 확인해 주세요.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류입니다.");
    }
  });
});
