const searchInput=document.getElementById('search-input');
searchInput.addEventListener('keyup', searchCampgrounds);

function searchCampgrounds() {
    const searchQuery=searchInput.value.toLowerCase();
    const cards=document.querySelectorAll('#campground-cards, .card');

    cards.forEach((card) => {
        const title=card.querySelector('.card-title').textContent.toLowerCase();

        if (title.includes(searchQuery)) {
            card.style.display='flex';
        } else {
            card.style.display='none';
        }
    });
}