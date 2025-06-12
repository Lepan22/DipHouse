// Carrossel de fotos usando Firebase Storage
class PhotoCarousel {
  constructor() {
    this.photos = [];
    this.currentIndex = 0;
    this.container = document.getElementById('photo');
    this.intervalId = null;
    this.init();
  }

  async init() {
    try {
      await this.loadPhotos();
      this.createCarousel();
      this.startAutoSlide();
    } catch (error) {
      console.error('Erro ao inicializar carrossel:', error);
      this.showError();
    }
  }

  async loadPhotos() {
    try {
      // Verificar se Firebase está disponível
      if (typeof firebase === 'undefined') {
        throw new Error('Firebase não está carregado');
      }

      const storage = firebase.storage();
      const photosRef = storage.ref('fotos');
      
      const result = await photosRef.listAll();
      
      if (result.items.length === 0) {
        throw new Error('Nenhuma foto encontrada');
      }

      // Obter URLs de download para todas as fotos
      this.photos = await Promise.all(
        result.items.map(async (item) => {
          const url = await item.getDownloadURL();
          return {
            name: item.name,
            url: url
          };
        })
      );

      console.log(`Carregadas ${this.photos.length} fotos`);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      // Fallback: usar fotos de exemplo se Firebase não funcionar
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
    }
  }

  createCarousel() {
    if (this.photos.length === 0) {
      this.showError();
      return;
    }

    this.container.innerHTML = `
      <div class="carousel-container">
        <div class="carousel-slide">
          <img id="carousel-image" src="${this.photos[0].url}" alt="Foto da família" />
        </div>
        <div class="carousel-controls">
          <button class="carousel-btn prev" onclick="photoCarousel.previousPhoto()">‹</button>
          <div class="carousel-indicators">
            ${this.photos.map((_, index) => 
              `<span class="indicator ${index === 0 ? 'active' : ''}" onclick="photoCarousel.goToPhoto(${index})"></span>`
            ).join('')}
          </div>
          <button class="carousel-btn next" onclick="photoCarousel.nextPhoto()">›</button>
        </div>
      </div>
    `;
  }

  nextPhoto() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.updatePhoto();
  }

  previousPhoto() {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.updatePhoto();
  }

  goToPhoto(index) {
    this.currentIndex = index;
    this.updatePhoto();
  }

  updatePhoto() {
    const image = document.getElementById('carousel-image');
    const indicators = document.querySelectorAll('.indicator');
    
    if (image && this.photos[this.currentIndex]) {
      image.src = this.photos[this.currentIndex].url;
      image.alt = this.photos[this.currentIndex].name;
    }

    // Atualizar indicadores
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }

  startAutoSlide() {
    // Trocar foto a cada 10 segundos
    this.intervalId = setInterval(() => {
      this.nextPhoto();
    }, 10000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  showError() {
    this.container.innerHTML = `
      <div class="carousel-error">
        <div class="error-icon">📷</div>
        <div class="error-text">Nenhuma foto disponível</div>
        <div class="error-subtext">Adicione fotos usando o painel de controle</div>
      </div>
    `;
  }
}

// Inicializar carrossel quando a página carregar
let photoCarousel;

document.addEventListener('DOMContentLoaded', () => {
  // Aguardar um pouco para garantir que Firebase está carregado
  setTimeout(() => {
    photoCarousel = new PhotoCarousel();
  }, 1000);
});

// Pausar auto-slide quando mouse estiver sobre o carrossel
document.addEventListener('DOMContentLoaded', () => {
  const photoContainer = document.getElementById('photo');
  if (photoContainer) {
    photoContainer.addEventListener('mouseenter', () => {
      if (photoCarousel) photoCarousel.stopAutoSlide();
    });
    
    photoContainer.addEventListener('mouseleave', () => {
      if (photoCarousel) photoCarousel.startAutoSlide();
    });
  }
});

