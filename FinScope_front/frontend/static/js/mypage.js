document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sign_up-form");
  const followersList = document.getElementById("followers-list");
  const followingsList = document.getElementById("followings-list");

  const accessToken = localStorage.getItem("access");

  fetch("http://127.0.0.1:8001/api/accounts/mypage/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + accessToken
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("받은 데이터:", data);
      document.getElementById("username").value = data.username || "";
      document.getElementById("email").value = data.email || "";
      document.getElementById("nickname").value = data.nickname || "";

      // 🧑‍🤝‍🧑 팔로잉 리스트 렌더링
      if (Array.isArray(data.followings) && data.followings.length > 0) {
        followingsList.innerHTML = "";
        data.followings.forEach(user => {
          const li = document.createElement("li");
          li.className = "list-group-item d-flex justify-content-between align-items-center";
          li.innerText = user.nickname;

          const btn = document.createElement("button");
          btn.className = "btn btn-sm btn-danger";
          btn.innerText = "언팔로우";
          btn.onclick = () => {
            fetch(`http://127.0.0.1:8001/api/accounts/follow/${user.id}/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
              }
            }).then(() => {
              alert("언팔로우 완료");
            });
          };

          li.appendChild(btn);
          followingsList.appendChild(li);
        });
      } else {
        followingsList.innerHTML = "<li class='list-group-item'>팔로잉한 유저가 없습니다.</li>";
      }

      // 👥 팔로워 리스트 렌더링
      if (Array.isArray(data.followers) && data.followers.length > 0) {
        followersList.innerHTML = "";
        data.followers.forEach(user => {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.innerText = user.nickname;
          followersList.appendChild(li);
        });
      } else {
        followersList.innerHTML = "<li class='list-group-item'>아직 나를 팔로우한 유저가 없습니다.</li>";
      }

      // 📬 회원정보 수정
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let password = document.getElementById("password").value.trim();
        let nickname = document.getElementById("nickname").value.trim();
        let email = document.getElementById("email").value.trim();

        const updated = {};
        if (password) updated.password = password;
        if (nickname) updated.nickname = nickname;
        if (email) updated.email = email;

        try {
          const response = await fetch("http://127.0.0.1:8001/api/accounts/mypage/", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(updated)
          });

          if (response.ok) {
            alert("회원 정보 수정 완료!");
          } else {
            const data = await response.json();
            alert(data.error || "수정에 실패했습니다.");
          }
        } catch (err) {
          console.error(err);
          alert("서버 오류로 정보를 수정할 수 없습니다.");
        }
      });
    });
});
