/**
 * 狐狸宠物组件 - 郭德纲相声风格版 v2
 * 功能：可拖动 + 丹凤眼 + 台词显示
 */

(function() {
    // 配置选项
    const config = {
        containerId: 'fox-pet-container',
        walkInterval: 3000,
        walkSpeed: 0.03,
        autoWalk: true,
        foxSize: 180,
        draggable: true  // 可拖动
    };

    // 狐狸状态
    let foxState = {
        position: { x: 0, y: 0 },
        targetPosition: { x: 0, y: 0 },
        isWalking: false,
        isRunning: false,
        isJumping: false,
        isSleeping: false,
        isDragging: false,
        happiness: 50,
        energy: 80,
        isInitialized: false,
        dragOffset: { x: 0, y: 0 }
    };

    // 郭德纲相声风格台词库
    const dialogues = {
        greet: [
            '哟，您来了！',
            '这不大忙人嘛！',
            '哎呦喂，可想死我了！',
            '您吉祥！',
            '今儿个什么日子，您能来瞧我！',
            '嚯，这不来则已，一来吓一跳！'
        ],
        idle: [
            '这日子过的，跟白开水似的！',
            '您说这人生，怎么就这么难呢？',
            '我寻思着，我也没招谁没惹谁啊！',
            '哎，这年头，当个狐狸也不容易！',
            '您瞧瞧，这都什么事儿啊！',
            '我这心里头，就跟猫抓似的！',
            '说句实在话，我太难了！',
            '这生活，简直了！'
        ],
        walking: [
            '遛遛弯儿去！',
            '活动活动筋骨！',
            '生命在于运动！',
            '我这叫巡视领地！',
            '走着！',
            '溜达溜达，消食儿！'
        ],
        running: [
            '哎呀妈呀，赶时间！',
            '快快快，来不及了！',
            '我这叫百米冲刺！',
            '跑起来，兄弟们！',
            '风一样的男子！',
            '我这速度，还行吧？'
        ],
        jumping: [
            '我跳！',
            '飞一般的感觉！',
            '一飞冲天！',
            '我这叫鲤鱼跃龙门！',
            '蹦跶蹦跶！',
            '跳起来，够得着！'
        ],
        playing: [
            '玩的就是心跳！',
            '高兴就完事儿了！',
            '人生苦短，及时行乐！',
            '我这叫自娱自乐！',
            '开心最重要！',
            '玩儿呗，谁怕谁啊！'
        ],
        eating: [
            '民以食为天！',
            '这口吃的，不容易！',
            '吃饱了不想家！',
            '美食不可辜负！',
            '我这叫品味生活！',
            '嗝~ 满足！'
        ],
        sleeping: [
            '困了，眯瞪会儿！',
            '梦里啥都有！',
            '早睡早起身体好！',
            '我先躺为敬！',
            '呼噜呼噜~',
            '别吵，正做梦呢！'
        ],
        surprised: [
            '哎呦我的妈！',
            '这可真是新鲜事儿！',
            '我没看错吧？',
            '这给我整不会了！',
            '嚯，这可了不得！',
            '吓我一跳！'
        ],
        happy: [
            '美滋滋！',
            '心里乐开了花！',
            '今儿个高兴！',
            '这心情，倍儿好！',
            '舒坦！',
            '美事儿！'
        ],
        tired: [
            '累死我了！',
            '歇会儿，歇会儿！',
            '这活儿没法干了！',
            '我这老胳膊老腿的！',
            '喘口气，喘口气！',
            '不行了，真不行了！'
        ],
        dragging: [
            '哎哎哎，轻点儿！',
            '您这是带我去哪儿啊？',
            '我自己会走！',
            '别拽别拽！',
            '得嘞，听您的！',
            '这待遇，专车接送啊！'
        ]
    };

    // DOM 元素
    let container, foxSprite, foxSpeech;

    // 初始化狐狸宠物
    window.initFoxPet = function(options = {}) {
        Object.assign(config, options);
        
        container = document.getElementById(config.containerId);
        if (!container) {
            console.error('狐狸宠物：未找到容器元素');
            return false;
        }

        createFoxElements();
        
        foxState.position = { 
            x: Math.random() * (window.innerWidth - 200), 
            y: Math.random() * (window.innerHeight - 200) 
        };

        bindEvents();
        requestAnimationFrame(updateFoxPosition);

        setInterval(() => {
            if (!foxState.isSleeping && !foxState.isDragging) {
                randomAction();
            }
        }, config.walkInterval);

        setTimeout(() => {
            showSpeech(dialogues.greet[Math.floor(Math.random() * dialogues.greet.length)]);
        }, 1000);

        foxState.isInitialized = true;
        console.log('🦊 狐狸宠物已初始化！');
        return true;
    };

    // 创建狐狸 DOM 元素
    function createFoxElements() {
        container.innerHTML = `
            <div class="fox-speech" id="fox-speech"></div>
            <div class="fox-sprite" id="fox-sprite">
                <svg class="fox-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <!-- 尾巴（加长） -->
                    <ellipse cx="30" cy="150" rx="70" ry="45" fill="#E85D04"/>
                    <ellipse cx="20" cy="140" rx="35" ry="25" fill="#FFFFFF"/>
                    
                    <!-- 身体 -->
                    <ellipse cx="100" cy="145" rx="55" ry="50" fill="#E85D04"/>
                    <ellipse cx="100" cy="150" rx="35" ry="40" fill="#FFF3E0"/>
                    
                    <!-- 后腿 -->
                    <ellipse cx="75" cy="185" rx="18" ry="15" fill="#5D4037"/>
                    <ellipse cx="125" cy="185" rx="18" ry="15" fill="#5D4037"/>
                    
                    <!-- 前腿 -->
                    <ellipse cx="85" cy="180" rx="14" ry="20" fill="#E85D04"/>
                    <ellipse cx="115" cy="180" rx="14" ry="20" fill="#E85D04"/>
                    <ellipse cx="85" cy="190" rx="12" ry="10" fill="#5D4037"/>
                    <ellipse cx="115" cy="190" rx="12" ry="10" fill="#5D4037"/>
                    
                    <!-- 头部（尖脸） -->
                    <ellipse cx="100" cy="90" rx="45" ry="55" fill="#E85D04"/>
                    
                    <!-- 耳朵 -->
                    <ellipse cx="65" cy="50" rx="18" ry="38" fill="#E85D04" transform="rotate(-20 65 50)"/>
                    <ellipse cx="135" cy="50" rx="18" ry="38" fill="#E85D04" transform="rotate(20 135 50)"/>
                    <ellipse cx="65" cy="50" rx="10" ry="24" fill="#FFCCBC" transform="rotate(-20 65 50)"/>
                    <ellipse cx="135" cy="50" rx="10" ry="24" fill="#FFCCBC" transform="rotate(20 135 50)"/>
                    
                    <!-- 脸部白色区域（尖） -->
                    <ellipse cx="100" cy="105" rx="35" ry="40" fill="#FFF3E0"/>
                    <ellipse cx="100" cy="125" rx="20" ry="25" fill="#FFFFFF"/>
                    
                    <!-- 丹凤眼（细长上扬） -->
                    <ellipse class="fox-eye" cx="80" cy="85" rx="18" ry="10" fill="#FFFFFF" transform="rotate(-15 80 85)"/>
                    <ellipse class="fox-eye" cx="120" cy="85" rx="18" ry="10" fill="#FFFFFF" transform="rotate(15 120 85)"/>
                    <ellipse cx="80" cy="86" rx="13" ry="7" fill="#4CAF50" transform="rotate(-15 80 86)"/>
                    <ellipse cx="120" cy="86" rx="13" ry="7" fill="#4CAF50" transform="rotate(15 120 86)"/>
                    <circle cx="82" cy="84" r="4" fill="#2E7D32"/>
                    <circle cx="122" cy="84" r="4" fill="#2E7D32"/>
                    <circle cx="84" cy="82" r="3" fill="#FFFFFF"/>
                    <circle cx="124" cy="82" r="3" fill="#FFFFFF"/>
                    
                    <!-- 眉毛（丹凤眉） -->
                    <path d="M 62 75 Q 80 68 92 74" stroke="#E85D04" stroke-width="3" fill="none" stroke-linecap="round"/>
                    <path d="M 108 74 Q 120 68 138 75" stroke="#E85D04" stroke-width="3" fill="none" stroke-linecap="round"/>
                    
                    <!-- 鼻子（尖） -->
                    <ellipse cx="100" cy="105" rx="10" ry="7" fill="#5D4037"/>
                    <circle cx="98" cy="103" r="3" fill="#8D6E63"/>
                    
                    <!-- 嘴巴 -->
                    <path d="M 92 120 Q 100 130 108 120" stroke="#5D4037" stroke-width="2" fill="none" stroke-linecap="round"/>
                    <path d="M 100 120 L 100 128" stroke="#5D4037" stroke-width="2" fill="none" stroke-linecap="round"/>
                    
                    <!-- 腮红 -->
                    <ellipse cx="60" cy="95" rx="12" ry="8" fill="#FFAB91" opacity="0.6"/>
                    <ellipse cx="140" cy="95" rx="12" ry="8" fill="#FFAB91" opacity="0.6"/>
                </svg>
            </div>
        `;

        foxSprite = document.getElementById('fox-sprite');
        foxSpeech = document.getElementById('fox-speech');
        
        foxSprite.style.width = config.foxSize + 'px';
        foxSprite.style.height = config.foxSize + 'px';
    }

    // 绑定事件
    function bindEvents() {
        // 拖动功能
        foxSprite.addEventListener('mousedown', startDrag);
        foxSprite.addEventListener('touchstart', startDrag, { passive: false });
        
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);

        window.addEventListener('resize', () => {
            foxState.position.x = Math.min(foxState.position.x, window.innerWidth - config.foxSize);
            foxState.position.y = Math.min(foxState.position.y, window.innerHeight - config.foxSize);
        });
    }

    // 开始拖动
    function startDrag(e) {
        e.preventDefault();
        foxState.isDragging = true;
        foxState.isWalking = false;
        foxState.isRunning = false;
        foxSprite.classList.remove('fox-walking', 'fox-running');
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        foxState.dragOffset = {
            x: clientX - foxState.position.x,
            y: clientY - foxState.position.y
        };
        
        foxSprite.style.cursor = 'grabbing';
        showSpeech(dialogues.dragging[Math.floor(Math.random() * dialogues.dragging.length)], 2000);
    }

    // 拖动中
    function onDrag(e) {
        if (!foxState.isDragging) return;
        e.preventDefault();
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        
        foxState.position.x = clientX - foxState.dragOffset.x;
        foxState.position.y = clientY - foxState.dragOffset.y;
        
        // 边界检查
        foxState.position.x = Math.max(0, Math.min(foxState.position.x, window.innerWidth - config.foxSize));
        foxState.position.y = Math.max(0, Math.min(foxState.position.y, window.innerHeight - config.foxSize));
    }

    // 结束拖动
    function endDrag() {
        if (!foxState.isDragging) return;
        foxState.isDragging = false;
        foxSprite.style.cursor = 'pointer';
        showSpeech('得嘞，到地儿了！', 1500);
    }

    // 显示对话
    function showSpeech(text, duration = 2500) {
        if (!foxSpeech) return;
        foxSpeech.textContent = text;
        foxSpeech.classList.add('show');
        
        // 清除之前的定时器
        if (foxState.actionTimer) {
            clearTimeout(foxState.actionTimer);
        }
        
        foxState.actionTimer = setTimeout(() => {
            foxSpeech.classList.remove('show');
        }, duration);
    }

    // 随机动作
    function randomAction() {
        const actions = ['walk', 'run', 'jump', 'play', 'idle'];
        const weights = [40, 20, 15, 15, 10];
        
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let selectedAction = 'idle';
        
        for (let i = 0; i < actions.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                selectedAction = actions[i];
                break;
            }
        }
        
        switch (selectedAction) {
            case 'walk':
                foxWalkRandom();
                showSpeech(dialogues.walking[Math.floor(Math.random() * dialogues.walking.length)], 2000);
                break;
            case 'run':
                foxRunRandom();
                showSpeech(dialogues.running[Math.floor(Math.random() * dialogues.running.length)], 2000);
                break;
            case 'jump':
                foxJump();
                showSpeech(dialogues.jumping[Math.floor(Math.random() * dialogues.jumping.length)], 2000);
                break;
            case 'play':
                foxPlay();
                showSpeech(dialogues.playing[Math.floor(Math.random() * dialogues.playing.length)], 2000);
                break;
            case 'idle':
                showSpeech(dialogues.idle[Math.floor(Math.random() * dialogues.idle.length)], 2500);
                break;
        }
    }

    // 随机走动
    function foxWalkRandom() {
        if (foxState.isSleeping || foxState.isDragging) return;
        
        const maxX = window.innerWidth - config.foxSize;
        const maxY = window.innerHeight - config.foxSize;
        
        foxState.targetPosition = {
            x: Math.random() * maxX,
            y: Math.random() * maxY
        };
        
        foxState.isWalking = true;
        foxState.isRunning = false;
        foxSprite.classList.add('fox-walking');
        
        if (foxState.targetPosition.x < foxState.position.x) {
            foxSprite.style.transform = 'scaleX(-1)';
        } else {
            foxSprite.style.transform = 'scaleX(1)';
        }
    }

    // 随机跑动
    function foxRunRandom() {
        if (foxState.isSleeping || foxState.isDragging) return;
        
        const maxX = window.innerWidth - config.foxSize;
        const maxY = window.innerHeight - config.foxSize;
        
        foxState.targetPosition = {
            x: Math.random() * maxX,
            y: Math.random() * maxY
        };
        
        foxState.isRunning = true;
        foxState.isWalking = false;
        foxSprite.classList.add('fox-running');
        
        if (foxState.targetPosition.x < foxState.position.x) {
            foxSprite.style.transform = 'scaleX(-1)';
        } else {
            foxSprite.style.transform = 'scaleX(1)';
        }
    }

    // 跳跃
    function foxJump() {
        if (foxState.isSleeping || foxState.isDragging) return;
        
        foxState.isJumping = true;
        foxSprite.classList.add('fox-jumping');
        
        setTimeout(() => {
            foxState.isJumping = false;
            foxSprite.classList.remove('fox-jumping');
        }, 800);
    }

    // 玩耍
    function foxPlay() {
        if (foxState.isSleeping || foxState.isDragging) return;
        
        foxSprite.classList.add('fox-playing');
        createHeart();
        
        setTimeout(() => {
            foxSprite.classList.remove('fox-playing');
        }, 1500);
    }

    // 创建爱心
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'fox-heart';
        heart.textContent = '💕';
        heart.style.left = (Math.random() * 80 + 20) + 'px';
        heart.style.top = (Math.random() * 80 + 20) + 'px';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 1500);
    }

    // 更新位置
    function updateFoxPosition() {
        if (foxState.isDragging) {
            requestAnimationFrame(updateFoxPosition);
            return;
        }
        
        if ((foxState.isWalking || foxState.isRunning) && !foxState.isSleeping && !foxState.isJumping) {
            const speed = foxState.isRunning ? config.walkSpeed * 3 : config.walkSpeed;
            const dx = foxState.targetPosition.x - foxState.position.x;
            const dy = foxState.targetPosition.y - foxState.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
                foxState.position.x += dx * speed;
                foxState.position.y += dy * speed;
                
                if (dx < 0) {
                    foxSprite.style.transform = 'scaleX(-1)';
                } else {
                    foxSprite.style.transform = 'scaleX(1)';
                }
            } else {
                foxState.isWalking = false;
                foxState.isRunning = false;
                foxSprite.classList.remove('fox-walking', 'fox-running');
            }
        }
        
        foxSprite.style.left = foxState.position.x + 'px';
        foxSprite.style.top = foxState.position.y + 'px';
        
        requestAnimationFrame(updateFoxPosition);
    }

    // 公开 API
    window.foxPetAPI = {
        walkRandom: foxWalkRandom,
        runRandom: foxRunRandom,
        jump: foxJump,
        play: foxPlay,
        sayHello: () => {
            const greetings = dialogues.greet;
            showSpeech(greetings[Math.floor(Math.random() * greetings.length)]);
        },
        sleep: () => {
            foxState.isSleeping = !foxState.isSleeping;
            foxSprite.classList.toggle('fox-sleeping');
            if (foxState.isSleeping) {
                showSpeech(dialogues.sleeping[Math.floor(Math.random() * dialogues.sleeping.length)]);
            } else {
                showSpeech('醒喽！');
            }
        },
        setDialogues: (newDialogues) => {
            Object.assign(dialogues, newDialogues);
        },
        getState: () => ({ ...foxState })
    };
})();
