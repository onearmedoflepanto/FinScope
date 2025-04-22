document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("stock-list");

  fetch("http://127.0.0.1:8001/api/stocks/hot/")
    .then(res => {
      console.log(res);
      if (!res.ok) throw new Error("데이터 로드 실패");
      return res.json();
    })
    .then(data => {
      if (!data || data.length === 0) {
        container.innerHTML = "<p>표시할 주식이 없습니다.</p>";
        return;
      }

      data.forEach(stock => {
        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${stock.name}</h5>
              <p class="card-text">💵 ${stock.price}</p>
              <p class="card-text">📈 ${stock.change}</p>
              <a href="http://127.0.0.1:8000/detail/${stock.name}" class="btn btn-primary">자세히</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p class='text-danger'>서버에 연결할 수 없습니다.</p>";
    });

  const favoriteContainer = document.getElementById("stock-favorite");

  fetch("http://127.0.0.1:8001/api/stocks/favorites/", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("access")
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("즐겨찾기 로드 실패");
      return res.json();
    })
    .then(favorites => {
      if (!favorites || favorites.length === 0) {
        favoriteContainer.innerHTML = "<p>즐겨찾기한 주식이 없습니다.</p>";
        return;
      }

      favorites.forEach(stock => {
        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${stock.name}</h5>
              <p class="card-text">💵 ${stock.price}</p>
              <p class="card-text">📈 ${stock.change}</p>
              <button class="btn btn-primary">자세히</button>
            </div>
          </div>
        `;

        card.querySelector("button").addEventListener("click", () => {
          window.location.href = `http://127.0.0.1:8000/detail/${stock.name}`;
        });
        favoriteContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      favoriteContainer.innerHTML = "<p class='text-danger'>즐겨찾기 로드 실패</p>";
    });
});
