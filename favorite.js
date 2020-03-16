(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const dataPanel = document.querySelector('#data-panel')
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  displayDataList(data)

  //more按鈕&刪除按鈕事件監聽
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-remove-favorite')) {
      removeFavoriteItem(event.target.dataset.id)
    }
  })

  //card生成 + more 按鈕
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  //生成彈出簡介視窗
  function showMovie(id) {
    // get elements
    const modalTitle = document.querySelector('#show-movie-title')
    const modalImage = document.querySelector('#show-movie-image')
    const modalDate = document.querySelector('#show-movie-date')
    const modalDescription = document.querySelector('#show-movie-description')
    // set request url
    const url = `${INDEX_URL}${id}`
    console.log(url)
    // send request to show api
    axios
      .get(url)
      .then(response => {
        const data = response.data.results
        console.log(data)
        // insert data into modal ui
        modalTitle.textContent = data.title
        modalImage.innerHTML = `
        <img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
        modalDate.textContent = `release at : ${data.release_date}`
        modalDescription.textContent = `${data.description}`
      })
  }

  //移除以收藏電影
  function removeFavoriteItem(id) {
    //使用id尋找是否存在此筆電影
    const index = data.findIndex(item => item.id === Number(id))
    if (index === -1) return
    //移除本地端資料庫
    data.splice(index, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(data))
    //重新渲染頁面
    displayDataList(data)
  }

})()