# 项目架构分析报告

## 项目概述

**项目名称**：yanglegeyang（羊了个羊类三消游戏）
**游戏引擎**：Cocos Creator 3.8.8
**开发语言**：TypeScript
**创建日期**：2026-05-08

---

## 架构总览

本项目采用**模块化单例架构**，通过核心管理器与业务模块分离的设计，实现了高度的解耦和可扩展性。

```
┌─────────────────────────────────────────────────────────┐
│                    Game Entry (GCtr)                    │
├─────────────────────────────────────────────────────────┤
│  Core Modules (Singleton Managers)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ UIManager  │  │ ResManager │  │AudioManager│        │
│  └────────────┘  └────────────┘  └────────────┘        │
├─────────────────────────────────────────────────────────┤
│  GamePlay Modules                                       │
│  ┌────────────┐          ┌────────────┐                │
│  │LoginModule │ ───────► │Match3Module│                │
│  └────────────┘          └────────────┘                │
└─────────────────────────────────────────────────────────┘
```

---

## 核心架构层

### 1. 核心模块层 (Core Modules)

**位置**: `assets/GScript/core/modules/`

#### 1.1 UI 管理器 (UIManager)
**文件**: [UIManager.ts](file:///e:/Projects/yanglegeyang/assets/GScript/core/modules/ui/UIManager.ts)

**核心功能**:
- **屏幕适配**: 动态计算设计分辨率下的实际屏幕尺寸 (`G_VIEW_SIZE`)
  - 宽屏设备：FIXED_HEIGHT 策略
  - 高屏设备：FIXED_WIDTH 策略
- **UI 分层管理**: 基于 `EViewLayer` 枚举实现 7 层 UI 层级
  - Scene (场景层)
  - UI (默认层)
  - Guide (引导层)
  - Anim (表现层)
  - Transform (切换层)
  - Loading (转圈层)
  - Modal (模态对话框)
  - Toast (提示层)
- **UI 注册与打开**: 通过 `g_UICls2BUrl` Map 建立 UI 类与 Bundle 资源映射

**设计模式**: 单例模式 (Singleton)

#### 1.2 资源管理器 (ResManager)
**文件**: [ResManager.ts](file:///e:/Projects/yanglegeyang/assets/GScript/core/modules/res/ResManager.ts)

**核心功能**:
- **Bundle 加载**: 支持异步加载 Asset Bundle
- **Prefab 加载**: 通过 Bundle 名称 + 路径加载预制体
- **音频加载**: 加载 AudioClip 资源
- **回调与 Promise 支持**: 同时支持回调和 async/await 两种调用方式

**核心接口**:
```typescript
- loadPrefab(bundleName, prefabPath, cb)
- loadPrefabByBUrl(bUrl, cb)
- loadAudioClip(bundleName, audioPath, cb)
- loadBundle(bundleName, cb)
- loadBundleAsync(bundleName): Promise<Bundle>
```

#### 1.3 音频管理器 (AudioManager)
**文件**: [audioManager.ts](file:///e:/Projects/yanglegeyang/assets/GScript/core/modules/audio/audioManager.ts)

**核心功能**:
- 背景音乐播放与循环控制
- 自动挂载 AudioSource 组件到 Canvas 节点
- 与 ResManager 集成实现异步音频加载

---

### 2. 游戏入口层 (Game Entry)

**文件**: [GCtr.ts](file:///e:/Projects/yanglegeyang/assets/GScript/GCtr.ts)

**核心职责**:
- 游戏初始化入口
- 初始化 UIManager（传入 Canvas）
- 加载 Login Bundle 并动态添加 LoginEntry 组件
- 使用 Cocos Creator 的 `js.getClassByName()` 实现动态类加载

---

### 3. 业务模块层 (GamePlay Modules)

#### 3.1 登录模块 (Login Module)
**文件**: [LoginEntry.ts](file:///e:/Projects/yanglegeyang/assets/GScript/GamePlay/Modules/Login/LoginEntry.ts)

**流程**:
1. 播放登录背景音乐
2. 模拟 1 秒自动登录
3. 预加载 Match3 Bundle
4. 动态添加 Match3Entry 组件并初始化

#### 3.2 三消游戏模块 (Match3 Module)
**文件**: 
- [Match3Entry.ts](file:///e:/Projects/yanglegeyang/assets/GScript/GamePlay/Modules/Match3/Match3Entry.ts)
- [Match3UI.ts](file:///e:/Projects/yanglegeyang/assets/GScript/GamePlay/Modules/Match3/Match3UI.ts)

**当前状态**: 基础框架已搭建，核心游戏逻辑待实现
- 已实现 UI 预制体加载
- 已实现屏幕尺寸适配
- 节点层级结构已建立

---

## 关键设计模式

### 1. 单例模式 (Singleton)
所有核心管理器均采用单例模式，确保全局唯一访问点：
```typescript
static getInstance() {
    if (!this._instance) {
        this._instance = new XxxManager();
    }
    return this._instance;
}
```

### 2. 模块化资源分包 (Asset Bundle)
通过 Bundle 实现资源按需加载：
- LoginBN: 登录模块资源
- Match3BN: 游戏主玩法资源

### 3. 动态组件挂载
使用 Cocos Creator 的 `addComponent` 实现模块间无缝切换：
```typescript
// Login -> Match3 切换
let match3Entry = this.node.addComponent("Match3Entry");
(match3Entry as any).init();
```

### 4. 全局类型声明
通过 `declare global` 实现跨模块类型共享：
- `IBundleUrl` 接口全局可用

---

## 目录结构规范

```
assets/
├── GScript/                          # 游戏脚本根目录
│   ├── GCtr.ts                       # 游戏总控入口
│   ├── core/                         # 核心框架层
│   │   └── modules/
│   │       ├── ui/                   # UI 管理模块
│   │       ├── res/                  # 资源管理模块
│   │       └── audio/                # 音频管理模块
│   └── GamePlay/                     # 游戏业务层
│       └── Modules/
│           ├── Login/                # 登录模块
│           └── Match3/               # 三消游戏模块
├── Login/                            # 登录资源（Bundle）
├── Match3/                           # 游戏资源（Bundle）
└── Boost/                            # 启动场景
```

---

## 资源配置规范

### Bundle URL 接口
**文件**: [ResConst.ts](file:///e:/Projects/yanglegeyang/assets/GScript/core/modules/res/ResConst.ts)

```typescript
interface IBundleUrl {
    b: string;      // Bundle 名称
    l: string;      // 资源路径
    id: string;     // 缓存关键字
}

// 使用 BL() 函数创建
BL("Match3UI", "Match3BN")
```

### UI 类注册
在 UIManager 中统一注册 UI 类与 Bundle 映射：
```typescript
g_UICls2BUrl.set(Match3UI, BL("Match3UI", "Match3BN"));
```

---

## 核心数据流

### 游戏启动流程
```
1. Boost 场景加载
   ↓
2. GCtr.init(canvas) 被调用
   ├─ UIManager.getInstance().init(canvas)
   │  ├─ 计算屏幕适配尺寸 G_VIEW_SIZE
   │  └─ 创建所有 UI 层级节点
   ↓
3. 加载 LoginBN Bundle
   ↓
4. 动态添加 LoginEntry 组件
   ├─ 播放登录背景音乐
   ├─ 1秒后模拟登录成功
   └─ 预加载 Match3BN Bundle
   ↓
5. 动态添加 Match3Entry 组件
   └─ 加载 Match3UI 预制体并添加到场景
```

---

## 技术债务与改进建议

### 1. 类型安全问题
**现状**: 
```typescript
let match3Entry = this.node.addComponent("Match3Entry");
(match3Entry as any).init();  // 使用 any 类型
```
**建议**: 导出组件类，使用类型安全的方式调用：
```typescript
import { Match3Entry } from './Match3Entry';
const match3Entry = this.node.addComponent(Match3Entry);
match3Entry.init();
```

### 2. 错误处理缺失
**现状**: 资源加载失败仅打印 console.error，无降级处理
**建议**: 添加加载失败重试、 fallback 资源机制

### 3. 内存管理
**现状**: 未实现 Bundle 卸载逻辑
**建议**: 添加资源引用计数，实现按需卸载

### 4. 配置化
**建议**: 将 Bundle 名称、资源路径等配置提取到配置文件，避免硬编码

### 5. 事件系统
**建议**: 引入事件总线，降低模块间耦合，替代直接方法调用

---

## 扩展指南

### 新增业务模块步骤
1. 在 `assets/GScript/GamePlay/Modules/` 下创建新模块目录
2. 创建 `XxxEntry.ts` 作为模块入口（继承 Component）
3. 在 UIManager 中注册该模块的 UI 类映射
4. 创建对应的 Asset Bundle 资源目录
5. 通过 `addComponent` 动态挂载并初始化

### 新增核心管理器步骤
1. 在 `assets/GScript/core/modules/` 下创建新目录
2. 实现单例模式管理器类
3. 在 GCtr.init() 中调用初始化方法

---

## 总结

**架构优势**:
- ✅ 模块化程度高，核心与业务分离
- ✅ 资源按需加载，启动速度快
- ✅ 单例管理器，全局访问一致
- ✅ 动态组件挂载，模块切换灵活
- ✅ TypeScript 类型支持，开发体验好

**当前阶段**: 核心框架完成，业务逻辑待开发
**适用场景**: 中小型休闲游戏、快速原型开发
