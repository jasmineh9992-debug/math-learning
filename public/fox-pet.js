/**
 * 狐狸宠物组件 - 可集成到任何网站
 * 使用方法:
 * 1. 在 HTML 中添加: <div id="fox-pet-container"></div>
 * 2. 引入此 JS 文件
 * 3. 调用 initFoxPet() 初始化
 */

(function() {
    // 配置选项
    const config = {
        containerId: 'fox-pet-container',
        walkInterval: 5000,      // 随机走动间隔 (ms)
        walkSpeed: 0.02,         // 移动速度
        autoWalk: true,          // 是否自动走动
        followMouse: false       // 是否跟随鼠标
    };

    // 狐狸状态
    let foxState = {
        position: { x: 0, y: 0 },
        targetPosition: { x: 0, y: 0 },
        isWalking: false,
        isSleeping: false,
        isFollowing: config.followMouse,
        happiness: 50,
        energy: 80,
        isInitialized: false
    };

    // 台词库 - 可以自定义
    const dialogues = {
        greet: ['你好呀！', '今天过得怎么样？', '又来找我玩啦！', '吱吱~', '嘿~'],
        feed: ['好吃！', '谢谢款待！', '再来一点！', '满足~', '美味！'],
        pet: ['好舒服~', '喜欢被摸摸', '再多摸一会儿', '呼噜呼噜...', '好开心~'],
        play: ['好开心！', '再来一次！', '真好玩~', '精力充沛！', '耶！'],
        sleep: ['晚安...', '呼噜...呼噜...', '让我睡一会儿...', 'zzz...', '困了...'],
        idle: ['有点无聊...', '你在忙什么呢？', '陪我玩嘛~', '发呆中...', '无聊...'],
        click: ['嗯？', '干嘛呀~', '我在呢', '怎么了？', '嘿嘿~']
    };

    // DOM 元素
    let container, foxSprite, foxSpeech, foxMenu;

    // 初始化狐狸宠物
    window.initFoxPet = function(options = {}) {
        // 合并配置
        Object.assign(config, options);
        
        // 获取或创建容器
        container = document.getElementById(config.containerId);
        if (!container) {
            console.error('狐狸宠物：未找到容器元素，请添加 <div id="fox-pet-container"></div>');
            return false;
        }

        // 创建狐狸元素
        createFoxElements();
        
        // 初始化位置
        foxState.position = { 
            x: window.innerWidth - 200, 
            y: window.innerHeight - 200 
        };

        // 绑定事件
        bindEvents();

        // 启动动画
        requestAnimationFrame(updateFoxPosition);

        // 定期随机走动
        if (config.autoWalk) {
            setInterval(() => {
                if (!foxState.isSleeping && !foxState.isFollowing && Math.random() > 0.7) {
                    foxWalkRandom();
                }
            }, config.walkInterval);
        }

        // 初始问候
        setTimeout(() => {
            showSpeech(dialogues.greet[Math.floor(Math.random() * dialogues.greet.length)]);
        }, 1000);

        foxState.isInitialized = true;
        return true;
    };

    // 创建狐狸 DOM 元素
    function createFoxElements() {
        container.innerHTML = `
            <div class="fox-speech" id="fox-speech"></div>
            <div class="fox-menu" id="fox-menu">
                <button class="fox-menu-btn" data-action="feed">🍖 喂食</button>
                <button class="fox-menu-btn" data-action="pet">👋 摸摸</button>
                <button class="fox-menu-btn" data-action="play">🎾 玩耍</button>
                <button class="fox-menu-btn" data-action="sleep">💤 睡觉</button>
            </div>
            <div class="fox-sprite" id="fox-sprite">
                <svg class="fox-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <!-- 尾巴 -->
                    <ellipse cx="50" cy="140" rx="55" ry="40" fill="#E85D04"/>
                    <ellipse cx="45" cy="130" rx="25" ry="20" fill="#FFFFFF"/>
                    
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
                    
                    <!-- 头部 -->
                    <ellipse cx="100" cy="90" rx="55" ry="50" fill="#E85D04"/>
                    
                    <!-- 耳朵 -->
                    <ellipse cx="65" cy="55" rx="20" ry="35" fill="#E85D04" transform="rotate(-20 65 55)"/>
                    <ellipse cx="135" cy="55" rx="20" ry="35" fill="#E85D04" transform="rotate(20 135 55)"/>
                    <ellipse cx="65" cy="55" rx="12" ry="22" fill="#FFCCBC" transform="rotate(-20 65 55)"/>
                    <ellipse cx="135" cy="55" rx="12" ry="22" fill="#FFCCBC" transform="rotate(20 135 55)"/>
                    
                    <!-- 脸部白色区域 -->
                    <ellipse cx="100" cy="105" rx="40" ry="35" fill="#FFF3E0"/>
                    <ellipse cx="100" cy="120" rx="25" ry="20" fill="#FFFFFF"/>
                    
                    <!-- 眼睛（绿色大眼睛） -->
                    <ellipse class="fox-eye" cx="80" cy="85" rx="16" ry="18" fill="#FFFFFF"/>
                    <ellipse class="fox-eye" cx="120" cy="85" rx="16" ry="18" fill="#FFFFFF"/>
                    <ellipse cx="80" cy="87" rx="11" ry="13" fill="#4CAF50"/>
                    <ellipse cx="120" cy="87" rx="11" ry="13" fill="#4CAF50"/>
                    <circle cx="83" cy="82" r="6" fill="#2E7D32"/>
                    <circle cx="123" cy="82" r="6" fill="#2E7D32"/>
                    <circle cx="85" cy="80" r="4" fill="#FFFFFF"/>
                    <circle cx="125" cy="80" r="4" fill="#FFFFFF"/>
                    
                    <!-- 眉毛 -->
                    <path d="M 65 70 Q 80 65 90 72" stroke="#E85D04" stroke-width="3" fill="none" stroke-linecap="round"/>
                    <path d="M 110 72 Q 120 65 135 70" stroke="#E85D04" stroke-width="3" fill="none" stroke-linecap="round"/>
                    
                    <!-- 鼻子 -->
                    <ellipse cx="100" cy="100" rx="12" ry="8" fill="#5D4037"/>
                    <circle cx="98" cy="98" r="3" fill="#8D6E63"/>
                    
                    <!-- 嘴巴 -->
                    <path d="M 90 115 Q 100 125 110 115" stroke="#5D4037" stroke-width="2" fill="none" stroke-linecap="round"/>
                    <path d="M 100 115 L 100 120" stroke="#5D4037" stroke-width="2" fill="none" stroke-linecap="round"/>
                    
                    <!-- 腮红 -->
                    <ellipse cx="60" cy="95" rx="12" ry="8" fill="#FFAB91" opacity="0.6"/>
                    <ellipse cx="140" cy="95" rx="12" ry="8" fill="#FFAB91" opacity="0.6"/>
                </svg>
            </div>
        `;

        foxSprite = document.getElementById('fox-sprite');
        foxSpeech = document.getElementById('fox-speech');
        foxMenu = document.getElementById('fox-menu');
    }

    // 绑定事件
    function bindEvents() {
        // 点击狐狸
        foxSprite.addEventListener('click', toggleFoxMenu);
        
        // 菜单按钮
        foxMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('fox-menu-btn')) {
                const action = e.target.dataset.action;
                foxInteract(action);
            }
        });

        // 点击其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (!foxSprite.contains(e.target) && !foxMenu.contains(e.target)) {
                foxMenu.classList.remove('show');
            }
        });

        // 鼠标跟随
        document.addEventListener('mousemove', (e) => {
            if (foxState.isFollowing && !foxState.isSleeping) {
                foxState.targetPosition = {
                    x: e.clientX - 60,
                    y: e.clientY - 60
                };
                foxState.isWalking = true;
            }
        });

        // 窗口大小变化
        window.addEventListener('resize', () => {
            foxState.position.x = Math.min(foxState.position.x, window.innerWidth - 150);
            foxState.position.y = Math.min(foxState.position.y, window.innerHeight - 150);
        });
    }

    // 显示对话
    function showSpeech(text, duration = 2000) {
        foxSpeech.textContent = text;
        foxSpeech.classList.add('show');
        setTimeout(() => {
            foxSpeech.classList.remove('show');
        }, duration);
    }

    // 切换菜单
    function toggleFoxMenu() {
        if (foxState.isSleeping) {
            showSpeech('别吵...我在睡觉...', 1500);
            return;
        }
        foxMenu.classList.toggle('show');
    }

    // 互动处理
    function foxInteract(action) {
        foxMenu.classList.remove('show');
        
        const responses = dialogues[action] || dialogues.click;
        const response = responses[Math.floor(Math.random() * responses.length)];
        showSpeech(response);
        
        if (['feed', 'pet', 'play'].includes(action)) {
            createHeart();
            foxState.happiness = Math.min(100, foxState.happiness + 10);
        }
        
        if (action === 'sleep') {
            foxState.isSleeping = !foxState.isSleeping;
            foxSprite.classList.toggle('fox-sleeping');
        }
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

    // 随机走动
    function foxWalkRandom() {
        if (foxState.isSleeping) return;
        
        const maxX = window.innerWidth - 150;
        const maxY = window.innerHeight - 150;
        
        foxState.targetPosition = {
            x: Math.random() * maxX,
            y: Math.random() * maxY
        };
        
        foxState.isWalking = true;
        foxSprite.classList.add('fox-walking');
        
        if (foxState.targetPosition.x < foxState.position.x) {
            foxSprite.style.transform = 'scaleX(-1)';
        } else {
            foxSprite.style.transform = 'scaleX(1)';
        }
    }

    // 更新位置
    function updateFoxPosition() {
        if (foxState.isFollowing) return;
        
        if (foxState.isWalking && !foxState.isSleeping) {
            const dx = foxState.targetPosition.x - foxState.position.x;
            const dy = foxState.targetPosition.y - foxState.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
                foxState.position.x += dx * config.walkSpeed;
                foxState.position.y += dy * config.walkSpeed;
                
                if (dx < 0) {
                    foxSprite.style.transform = 'scaleX(-1)';
                } else {
                    foxSprite.style.transform = 'scaleX(1)';
                }
            } else {
                foxState.isWalking = false;
                foxSprite.classList.remove('fox-walking');
                
                if (Math.random() > 0.5) {
                    const idles = dialogues.idle;
                    showSpeech(idles[Math.floor(Math.random() * idles.length)]);
                }
            }
        }
        
        foxSprite.style.left = foxState.position.x + 'px';
        foxSprite.style.top = foxState.position.y + 'px';
        
        requestAnimationFrame(updateFoxPosition);
    }

    // 公开 API
    window.foxPetAPI = {
        walkRandom: foxWalkRandom,
        setFollowMouse: (follow) => {
            foxState.isFollowing = follow;
            if (follow) showSpeech('我会跟着你的鼠标哦~');
        },
        stay: () => {
            foxState.isWalking = false;
            foxState.isFollowing = false;
            foxSprite.classList.remove('fox-walking');
            showSpeech('好的，我在这里等你~');
        },
        sayHello: () => {
            const greetings = dialogues.greet;
            showSpeech(greetings[Math.floor(Math.random() * greetings.length)]);
        },
        sleep: () => {
            foxState.isSleeping = !foxState.isSleeping;
            foxSprite.classList.toggle('fox-sleeping');
        },
        setDialogues: (newDialogues) => {
            Object.assign(dialogues, newDialogues);
        },
        getState: () => ({ ...foxState })
    };
})();
