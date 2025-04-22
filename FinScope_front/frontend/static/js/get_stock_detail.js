document.addEventListener("DOMContentLoaded", () => {
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  const name = decodeURIComponent(pathSegments[pathSegments.length - 1]);

  const container = document.getElementById("scraped-comments");

  fetch(`http://127.0.0.1:8001/api/stocks/detail/${name}`)
    .then(res => {
      if (!res.ok) throw new Error("데이터 로드 실패");
      return res.json();
    })
    .then(data => {
      document.getElementById("stock-name").innerText = data.stock.이름;
      document.getElementById("stock-code").innerText = data.stock.코드;
      document.getElementById("stock-price").innerText = data.stock.가격;
      document.getElementById("stock-change").innerText = data.stock.등락률;
      document.getElementById("stock-chart").src = "http://127.0.0.1:8001" + data.stock.차트;

      if (Array.isArray(data.comments)) {
        data.comments.forEach(comment => {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.innerText = comment;
          container.appendChild(li);
        });
      } else {
        container.innerHTML = "<p>댓글이 없습니다.</p>";
      }
      if (data.ai_analysis) {
        const temperature = data.ai_analysis.temperature;
        const summary = data.ai_analysis.summary;

        document.getElementById("sentiment-score").innerText = `${temperature}°`;
        document.getElementById("analysis-summary").innerText = summary;

        // 🌡️ 색깔 온도 시각화(선택사항)
        const tempElement = document.getElementById("sentiment-score");
        if (temperature >= 70) {
          tempElement.style.color = "red";
        } else if (temperature >= 40) {
          tempElement.style.color = "orange";
        } else {
          tempElement.style.color = "blue";
        }
      }
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p class='text-danger'>데이터를 불러올 수 없습니다.</p>";
    });
  const favoriteBtn = document.getElementById("favorite-btn");
  fetch(`http://127.0.0.1:8001/api/stocks/favorites/`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("access"),
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("상태 조회 실패");
      return res.json();
    })
    .then(data => {
      favoriteBtn.innerText = data.favorites ? "💔즐겨찾기 취소" : "✨즐겨찾기";
    })
    .catch(err => {
      console.error(err);
      favoriteBtn.innerText = "✨즐겨찾기";
    });
  favoriteBtn.addEventListener("click", () => {
    fetch(`http://127.0.0.1:8001/api/stocks/${name}/favorite/`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("access"),
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        favoriteBtn.innerText = data.message.includes("추가") ? "💔즐겨찾기 취소" : "✨즐겨찾기";
      })
      .catch(err => {
        console.error(err);
        alert("즐겨찾기 요청 실패!");
      });
  });
});