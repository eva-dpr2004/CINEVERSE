// Modal♥
var modal1 = document.getElementById("myModal1");
var modal2 = document.getElementById("myModal2");
var modal3 = document.getElementById("myModal3");
var modal4 = document.getElementById("myModal4");

// Boutons de la modal♥
var btn1 = document.getElementById("myBtn1");
var btn2 = document.getElementById("myBtn2");
var btn3 = document.getElementById("myBtn3");
var btn4 = document.getElementById("myBtn4");

// Span♥
var span1 = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
var span3 = document.getElementsByClassName("close")[2];
var span4 = document.getElementsByClassName("close")[3];

// Quand on clique sur le bouton "en savoir plus ça ouvre la modal"♥
btn1.onclick = function() {
  modal1.style.display = "block";
}
btn2.onclick = function() {
  modal2.style.display = "block";
}
btn3.onclick = function() {
  modal3.style.display = "block";
}
btn4.onclick = function() {
  modal4.style.display = "block";
}

// Quand on clique sur x fermer♥
span1.onclick = function() {
  modal1.style.display = "none";
}
span2.onclick = function() {
  modal2.style.display = "none";
}
span3.onclick = function() {
  modal3.style.display = "none";
}
span4.onclick = function() {
  modal4.style.display = "none";
}

// Quand on clique en dehors de la modal, fermer♥
window.onclick = function fermer(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
  if (event.target == modal3) {
    modal3.style.display = "none";
  }
  if (event.target == modal4) {
    modal4.style.display = "none";
  }
}

// API♥
const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;
const genres = [ 
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Thriller"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
]

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
var selectedGenre = []
// Définition du genre♥
setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
        if(selectedGenre.length == 0){
          selectedGenre.push(genre.id);
        }else{
        if(selectedGenre.includes(genre.id)){
          selectedGenre.forEach((id, idx) => {
        if(id == genre.id){
          selectedGenre.splice(idx, 1);
        }
          })
        }else{
          selectedGenre.push(genre.id);
        }
          }
          console.log(selectedGenre)
          getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
          highlightSelection()
        })
        tagsEl.append(t);
    })
}
// Surbrillance des filtres♥
function highlightSelection() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
      tag.classList.remove('highlight')
  })
  clearBtn()
  if(selectedGenre.length !=0){   
      selectedGenre.forEach(id => {
        const hightlightedTag = document.getElementById(id);
        hightlightedTag.classList.add('highlight');
      })
  }

}
// Bouton x des filtres♥
function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{ 
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
}
getMovies(API_URL);
// Récupération des films♥
function getMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;
            current.innerText = currentPage;
            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }
            tagsEl.scrollIntoView({behavior : 'smooth'})
        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
    })
}
// Afficher les films♥
function showMovies(data) {
  main.innerHTML = '';
  data.sort((a, b) => b.vote_average - a.vote_average); // Classement des films des meilleurs au moins bonne note notes♥
  data.forEach(movie => {
      const {title, poster_path, vote_average, overview, id} = movie;
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
      <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">
      <div class="movie-info" style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 140px;">
          <h3>${title}</h3>
          <span class="${getColor(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
          <h3>Description</h3>
          ${overview}
      </div>
    `;
      main.appendChild(movieEl);
  })
}
//Couleur des votes ♥
function getColor(vote) {
  if(vote>= 8){
      return 'green'
  }else if(vote >= 5){
      return "orange"
  }else{
      return 'red'
  }
}
//Vérification de la valeur d'un champ de recherche ♥ 
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value
  if(searchTerm){
    getMovies(searchURL+'&query='+searchTerm)
  }
  else{
    getMovies(API_URL)
  }
})

//Loader♥
const loader = document.getElementById("loader");
setTimeout(function() {
  loader.style.display = "none";
}, 750);