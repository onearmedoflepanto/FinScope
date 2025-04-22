document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access");

  const authHeader = token
    ? { "Authorization": `Bearer ${token}` }
    : {};

  const stockName = decodeURIComponent(location.pathname.replace("/detail/", ""));
  const API_URL = "http://127.0.0.1:8001/api/boards/comments/";

  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");
  const commentList = document.getElementById("user-comments");

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  const payload = parseJwt(token);
  const currentUserId = payload?.user_id;
  // 🔥 댓글 불러오기
  async function fetchComments() {
    const res = await fetch(`${API_URL}${stockName}/`, {
      headers: {
        ...authHeader,
      }
    });

    if (!res.ok) {
      alert("댓글을 불러오는 데 실패했습니다.");
      return;
    }

    const comments = await res.json();
    commentList.innerHTML = "";

    if (Array.isArray(comments)) {
      for (const comment of comments) {
        const isOwner = comment.user_id === currentUserId;

        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-start";

        item.innerHTML = `
          <div>
            <strong>${comment.user}</strong><br>${comment.content}
            <div class="text-muted small">${new Date(comment.created_at).toLocaleString()}</div>
          </div>
          ${isOwner ? `
            <div>
              <button class="btn btn-sm btn-outline-secondary me-1" data-edit="${comment.id}">수정</button>
              <button class="btn btn-sm btn-outline-danger" data-delete="${comment.id}">삭제</button>
            </div>
          ` :
            `<div>
              <button class="btn btn-sm btn-primary ms-1" data-follow="${comment.user_id}">팔로우</button>
            </div>
          `}
        `;
        commentList.appendChild(item);
      }
    } else if (comments.message) {
      commentList.innerHTML = `
        <div class="alert alert-warning text-center">
          ${comments.message}<br>
          <a href="http://127.0.0.1:8000/login/" class="btn btn-outline-primary btn-sm mt-2">로그인</a>
        </div>
      `;
    }
  }

  // ✏️ 댓글 등록
  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = commentInput.value.trim();
    if (!content) {
      alert("댓글을 입력하세요!");
      return;
    }
    if (!token) {
      alert("로그인이 필요합니다.");
      location.href = "/login.html";
      return;
    }

    const res = await fetch(`http://127.0.0.1:8001/api/boards/comments/${stockName}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify({ content })
    });

    if (!res.ok) {
      alert("댓글 등록 실패");
      return;
    }

    commentInput.value = "";
    fetchComments();
  });

  // 🛠️ 댓글 수정 / 삭제
  commentList.addEventListener("click", async (e) => {
    const editId = e.target.dataset.edit;
    const deleteId = e.target.dataset.delete;
    const followId = e.target.dataset.follow;

    // 팔로우
    if (followId) {
      if (!token) {
        alert("로그인이 필요합니다.");
        location.href = "127.0.0.1:8000/login/";
        return;
      }

      const res = await fetch(`http://127.0.0.1:8001/api/accounts/follow/${followId}/`, {
        method: "POST",
        headers: {
          ...authHeader,
        }
      });

      if (!res.ok) {
        alert("팔로우 요청 실패");
        return;
      }

      const data = await res.json();
      alert(data.message);
    }


    // 삭제 처리
    if (deleteId) {
      if (!confirm("댓글을 삭제하시겠습니까?")) return;

      const res = await fetch(`${API_URL}${deleteId}/`, {
        method: "DELETE",
        headers: {
          ...authHeader,
        }
      });

      if (!res.ok) {
        alert("삭제 실패");
        return;
      }

      fetchComments();
    }

    // 수정 처리
    if (editId) {
      const li = e.target.closest("li");
      const original = li.querySelector("div").innerText;
      const newContent = prompt("댓글을 수정하세요:", original.split("\n")[1]);
      if (newContent === null) return;

      const res = await fetch(`${API_URL}${editId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        body: JSON.stringify({ content: newContent })
      });

      if (!res.ok) {
        alert("수정 실패");
        return;
      }

      fetchComments();
    }
  });

  fetchComments();
});
