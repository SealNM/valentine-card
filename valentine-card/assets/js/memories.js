document.addEventListener('DOMContentLoaded', () => {
    const heartContainer = document.getElementById('heart-container');
    
    // Set initial states
    gsap.set('body', { opacity: 0 });
    gsap.set('.banner-container', { opacity: 0, y: 20 });
    gsap.set('.safe-container', { opacity: 0, y: 30, scale: 0.95 });
    
    // Create single animation timeline for initial animations
    const tl = gsap.timeline({
        delay: 0.3
    });

    // Sequence all initial animations
    tl.to('body', {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
    })
    .to('.banner-container', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
    })
    .to('.safe-container', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'back.out(1.7)'
    }, "-=0.7");

    // Initialize heart animation
    let normalHeart = lottie.loadAnimation({
        container: document.getElementById('heart-container'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json'
    });

    function playBrokenHeartAnimation() {
        // ล้างและหยุด animation หัวใจปกติ
        if (normalHeart) {
            normalHeart.destroy();
        }

        // เล่น animation หัวใจแตก
        const brokenHeart = lottie.loadAnimation({
            container: heartContainer,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f494/lottie.json'
        });

        // เมื่อ animation เล่นจบ กลับไปเป็นหัวใจปกติ
        brokenHeart.addEventListener('complete', () => {
            brokenHeart.destroy();
            normalHeart = lottie.loadAnimation({
                container: heartContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json'
            });
        });
    }

    function wrongPasswordAnimation() {
        // สั่น safe container
        gsap.to('.safe-container', {
            x: 10,
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: 'power2.inOut'
        });

        // เล่น animation หัวใจแตก
        playBrokenHeartAnimation();

        // ล้างรหัสผ่านและ dots
        setTimeout(() => {
            passwordInput.value = '';
            updateDots(0);
        }, 100);
    }

    const passwordInput = document.querySelector('.password-input');
    const dots = document.querySelectorAll('.dot');
    const correctPassword = setCorrectPassword;

    function showMusicPlayer() {
        const musicContainer = document.createElement('div');
        musicContainer.className = 'music-container opacity-0';
        
        const thumbnailUrl = `https://img.youtube.com/vi/${setVideoId}/maxresdefault.jpg`;
        
        musicContainer.innerHTML = `
            <div class="vinyl-player">
                <div class="vinyl-record">
                    <img src="${thumbnailUrl}" alt="Album Cover">
                </div>
                <div class="play-button">
                    <i class="ri-play-fill"></i>
                </div>
                <div id="youtube-player"></div>
            </div>
            <div class="time-together opacity-0">
                <div id="couple-animation" class="couple-animation mb-8"></div>
                <h2>เราคบกันมาแล้ว</h2>
                <div class="time-counters">
                    <div class="time-row">
                        <div class="time-item">
                            <span class="count days">0</span>
                            <span class="label">วัน</span>
                        </div>
                        <div class="time-item">
                            <span class="count hours">0</span>
                            <span class="label">ชั่วโมง</span>
                        </div>
                    </div>
                    <div class="time-row">
                        <div class="time-item">
                            <span class="count minutes">0</span>
                            <span class="label">นาที</span>
                        </div>
                        <div class="time-item">
                            <span class="count seconds">0</span>
                            <span class="label">วินาที</span>
                        </div>
                    </div>
                </div>
                <button class="next-button opacity-0">
                    <span>ดูความทรงจำของเรา</span>
                    <i class="ri-arrow-right-line"></i>
                </button>
            </div>
        `;
        
        // เพิ่มการเปิด pointer-events ทันทีที่เรียกฟังก์ชัน
        musicContainer.style.pointerEvents = 'auto';
        
        document.body.appendChild(musicContainer);

        // Initialize couple animation
        lottie.loadAnimation({
            container: document.getElementById('couple-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/img/lottie/Animation - 1739014552165.json'
        });

        // เริ่มนับเวลาที่คบกัน (ตั้งวันที่เริ่มคบกันตรงนี้)
        const startDate = new Date(setStartDate); // แก้ไขวันที่ตามต้องการ

        function updateTimer() {
            const now = new Date();
            const diff = now - startDate;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.querySelector('.days').textContent = days;
            document.querySelector('.hours').textContent = hours;
            document.querySelector('.minutes').textContent = minutes;
            document.querySelector('.seconds').textContent = seconds;
        }

        // Create YouTube player
        let player;
        
        // Initialize YouTube player immediately
        player = new YT.Player('youtube-player', {
            videoId: setVideoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                playlist: setVideoId,
                fs: 0
            },
            events: {
                onReady: function(event) {
                    const vinyl = document.querySelector('.vinyl-record');
                    const vinylPlayer = document.querySelector('.vinyl-player');
                    const playBtn = document.querySelector('.play-button');
                    
                    // เพิ่ม event listener สำหรับทั้ง vinyl player
                    vinylPlayer.addEventListener('click', handlePlay);
                    // เพิ่ม event listener สำหรับปุ่มเล่น
                    playBtn.addEventListener('click', handlePlay);

                    function handlePlay(e) {
                        e.stopPropagation(); // ป้องกันการ bubble
                        
                        if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
                            player.playVideo();
                            vinyl.classList.add('playing');
                            
                            // Animation sequence when playing starts
                            const tl = gsap.timeline();
                            
                            tl.to('.vinyl-player', {
                                scale: 1.1,
                                duration: 0.3,
                                ease: 'power2.out'
                            })
                            .to('.vinyl-player', {
                                opacity: 0,
                                scale: 0.8,
                                duration: 0.5,
                                ease: 'power2.in',
                                pointerEvents: 'none' // เพิ่ม pointer-events: none
                            })
                            .to('.time-together', {
                                opacity: 1,
                                duration: 0.8,
                                ease: 'power2.out',
                                onComplete: () => {
                                    // เพิ่ม class active ให้ time-together
                                    document.querySelector('.time-together').classList.add('active');
                                }
                            })
                            .to('.time-together h2', {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: 'back.out(1.7)'
                            })
                            .to('.time-counters', {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: 'back.out(1.7)'
                            }, "-=0.3")
                            .to('.next-button', {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: 'back.out(1.7)',
                                onComplete: () => {
                                    // เพิ่ม event listener สำหรับปุ่ม next เพียงครั้งเดียว
                                    const nextButton = document.querySelector('.next-button');
                                    if (nextButton && !nextButton.hasAttribute('data-initialized')) {
                                        nextButton.setAttribute('data-initialized', 'true');
                                        nextButton.addEventListener('click', showGallery);
                                    }
                                }
                            }, "-=0.3");

                            updateTimer();
                            setInterval(updateTimer, 1000);
                        }
                    }
                },
                onStateChange: function(event) {
                    const vinyl = document.querySelector('.vinyl-record');
                    const playBtn = document.querySelector('.play-button');
                    
                    if (event.data === YT.PlayerState.ENDED) {
                        player.playVideo(); // Auto replay
                    }
                    if (event.data === YT.PlayerState.PAUSED) {
                        vinyl.classList.remove('playing');
                        playBtn.innerHTML = '<i class="ri-play-fill"></i>';
                    }
                    if (event.data === YT.PlayerState.PLAYING) {
                        vinyl.classList.add('playing');
                        playBtn.innerHTML = '<i class="ri-pause-fill"></i>';
                    }
                }
            }
        });

        // Animate transition
        const tl = gsap.timeline();
        
        tl.to(['.banner-container', '.safe-container'], {
            opacity: 0,
            y: -50,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                document.querySelector('.banner-container').remove();
                document.querySelector('.safe-container').remove();
                document.querySelector('.safe-wrapper').remove(); // เพิ่มบรรทัดนี้
            }
        })
        .to('.music-container', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                // เพิ่ม class active หลังจาก animation เสร็จ
                musicContainer.classList.add('active');
            }
        });
    }

    // แยกฟังก์ชันแสดงแกลลอรี่ออกมา
    function showGallery() {
        const galleryContainer = document.querySelector('.gallery-container');
        const tl = gsap.timeline();
        
        // เพิ่ม class active ก่อนเริ่ม animation
        galleryContainer.classList.add('active');
        
        tl.to('.time-together', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            pointerEvents: 'none'
        })
        .set('.gallery-container', {
            display: 'flex',
            opacity: 0
        })
        .to('.gallery-container', {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        })
        .to('.gallery-next-button', {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        })
        .call(() => {
            // Initialize Swiper
            const swiper = new Swiper('.memory-swiper', {
                effect: 'cards',
                grabCursor: true,
                initialSlide: 0,
                loop: false,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                cardsEffect: {
                    slideShadows: false,
                    perSlideRotate: 2,
                    perSlideOffset: 12,
                }
            });

            // Animate cards
            gsap.to('.memory-card', {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            });

            // Add click handler for puzzle button
            document.querySelector('.gallery-next-button').addEventListener('click', showPuzzle);
        });
    }

    // เพิ่มฟังก์ชันสำหรับเกมจิ๊กซอร์
    function showPuzzle() {
        const puzzleContainer = document.querySelector('.puzzle-container');
        const galleryContainer = document.querySelector('.gallery-container');
        
        // เพิ่ม fade-out effect ก่อนซ่อน gallery
        galleryContainer.classList.add('fade-out');
        
        setTimeout(() => {
            galleryContainer.style.display = 'none';
            galleryContainer.classList.remove('fade-out');
            puzzleContainer.classList.add('active');
            
            const puzzlePreviewImage = document.getElementById('puzzle-target-image');
            const nextButton = document.querySelector('.next-section-button');
            const puzzleArea = document.getElementById('forPuzzle');
            
            // ซ่อน gallery และแสดง puzzle
            galleryContainer.style.display = 'none';
            puzzleContainer.classList.add('active');
            
            // รีเซ็ตค่าเริ่มต้น
            puzzleArea.innerHTML = '';
            events = [];
            window.puzzle = null;
            window.autoStart = true;
            window.checkComplete = false;
            
            // แสดง Container ก่อน
            gsap.to(puzzleContainer, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    // สร้างเกมใหม่
                    window.puzzle = new Puzzle({
                        container: 'forPuzzle',
                        nbPieces: 9,
                        imageUrl: puzzlePreviewImage.src
                    });

                    // แสดงปุ่มถัดไปทันที
                    gsap.to(nextButton, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'back.out(1.7)'
                    });

                    // รอให้รูปพร้อมก่อนเริ่มเกม
                    const img = new Image();
                    img.onload = () => {
                        // เริ่มเกมหลังจากโหลดรูปเสร็จ
                        setTimeout(() => {
                            events.push({ event: 'nbpieces', nbpieces: 9 });
                        }, 500);
                    };
                    img.src = puzzlePreviewImage.src;
                }
            });
            
            // Event listener สำหรับปุ่มถัดไป
            nextButton.addEventListener('click', showMessage, { once: true });
        }, 500); // รอให้ animation จบก่อน
    }

    // เพิ่มฟังก์ชันสำหรับแสดงข้อความ
    function showMessage() {
        const messageContainer = document.querySelector('.message-container');
        const puzzleContainer = document.querySelector('.puzzle-container');
        
        // Create container for floating hearts
        const heartsContainer = document.createElement('div');
        heartsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(heartsContainer);

        // Create multiple hearts with random positions and sizes
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.style.cssText = `
                position: absolute;
                bottom: -100px;
                left: ${Math.random() * 100}vw;
                width: ${Math.random() * 250 + 80}px;
                height: ${Math.random() * 250 + 80}px;
            `;
            heartsContainer.appendChild(heart);

            // Initialize Lottie animation for each heart
            lottie.loadAnimation({
                container: heart,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f970/lottie.json'
            });

            // Animate each heart
            gsap.to(heart, {
                y: -window.innerHeight - 200,
                x: `random(-100, 100)`,
                duration: Math.random() * 3 + 2,
                ease: 'power1.out',
                delay: Math.random() * 1,
                onComplete: () => heart.remove()
            });
        }

        // เพิ่มการแสดง message container ก่อนเริ่ม animation
        messageContainer.style.display = 'block';
        messageContainer.style.opacity = '0';
        
        // Animation sequence
        const tl = gsap.timeline();
        
        tl.to(puzzleContainer, {
            y: -50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => {
                puzzleContainer.style.display = 'none';
                // Remove hearts container after transition
                setTimeout(() => {
                    heartsContainer.remove();
                }, 5000);
            }
        })
        .to(messageContainer, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
                const messageText = document.querySelector('.message-text');
                const skipButton = document.querySelector('.skip-button');
                const secretButton = document.querySelector('.secret-button');
                let currentText = '';
                messageText.classList.add('typing');

                // แสดงข้อความ
                const message = setMessage;

                const typing = setInterval(() => {
                    if (currentText.length < message.length) {
                        currentText += message[currentText.length];
                        messageText.textContent = currentText;
                    } else {
                        clearInterval(typing);
                        messageText.classList.remove('typing');
                        skipButton.style.opacity = '0';
                        
                        gsap.to(secretButton, {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            ease: 'back.out(1.7)'
                        });

                        setTimeout(() => skipButton.remove(), 300);
                    }
                }, 100);

                skipButton.addEventListener('click', () => {
                    clearInterval(typing);
                    messageText.classList.remove('typing');
                    messageText.textContent = message;
                    skipButton.style.opacity = '0';
                    
                    gsap.to(secretButton, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'back.out(1.7)'
                    });

                    setTimeout(() => skipButton.remove(), 300);
                });

                secretButton.addEventListener('click', showScratchCard);
            }
        });
    }

    // เพิ่มฟังก์ชัน showScratchCard
    function showScratchCard() {
        const messageContainer = document.querySelector('.message-container');
        const scratchContainer = document.querySelector('.scratch-container');
        const canvas = document.getElementById('scratch-card');
        const homeButton = document.querySelector('.home-button');
        const secretContent = document.querySelector('.scratch-content');
        
        // ซ่อนข้อความความลับไว้ก่อน
        if (secretContent) {
            secretContent.style.opacity = '0';
        }
        
        // แสดง scratch container แต่ยังไม่ให้เห็น
        scratchContainer.style.display = 'flex';
        scratchContainer.style.opacity = '0';
        
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // ฟังก์ชัน setup canvas และ event handlers อื่นๆ คงเดิม
        function setupCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            // สร้าง gradient สำหรับพื้นหลัง
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#ff69b4');
            gradient.addColorStop(1, '#ff1493');
            
            // วาดพื้นหลังให้เต็ม canvas
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // เพิ่มข้อความและไอคอน
            ctx.font = 'bold 24px "Noto Sans Thai"';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.fillText('ขูดเพื่อดูความลับ', canvas.width/2, canvas.height/2 - 30);
            
            // เพิ่มไอคอน remixicon
            ctx.font = '32px "remixicon"';
            ctx.fillText('', canvas.width/2, canvas.height/2 + 30);
        }

        // ฟังก์ชันสำหรับสร้างหัวใจลอย
        let lastHeartTime = 0;  // เพิ่มตัวแปรเก็บเวลาที่สร้างหัวใจล่าสุด
        const HEART_THROTTLE = 150;  // กำหนดระยะห่างขั้นต่ำระหว่างการสร้างหัวใจ (มิลลิวินาที)
        const MAX_HEARTS = 10;  // กำหนดจำนวนหัวใจสูงสุดที่แสดงพร้อมกัน
        let activeHearts = 0;  // เพิ่มตัวแปรนับจำนวนหัวใจที่กำลังแสดงอยู่
        
        function createFloatingHeart(x, y) {
            const currentTime = Date.now();
            
            // ตรวจสอบเงื่อนไขก่อนสร้างหัวใจใหม่
            if (currentTime - lastHeartTime < HEART_THROTTLE || activeHearts >= MAX_HEARTS) {
                return;
            }
            
            lastHeartTime = currentTime;
            activeHearts++;
        
            const heart = document.createElement('div');
            heart.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 30px;  // ลดขนาดลงเล็กน้อย
                height: 30px;
                pointer-events: none;
                z-index: 1001;
            `;
            scratchContainer.appendChild(heart);
        
            // สร้าง Lottie animation แบบ lightweight
            const heartAnim = lottie.loadAnimation({
                container: heart,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2728/lottie.json'
            });
        
            // Animation ให้หัวใจลอยขึ้นและหายไป
            gsap.to(heart, {
                y: -80,
                x: gsap.utils.random(-30, 30),
                opacity: 0,
                duration: 0.8,
                ease: 'power1.out',
                onComplete: () => {
                    heart.remove();
                    activeHearts--;
                }
            });
        }

        // อัปเดตฟังก์ชัน scratch
        function scratch(e) {
            if (!isDrawing) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = e.type.includes('touch') ? 
                e.touches[0].clientX - rect.left :
                e.clientX - rect.left;
            const y = e.type.includes('touch') ? 
                e.touches[0].clientY - rect.top :
                e.clientY - rect.top;

            // วาดรอยขูด
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 40;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            // สร้างหัวใจตามการเคลื่อนที่ของเมาส์/นิ้ว
            if (Math.random() > 0.5) { // 50% chance to create heart for performance
                createFloatingHeart(
                    e.type.includes('touch') ? e.touches[0].clientX : e.clientX,
                    e.type.includes('touch') ? e.touches[0].clientY : e.clientY
                );
            }

            lastX = x;
            lastY = y;
        }

        // Event listeners สำหรับการขูด
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        });

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = e.touches[0].clientX - rect.left;
            lastY = e.touches[0].clientY - rect.top;
        });
        
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            scratch(e);
        });
        
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('touchend', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);

        // แสดงปุ่มกลับหน้าแรกทันที
        gsap.set(homeButton, {
            opacity: 1,
            y: 0
        });

        // Event listener สำหรับปุ่มกลับหน้าแรก
        homeButton.addEventListener('click', () => {
            gsap.to(scratchContainer, {
                opacity: 0,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    window.location.href = 'index.html';
                }
            });
        });

        // Transition animation
        const tl = gsap.timeline();
        
        tl.to(messageContainer, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                messageContainer.style.display = 'none';
                // Setup canvas หลังจากที่ซ่อน message container แล้ว
                setupCanvas();
            }
        })
        .set(canvas, { opacity: 0 }) // ซ่อน canvas ก่อน
        .to(scratchContainer, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        })
        .to(canvas, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        }) // แสดง canvas ด้วย fade in
        // เพิ่มดีเลย์การแสดงข้อความความลับ
        .to(secretContent, {
            opacity: 1,
            duration: 0.3,
            delay: 0.5 // รอให้การ์ดด้านหน้าแสดงเสร็จก่อน
        });
    }

    function checkPassword(value) {
        if (value === correctPassword) {
            // Success animation
            gsap.to('.safe-container', {
                scale: 1.05,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                onComplete: showMusicPlayer
            });
        } else {
            wrongPasswordAnimation();
        }
    }

    // Update key press handler
    function handleKeyPress(key) {
        if (passwordInput.value.length < 4) {
            passwordInput.value += key;
            updateDots(passwordInput.value.length);
            if (passwordInput.value.length === 4) {
                checkPassword(passwordInput.value);
            }
        }
    }

    // Set initial states
    gsap.set('.memory-img', {
        opacity: 0,
        y: 50,
        scale: 0.8,
        rotate: gsap.utils.random(-10, 10)
    });
    
    // Create main animation timeline
    const tl2 = gsap.timeline({
        delay: 0.5
    });

    // Animate images first
    tl2.to('.memory-img', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: {
            amount: 1,
            from: "random"
        },
        ease: "power4.out"
    })
    .to('.safe-container', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.5");

    // Add hover animations for images
    document.querySelectorAll('.memory-img').forEach(img => {
        img.addEventListener('mouseenter', () => {
            gsap.to(img, {
                scale: 1.05,
                rotate: 0,
                zIndex: 5,
                duration: 0.3
            });
        });

        img.addEventListener('mouseleave', () => {
            gsap.to(img, {
                scale: 1,
                rotate: img._gsap.vars.rotate, // Return to original rotation
                zIndex: 1,
                duration: 0.3
            });
        });
    });

    const keyBtns = document.querySelectorAll('.key-btn');

    const updateDots = (length) => {
        dots.forEach((dot, index) => {
            dot.classList.toggle('filled', index < length);
        });
    };

    keyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            gsap.to(btn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });

            if (btn.classList.contains('clear')) {
                passwordInput.value = '';
                updateDots(0);
            } else if (btn.classList.contains('enter')) {
                if (passwordInput.value.length === 4) {
                    checkPassword(passwordInput.value);
                }
            } else {
                handleKeyPress(btn.textContent);
            }
        });
    });
});
