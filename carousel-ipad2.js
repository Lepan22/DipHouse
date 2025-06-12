// Carrossel de fotos compatível com iPad 2
function PhotoCarousel() {
  this.photos = [];
  this.currentIndex = 0;
  this.container = document.getElementById('photo');
  this.intervalId = null;
  
  // Bind methods to this context
  var self = this;
  this.nextPhoto = function() { self._nextPhoto(); };
  this.previousPhoto = function() { self._previousPhoto(); };
  this.goToPhoto = function(index) { self._goToPhoto(index); };
  
  this.init();
}

PhotoCarousel.prototype.init = function() {
  var self = this;
  this.loadPhotos(function() {
    self.createCarousel();
    self.startAutoSlide();
  });
};

PhotoCarousel.prototype.loadPhotos = function(callback) {
  var self = this;
  
  // Verificar se Firebase está disponível
  if (typeof firebase !== 'undefined' && firebase.storage) {
    try {
      var storage = firebase.storage();
      var photosRef = storage.ref('fotos');
      
      photosRef.listAll().then(function(result) {
        if (result.items.length === 0) {
          self.useFallbackPhotos();
          callback();
          return;
        }
        
        var promises = [];
        for (var i = 0; i < result.items.length; i++) {
          promises.push(result.items[i].getDownloadURL());
        }
        
        Promise.all(promises).then(function(urls) {
          self.photos = [];
          for (var i = 0; i < urls.length; i++) {
            self.photos.push({
              name: 'foto' + (i + 1) + '.jpg',
              url: urls[i]
            });
          }
          console.log('Carregadas ' + self.photos.length + ' fotos');
          callback();
        }).catch(function(error) {
          console.error('Erro ao carregar URLs:', error);
          self.useFallbackPhotos();
          callback();
        });
      }).catch(function(error) {
        console.error('Erro ao listar fotos:', error);
        self.useFallbackPhotos();
        callback();
      });
    } catch (error) {
      console.error('Erro no Firebase:', error);
      this.useFallbackPhotos();
      callback();
    }
  } else {
    this.useFallbackPhotos();
    callback();
  }
};

PhotoCarousel.prototype.useFallbackPhotos = function() {
  this.photos = [
    {
      name: 'placeholder1.jpg',
      url: 'https://picsum.photos/800/600?random=1'
    },
    {
      name: 'placeholder2.jpg', 
      url: 'https://picsum.photos/800/600?random=2'
    },
    {
      name: 'placeholder3.jpg',
      url: 'https://picsum.photos/800/600?random=3'
    }
  ];
};

PhotoCarousel.prototype.createCarousel = function() {
  if (this.photos.length === 0) {
    this.showError();
    return;
  }

  var indicators = '';
  for (var i = 0; i < this.photos.length; i++) {
    var activeClass = i === 0 ? ' active' : '';
    indicators += '<span class="indicator' + activeClass + '" onclick="photoCarousel.goToPhoto(' + i + ')"></span>';
  }

  this.container.innerHTML = 
    '<div class="carousel-container">' +
      '<div class="carousel-slide">' +
        '<img id="carousel-image" src="' + this.photos[0].url + '" alt="Foto da família" />' +
      '</div>' +
      '<div class="carousel-controls">' +
        '<button class="carousel-btn prev" onclick="photoCarousel.previousPhoto()">‹</button>' +
        '<div class="carousel-indicators">' + indicators + '</div>' +
        '<button class="carousel-btn next" onclick="photoCarousel.nextPhoto()">›</button>' +
      '</div>' +
    '</div>';
};

PhotoCarousel.prototype._nextPhoto = function() {
  this.currentIndex = (this.currentIndex + 1) % this.photos.length;
  this.updatePhoto();
};

PhotoCarousel.prototype._previousPhoto = function() {
  this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
  this.updatePhoto();
};

PhotoCarousel.prototype._goToPhoto = function(index) {
  this.currentIndex = index;
  this.updatePhoto();
};

PhotoCarousel.prototype.updatePhoto = function() {
  var image = document.getElementById('carousel-image');
  var indicators = document.getElementsByClassName('indicator');
  
  if (image && this.photos[this.currentIndex]) {
    image.src = this.photos[this.currentIndex].url;
    image.alt = this.photos[this.currentIndex].name;
  }

  // Atualizar indicadores
  for (var i = 0; i < indicators.length; i++) {
    if (i === this.currentIndex) {
      indicators[i].className = 'indicator active';
    } else {
      indicators[i].className = 'indicator';
    }
  }
};

PhotoCarousel.prototype.startAutoSlide = function() {
  var self = this;
  this.intervalId = setInterval(function() {
    self._nextPhoto();
  }, 10000);
};

PhotoCarousel.prototype.stopAutoSlide = function() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
};

PhotoCarousel.prototype.showError = function() {
  this.container.innerHTML = 
    '<div class="carousel-error">' +
      '<div class="error-icon">📷</div>' +
      '<div class="error-text">Nenhuma foto disponível</div>' +
      '<div class="error-subtext">Adicione fotos usando o painel de controle</div>' +
    '</div>';
};

// Variável global para o carrossel
var photoCarousel;

// Inicializar carrossel quando a página carregar - compatível com navegadores antigos
function initCarousel() {
  setTimeout(function() {
    photoCarousel = new PhotoCarousel();
  }, 1000);
}

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else if (document.attachEvent) {
  document.attachEvent('onreadystatechange', function() {
    if (document.readyState === 'complete') {
      initCarousel();
    }
  });
}

// Pausar auto-slide quando mouse estiver sobre o carrossel
function setupMouseEvents() {
  var photoContainer = document.getElementById('photo');
  if (photoContainer) {
    if (photoContainer.addEventListener) {
      photoContainer.addEventListener('mouseenter', function() {
        if (photoCarousel) photoCarousel.stopAutoSlide();
      });
      
      photoContainer.addEventListener('mouseleave', function() {
        if (photoCarousel) photoCarousel.startAutoSlide();
      });
    }
  }
}

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', setupMouseEvents);
} else if (document.attachEvent) {
  document.attachEvent('onreadystatechange', function() {
    if (document.readyState === 'complete') {
      setupMouseEvents();
    }
  });
}

