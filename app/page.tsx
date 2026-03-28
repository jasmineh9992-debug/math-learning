"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [foxLoaded, setFoxLoaded] = useState(false);
  
  useEffect(() => {
    // 加载狐狸宠物脚本
    const loadFoxPet = () => {
      // 检查是否已经加载
      if ((window as any).initFoxPet) {
        (window as any).initFoxPet();
        setFoxLoaded(true);
        console.log("🦊 狐狸宠物已初始化!");
        return;
      }
      
      // 动态加载脚本
      const script = document.createElement("script");
      script.src = "/fox-pet.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).initFoxPet) {
          (window as any).initFoxPet();
          setFoxLoaded(true);
          console.log("🦊 狐狸宠物脚本加载成功!");
        }
      };
      script.onerror = () => {
        console.error("❌ 狐狸宠物脚本加载失败");
      };
      document.body.appendChild(script);
    };
    
    loadFoxPet();
    
    return () => {
      // 清理
      const script = document.querySelector('script[src="/fox-pet.js"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* 头部 */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            🦊 喵呜喵啊的数学学习之旅
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            从财务到实分析 · 每天 4 小时 · 提升逻辑思维
          </p>
        </header>

        {/* 学习概览 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6">
            📚 学习计划
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">阶段一</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">证明基础</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">第 1-3 周</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <span className="block h-full bg-green-500" style={{ width: '25%' }}></span>
                </span>
                <span className="text-sm text-zinc-500">25%</span>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">阶段二</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">实分析核心</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">第 4-8 周</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <span className="block h-full bg-zinc-300 dark:bg-zinc-600" style={{ width: '0%' }}></span>
                </span>
                <span className="text-sm text-zinc-500">0%</span>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">阶段三</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">深化综合</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">第 9-12 周</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <span className="block h-full bg-zinc-300 dark:bg-zinc-600" style={{ width: '0%' }}></span>
                </span>
                <span className="text-sm text-zinc-500">0%</span>
              </div>
            </div>
          </div>
        </section>

        {/* 当前进度 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6">
            📖 当前进度
          </h2>
          <div className="space-y-4">
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  第 1 周：逻辑与证明方法
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  命题逻辑、量词、反证法、数学归纳法
                </p>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  第 2 周：集合论基础
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  集合运算、函数、单射/满射、可数集
                </p>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  第 3 周：实数系统入门
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  有理数构造、上确界、完备性公理
                </p>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-white font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  第 4 周：序列与极限
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  ε-N 定义、收敛、柯西序列
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 最近笔记 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6">
            📝 最近笔记
          </h2>
          <a href="/notes/logic" className="block p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              命题逻辑基础
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
              学习了与、或、非、蕴含的真值表和证明方法...
            </p>
            <span className="text-xs text-zinc-500">2026-03-27</span>
          </a>
        </section>

        {/* 学习资源 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-6">
            🔗 学习资源
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="https://classicalrealanalysis.info/com/documents/TBB-AllChapters-Landscape.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                📖 Elementary Real Analysis (TBB)
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">主教材 - 免费下载</p>
            </a>
            <a
              href="https://github.com/jasmineh9992-debug/math-learning"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                💻 GitHub 仓库
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">查看源代码</p>
            </a>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="py-8 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            开始于 2026-03-27 · 目标：12 周掌握实分析基础
          </p>
        </footer>
      </main>
      
      {/* 狐狸宠物容器 */}
      <div id="fox-pet-container" className="fixed bottom-5 right-5 w-32 h-32 z-[999999]" />
    </div>
  );
}
