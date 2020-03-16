(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = `${BASE_URL}/api/v1/movies/`
  const POSTER_URL = `${BASE_URL}/posters/`
  const data = []
  let paginationData = []
  const dataPanel = document.querySelector('#data-panel')
  const searchForm = document.querySelector('#search')
  const searchInput = document.querySelector('#search-input')
  const pagination = document.querySelector('#pagination')
  const switchPages = document.querySelector('#switch-pages')
  const ITEM_PER_PAGE = 12
  let currStatus = 'icon-page'
  let CURR_PAGE = 1


  //呼叫電影API+渲染主要頁面
  axios.get(INDEX_URL)
    .then((response) => {
      data.push(...response.data.results)
      console.log(data)
      // displayDataList(data)
      getTotalPages(data)
      getPageData(CURR_PAGE, data, currStatus)
    })
    .catch((err) => console.log(err))

  //more按鈕&收藏按鈕事件監聽
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  //search bar事件監聽
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault() //禁止表單預設提交行為
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(CURR_PAGE, results, currStatus)
  })

  //頁籤變換事件監聽
  pagination.addEventListener('click', (event) => {
    // console.log(event.target)
    // console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      // console.log(event.target.dataset.page)
      CURR_PAGE = event.target.dataset.page
      getPageData(event.target.dataset.page, paginationData, currStatus)

    }
  })

  //頁面切換事件監聽
  switchPages.addEventListener('click', (event) => {
    // console.log(event.target.id)
    console.log(CURR_PAGE)
    if (event.target.matches('#icon-page')) {
      currStatus = 'icon-page'
      getPageData(CURR_PAGE, data, currStatus)
    } else if (event.target.matches('#list-page')) {
      currStatus = 'list-page'
      getPageData(CURR_PAGE, data, currStatus)
    }
  })

  //card生成 + more 按鈕
  function displayDataList(data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-6 col-md-4 col-lg-3" style="min-width:200px;">
          <div class="card mb-2">
            <img class="card-img-top" src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h5 class="card-title">${item.title}</h6>
            </div>
            <div class="card-footer">
              <!-- "More" button -->
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  //list生成
  function displayDataColumns(data) {
    let htmlContent = ''
    htmlContent += `
    <ul class="list-group list-group-flush" style="width:100%;">`
    data.forEach(item => {
      htmlContent +=
        `
        <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${item.id}">${item.title}
          <div class="d-flex flex-nowrap mr-sm-5">
          <!-- "More" button -->
            <button class="btn btn-primary btn-show-movie mr-sm-3" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
          <!-- favorite button -->
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </li>  
        `
    })
    htmlContent += `</ul>`
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

  //加入電影至我的最愛
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))
    // console.log(list)
    // console.log(movie)
    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  //獲得頁數總數並生成對應頁籤數
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  //取得單一特定頁面
  function getPageData(pageNum, data, currStatus) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)

    if (currStatus === 'icon-page') {
      displayDataList(pageData)
    } else if (currStatus === 'list-page') {
      displayDataColumns(pageData)
    }
  }
})()