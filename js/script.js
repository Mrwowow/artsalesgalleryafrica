/**
 * Art Sales Gallery Africa - Main JavaScript File
 * Created: April 2025
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
        });
    }
    
    // Hero Slider
    function initializeHeroSlider() {
        // Get all slides
        const heroSlides = document.querySelectorAll('.hero-slide');
        if (!heroSlides.length) return; // Exit if no slides exist
        
        let currentSlide = 0;
        let slideInterval = null;
        
        // Function to display a specific slide
        function showSlide(index) {
            // Ensure the index is valid
            if (index < 0) index = heroSlides.length - 1;
            if (index >= heroSlides.length) index = 0;
            
            // Update current slide index
            currentSlide = index;
            
            // Hide all slides
            heroSlides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.display = 'none';
            });
            
            // Show the current slide
            heroSlides[currentSlide].classList.add('active');
            heroSlides[currentSlide].style.display = 'block';
        }
        
        // Function to move to the next slide
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        // Function to move to the previous slide
        function prevSlide() {
            showSlide(currentSlide - 1);
        }
        
        // Set up slide indicators and nav controls
        const hero = document.querySelector('.hero');
        if (hero) {
            // Create navigation arrows
            const navPrev = document.createElement('button');
            navPrev.className = 'hero-nav hero-prev';
            navPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
            navPrev.setAttribute('aria-label', 'Previous slide');
            
            const navNext = document.createElement('button');
            navNext.className = 'hero-nav hero-next';
            navNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
            navNext.setAttribute('aria-label', 'Next slide');
            
            // Add event listeners for navigation
            navPrev.addEventListener('click', function(e) {
                e.preventDefault();
                prevSlide();
                resetTimer();
            });
            
            navNext.addEventListener('click', function(e) {
                e.preventDefault();
                nextSlide();
                resetTimer();
            });
            
            // Add nav controls to the hero
            hero.appendChild(navPrev);
            hero.appendChild(navNext);
            
            // Create slide indicators
            const indicators = document.createElement('div');
            indicators.className = 'hero-indicators';
            
            // Create an indicator for each slide
            heroSlides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'hero-indicator';
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                
                // Add event listener for each indicator
                dot.addEventListener('click', function() {
                    showSlide(index);
                    resetTimer();
                });
                
                indicators.appendChild(dot);
            });
            
            // Add indicators to the hero
            hero.appendChild(indicators);
            
            // Update indicators when slide changes
            function updateIndicators() {
                const dots = indicators.querySelectorAll('.hero-indicator');
                dots.forEach((dot, index) => {
                    if (index === currentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            
            // Override showSlide to also update indicators
            const originalShowSlide = showSlide;
            showSlide = function(index) {
                originalShowSlide(index);
                updateIndicators();
            };
        }
        
        // Reset the automatic sliding timer
        function resetTimer() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        // Initialize slider
        showSlide(0); // Start with the first slide
        slideInterval = setInterval(nextSlide, 5000); // Auto-advance slides
    }
    
    // Initialize the slider
    initializeHeroSlider();
    
    // Gallery Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const artworkItems = document.querySelectorAll('.artwork-item');
    
    if (filterBtns.length > 0 && artworkItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                artworkItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category')?.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Testimonial Slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        testimonialSlides[index].classList.add('active');
    }
    
    if (prevBtn && nextBtn && testimonialSlides.length > 0) {
        prevBtn.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
            showTestimonial(currentTestimonial);
        });
        
        nextBtn.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
            showTestimonial(currentTestimonial);
        });
        
        // Auto-advance testimonials every 7 seconds
        setInterval(function() {
            currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
            showTestimonial(currentTestimonial);
        }, 7000);
    }
    
    // Artwork Modal with responsive improvements
    const viewArtworkBtns = document.querySelectorAll('.view-artwork-btn');
    const artworkModal = document.getElementById('artworkModal');
    const modalClose = document.querySelector('.modal-close');
    
    // Handle modal scroll behavior
    function lockScroll() {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = getScrollbarWidth() + 'px';
    }
    
    function unlockScroll() {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
    
    // Calculate scrollbar width to prevent layout shift when opening modal
    function getScrollbarWidth() {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.overflow = 'scroll';
        document.body.appendChild(outer);
        
        const inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);
        
        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        
        return scrollbarWidth;
    }
    
    // Ensure modal can be closed with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && artworkModal.classList.contains('active')) {
            artworkModal.classList.remove('active');
            unlockScroll();
        }
    });
    
    // Artwork details for modal (in a real implementation, this would come from a database)
    const artworkDetails = {
        // Chidozie Oliver Maduka artworks
        'reflection-i': {
            title: 'Solitude',
            artist: 'Chidozie Oliver Maduka',
            description: 'Find peace and inner richness in the quiet embrace of your own being.',
            collection: 'Ntughari uche',
            year: '2021',
            medium: 'Fine Art Photography',
            dimensions: '60 × 90 cm',
            edition: 'Limited Edition of 10',
            framing: 'Museum-quality framing available',
            price: '$7,000',
            image: 'images/solitude.jpeg',
            artistId: 'chidozie'
        },
        'hope-emerging': {
            title: 'Free',
            artist: 'Chidozie Oliver Maduka',
            description: 'Defy gravity, embrace the boundless possibilities that float freely before you.',
            collection: 'Nchekwube',
            year: '2022',
            medium: 'Fine Art Photography',
            dimensions: '70 × 100 cm',
            edition: 'Limited Edition of 10',
            framing: 'Museum-quality framing available',
            price: '$9,500',
            image: 'images/free.jpeg',
            artistId: 'chidozie'
        },
        
        // Amara Nwankwo artworks
        'threads-of-memory': {
            title: 'Threads of Memory',
            artist: 'Amara Nwankwo',
            description: 'Intricate layering of traditional textiles and contemporary elements exploring female ancestry. This mixed media work incorporates hand-woven textiles, photo transfers, and acrylic paint to create a rich tapestry of cultural memory and feminine identity. The piece honors the artist\'s female ancestors and the textile traditions passed down through generations.',
            collection: 'Ancestral Whispers',
            year: '2023',
            medium: 'Mixed Media',
            dimensions: '80 × 100 cm',
            edition: 'Original',
            framing: 'Custom hardwood frame included',
            price: '$6,500',
            image: '/api/placeholder/600/600',
            artistId: 'amara'
        },
        'textile-cosmos': {
            title: 'Textile Cosmos',
            artist: 'Amara Nwankwo',
            description: 'Abstract composition blending traditional textiles with cosmic imagery and feminine symbolism. This complex mixed media work from the "Woven Universe" collection creates a bridge between earthly traditions and celestial themes, using fabrics, beads, and metallic elements to suggest connections between human creativity and cosmic energy.',
            collection: 'Woven Universe',
            year: '2023',
            medium: 'Mixed Media',
            dimensions: '90 × 90 cm',
            edition: 'Original',
            framing: 'Custom frame included',
            price: '$7,800',
            image: '/api/placeholder/600/600',
            artistId: 'amara'
        },
        
        // Kwame Osei artworks
        'market-woman': {
            title: 'Market Woman',
            artist: 'Kwame Osei',
            description: 'A striking black and white portrait capturing the dignity and strength of a Ghanaian market woman. Part of Osei\'s acclaimed "Faces of Accra" series, this image reveals the quiet fortitude behind an ordinary moment. The rich tonal range and careful composition draw attention to the subject\'s eyes, which reflect a lifetime of stories and resilience.',
            collection: 'Faces of Accra',
            year: '2021',
            medium: 'Black and White Photography',
            dimensions: '50 × 75 cm',
            edition: 'Limited Edition of 20',
            framing: 'Museum-quality framing available',
            price: '$5,800',
            image: '/api/placeholder/600/600',
            artistId: 'kwame'
        },
        'accra-nightlife': {
            title: 'Accra Nightlife',
            artist: 'Kwame Osei',
            description: 'A dynamic exploration of urban nightlife in Ghana\'s capital city. This photograph captures the energy and vibrancy of Accra after dark, with its bustling streets, vibrant signage, and rich social interactions. The play of artificial light against the night sky creates a rhythmic visual composition reflecting the city\'s pulsating energy.',
            collection: 'Urban Rhythms',
            year: '2022',
            medium: 'Color Photography',
            dimensions: '60 × 90 cm',
            edition: 'Limited Edition of 15',
            framing: 'Museum-quality framing available',
            price: '$6,200',
            image: '/api/placeholder/600/600',
            artistId: 'kwame'
        },
        
        // Fatima Mohamoud artworks
        'displaced-patterns': {
            title: 'Displaced Patterns',
            artist: 'Fatima Mohamoud',
            description: 'A layered exploration of displacement and cultural identity through geometric patterns and fragmented imagery. This mixed media piece from Mohamoud\'s "Between Worlds" series combines traditional East African patterns with contemporary elements, creating a visual metaphor for the experience of migration and cultural duality.',
            collection: 'Between Worlds',
            year: '2022',
            medium: 'Mixed Media',
            dimensions: '90 × 120 cm',
            edition: 'Original',
            framing: 'Custom metal frame included',
            price: '$9,200',
            image: 'images/fatima1.png',
            artistId: 'fatima'
        },
        'memory-fragments': {
            title: 'Memory Fragments',
            artist: 'Fatima Mohamoud',
            description: 'An evocative mixed media piece exploring the fragmentary nature of memories from a homeland left behind. Using traditional Somali textile patterns juxtaposed with contemporary urban imagery, this work creates a visual conversation about cultural continuity and rupture in the context of forced migration.',
            collection: 'Between Worlds',
            year: '2023',
            medium: 'Mixed Media',
            dimensions: '80 × 100 cm',
            edition: 'Original',
            framing: 'Custom metal frame included',
            price: '$8,500',
            image: 'images/fatima2.png',
            artistId: 'fatima'
        },
        
        // Nelson Makamo artworks
        'hopeful-eyes': {
            title: 'Hopeful Eyes',
            artist: 'Nelson Makamo',
            description: 'A vibrant, expressive portrait capturing the innocence and hope of African youth. This mixed media work showcases Makamo\'s signature style, using a combination of charcoal, acrylic, watercolors, and oil paints to create a powerful emotional impact. The piece celebrates the resilience and optimism of African children, challenging negative narratives with a vision of hope.',
            collection: 'Children of Tomorrow',
            year: '2022',
            medium: 'Mixed Media',
            dimensions: '100 × 120 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$12,500',
            image: '/api/placeholder/600/600',
            artistId: 'nelson'
        },
        'future-forward': {
            title: 'Future Forward',
            artist: 'Nelson Makamo',
            description: 'A powerful portrait celebrating the potential and dreams of African youth. This mixed media work on canvas uses Makamo\'s characteristic bold brushstrokes and vibrant color palette to create an emotionally resonant image that speaks to themes of possibility, resilience, and the unbounded potential of the next generation.',
            collection: 'Children of Tomorrow',
            year: '2023',
            medium: 'Mixed Media',
            dimensions: '110 × 130 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$14,800',
            image: '/api/placeholder/600/600',
            artistId: 'nelson'
        },
        
        // Aida Muluneh artworks
        'past-present-future': {
            title: 'The Past, Present and Future',
            artist: 'Aida Muluneh',
            description: 'A bold, color-saturated portrait challenging conventional narratives about African identity. This striking photograph from Muluneh\'s "The World is 9" series uses symbolic body painting, vibrant color, and careful composition to explore themes of history, identity, and the complexity of being African in the modern world.',
            collection: 'The World is 9',
            year: '2022',
            medium: 'Color Photography',
            dimensions: '80 × 80 cm',
            edition: 'Limited Edition of 15',
            framing: 'Museum-quality framing available',
            price: '$11,000',
            image: '/api/placeholder/600/600',
            artistId: 'aida'
        },
        'world-stage': {
            title: 'World Stage',
            artist: 'Aida Muluneh',
            description: 'A vibrant, symbolically rich portrait addressing Africa\'s position on the global stage. This color-saturated photograph uses Muluneh\'s characteristic body painting and stark compositional elements to create a visual commentary on representation, voice, and the politics of visibility for African narratives in international contexts.',
            collection: 'Memory of the Future',
            year: '2023',
            medium: 'Color Photography',
            dimensions: '90 × 90 cm',
            edition: 'Limited Edition of 10',
            framing: 'Museum-quality framing available',
            price: '$12,500',
            image: '/api/placeholder/600/600',
            artistId: 'aida'
        },
        
        // Ibrahim Mahama artworks
        'labor-exchange': {
            title: 'Labor Exchange',
            artist: 'Ibrahim Mahama',
            description: 'A monumental installation created from repurposed jute sacks previously used to transport cocoa beans and other commodities. This work examines the history of trade, labor, and economic exchange between Ghana and global markets, creating a powerful spatial experience that confronts viewers with the materiality of commerce and its human implications.',
            collection: 'Material Histories',
            year: '2020',
            medium: 'Installation - Jute sacks, thread, documentation',
            dimensions: 'Variable dimensions',
            edition: 'Original Installation',
            framing: 'Not applicable',
            price: '$28,000',
            image: 'images/Ibrahim_Mahama1.jpg',
            artistId: 'ibrahim'
        },
        'material-histories': {
            title: 'Material Histories',
            artist: 'Ibrahim Mahama',
            description: 'A powerful mixed media installation exploring the intersections of materiality, memory, and colonial history. Using discarded materials including jute sacks, wooden crates, and archival documents, this work creates a spatial narrative about the flows of goods, people, and power that have shaped Ghana\'s economic history.',
            collection: 'Fragments',
            year: '2021',
            medium: 'Mixed Media Installation',
            dimensions: 'Variable dimensions',
            edition: 'Original Installation',
            framing: 'Not applicable',
            price: '$35,000',
            image: 'images/Ibrahim_Mahama2.jpg',
            artistId: 'ibrahim'
        },
        
        // Wangechi Mutu artworks
        'guardian-figures': {
            title: 'Guardian Figures',
            artist: 'Wangechi Mutu',
            description: 'A sculptural installation featuring anthropomorphic figures that blend human, animal, and mechanical elements. These guardian entities embody protective spirits drawn from various African spiritual traditions while incorporating contemporary materials, creating a dialogue between ancestral knowledge and futuristic vision.',
            collection: 'The NewOnes, will free Us',
            year: '2021',
            medium: 'Bronze, mixed media',
            dimensions: '180 × 60 × 40 cm each (set of three)',
            edition: 'Edition 2 of 3',
            framing: 'Not applicable',
            price: '$65,000',
            image: 'images/Wangechi_Mutu1.png',
            artistId: 'wangechi'
        },
        'sentinels': {
            title: 'Sentinels',
            artist: 'Wangechi Mutu',
            description: 'A series of collage works that reimagine female forms as powerful, hybrid sentinels. These fantastical figures combine elements from fashion magazines, botanical illustrations, ethnographic photographs, and medical diagrams to create complex visual narratives about gender, race, and the body as a contested site of meaning.',
            collection: 'Hybrid Beings',
            year: '2022',
            medium: 'Mixed media collage on mylar',
            dimensions: '152 × 122 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$45,000',
            image: 'images/Wangechi_Mutu2.png',
            artistId: 'wangechi'
        },
        
        // Yinka Shonibare artworks
        'wind-sculpture': {
            title: 'Wind Sculpture (SG) III',
            artist: 'Yinka Shonibare',
            description: 'A large-scale fiberglass sculpture that captures the movement of fabric in wind, rendered in vibrant Dutch wax-printed textile patterns. This dynamic public artwork explores themes of cultural hybridity, global trade, and the complex colonial and post-colonial relationship between Africa and Europe.',
            collection: 'Wind Sculptures',
            year: '2020',
            medium: 'Hand-painted fiberglass',
            dimensions: '360 × 250 × 200 cm',
            edition: 'Edition 1 of 5',
            framing: 'Not applicable',
            price: '$150,000',
            image: 'images/wind-sculpture.jpg',
            artistId: 'yinka'
        },
        'colonial-narratives': {
            title: 'Colonial Narratives',
            artist: 'Yinka Shonibare',
            description: 'A series of tableaux featuring headless mannequins dressed in Victorian-style clothing made from colorful "African" Dutch wax fabrics. These elaborate scenes recreate moments from European colonial history with a critical twist, highlighting the economic and cultural entanglements between Europe and Africa.',
            collection: 'Decolonizing History',
            year: '2019',
            medium: 'Mixed media installation - mannequins, Dutch wax printed cotton, various materials',
            dimensions: 'Variable dimensions',
            edition: 'Original Installation',
            framing: 'Not applicable',
            price: '$120,000',
            image: 'images/yinka1.jpg',
            artistId: 'yinka'
        },
        
        // Eddy Kamuanga Ilunga artworks
        'mangbetu-dreams': {
            title: 'Mangbetu Dreams',
            artist: 'Eddy Kamuanga Ilunga',
            description: 'A striking large-scale painting depicting figures from the Mangbetu people of the Democratic Republic of Congo, rendered with Ilunga\'s distinctive style that merges traditional African imagery with digital aesthetics. The subjects\' bodies appear as circuit boards, symbolizing the impact of technology on traditional cultures.',
            collection: 'Fragile Identities',
            year: '2021',
            medium: 'Acrylic and oil on canvas',
            dimensions: '200 × 180 cm',
            edition: 'Original',
            framing: 'Floating frame included',
            price: '$18,500',
            image: 'images/eddy_2.png',
            artistId: 'eddy'
        },
        'digital-traditions': {
            title: 'Digital Traditions',
            artist: 'Eddy Kamuanga Ilunga',
            description: 'A powerful painting exploring the intersection of traditional Congolese cultural practices and digital technology. The figures, with skin rendered as electronic circuitry, perform traditional Mangbetu rituals while surrounded by symbols of technology and global commerce, creating a visual dialogue about cultural preservation in an era of rapid technological change.',
            collection: 'Fragile Identities',
            year: '2022',
            medium: 'Acrylic and oil on canvas',
            dimensions: '190 × 170 cm',
            edition: 'Original',
            framing: 'Floating frame included',
            price: '$22,000',
            image: 'images/eddy1.png',
            artistId: 'eddy'
        },
        
        // Zanele Muholi artworks
        'somnyama-ngonyama': {
            title: 'Somnyama Ngonyama (Hail the Dark Lioness)',
            artist: 'Zanele Muholi',
            description: 'A powerful self-portrait from Muholi\'s acclaimed series exploring the politics of race and representation. Using everyday objects as props and enhancing the contrast to emphasize the darkness of their skin, Muholi creates striking images that confront the viewer and challenge conventional representations of Black bodies in photography.',
            collection: 'Somnyama Ngonyama',
            year: '2020',
            medium: 'Silver gelatin print',
            dimensions: '100 × 100 cm',
            edition: 'Edition 3 of 8',
            framing: 'Museum-quality framing included',
            price: '$16,000',
            image: 'images/zanele1.png',
            artistId: 'zanele'
        },
        'brave-beauties': {
            title: 'Brave Beauties',
            artist: 'Zanele Muholi',
            description: 'A portrait from Muholi\'s series documenting South Africa\'s transgender community. This intimate and dignified image challenges the violence and discrimination faced by transgender individuals while celebrating their beauty, courage, and humanity. The work forms part of Muholi\'s broader visual activism creating visibility for LGBTQI+ communities.',
            collection: 'Faces and Phases',
            year: '2019',
            medium: 'Silver gelatin print',
            dimensions: '90 × 60 cm',
            edition: 'Edition 2 of 8',
            framing: 'Museum-quality framing included',
            price: '$12,000',
            image: 'images/zanele.png',
            artistId: 'zanele'
        },
        
        // Billie Zangewa artworks
        'domestic-symphonies': {
            title: 'Domestic Symphonies',
            artist: 'Billie Zangewa',
            description: 'A meticulously hand-stitched silk tapestry depicting an intimate domestic scene that elevates the everyday experiences of women. This autobiographical work transforms ordinary moments into poetic narratives, celebrating the often invisible labor of women while creating a space for contemplation and recognition of daily life as worthy of artistic attention.',
            collection: 'Everyday Rituals',
            year: '2022',
            medium: 'Hand-stitched silk collage',
            dimensions: '120 × 150 cm',
            edition: 'Original',
            framing: 'Floating frame included',
            price: '$24,000',
            image: 'images/billie2.jpg',
            artistId: 'billie'
        },
        'silk-narratives': {
            title: 'Silk Narratives',
            artist: 'Billie Zangewa',
            description: 'A delicate silk tapestry that weaves together personal and political narratives through domestic imagery. This intricate work uses the intimate space of the home as a lens through which to explore broader themes of gender, race, and social justice, asserting the political dimension of domestic life and women\'s experiences.',
            collection: 'Everyday Rituals',
            year: '2023',
            medium: 'Hand-stitched silk collage',
            dimensions: '130 × 160 cm',
            edition: 'Original',
            framing: 'Floating frame included',
            price: '$28,000',
            image: 'images/billie.jpg',
            artistId: 'billie'
        },
        
        // Abdoulaye Konaté artworks
        'textile-symphony': {
            title: 'Textile Symphony',
            artist: 'Abdoulaye Konaté',
            description: 'A monumental textile composition created from hand-dyed cotton strips arranged in a harmonious composition of color and form. Drawing on traditional Malian textile techniques, this work transforms fabric into a medium for abstract expression while referencing cultural symbols and environmental concerns specific to West Africa.',
            collection: 'Harmonic Colors',
            year: '2021',
            medium: 'Textile - dyed cotton',
            dimensions: '300 × 200 cm',
            edition: 'Original',
            framing: 'Display mounting included',
            price: '$32,000',
            image: '/api/placeholder/600/600',
            artistId: 'abdoulaye'
        },
        'mali-blues': {
            title: 'Mali Blues',
            artist: 'Abdoulaye Konaté',
            description: 'A textile composition exploring variations of blue inspired by the indigo dyeing traditions of Mali. This work connects traditional craft techniques with contemporary artistic expression, creating a meditation on color that resonates with musical rhythm. The piece references both cultural heritage and the natural environment of West Africa.',
            collection: 'Harmonic Colors',
            year: '2022',
            medium: 'Textile - dyed cotton',
            dimensions: '250 × 180 cm',
            edition: 'Original',
            framing: 'Display mounting included',
            price: '$28,000',
            image: '/api/placeholder/600/600',
            artistId: 'abdoulaye'
        },
        
        // Julie Mehretu artworks
        'stadia': {
            title: 'Stadia II',
            artist: 'Julie Mehretu',
            description: 'A large-scale, densely layered abstract painting that combines architectural elements, gestural marks, and dynamic forms to create a complex spatial composition. Drawing on imagery from sports arenas, urban plans, and sites of public gathering, this work explores themes of collective movement, social organization, and the built environment.',
            collection: 'Stadia Series',
            year: '2021',
            medium: 'Ink and acrylic on canvas',
            dimensions: '270 × 360 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$400,000',
            image: '/api/placeholder/600/600',
            artistId: 'julie'
        },
        'empirical-construction': {
            title: 'Empirical Construction',
            artist: 'Julie Mehretu',
            description: 'A complex abstract composition that layers architectural drawings, geographical maps, and gestural marks to create a dynamic visual field. This work explores the relationship between human movement, urban development, and global systems, creating a visual language that speaks to themes of migration, displacement, and the built environment.',
            collection: 'Spatial Constructions',
            year: '2022',
            medium: 'Ink and acrylic on canvas',
            dimensions: '240 × 300 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$350,000',
            image: '/api/placeholder/600/600',
            artistId: 'julie'
        },
        
        // Godfried Donkor artworks
        'financial-times': {
            title: 'The Financial Times',
            artist: 'Godfried Donkor',
            description: 'A meticulously crafted collage placing historical figures from the transatlantic slave trade against backgrounds of financial newspapers. This work creates a powerful visual commentary on the economic foundations of slavery and its lasting impact on global financial systems, highlighting the often-overlooked connections between historical exploitation and contemporary wealth.',
            collection: 'Paper Works',
            year: '2020',
            medium: 'Collage on paper',
            dimensions: '100 × 150 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$15,000',
            image: 'images/Godfried_Donkor.png',
            artistId: 'godfried'
        },
        'people-liberty': {
            title: 'People of Liberty',
            artist: 'Godfried Donkor',
            description: 'A mixed media work examining the contradictory narratives of liberty and bondage in transatlantic history. Combining images from historical archives with contemporary financial papers and gold leaf elements, this piece creates a layered visual commentary on the economic underpinnings of historical injustice and their continuation in present-day global systems.',
            collection: 'Paper Works',
            year: '2021',
            medium: 'Mixed media and gold leaf on paper',
            dimensions: '120 × 170 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$18,000',
            image: 'images/Godfried_Donkor1.png',
            artistId: 'godfried'
        },
        
        // Toyin Ojih Odutola artworks
        'skin-luminosity': {
            title: 'Skin Luminosity',
            artist: 'Toyin Ojih Odutola',
            description: 'An intricate drawing depicting a figure with richly textured skin rendered in Odutola\'s signature style of fine marks that create a sense of luminosity and depth. This work explores the materiality of skin as a site of identity formation, challenging conventional representations of blackness while celebrating the beauty and complexity of the Black figure.',
            collection: 'The Treatment',
            year: '2021',
            medium: 'Pastel, charcoal and pencil on paper',
            dimensions: '160 × 120 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$40,000',
            image: 'images/Toyin_Odutola.png',
            artistId: 'toyin'
        },
        'wealth-markers': {
            title: 'Wealth Markers',
            artist: 'Toyin Ojih Odutola',
            description: 'A detailed portrait from Odutola\'s series exploring a fictional aristocratic Nigerian family. This drawing uses meticulous mark-making to create richly textured skin and sumptuous environments, reimagining Black wealth and privilege through an alternative historical narrative that challenges the limited representation of African subjects in Western art history.',
            collection: 'The Ruling Class',
            year: '2022',
            medium: 'Pastel, charcoal and pencil on paper',
            dimensions: '180 × 150 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$55,000',
            image: 'images/Toyin_Odutola1.png',
            artistId: 'toyin'
        },
        
        // Mikhael Subotzky artworks
        'ponte-city': {
            title: 'Ponte City',
            artist: 'Mikhael Subotzky',
            description: 'A photographic work from Subotzky\'s extensive documentation of Johannesburg\'s iconic Ponte City apartment building. This image captures the circular core of the brutalist structure, creating a powerful visual metaphor for the social history and transformation of urban South Africa. The work examines themes of architecture, surveillance, and the legacy of apartheid urban planning.',
            collection: 'Ponte City',
            year: '2018',
            medium: 'C-print',
            dimensions: '150 × 150 cm',
            edition: 'Edition 3 of 5',
            framing: 'Museum-quality framing included',
            price: '$18,000',
            image: 'images/pontecity.jpg',
            artistId: 'mikhael'
        },
        'umjiegwana': {
            title: 'Umjiegwana (The Searching)',
            artist: 'Mikhael Subotzky',
            description: 'A photograph from Subotzky\'s series documenting life in South African prisons. This powerful image captures the complex social dynamics and human experiences within the carceral system, exploring themes of confinement, surveillance, and the struggle for dignity in dehumanizing environments. The work offers a nuanced perspective on incarceration in post-apartheid South Africa.',
            collection: 'Die Vier Hoeke',
            year: '2019',
            medium: 'C-print',
            dimensions: '120 × 180 cm',
            edition: 'Edition 2 of 5',
            framing: 'Museum-quality framing included',
            price: '$15,000',
            image: 'images/Mikhael_Subotzky.jpg',
            artistId: 'mikhael'
        },
        
        // Peju Alatise artworks
        'flying-girls': {
            title: 'Flying Girls',
            artist: 'Peju Alatise',
            description: 'A sculptural installation featuring a series of life-sized figures of girls with wings, inspired by the story of a domestic worker\'s daughter who dreams of a realm where she can fly free. This powerful work addresses child labor in Nigeria while using flight as a metaphor for freedom, imagination, and the transcendence of social constraints.',
            collection: 'Dreams',
            year: '2020',
            medium: 'Mixed media sculpture - fabric, resin, wood',
            dimensions: 'Life-sized figures, variable installation',
            edition: 'Original installation',
            framing: 'Not applicable',
            price: '$45,000',
            image: 'images/PEJU_ALATISE1.jpeg',
            artistId: 'peju'
        },
        'material-witness': {
            title: 'Material Witness',
            artist: 'Peju Alatise',
            description: 'A mixed media sculptural work that combines traditional Yoruba symbols with contemporary materials to create a powerful commentary on gender, spirituality, and social justice in Nigeria. Drawing on Alatise\'s background in architecture, this piece creates a spatial narrative about women\'s experiences and their connection to ancestral knowledge and power.',
            collection: 'Witnesses',
            year: '2021',
            medium: 'Mixed media sculpture - clay, fabric, metal, found objects',
            dimensions: '200 × 150 × 150 cm',
            edition: 'Original',
            framing: 'Not applicable',
            price: '$38,000',
            image: 'images/PEJU_ALATISE2.jpeg',
            artistId: 'peju'
        },
        
        // Barthélémy Toguo artworks
        'stamp-politics': {
            title: 'Stamp Politics',
            artist: 'Barthélémy Toguo',
            description: 'An installation featuring oversized wooden stamps carved with phrases related to migration, borders, and human rights. This work reflects on the bureaucratic control of human movement and the power dynamics embedded in official documentation, drawing on Toguo\'s personal experiences of cross-border travel as well as broader political concerns.',
            collection: 'Transit',
            year: '2020',
            medium: 'Carved wood, ink, paper',
            dimensions: 'Variable installation - stamps approx. 50 × 30 × 30 cm each',
            edition: 'Original installation',
            framing: 'Not applicable',
            price: '$35,000',
            image: 'images/Barthélémy_Toguomain.jpg',
            artistId: 'barthélémy'
        },
        'purification-series': {
            title: 'Purification Series',
            artist: 'Barthélémy Toguo',
            description: 'A series of large-scale watercolor paintings that combine fluid, organic forms with political text and imagery. These works address themes of healing, cleansing, and transformation in relation to historical violence, environmental concerns, and social inequities, creating a visual language that speaks to both personal and collective processes of recovery and renewal.',
            collection: 'Purification',
            year: '2021',
            medium: 'Watercolor on paper',
            dimensions: '200 × 150 cm',
            edition: 'Original',
            framing: 'Museum-quality framing included',
            price: '$28,000',
            image: 'images/Barthélémy_Toguo1.jpg',
            artistId: 'barthélémy'
        },
        
        // Hassan Hajjaj artworks
        'kesh-angels': {
            title: 'Kesh Angels',
            artist: 'Hassan Hajjaj',
            description: 'A vibrant photographic portrait from Hajjaj\'s acclaimed series featuring female motorcyclists in Marrakech. This bold image challenges Western stereotypes about Muslim women by showcasing confident riders in traditional garments reimagined with contemporary elements. The distinctive framing using repurposed everyday Moroccan products adds another layer of cultural commentary.',
            collection: 'Kesh Angels',
            year: '2019',
            medium: 'Metallic Lambda print on dibond with wood and found objects frame',
            dimensions: '140 × 94 cm',
            edition: 'Edition 3 of 10',
            framing: 'Artist\'s custom frame of found objects',
            price: '$18,000',
            image: 'images/hassan-hajjaj.jpg ',
            artistId: 'hassan'
        },
        'karima-series': {
            title: 'Karima: A Day in the Life of',
            artist: 'Hassan Hajjaj',
            description: 'A photographic portrait that combines documentary and fashion photography aesthetics to celebrate the everyday life and style of a Moroccan woman. The subject is framed against a backdrop of vibrant patterns and surrounded by everyday products, creating a playful commentary on consumerism, cultural identity, and the influence of global brands in North Africa.',
            collection: 'My Rock Stars',
            year: '2020',
            medium: 'Metallic Lambda print on dibond with wood and found objects frame',
            dimensions: '130 × 90 cm',
            edition: 'Edition 2 of 10',
            framing: 'Artist\'s custom frame of found objects',
            price: '$16,500',
            image: 'images/hassan-hajjaj1.jpeg',
            artistId: 'hassan'
        }
    };
    
    // Artist details for modal
    const artistDetails = {
        'chidozie': {
            name: 'Chidozie Oliver Maduka',
            specialty: 'Fine Art Photographer | Visual Storyteller | Cultural Archivist',
            nationality: 'Nigeria',
            image: 'images/aboutpic.jpg',
            bio: `<p>Chidozie Oliver Maduka is a Nigerian fine art photographer and visual storyteller whose lens captures more than just images—it captures soul, silence, memory, and meaning. A graduate of Civil Engineering from Kwara State University (Class of 2021), Chidozie's artistic journey runs parallel to his academic pursuit.</p>
                  <p>In 2020, while still in university, Chidozie formally began his career as a fine art photographer. With a style deeply grounded in cultural memory and emotional resonance, topics like identity, ancestral memory, hope, silence, displacement, and dreams feature as constant subjects in his works.</p>
                  <p>La Mode Awards 2021 as top rising fine art photographer</p>
                  <p>Icon Touch Awards 2022 Emerging Artist of the Year</p>
                  <p>African Icon Award 2024 as young fine art photographer of the year.</p>`,
            stats: {
                exhibitions: '12+',
                collections: '6',
                awards: '5',
                careerStart: '2020'
            },
            featuredWorks: ['reflection-i', 'hope-emerging']
        },
     
        'fatima': {
            name: 'Fatima Mohamoud',
            specialty: 'Mixed Media Artist | Installation Artist',
            nationality: 'Somalia',
            image: 'images/fatima.png',
            bio: `<p>Fatima Mohamoud is a Somali artist whose work draws on her experience of displacement and migration, creating powerful mixed media pieces that blend traditional East African patterns with contemporary symbolism.</p>
                  <p>Having fled Somalia as a child during the civil war, Fatima's art explores themes of identity, memory, and belonging. Her distinctive visual language combines traditional patterns from her homeland with fragments of her adopted cultures, creating layered compositions that speak to the complexity of diasporic experience.</p>`,
            stats: {
                exhibitions: '11',
                collections: '5',
                awards: '4',
                careerStart: '2017'
            },
            featuredWorks: ['displaced-patterns', 'memory-fragments']
        },
        'nelson': {
            name: 'Nelson Makamo',
            specialty: 'Mixed Media Artist | Painter',
            nationality: 'South Africa',
            image: 'images/nelsonmakamo_hope.jpg',
            bio: `<p>Nelson Makamo is an internationally acclaimed South African artist known for his vibrant, expressive works that capture the resilience and hope of African youth through a combination of charcoal, acrylic, watercolors, and oil paints.</p>
                  <p>Born in Modimolle, Limpopo province, Nelson moved to Johannesburg to pursue his passion for art. His distinctive style features richly textured surfaces and emotionally evocative portraits, particularly of children, which celebrate the vibrancy and potential of Africa's youngest generation.</p>`,
            stats: {
                exhibitions: '20+',
                collections: '12',
                awards: '8',
                careerStart: '2005'
            },
            featuredWorks: ['hopeful-eyes', 'future-forward']
        },
        'aida': {
            name: 'Aida Muluneh',
            specialty: 'Fine Art Photographer | Contemporary Artist',
            nationality: 'Ethiopia',
            image: 'images/Aida_Mulune.jpg',
            bio: `<p>Aida Muluneh is an Ethiopian photographer and contemporary artist whose bold, color-saturated portraits challenge conventional narratives about Africa and explore themes of identity, history, and the complexity of being African in the modern world.</p>
                  <p>After spending her early years abroad, including in Yemen, England, Cyprus, and Canada, Aida returned to Ethiopia in 2007, where she founded the Addis Foto Fest, the first international photography festival in East Africa.</p>`,
            stats: {
                exhibitions: '25+',
                collections: '14',
                awards: '9',
                careerStart: '2007'
            },
            featuredWorks: ['past-present-future', 'world-stage']
        },
        'ibrahim': {
            name: 'Ibrahim Mahama',
            specialty: 'Installation Artist | Mixed Media',
            nationality: 'Ghana',
            image: 'images/Ibrahim_Mahama.jpg',
            bio: `<p>Ibrahim Mahama is a Ghanaian artist known for his large-scale installations made from repurposed materials, particularly jute sacks previously used to transport cocoa beans and other commodities.</p>
                  <p>Through his work, Mahama explores themes of globalization, labor, and commerce, highlighting the complex economic relationships between Ghana and the rest of the world. His installations transform everyday objects into powerful statements about trade, migration, and postcolonial narratives.</p>`,
            stats: {
                exhibitions: '18',
                collections: '9',
                awards: '4',
                careerStart: '2012'
            },
            featuredWorks: ['labor-exchange', 'material-histories']
        },
        'wangechi': {
            name: 'Wangechi Mutu',
            specialty: 'Mixed Media Artist | Sculptor',
            nationality: 'Kenya',
            image: 'images/Wangechi_Mutu.png',
            bio: `<p>Wangechi Mutu is a Kenyan-born artist whose work spans collage, painting, sculpture, and installation art. Her provocative pieces explore gender, race, and the history of representation.</p>
                  <p>Known for her distinct aesthetic that combines organic and technological elements, Mutu creates fantastical female figures that challenge Western perceptions of African women. Her work has been featured in major institutions including The Metropolitan Museum of Art in New York.</p>`,
            stats: {
                exhibitions: '30+',
                collections: '15',
                awards: '7',
                careerStart: '2000'
            },
            featuredWorks: ['guardian-figures', 'sentinels']
        },
        'yinka': {
            name: 'Yinka Shonibare',
            specialty: 'Sculptor | Installation Artist | Photographer',
            nationality: 'Nigeria/UK',
            image: 'images/yinka.png',
            bio: `<p>Yinka Shonibare CBE is a British-Nigerian artist known for his exploration of cultural identity, colonialism, and post-colonialism through various media including sculpture, photography, and film.</p>
                  <p>His signature style involves the use of colorful "African" fabrics (Dutch wax-printed textiles) that question notions of authenticity and origin. Shonibare's work examines the interrelationship between Africa and Europe and their respective economic and political histories.</p>`,
            stats: {
                exhibitions: '40+',
                collections: '20',
                awards: '10',
                careerStart: '1994'
            },
            featuredWorks: ['wind-sculpture', 'colonial-narratives']
        },
        'eddy': {
            name: 'Eddy Kamuanga Ilunga',
            specialty: 'Painter | Digital Artist',
            nationality: 'Democratic Republic of Congo',
            image: 'images/eddy_kamuanga.jpg',
            bio: `<p>Eddy Kamuanga Ilunga is a painter from Kinshasa whose distinctive style merges traditional African imagery with digital aesthetics. His large-scale paintings examine the erosion of cultural identity in the face of globalization and technology.</p>
                  <p>A graduate of the Academy of Fine Arts in Kinshasa, Ilunga's work focuses particularly on the Mangbetu people of the DRC and their struggle to maintain cultural practices amidst rapid modernization and resource exploitation.</p>`,
            stats: {
                exhibitions: '12',
                collections: '8',
                awards: '3',
                careerStart: '2014'
            },
            featuredWorks: ['mangbetu-dreams', 'digital-traditions']
        },
        'zanele': {
            name: 'Zanele Muholi',
            specialty: 'Visual Activist | Photographer',
            nationality: 'South Africa',
            image: 'images/zanele1.png',
            bio: `<p>Zanele Muholi is a South African visual activist and photographer. Their self-proclaimed mission is to "rewrite a black queer and trans visual history of South Africa" through their powerful photographic portraits.</p>
                  <p>Through their project "Faces and Phases," Muholi has created an extensive archive of portraits documenting black lesbian and transgender individuals, creating visibility for a community that faces discrimination and violence.</p>`,
            stats: {
                exhibitions: '25',
                collections: '16',
                awards: '12',
                careerStart: '2006'
            },
            featuredWorks: ['somnyama-ngonyama', 'brave-beauties']
        },
        'billie': {
            name: 'Billie Zangewa',
            specialty: 'Textile Artist | Silk Tapestry Artist',
            nationality: 'Malawi/South Africa',
            image: 'images/Billie_Zangewa.jpg',
            bio: `<p>Billie Zangewa creates intricate hand-stitched silk tapestries that explore themes of femininity, domesticity, and everyday life. Her autobiographical works celebrate the strength and resilience of women.</p>
                  <p>Based in Johannesburg, Zangewa uses her personal experiences as a starting point to explore broader social and political issues. Her delicate silk collages depict intimate domestic scenes that elevate traditionally undervalued women's labor and experiences.</p>`,
            stats: {
                exhibitions: '15',
                collections: '10',
                awards: '4',
                careerStart: '2004'
            },
            featuredWorks: ['domestic-symphonies', 'silk-narratives']
        },
        'abdoulaye': {
            name: 'Abdoulaye Konaté',
            specialty: 'Textile Artist | Mixed Media Artist',
            nationality: 'Mali',
            image: 'images/Abdoulaye.png',
            bio: `<p>Abdoulaye Konaté is a Malian artist known for his textile-based installations that combine traditional West African techniques with contemporary artistic expressions.</p>
                  <p>His colorful compositions made of hand-dyed cotton strips address sociopolitical and environmental issues, traditional Malian society, and global concerns. Konaté's work demonstrates the rich potential of fabric as a medium for contemporary artistic expression.</p>`,
            stats: {
                exhibitions: '30',
                collections: '18',
                awards: '6',
                careerStart: '1989'
            },
            featuredWorks: ['textile-symphony', 'mali-blues']
        },
        'julie': {
            name: 'Julie Mehretu',
            specialty: 'Abstract Painter | Visual Artist',
            nationality: 'Ethiopia/US',
            image: '/api/placeholder/300/400',
            bio: `<p>Julie Mehretu is an Ethiopian-born American artist known for her large-scale, densely layered abstract paintings that often reference mapping, urban planning, and architectural elements.</p>
                  <p>Her complex compositions combine architectural renderings, gestural marks, and dynamic forms to create spaces that suggest social organizations, movements, and systems. Mehretu's work engages with themes of migration, displacement, and globalization.</p>`,
            stats: {
                exhibitions: '35',
                collections: '22',
                awards: '8',
                careerStart: '1997'
            },
            featuredWorks: ['stadia', 'empirical-construction']
        },
        'godfried': {
            name: 'Godfried Donkor',
            specialty: 'Mixed Media Artist | Collage Artist',
            nationality: 'Ghana/UK',
            image: 'images/Godfried_Donkor.1png',
            bio: `<p>Godfried Donkor is a British-Ghanaian artist whose work explores the historical relationships between Africa, Europe, and the Caribbean through collage, printmaking, and oil painting.</p>
                  <p>His series "The Financial Times" places historical figures from the transatlantic slave trade against backgrounds of financial newspapers, creating a powerful commentary on the economic foundations of slavery and its lasting impact on global economies.</p>`,
            stats: {
                exhibitions: '20',
                collections: '12',
                awards: '4',
                careerStart: '1995'
            },
            featuredWorks: ['financial-times', 'people-liberty']
        },
        'toyin': {
            name: 'Toyin Ojih Odutola',
            specialty: 'Visual Artist | Drawing Artist',
            nationality: 'Nigeria/US',
            image: 'images/Toyin_Odutola1.png',
            bio: `<p>Toyin Ojih Odutola creates intricate portraits using ballpoint pens, charcoal, and pastels that explore the sociopolitical construct of skin color and identity through a distinctive visual narrative.</p>
                  <p>Her detailed drawings feature Black subjects rendered with a marked attention to the texture of skin, which she depicts as striated and luminous. Through her work, Odutola examines the malleability of identity and the transformative possibilities of visual storytelling.</p>`,
            stats: {
                exhibitions: '22',
                collections: '13',
                awards: '5',
                careerStart: '2011'
            },
            featuredWorks: ['skin-luminosity', 'wealth-markers']
        },
        'mikhael': {
            name: 'Mikhael Subotzky',
            specialty: 'Photographer | Videographer',
            nationality: 'South Africa',
            image: 'images/Mikhael_Subotzky.jpg',
            bio: `<p>Mikhael Subotzky is a South African artist whose photographic work examines social issues and the architecture of control in post-apartheid South Africa.</p>
                  <p>His projects often focus on institutions and communities on the margins of society, including prisons, rural townships, and aging urban neighborhoods. Through his lens, Subotzky explores themes of surveillance, confinement, and the struggle for dignity in challenging environments.</p>`,
            stats: {
                exhibitions: '18',
                collections: '11',
                awards: '7',
                careerStart: '2004'
            },
            featuredWorks: ['ponte-city', 'umjiegwana']
        },
        'peju': {
            name: 'Peju Alatise',
            specialty: 'Mixed Media Artist | Sculptor | Writer',
            nationality: 'Nigeria',
            image: 'images/PEJU_ALATISE.jpeg',
            bio: `<p>Peju Alatise is a Nigerian artist, architect, and author whose interdisciplinary practice encompasses sculpture, painting, and installation art. Her work addresses social, political, and gender issues affecting contemporary African women.</p>
                  <p>Drawing on Yoruba mythology and her own literary narratives, Alatise creates powerful sculptural pieces that advocate for the rights and dignity of African women and girls. Her work explores themes of cultural identity, spirituality, and social justice.</p>`,
            stats: {
                exhibitions: '16',
                collections: '9',
                awards: '5',
                careerStart: '2009'
            },
            featuredWorks: ['flying-girls', 'material-witness']
        },
        'barthélémy': {
            name: 'Barthélémy Toguo',
            specialty: 'Installation Artist | Painter | Sculptor',
            nationality: 'Cameroon',
            image: 'images/Barthélémy_Toguo.jpg',
            bio: `<p>Barthélémy Toguo is a multidisciplinary artist whose work spans painting, drawing, sculpture, photography, performance, and video. His art addresses themes of migration, borders, and human rights.</p>
                  <p>Known for his large-scale watercolor paintings and installations featuring carved wooden stamps, Toguo's work comments on political structures and global inequalities. Through his "Bandjoun Station" arts center in Cameroon, he fosters artistic exchange between Africa and the wider world.</p>`,
            stats: {
                exhibitions: '28',
                collections: '15',
                awards: '6',
                careerStart: '1998'
            },
            featuredWorks: ['stamp-politics', 'purification-series']
        },
        'hassan': {
            name: 'Hassan Hajjaj',
            specialty: 'Photographer | Designer | Filmmaker',
            nationality: 'Morocco',
            image: 'images/hassan-hajjaj2.png',
            bio: `<p>Hassan Hajjaj, often referred to as the "Andy Warhol of Marrakech," creates vibrant photographic portraits that blend traditional North African culture with contemporary global pop culture and fashion.</p>
                  <p>His distinctive style features bold colors, pattern-on-pattern compositions, and frames made from everyday Moroccan objects like food cans. Hajjaj's work playfully disrupts stereotypes about Arab and African identity while celebrating the rich visual culture of Morocco.</p>`,
            stats: {
                exhibitions: '25',
                collections: '14',
                awards: '5',
                careerStart: '2000'
            },
            featuredWorks: ['kesh-angels', 'karima-series']
        }
    };
    
    if (viewArtworkBtns.length > 0 && artworkModal) {
        viewArtworkBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const artworkId = this.getAttribute('data-artwork');
                const artwork = artworkDetails[artworkId];
                
                if (artwork) {
                    // Populate modal with artwork details
                    document.getElementById('modalTitle').textContent = artwork.title;
                    document.getElementById('modalArtist').textContent = artwork.artist;
                    document.getElementById('modalDescription').innerHTML = `<p>${artwork.description}</p>`;
                    document.getElementById('modalCollection').textContent = artwork.collection;
                    document.getElementById('modalYear').textContent = artwork.year;
                    document.getElementById('modalMedium').textContent = artwork.medium;
                    document.getElementById('modalDimensions').textContent = artwork.dimensions;
                    document.getElementById('modalEdition').textContent = artwork.edition;
                    document.getElementById('modalFraming').textContent = artwork.framing;
                    document.getElementById('modalPrice').textContent = artwork.price;
                    document.getElementById('modalImage').src = artwork.image;
                    document.getElementById('modalImage').alt = artwork.title;
                    
                    // Add artist link if available
                    const modalArtistElement = document.getElementById('modalArtist');
                    if (artwork.artistId) {
                        modalArtistElement.innerHTML = `<a href="#" class="view-artist-modal" data-artist="${artwork.artistId}">${artwork.artist}</a>`;
                        
                        // Add click event for artist link
                        const artistLink = modalArtistElement.querySelector('.view-artist-modal');
                        if (artistLink) {
                            artistLink.addEventListener('click', function(e) {
                                e.preventDefault();
                                // Close artwork modal
                                artworkModal.classList.remove('active');
                                // Open artist modal
                                const artistId = this.getAttribute('data-artist');
                                openArtistModal(artistId);
                            });
                        }
                    } else {
                        modalArtistElement.textContent = artwork.artist;
                    }
                    
                    // Also find any "View Profile" button inside modal that might reference an artist
                    const modalArtistViewButton = document.querySelector('.artwork-modal-actions .view-artist-btn');
                    if (modalArtistViewButton && artwork.artistId) {
                        modalArtistViewButton.setAttribute('data-artist', artwork.artistId);
                        
                        modalArtistViewButton.addEventListener('click', function(e) {
                            e.preventDefault();
                            // Close artwork modal
                            artworkModal.classList.remove('active');
                            // Open artist modal
                            openArtistModal(artwork.artistId);
                        });
                    }
                    
                    // Show modal with improved transition
                    artworkModal.classList.add('active');
                    lockScroll(); // Prevent scrolling with our enhanced function
                    
                    // Adjust focus for accessibility
                    setTimeout(() => {
                        modalClose.focus();
                    }, 100);
                }
            });
        });
        
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                artworkModal.classList.remove('active');
                unlockScroll(); // Restore scrolling with our enhanced function
            });
            
            // Close modal if clicking outside content
            artworkModal.addEventListener('click', function(e) {
                if (e.target === artworkModal) {
                    artworkModal.classList.remove('active');
                    unlockScroll(); // Restore scrolling with our enhanced function
                }
            });
            
            // Add swipe support for mobile
            let touchStartY = 0;
            let touchEndY = 0;
            
            const modalContent = artworkModal.querySelector('.modal-content');
            
            modalContent.addEventListener('touchstart', function(e) {
                touchStartY = e.changedTouches[0].screenY;
            }, false);
            
            modalContent.addEventListener('touchend', function(e) {
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }, false);
            
            function handleSwipe() {
                const swipeDistance = touchEndY - touchStartY;
                // If swiped down significantly on a mobile device
                if (swipeDistance > 100 && window.innerWidth <= 768) {
                    artworkModal.classList.remove('active');
                    unlockScroll();
                }
            }
        }
    }
    
    // Artist Modal Functionality
    const artistModal = document.getElementById('artistModal');
    const artistModalClose = document.querySelector('#artistModal .modal-close');
    const viewArtistBtns = document.querySelectorAll('.view-artist-btn');
    
    function openArtistModal(artistId) {
        const artist = artistDetails[artistId];
        
        if (artist && artistModal) {
            // Populate modal with artist details
            document.getElementById('artistModalName').textContent = artist.name;
            document.getElementById('artistModalSpecialty').textContent = artist.specialty;
            document.getElementById('artistModalBio').innerHTML = artist.bio;
            document.getElementById('artistModalImage').src = artist.image;
            document.getElementById('artistModalImage').alt = artist.name;
            
            // Update statistics
            document.getElementById('artistModalExhibitions').textContent = artist.stats.exhibitions;
            document.getElementById('artistModalCollections').textContent = artist.stats.collections;
            document.getElementById('artistModalAwards').textContent = artist.stats.awards;
            document.getElementById('artistModalCareerStart').textContent = artist.stats.careerStart;
            
            // Update featured works
            const worksContainer = document.getElementById('artistModalWorks');
            if (worksContainer) {
                let worksHTML = '';
                artist.featuredWorks.forEach(workId => {
                    const work = artworkDetails[workId];
                    if (work) {
                        worksHTML += `
                            <div class="artwork-item">
                                <div class="artwork-image-container">
                                    <img src="${work.image}" alt="${work.title}" class="artwork-image">
                                    <div class="artwork-overlay">
                                        <p>${work.description.substring(0, 100)}...</p>
                                        <div class="artwork-actions">
                                            <button class="artwork-btn view-artwork-btn" data-artwork="${workId}">View Details</button>
                                            <button class="artwork-btn artwork-wishlist-btn"><i class="far fa-heart"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="artwork-info">
                                    <h3 class="artwork-title">${work.title}</h3>
                                    <p class="artwork-artist">${work.artist}</p>
                                    <p class="artwork-description">From "${work.collection}" collection (${work.year})</p>
                                    <div class="artwork-details">
                                        <p class="artwork-price">${work.price}</p>
                                        <span class="artwork-category">${work.medium.split(' ')[0]}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                });
                worksContainer.innerHTML = worksHTML;
                
                // Add event listeners to the new View Details buttons
                worksContainer.querySelectorAll('.view-artwork-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const artworkId = this.getAttribute('data-artwork');
                        // Close artist modal
                        artistModal.classList.remove('active');
                        // Open artwork modal
                        const viewArtworkBtn = document.querySelector(`.artwork-btn[data-artwork="${artworkId}"]`);
                        if (viewArtworkBtn) {
                            viewArtworkBtn.click();
                        }
                    });
                });
            }
            
            // Show modal
            artistModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }
    
    if (viewArtistBtns.length > 0) {
        viewArtistBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // First try to get ID directly from the button's data attribute
                let artistId = this.getAttribute('data-artist');
                
                // If no data attribute, try to get from parent elements
                if (!artistId) {
                    // Try to get from artist card
                    const artistCard = this.closest('.artist-card');
                    if (artistCard) {
                        artistId = artistCard.querySelector('h3').textContent
                            .toLowerCase()
                            .split(' ')[0]; // Get first name in lowercase as ID
                    }
                    
                    // For the detailed artist profile, get the ID from the section
                    const parentSection = this.closest('section');
                    if (parentSection && parentSection.id) {
                        artistId = parentSection.id;
                    }
                }
                
                if (artistId) {
                    openArtistModal(artistId);
                }
            });
        });
    }
    
    if (artistModalClose) {
        artistModalClose.addEventListener('click', function() {
            artistModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close modal if clicking outside content
        artistModal.addEventListener('click', function(e) {
            if (e.target === artistModal) {
                artistModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
    // Shopping Cart
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.querySelector('.cart-close');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    
    let cart = [];
    
    if (cartBtn && cartSidebar && cartClose) {
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
        
        cartClose.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                // Get current artwork details from modal
                const title = document.getElementById('modalTitle').textContent;
                const artist = document.getElementById('modalArtist').textContent;
                const price = document.getElementById('modalPrice').textContent;
                const image = document.getElementById('modalImage').src;
                
                // Add to cart
                cart.push({
                    id: Date.now(), // Simple unique ID for the cart item
                    title,
                    artist,
                    price,
                    image
                });
                
                // Update cart UI
                updateCart();
                
                // Show cart sidebar
                cartSidebar.classList.add('active');
                
                // Close artwork modal
                artworkModal.classList.remove('active');
            });
        }
    }
    
    function updateCart() {
        // Update cart count
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
        
        // Update cart items
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
                if (cartTotal) {
                    cartTotal.textContent = '$0';
                }
                return;
            }
            
            let html = '';
            let total = 0;
            
            cart.forEach(item => {
                // Extract numeric price and add to total
                const priceValue = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
                total += priceValue;
                
                html += `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.title}</h4>
                            <p class="cart-item-artist">${item.artist}</p>
                            <p class="cart-item-price">${item.price}</p>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            });
            
            cartItems.innerHTML = html;
            if (cartTotal) {
                cartTotal.textContent = `${total.toLocaleString()}`;
            }
            
            // Add event listeners to remove buttons
            const removeButtons = document.querySelectorAll('.cart-item-remove');
            removeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    removeFromCart(id);
                });
            });
        }
    }
    
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (nav) {
                    nav.classList.remove('active');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                }
                
                // Scroll to target
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submissions
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, you would send the form data to a server
            alert('Thank you for your message. We will get back to you soon!');
            this.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, you would add the email to a newsletter list
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
});
