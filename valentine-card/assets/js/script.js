document.addEventListener('DOMContentLoaded', () => {
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    
    // Initialize Lottie animation
    const heartLottie = lottie.loadAnimation({
        container: document.getElementById('heart-lottie'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2764_fe0f/lottie.json'
    });

    function createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        document.getElementById('floating-hearts-container').appendChild(heart);

        const animation = lottie.loadAnimation({
            container: heart,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1fa77/lottie.json'
        });

        // Generate angle in the upper 180 degrees (from 0 to 180 degrees)
        const angle = (Math.random() * Math.PI) + Math.PI;
        const distance = 200 + Math.random() * 300;
        const duration = 1.5 + Math.random() * 1.5;

        gsap.fromTo(heart, 
            {
                x: x,
                y: y,
                scale: 0.8
            },
            {
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                scale: 1.2 + Math.random() * 0.3,
                duration: duration,
                ease: "power2.out",
                onComplete: () => heart.remove()
            }
        );
    }

    function createMultipleHearts(centerX, centerY) {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createFloatingHeart(
                    centerX + (Math.random() - 0.5) * 20,  // Reduced spread
                    centerY + (Math.random() - 0.5) * 20   // Reduced spread
                );
            }, i * 80);  // Slightly faster sequence
        }
    }

    const toggleEnvelope = () => {
        const isOpening = !envelopeWrapper.classList.contains('flap');
        const isLargeScreen = window.innerWidth >= 768;
        
        if (isOpening) {
            envelopeWrapper.classList.add('flap');
            const tl = gsap.timeline();

            tl.to(envelopeWrapper, {
                y: isLargeScreen ? 120 : 80,
                duration: 0.5,
                ease: "power2.inOut"
            })
            .to('.letter', {
                yPercent: -60,
                height: "110%",  // ขยายจาก 100% เป็น 110%
                duration: 0.7,
                ease: "power2.out",
                onComplete: () => {
                    const wrapper = document.querySelector('.envelope-wrapper');
                    const rect = wrapper.getBoundingClientRect();
                    const centerX = rect.left + (rect.width / 2) - 40;
                    const centerY = rect.top + (rect.height / 2) - 40;
                    createMultipleHearts(centerX, centerY);
                }
            }, "-=0.3");

        } else {
            const tl = gsap.timeline();
            
            tl.to('.letter', {
                yPercent: 0,
                height: "70%",  // กลับไปที่ขนาดเริ่มต้น 100%
                duration: 0.5,
                ease: "power2.inOut"
            })
            .to(envelopeWrapper, {
                y: 0,
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => {
                    envelopeWrapper.classList.remove('flap');
                }
            }, "-=0.3");
        }
    };

    envelopeWrapper.addEventListener('click', toggleEnvelope);
    document.getElementById('heart-lottie').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleEnvelope();
    });

    const nextBtn = document.getElementById('next-btn');
    const overlay = document.getElementById('memory-overlay');
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    let noClickCount = 0;

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Set initial states
        gsap.set('#memory-overlay', { opacity: 0, display: 'flex' });
        gsap.set('.memory-content', { opacity: 0, y: 40 });
        gsap.set('#question-text, #button-group', { opacity: 0, y: 20 });
        
        // Create timeline with smoother transitions
        const tl = gsap.timeline();
        
        tl.to('.envelope-wrapper', {
            x: -window.innerWidth,
            duration: 0.8,
            ease: "power2.inOut"
        })
        // Fade in background very slowly
        .to('#memory-overlay', {
            opacity: 1,
            duration: 2,
            ease: "power1.inOut"
        }, "-=0.5")
        // Wait for background to be almost fully faded in
        .to('.memory-content', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.8")
        .to('#question-text', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        }, "+=0.1")
        .to('#button-group', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
        }, "-=0.4");

        overlay.classList.add('active');
    });

    noBtn.addEventListener('click', () => {
        noClickCount++;
        
        // ปรับค่าการขยายและความมนของปุ่ม
        const scale = 1 + (noClickCount * 0.2);
        const newSize = Math.min(60, 20 + (noClickCount * 8)); // ใช้ขนาดเดียวกันทั้งความกว้างและความสูง
        const borderRadius = Math.max(50 - (noClickCount * 8), 25); // ลดความมนลงเรื่อยๆ แต่ไม่ต่ำกว่า 25%
        
        // สุ่มตำแหน่งใหม่สำหรับปุ่ม "ไม่"
        const yesBtnRect = yesBtn.getBoundingClientRect();
        const noBtnRect = noBtn.getBoundingClientRect();
        
        if (noClickCount < 7) {
            // คำนวณรัศมีการเคลื่อนที่ที่เพิ่มขึ้นตามจำนวนครั้งที่กด
            const radius = 50 + (noClickCount * 30); // เริ่มที่ 50px และเพิ่มขึ้นทีละ 30px
            
            // สุ่มมุมในการเคลื่อนที่ (0-360 องศา)
            const angle = Math.random() * Math.PI * 2;
            
            // คำนวณตำแหน่งใหม่จากตำแหน่งเริ่มต้นของปุ่ม
            const startX = noBtnRect.left;
            const startY = noBtnRect.top;
            
            let newX = startX + (Math.cos(angle) * radius);
            let newY = startY + (Math.sin(angle) * radius);
            
            // ป้องกันไม่ให้ปุ่มออกนอกหน้าจอ
            const padding = 20; // ระยะห่างจากขอบหน้าจอ
            newX = Math.max(padding, Math.min(newX, window.innerWidth - noBtnRect.width - padding));
            newY = Math.max(padding, Math.min(newY, window.innerHeight - noBtnRect.height - padding));
            
            // เคลื่อนย้ายปุ่ม "ไม่" ไปยังตำแหน่งใหม่
            gsap.to(noBtn, {
                x: newX - startX,
                y: newY - startY,
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            // ครั้งที่ 5 เคลื่อนที่ออกนอกจอ
            gsap.to(noBtn, {
                x: window.innerWidth,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    noBtn.style.display = 'none';
                    // ขยายปุ่มให้เต็มจอในครั้งสุดท้าย
                    gsap.to('#yes-btn', {
                        width: "100vw",
                        height: "100vh",
                        duration: 1,
                        ease: "power2.inOut"
                    });
                }
            });
        }
        
        // ปรับ animation ของปุ่ม yes ให้เหมือนลูกโป่ง
        gsap.to('#yes-btn', {
            scale: scale,
            width: `${newSize}vmin`, // ใช้ vmin แทน vw เพื่อให้ขนาดสัมพันธ์กับหน้าจอ
            height: `${newSize}vmin`,
            borderRadius: `${borderRadius}%`,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)", // ปรับ elastic ให้ดูเหมือนยางยืด
            fontSize: `${Math.min(2 + (noClickCount * 0.3), 4)}rem`,
            boxShadow: `0 ${4 + (noClickCount * 2)}px ${15 + (noClickCount * 5)}px rgba(255, 107, 139, ${0.3 + (noClickCount * 0.1)})` // เพิ่มเงาตามขนาด
        });

        // ในกรณีที่กดครบ 5 ครั้ง
        if (noClickCount >= 7) {
            gsap.to('#yes-btn', {
                width: "100vw",
                height: "100vh",
                borderRadius: "0%", // ยกเลิกความมนเมื่อเต็มจอ
                duration: 1,
                ease: "power2.inOut",
                boxShadow: "none" // ยกเลิกเงาเมื่อเต็มจอ
            });
        }
    });

    yesBtn.addEventListener('click', () => {
        gsap.to('#memory-overlay', {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                window.location.href = 'memories.html';
            }
        });
    });
});