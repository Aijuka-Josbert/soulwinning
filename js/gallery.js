(function() {
    // ---- Tab switching ----
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = {
        images: document.getElementById('tab-images'),
        videos: document.getElementById('tab-videos')
    };

    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding content
                const tab = this.dataset.tab;
                Object.keys(tabContents).forEach(key => {
                    tabContents[key].classList.toggle('active', key === tab);
                });
            });
        });
    }

    // ---- Image filter ----
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('#imageGrid .gallery-item');

    if (filterButtons.length && galleryItems.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.filter;
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
})();