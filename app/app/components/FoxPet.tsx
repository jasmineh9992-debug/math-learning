'use client';

import React, { useEffect, useRef, useState } from 'react';

const dialogues = [
"哟呵~您也来学数学啊？巧了不是！",
"这题我会啊，不就是...呃...让我想想...",
"学习这事儿，就跟说相声一样，得讲究个节奏！",
"您别看我长得萌，我数学可不含糊~",
"哎呦喂，点击我干啥？我脸上有答案啊？",
"数学好的人，那都是头发换的！您看我头发多茂密...",
"这道题啊，简单来说就是...复杂来说更复杂！",
"您要是不会，咱俩可以凑一对儿...都不会！",
"学习要刻苦，但也得注意休息，比如...摸摸我？",
"我师父说了，数学不好没关系，重要的是心态好！",
"您看我这尾巴，摇一摇就是一个公式~",
"别光看我可爱啊，做题得认真！",
"这题出得，比我师父的段子还绕！",
"学会了记得给我鼓掌啊，虽然我也听不懂...",
"数学的海洋里，咱俩都是扑腾的小鱼儿~"
];

export default function FoxPet() {
const foxRef = useRef<HTMLDivElement>(null);
const [position, setPosition] = useState({ x: 100, y: 100 });
const [targetPosition, setTargetPosition] = useState({ x: 200, y: 200 });
const [isPaused, setIsPaused] = useState(false);
const [showBubble, setShowBubble] = useState(false);
const [currentDialogue, setCurrentDialogue] = useState('');
const [direction, setDirection] = useState(1);

useEffect(() => {
if (typeof window !== 'undefined') {
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
const startX = viewportWidth - 170;
const startY = viewportHeight - 170;
setPosition({ x: startX, y: startY });
setTargetPosition({
x: Math.random() * (viewportWidth - 170) + 50,
y: Math.random() * (viewportHeight - 170) + 50
});
}
}, []);

useEffect(() => {
if (isPaused) return;
const moveInterval = setInterval(() => {
setPosition(prev => {
const dx = targetPosition.x - prev.x;
const dy = targetPosition.y - prev.y;
const distance = Math.sqrt(dx * dx + dy * dy);
if (distance > 5) {
if (dx < 0) setDirection(-1);
else setDirection(1);
return {
x: prev.x + (dx / distance) * 2,
y: prev.y + (dy / distance) * 2
};
}
return prev;
});
}, 16);
return () => clearInterval(moveInterval);
}, [targetPosition, isPaused]);

useEffect(() => {
if (isPaused) return;
const checkArrival = setInterval(() => {
const dx = targetPosition.x - position.x;
const dy = targetPosition.y - position.y;
const distance = Math.sqrt(dx * dx + dy * dy);
if (distance < 10 && typeof window !== 'undefined') {
setTargetPosition({
x: Math.random() * (window.innerWidth - 170) + 50,
y: Math.random() * (window.innerHeight - 170) + 50
});
}
}, 500);
return () => clearInterval(checkArrival);
}, [position, targetPosition, isPaused]);

const handleClick = () => {
setIsPaused(true);
const randomIndex = Math.floor(Math.random() * dialogues.length);
setCurrentDialogue(dialogues[randomIndex]);
setShowBubble(true);
setTimeout(() => {
setShowBubble(false);
setTimeout(() => setIsPaused(false), 500);
}, 3000);
};

return (
<>
<style jsx>{`
.fox-container {
position: fixed;
width: 120px;
height: 120px;
cursor: pointer;
z-index: 9999;
transition: transform 0.3s ease;
filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
}
.fox-container:hover {
transform: scale(1.1);
}
.fox-svg {
width: 100%;
height: 100%;
}
.fox-tail {
transform-origin: 20px 80px;
animation: tailWag 1s ease-in-out infinite alternate;
}
@keyframes tailWag {
from { transform: rotate(-10deg); }
to { transform: rotate(10deg); }
}
.fox-ear-left, .fox-ear-right {
animation: earTwitch 3s ease-in-out infinite;
}
@keyframes earTwitch {
0%, 90%, 100% { transform: rotate(0deg); }
95% { transform: rotate(-5deg); }
}
.fox-eye {
animation: blink 4s ease-in-out infinite;
}
@keyframes blink {
0%, 90%, 95%, 100% { transform: scaleY(1); }
92.5% { transform: scaleY(0.1); }
}
.speech-bubble {
position: absolute;
bottom: 130px;
left: 50%;
transform: translateX(-50%) scale(0);
background: #fff;
border: 3px solid #333;
border-radius: 25px;
padding: 15px 25px;
font-size: 14px;
color: #333;
white-space: nowrap;
box-shadow: 0 5px 20px rgba(0,0,0,0.2);
opacity: 0;
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
pointer-events: none;
z-index: 10000;
}
.speech-bubble.show {
opacity: 1;
transform: translateX(-50%) scale(1);
}
.speech-bubble::after {
content: '';
position: absolute;
bottom: -15px;
left: 50%;
transform: translateX(-50%);
border-left: 12px solid transparent;
border-right: 12px solid transparent;
border-top: 15px solid #333;
}
`}</style>

<div
ref={foxRef}
className="fox-container"
style={{
left: position.x,
top: position.y,
transform: `scaleX(${direction})`
}}
onClick={handleClick}
>
<div className={`speech-bubble ${showBubble ? 'show' : ''}`}>
{currentDialogue}
</div>

<svg className="fox-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
<ellipse className="fox-tail" cx="25" cy="75" rx="35" ry="28" fill="#FF8C00"/>
<ellipse cx="20" cy="70" rx="18" ry="15" fill="#FFA500"/>
<ellipse cx="15" cy="68" rx="10" ry="8" fill="#FFFFFF"/>
<ellipse cx="60" cy="80" rx="40" ry="35" fill="#FF8C00"/>
<ellipse cx="60" cy="85" rx="25" ry="28" fill="#FFF8DC"/>
<ellipse cx="40" cy="105" rx="15" ry="12" fill="#FF8C00"/>
<ellipse cx="80" cy="105" rx="15" ry="12" fill="#FF8C00"/>
<ellipse cx="40" cy="112" rx="12" ry="8" fill="#5D4037"/>
<ellipse cx="80" cy="112" rx="12" ry="8" fill="#5D4037"/>
<ellipse cx="48" cy="100" rx="10" ry="18" fill="#FF8C00"/>
<ellipse cx="72" cy="100" rx="10" ry="18" fill="#FF8C00"/>
<ellipse cx="48" cy="112" rx="9" ry="7" fill="#5D4037"/>
<ellipse cx="72" cy="112" rx="9" ry="7" fill="#5D4037"/>
<ellipse cx="60" cy="50" rx="38" ry="35" fill="#FF8C00"/>
<ellipse className="fox-ear-left" cx="32" cy="25" rx="14" ry="22" fill="#FF8C00" transform="rotate(-25 32 25)"/>
<ellipse cx="32" cy="25" rx="8" ry="14" fill="#FFB6C1" transform="rotate(-25 32 25)"/>
<ellipse className="fox-ear-right" cx="88" cy="25" rx="14" ry="22" fill="#FF8C00" transform="rotate(25 88 25)"/>
<ellipse cx="88" cy="25" rx="8" ry="14" fill="#FFB6C1" transform="rotate(25 88 25)"/>
<ellipse cx="60" cy="58" rx="28" ry="25" fill="#FFF8DC"/>
<ellipse cx="60" cy="68" rx="18" ry="15" fill="#FFFFFF"/>
<ellipse className="fox-eye" cx="45" cy="48" rx="14" ry="16" fill="#FFFFFF"/>
<ellipse className="fox-eye" cx="75" cy="48" rx="14" ry="16" fill="#FFFFFF"/>
<ellipse cx="47" cy="50" rx="9" ry="11" fill="#2C1810"/>
<ellipse cx="77" cy="50" rx="9" ry="11" fill="#2C1810"/>
<circle cx="50" cy="46" r="5" fill="#FFFFFF"/>
<circle cx="80" cy="46" r="5" fill="#FFFFFF"/>
<ellipse cx="60" cy="62" rx="10" ry="7" fill="#5D4037"/>
<path d="M 50 70 Q 60 78 70 70" stroke="#5D4037" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
<ellipse cx="28" cy="58" rx="10" ry="7" fill="#FFB6C1" opacity="0.7"/>
<ellipse cx="92" cy="58" rx="10" ry="7" fill="#FFB6C1" opacity="0.7"/>
</svg>
</div>
</>
);
}
