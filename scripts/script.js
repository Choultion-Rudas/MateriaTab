document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	// =================================================================================
	// --- 模块 1: 预设数据与常量 ---
	// 定义应用所需的静态数据，如默认搜索引擎、翻译文本和 SVG 图标。
	// =================================================================================
	const PRESET_ENGINES = [
		// 浏览器默认引擎 - 始终置顶，不可删除
		{ id: 'default', name: '浏览器默认', url: '', icon: '', api: 'bing' },
		{ id: 'google', name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://www.google.com/favicon.ico', api: 'google' },
		{ id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/favicon.ico', api: 'bing' },
		{ id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=', icon: 'https://www.baidu.com/favicon.ico', api: 'baidu' },
		{ id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico', api: 'duckduckgo' },
		{ id: 'yandex', name: 'Yandex', url: 'https://yandex.com/search/?text=', icon: 'https://yandex.com/favicon.ico', api: 'yandex' },
		{ id: 'brave', name: 'Brave', url: 'https://search.brave.com/search?q=', icon: 'https://brave.com/favicon.ico', api: 'brave' }
	];

	const TRANSLATIONS = {
		zh: {
			pageTitle: "新标签页",
			settingsTitle: "设置",
			secEngine: "搜索引擎",
			btnAddEngine: "添加搜索引擎",
			secAppearance: "外观",
			lblLang: "语言",
			descLang: "界面显示语言",
			optSystem: "跟随系统",
			lblTheme: "主题",
			descTheme: "浅色或深色主题",
			optLight: "浅色",
			optDark: "深色",
			lblOpacity: "搜索栏不透明度",
			lblWallpaper: "背景图片",
			descWallpaper: "支持常见图片格式 (如 JPG, PNG, WebP)",
			btnUpload: "上传图片",
			btnDelete: "删除图片",
			btnBingCN: "Bing 国内版壁纸",
			btnBingGlobal: "Bing 国际版壁纸",
			titleAddEngine: "添加搜索引擎",
			titleEditEngine: "编辑搜索引擎",
			lblEngineName: "名称",
			lblEngineUrl: "搜索 URL",
			lblEngineApi: "搜索建议源",
			optNone: "无",
			btnCancel: "取消",
			btnSave: "保存",
			apiBaidu: "百度",
			engDefault: "浏览器默认",
			descDefaultEngine: "浏览器默认搜索引擎",
			msgBingFail: "无法连接到 Bing 壁纸服务器，请检查网络设置。",
			msgIncomplete: "搜索引擎名称和 URL 不能为空。",
			msgDelEngine: "确认要移除 \"%s\" 吗？",
			msgDelWallpaper: "确定要移除当前背景图片吗？",
			msgMobileDefaultDisabled: "移动端不支持浏览器默认搜索",
			tipSwitchEngine: "切换搜索引擎",
			tipSettings: "设置",
			tipClose: "关闭",
			tipDeleteEngine: "删除搜索引擎",
			tipEditEngine: "编辑搜索引擎",
			tipBingCN: "获取 Bing 国内版今日壁纸",
			tipBingGlobal: "获取 Bing 国际版今日壁纸"
		},
		en: {
			pageTitle: "New Tab",
			settingsTitle: "Settings",
			secEngine: "Search Engines",
			btnAddEngine: "Add Search Engine",
			secAppearance: "Appearance",
			lblLang: "Language",
			descLang: "Interface language",
			optSystem: "System",
			lblTheme: "Theme",
			descTheme: "Light or dark theme",
			optLight: "Light",
			optDark: "Dark",
			lblOpacity: "Search Bar Opacity",
			lblWallpaper: "Wallpaper",
			descWallpaper: "Supports common formats (e.g., JPG, PNG, WebP)",
			btnUpload: "Upload Image",
			btnDelete: "Delete Image",
			btnBingCN: "Bing CN Wallpaper",
			btnBingGlobal: "Bing Global Wallpaper",
			titleAddEngine: "Add Engine",
			titleEditEngine: "Edit Engine",
			lblEngineName: "Name",
			lblEngineUrl: "Search URL",
			lblEngineApi: "Suggestion Source",
			optNone: "None",
			btnCancel: "Cancel",
			btnSave: "Save",
			apiBaidu: "Baidu",
			engDefault: "Browser Default",
			descDefaultEngine: "Browser default search engine",
			msgBingFail: "Unable to connect to Bing wallpaper server, please check your network.",
			msgIncomplete: "Engine name and URL cannot be empty.",
			msgDelEngine: "Are you sure you want to remove \"%s\"?",
			msgDelWallpaper: "Are you sure you want to remove the current wallpaper?",
			msgMobileDefaultDisabled: "Browser default search is not supported on mobile",
			tipSwitchEngine: "Switch search engine",
			tipSettings: "Settings",
			tipClose: "Close",
			tipDeleteEngine: "Remove search engine",
			tipEditEngine: "Edit search engine",
			tipBingCN: "Fetch today's Bing CN wallpaper",
			tipBingGlobal: "Fetch today's Bing global wallpaper"
		}
	};
	// 当搜索引擎图标加载失败时，使用此 SVG 作为回退
	const MD_SEARCH_ICON_SVG = `<svg class="md-icon fallback-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>`;


	// =================================================================================
	// --- 模块 2: DOM 元素引用 ---
	// 集中管理所有需要操作的 DOM 元素，便于维护和访问。
	// =================================================================================
	const els = {
		root: document.documentElement,
		searchWrapper: document.querySelector('.search-bar-wrapper'), // 搜索栏、下拉菜单和建议的共同父容器
		searchContainer: document.getElementById('searchBarContainer'),
		engineSelectorBtn: document.getElementById('engineSelectorBtn'),
		currentEngineIconContainer: document.getElementById('currentEngineIconContainer'),
		searchForm: document.getElementById('searchForm'),
		searchInput: document.getElementById('searchInput'),
		settingsBtn: document.getElementById('settingsBtn'),
		engineDropdown: document.getElementById('engineDropdown'),
		searchSuggestions: document.getElementById('searchSuggestions'),
		settingsDialog: document.getElementById('settingsDialog'),
		closeSettingsBtn: document.getElementById('closeSettingsBtn'),
		engineList: document.getElementById('engineList'),
		showAddEngineForm: document.getElementById('showAddEngineForm'),
		langSelectWrapper: document.getElementById('langSelectWrapper'),
		themeSelectWrapper: document.getElementById('themeSelectWrapper'),
		editEngineApiWrapper: document.getElementById('editEngineApiWrapper'),
		opacitySliderWrapper: document.getElementById('opacitySliderWrapper'),
		opacitySlider: document.getElementById('opacitySlider'),
		opacityValueFilled: document.getElementById('opacityValueFilled'),
		opacityValueEmpty: document.getElementById('opacityValueEmpty'),
		bgUpload: document.getElementById('bgUpload'),
		bgBingCN: document.getElementById('bgBingCN'),
		bgBingGlobal: document.getElementById('bgBingGlobal'),
		bgDelete: document.getElementById('bgDelete'),
		engineEditorDialog: document.getElementById('engineEditorDialog'),
		engineEditorTitle: document.getElementById('engineEditorTitle'),
		editEngineName: document.getElementById('editEngineName'),
		editEngineUrl: document.getElementById('editEngineUrl'),
		cancelEditEngine: document.getElementById('cancelEditEngine'),
		saveEditEngine: document.getElementById('saveEditEngine'),
		wallpaperLayer: document.getElementById('wallpaper-layer'),
		wallpaperOverlay: document.getElementById('wallpaper-overlay')
	};

	// 检测是否为移动端
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


	// =================================================================================
	// --- 模块 3: 应用状态管理 ---
	// 管理应用的核心状态和数据，包括配置、数据库操作和国际化。
	// =================================================================================
	let config; // 全局配置对象
	let editingEngineId = null; // 正在编辑的搜索引擎 ID
	let selectedEngineApi = 'google'; // 在编辑器中选中的 API
	let suggestionDebounceTimer; // 搜索建议的防抖计时器
	let activeSuggestionIndex = -1; // 键盘导航选中的建议索引
	let originalUserQuery = ''; // 用户在键盘导航前的原始输入

	/**
	 * 转义 HTML 字符串以防止 XSS 攻击。
	 * @param {string} str - 需要转义的字符串。
	 * @returns {string} 转义后的字符串。
	 */
	const escapeHtml = (str) => {
		if (!str) return '';
		return String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	};

	/**
	 * @namespace configManager
	 * @description 管理应用配置的加载、保存和获取。使用 localStorage 进行持久化。
	 */
	const configManager = {
		defaultConfig: {
			engines: JSON.parse(JSON.stringify(PRESET_ENGINES)), // 深拷贝预设引擎
			currentEngineId: isMobile ? 'bing' : 'default', // 电脑端默认为 'default'，移动端默认为 'bing'
			theme: 'system',
			language: 'system',
			opacity: 90,
			bgSource: 'custom', // 壁纸来源: 'custom', 'bing-cn', 'bing-global'
			bgLastUpdate: ''    // 上次更新壁纸的日期字符串
		},

		/**
		 * 从 localStorage 加载配置。如果失败或无配置，则使用默认配置并进行数据修复。
		 */
		load() {
			try {
				const savedConfig = localStorage.getItem('materia_config');
				const parsed = savedConfig ? JSON.parse(savedConfig) : {};
				config = { ...this.defaultConfig, ...parsed };

				// --- 数据校验与修复 ---
				// 确保引擎列表有效
				if (!config.engines || !Array.isArray(config.engines) || config.engines.length === 0) {
					config.engines = JSON.parse(JSON.stringify(PRESET_ENGINES));
				}
				// 确保 'default' 引擎始终存在且在首位
				const defaultEngine = config.engines.find(e => e.id === 'default');
				if (!defaultEngine) {
					config.engines.unshift(JSON.parse(JSON.stringify(PRESET_ENGINES[0])));
				} else if (config.engines[0].id !== 'default') {
					config.engines = [defaultEngine, ...config.engines.filter(e => e.id !== 'default')];
				}

				// 移动端强制检查：如果当前是 'default'，需要切换到其他可用引擎
				if (isMobile && config.currentEngineId === 'default') {
					// 优先尝试切换到 Bing
					const hasBing = config.engines.some(e => e.id === 'bing');
					if (hasBing) {
						config.currentEngineId = 'bing';
					} else {
						// 如果 Bing 被删除了，则切换到列表中第一个非 default 的引擎
						const fallbackEngine = config.engines.find(e => e.id !== 'default');
						if (fallbackEngine) {
							config.currentEngineId = fallbackEngine.id;
						}
					}
				}

				// 确保不透明度值在有效范围内
				if (typeof config.opacity !== 'number' || config.opacity < 20 || config.opacity > 100) {
					config.opacity = this.defaultConfig.opacity;
				}

			} catch (error) {
				console.error("加载配置失败，将使用默认配置:", error);
				config = { ...this.defaultConfig };
			}
		},

		/**
		 * 将当前配置保存到 localStorage。
		 */
		save() {
			try {
				localStorage.setItem('materia_config', JSON.stringify(config));
			} catch (error) {
				console.error("保存配置失败:", error);
			}
		},

		/**
		 * 获取当前选中的搜索引擎对象。
		 * @returns {object} 当前搜索引擎对象，如果找不到则返回第一个引擎。
		 */
		getCurrentEngine() {
			return config.engines.find(e => e.id === config.currentEngineId) || config.engines[0];
		}
	};

	/**
	 * @namespace dbHelper
	 * @description IndexedDB 的封装，用于高效存储和读取壁纸图片 (Blob)。
	 */
	const dbHelper = {
		dbName: 'MateriaTabDB',
		storeName: 'wallpapers',
		db: null,

		/**
		 * 打开或创建 IndexedDB 数据库。
		 * @returns {Promise<IDBDatabase>} 数据库实例。
		 */
		async open() {
			if (this.db) return this.db;
			return new Promise((resolve, reject) => {
				const req = indexedDB.open(this.dbName, 1);
				req.onupgradeneeded = e => {
					const db = e.target.result;
					if (!db.objectStoreNames.contains(this.storeName)) {
						db.createObjectStore(this.storeName);
					}
				};
				req.onsuccess = e => {
					this.db = e.target.result;
					resolve(this.db);
				};
				req.onerror = e => {
					console.error("IndexedDB 打开失败:", e.target.error);
					reject(e.target.error);
				}
			});
		},

		/**
		 * 私有辅助函数，用于创建和管理数据库事务。
		 * @param {'readonly'|'readwrite'} type - 事务类型。
		 * @param {function(IDBObjectStore): void} callback - 在事务中执行的回调函数。
		 * @returns {Promise<void>} 事务完成时解析的 Promise。
		 */
		async _transaction(type, callback) {
			const db = await this.open();
			return new Promise((resolve, reject) => {
				const tx = db.transaction(this.storeName, type);
				const store = tx.objectStore(this.storeName);
				callback(store);
				tx.oncomplete = () => resolve();
				tx.onerror = () => {
					console.error("IndexedDB 事务错误:", tx.error);
					reject(tx.error);
				}
			});
		},

		/**
		 * 将文件保存到数据库。
		 * @param {Blob|File} file - 要保存的图片文件。
		 * @returns {Promise<void>}
		 */
		async save(file) {
			return this._transaction('readwrite', store => store.put(file, 'bgImage'));
		},

		/**
		 * 从数据库获取文件。
		 * @returns {Promise<File|Blob|undefined>}
		 */
		async get() {
			const db = await this.open();
			return new Promise((resolve, reject) => {
				const tx = db.transaction(this.storeName, 'readonly');
				const req = tx.objectStore(this.storeName).get('bgImage');
				req.onsuccess = e => resolve(e.target.result);
				req.onerror = e => {
					console.error("IndexedDB 读取失败:", e.target.error);
					reject(e.target.error);
				}
			});
		},

		/**
		 * 从数据库删除文件。
		 * @returns {Promise<void>}
		 */
		async delete() {
			return this._transaction('readwrite', store => store.delete('bgImage'));
		}
	};

	/**
	 * @namespace localization
	 * @description 处理国际化 (i18n)。
	 */
	const localization = {
		/**
		 * 根据用户配置或浏览器设置获取有效的语言代码 ('zh' 或 'en')。
		 * @returns {'zh'|'en'}
		 */
		getEffectiveLang() {
			if (config.language === 'system') {
				return navigator.language.startsWith('zh') ? 'zh' : 'en';
			}
			return config.language;
		},

		/**
		 * 获取指定键的翻译文本。
		 * @param {string} key - 翻译键。
		 * @returns {string} 翻译后的文本。
		 */
		translate(key) {
			const lang = this.getEffectiveLang();
			return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key];
		},

		/**
		 * 将翻译应用到整个页面。
		 */
		apply() {
			const lang = this.getEffectiveLang();
			const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

			document.title = t.pageTitle;
			document.querySelectorAll('[data-i18n]').forEach(el => {
				const key = el.dataset.i18n;
				if (t[key]) el.textContent = t[key];
			});

			// 处理 tooltip 的国际化
			document.querySelectorAll('[data-i18n-title]').forEach(el => {
				const key = el.dataset.i18nTitle;
				if (t[key]) el.title = t[key];
			});

			this.updateSelectTriggerText(els.langSelectWrapper);
			this.updateSelectTriggerText(els.themeSelectWrapper);
			this.updateSelectTriggerText(els.editEngineApiWrapper);
		},

		/**
		 * 更新自定义下拉框触发器中显示的文本。
		 * @param {HTMLElement} wrapper - 下拉框的包装元素。
		 */
		updateSelectTriggerText(wrapper) {
			if (!wrapper) return;
			const triggerSpan = wrapper.querySelector('.custom-select-trigger span');
			const selectedOption = wrapper.querySelector('.custom-option.selected');
			if (triggerSpan && selectedOption) {
				triggerSpan.textContent = selectedOption.textContent;
			}
		}
	};


	// =================================================================================
	// --- 模块 4: UI 管理器 ---
	// 集中处理所有UI的渲染和更新逻辑。
	// =================================================================================
	const uiManager = {
		lastWallpaperUrl: null,
		/**
		 * 渲染所有UI组件，通常在初始化或配置变更后调用。
		 */
		renderAll() {
			localization.apply();
			this.applyTheme();
			this.updateSearchbarOpacity(config.opacity);
			this.updateCurrentEngineIcon();
			this.updateSlider(config.opacity);
			this.renderEngineDropdown();
			this.renderEngineSettingsList();
			this.updateCustomSelect(els.langSelectWrapper, config.language);
			this.updateCustomSelect(els.themeSelectWrapper, config.theme);
			this.updateWallpaperButtonsState();
		},

		/**
		 * 根据配置应用浅色或深色主题。
		 */
		applyTheme() {
			let theme = config.theme;
			if (theme === 'system') {
				theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			}
			els.root.setAttribute('data-theme', theme);
		},

		/**
		 * 更新搜索栏及其关联下拉菜单的不透明度。
		 * @param {number} value - 不透明度值 (20-100)。
		 */
		updateSearchbarOpacity(value) {
			els.searchWrapper.style.opacity = value / 100;
		},

		/**
		 * 更新搜索栏左侧当前搜索引擎的图标。
		 */
		updateCurrentEngineIcon() {
			const currentEngine = configManager.getCurrentEngine();
			if (!currentEngine) return;
			// 默认引擎没有图片 icon，直接触发 onerror 显示回退图标
			els.currentEngineIconContainer.innerHTML = `
				<img src="${currentEngine.icon || ''}" alt="icon" class="engine-icon-img">
				${MD_SEARCH_ICON_SVG}`;
			const img = els.currentEngineIconContainer.querySelector('img');
			img.onerror = () => { img.style.display = 'none'; };
		},

		/**
		 * 预连接到当前搜索引擎的源，以加快搜索跳转速度。
		 */
		preconnectToEngine() {
			const engine = configManager.getCurrentEngine();
			// 如果 URL 为空（如默认引擎），则不进行预连接，防止报错
			if (!engine || !engine.url) return;
			try {
				const origin = new URL(engine.url).origin;
				if (document.head.querySelector(`link[rel="preconnect"][href="${origin}"]`)) return;
				const link = document.createElement('link');
				link.rel = 'preconnect';
				link.href = origin;
				link.crossOrigin = 'anonymous';
				document.head.appendChild(link);
			} catch (e) {
				console.warn("无法为 URL 创建预连接:", engine.url, e);
			}
		},

		/**
		 * 获取并应用 Bing 每日壁纸。
		 * @param {'zh-CN' | 'en-US'} region - Bing API 的区域参数。
		 * @param {boolean} [isSilent=false] - 是否为静默模式 (不显示 alert 错误)。
		 */
		async fetchBingWallpaper(region, isSilent = false) {
			const btn = region === 'zh-CN' ? els.bgBingCN : els.bgBingGlobal;
			if (!isSilent && btn) btn.disabled = true;

			try {
				const domain = region === 'zh-CN' ? 'https://cn.bing.com' : 'https://www.bing.com';
				const jsonUrl = `${domain}/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=${region}`;

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时

				const res = await fetch(jsonUrl, { signal: controller.signal, credentials: 'omit' });
				clearTimeout(timeoutId);

				if (!res.ok) throw new Error('Network error');
				const data = await res.json();

				if (data.images && data.images.length > 0) {
					const imgInfo = data.images[0];
					const urlBase = imgInfo.urlbase;
					const uhdUrl = `${domain}${urlBase}_UHD.jpg`; // 4K 分辨率
					const fallbackUrl = `${domain}${imgInfo.url}`; // 1080P 分辨率

					let blob;
					try {
						// 优先尝试下载 4K
						const imgRes = await fetch(uhdUrl, { cache: 'no-cache', credentials: 'omit' });
						if (imgRes.ok) {
							blob = await imgRes.blob();
						} else {
							throw new Error('UHD not available');
						}
					} catch (e) {
						// 4K 下载失败，回退到 1080P
						console.log("UHD download failed, falling back to standard resolution.");
						const fallbackRes = await fetch(fallbackUrl, { cache: 'no-cache', credentials: 'omit' });
						if (!fallbackRes.ok) throw new Error('Image download failed');
						blob = await fallbackRes.blob();
					}

					await dbHelper.save(blob);

					// 更新状态
					config.bgSource = region === 'zh-CN' ? 'bing-cn' : 'bing-global';
					config.bgLastUpdate = new Date().toDateString();
					configManager.save();

					await this.loadWallpaper();
					this.updateWallpaperButtonsState();
				}
			} catch (e) {
				console.warn("Bing 壁纸获取失败:", e);
				if (!isSilent) {
					alert(localization.translate('msgBingFail'));
				}
			} finally {
				if (!isSilent && btn) btn.disabled = false;
			}
		},

		/**
		 * 根据当前壁纸来源更新设置中按钮的高亮状态。
		 */
		updateWallpaperButtonsState() {
			els.bgBingCN.classList.toggle('active-source', config.bgSource === 'bing-cn');
			els.bgBingGlobal.classList.toggle('active-source', config.bgSource === 'bing-global');
		},

		/**
		 * 渲染搜索引擎选择下拉菜单。
		 */
		renderEngineDropdown() {
			const fragment = document.createDocumentFragment();
			config.engines.forEach(eng => {
				// 移动端跳过 'default' 引擎，不让选
				if (isMobile && eng.id === 'default') return;

				const isSelected = eng.id === config.currentEngineId;
				const div = document.createElement('div');
				div.className = `engine-option ${isSelected ? 'selected' : ''}`;
				div.setAttribute('role', 'option');
				div.dataset.engineId = eng.id;
				if (isSelected) div.setAttribute('aria-selected', 'true');

				const displayName = eng.id === 'default' ? localization.translate('engDefault') : eng.name;

				div.innerHTML = `
                    <div class="engine-option-left">
                        <div class="icon-container">
							<img src="${eng.icon || ''}" alt="${eng.name} icon" class="engine-icon-img small">
							${MD_SEARCH_ICON_SVG}
						</div>
                        <span>${displayName}</span>
                    </div>
                    <svg class="engine-check-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>`;

				const img = div.querySelector('img');
				img.onerror = () => { img.style.display = 'none'; };
				fragment.appendChild(div);
			});
			els.engineDropdown.innerHTML = '';
			els.engineDropdown.appendChild(fragment);
		},

		/**
		 * 渲染设置界面中的搜索引擎列表。
		 */
		renderEngineSettingsList() {
			const fragment = document.createDocumentFragment();
			// 删除按钮禁用逻辑
			// 规则：总数必须 > 1。如果是移动端，'default' 不算数
			let validEngineCount = config.engines.length;
			if (isMobile) {
				if (config.engines.find(e => e.id === 'default')) validEngineCount--;
			}
			const isDeleteDisabled = validEngineCount <= 1;

			config.engines.forEach((eng) => {
				const isDefault = eng.id === 'default';
				const item = document.createElement('div');
				item.className = 'engine-list-item';
				if (isDefault) {
					item.classList.add('fixed-item');
					if (isMobile) {
						item.classList.add('disabled-item');
						item.setAttribute('title', localization.translate('msgMobileDefaultDisabled'));
					}
				} else {
					item.setAttribute('draggable', 'true');
				}
				item.dataset.id = eng.id;
				item.setAttribute('role', 'option');

				if (eng.id === config.currentEngineId) item.classList.add('selected');

				const displayName = escapeHtml(isDefault ? localization.translate('engDefault') : eng.name);
				const desc = escapeHtml(isDefault ? localization.translate('descDefaultEngine') : eng.url);

				item.innerHTML = `
                    <div class="engine-list-info">
                        <div class="engine-name">${displayName}</div>
                        <div class="setting-desc">${desc}</div>
                    </div>
                    <div class="engine-actions">
                        <button class="icon-btn small delete-btn" title="${localization.translate('tipDeleteEngine')}" data-action="delete" ${isDeleteDisabled || isDefault ? 'disabled' : ''}>
                            <svg class="md-icon" style="width:18px;height:18px" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                        <button class="icon-btn small edit-btn" title="${localization.translate('tipEditEngine')}" data-action="edit">
                            <svg class="md-icon" style="width:18px;height:18px" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                    </div>
                    <div class="drag-handle">
                        <svg class="md-icon" style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"/></svg>
                    </div>`;

				if (!isDefault) {
					// 桌面端鼠标拖拽
					item.addEventListener('dragstart', () => item.classList.add('dragging'));
					item.addEventListener('dragend', () => {
						item.classList.remove('dragging');
						this.updateEngineOrderFromDOM();
					});

					// 移动端触摸拖拽
					item.addEventListener('touchstart', (e) => {
						if (e.target.closest('.drag-handle')) {
							e.preventDefault();
							item.classList.add('dragging');
						}
					}, { passive: false });

					item.addEventListener('touchmove', (e) => {
						if (!item.classList.contains('dragging')) return;
						e.preventDefault();
						const touchY = e.touches[0].clientY;
						const siblings = [...els.engineList.querySelectorAll('.engine-list-item:not(.dragging):not(.fixed-item)')];
						const nextSibling = siblings.reduce((closest, child) => {
							const box = child.getBoundingClientRect();
							const offset = touchY - box.top - box.height / 2;
							if (offset < 0 && offset > closest.offset) {
								return { offset: offset, element: child };
							} else {
								return closest;
							}
						}, { offset: Number.NEGATIVE_INFINITY }).element;

						if (nextSibling) {
							els.engineList.insertBefore(item, nextSibling);
						} else {
							els.engineList.appendChild(item);
						}
					}, { passive: false });

					item.addEventListener('touchend', () => {
						if (item.classList.contains('dragging')) {
							item.classList.remove('dragging');
							this.updateEngineOrderFromDOM();
						}
					});
				}

				fragment.appendChild(item);
			});

			els.engineList.innerHTML = '';
			els.engineList.appendChild(fragment);
		},

		/**
		 * 根据 DOM 中的顺序更新配置中的搜索引擎排序。
		 */
		updateEngineOrderFromDOM() {
			const newOrderIds = [...els.engineList.querySelectorAll('.engine-list-item')].map(item => item.dataset.id);
			config.engines = newOrderIds.map(id => config.engines.find(e => e.id === id)).filter(Boolean);
			configManager.save();
			this.renderEngineDropdown();
		},

		/**
		 * 处理引擎列表项上的点击事件（选择、编辑、删除）。
		 * @param {MouseEvent} e - 点击事件对象。
		 */
		handleEngineAction(e) {
			const listItem = e.target.closest('.engine-list-item');
			if (!listItem) return;

			const engineId = listItem.dataset.id;
			const engine = config.engines.find(e => e.id === engineId);
			if (!engine) return;

			// 移动端点击 'default' 不响应
			if (isMobile && engineId === 'default') return;

			const action = e.target.closest('[data-action]')?.dataset.action;

			if (action === 'edit') {
				this.openEngineEditor(engine);
			} else if (action === 'delete') {
				let validEngineCount = config.engines.length;
				if (isMobile && config.engines.find(e => e.id === 'default')) validEngineCount--;

				if (engineId !== 'default' && validEngineCount > 1) this.deleteEngine(engine);
			} else {
				// 如果点击的不是按钮，则认为是选择该引擎
				config.currentEngineId = engineId;
				configManager.save();
				this.renderAll();
			}
		},

		/**
		 * 删除指定的搜索引擎。
		 * @param {object} engineToDelete - 要删除的引擎对象。
		 */
		deleteEngine(engineToDelete) {
			const msg = localization.translate('msgDelEngine').replace('%s', engineToDelete.name);
			if (confirm(msg)) {
				config.engines = config.engines.filter(e => e.id !== engineToDelete.id);
				if (config.currentEngineId === engineToDelete.id) {
					config.currentEngineId = config.engines[0]?.id;
				}
				configManager.save();
				this.renderAll();
			}
		},

		/**
		 * 更新自定义下拉选择框的选中状态。
		 * @param {HTMLElement} wrapper - 下拉框的包装器元素。
		 * @param {string} value - 要选中的值。
		 */
		updateCustomSelect(wrapper, value) {
			if (!wrapper) return;
			wrapper.querySelectorAll('.custom-option').forEach(opt => {
				opt.classList.toggle('selected', opt.dataset.value === value);
			});
			localization.updateSelectTriggerText(wrapper);
		},

		/**
		 * 更新不透明度滑块的视觉表现。
		 * @param {number} value - 当前不透明度值 (20-100)。
		 */
		updateSlider(value) {
			els.opacitySlider.value = value;
			els.opacitySliderWrapper.style.setProperty('--value', value + '%');
			els.opacityValueFilled.textContent = `${value}%`;
			els.opacityValueEmpty.textContent = `${value}%`;

			// 使用 rAF 确保在下一次绘制前计算，避免布局抖动
			requestAnimationFrame(() => {
				const wrapperRect = els.opacitySliderWrapper.getBoundingClientRect();
				const textRect = els.opacityValueFilled.getBoundingClientRect();
				if (wrapperRect.width === 0 || textRect.width === 0) return;

				const fillWidthPx = (value / 100) * wrapperRect.width;
				const textStartPx = textRect.left - wrapperRect.left;
				const intersectPx = fillWidthPx - textStartPx;
				let clipPercent = (intersectPx / textRect.width) * 100;
				clipPercent = Math.max(0, Math.min(100, clipPercent));
				els.opacitySliderWrapper.style.setProperty('--text-clip', clipPercent + '%');
			});

			/**
			 * 更新滑块的视觉效果，特别是两种颜色文本的裁剪位置。
			 * - 使用 requestAnimationFrame (rAF) 是为了确保所有DOM元素的尺寸计算
			 *   都发生在浏览器下一次重绘之前。这是一种性能优化，可以避免因连续
			 *   读写DOM属性而导致的"布局抖动"(Layout Thrashing)。
			 * - 核心逻辑是通过计算填充轨道的宽度与文本起始位置的交集，
			 *   来动态设置填充色文本的 clip-path，从而实现平滑的颜色填充效果。
			 */
		},

		/**
		 * 打开搜索引擎编辑器模态框。
		 * @param {object|null} [engine=null] - 要编辑的引擎对象，如果为 null 则为添加模式。
		 */
		openEngineEditor(engine = null) {
			editingEngineId = engine ? engine.id : null;
			els.engineEditorTitle.textContent = engine ? localization.translate('titleEditEngine') : localization.translate('titleAddEngine');

			const isDefault = engine && engine.id === 'default';

			if (engine) {
				els.editEngineName.value = isDefault ? localization.translate('engDefault') : engine.name;
				els.editEngineUrl.value = engine.url;
				selectedEngineApi = engine.api || 'none';
			} else {
				els.editEngineName.value = '';
				els.editEngineUrl.value = '';
				selectedEngineApi = 'bing';
			}

			// 默认引擎的名称和 URL 不可编辑
			els.editEngineName.disabled = isDefault;
			els.editEngineUrl.disabled = isDefault;

			this.updateCustomSelect(els.editEngineApiWrapper, selectedEngineApi);
			els.engineEditorDialog.showModal();
		},

		/**
		 * 保存从编辑器中修改或新增的搜索引擎。
		 */
		saveEngineFromEditor() {
			const name = els.editEngineName.value.trim();
			let url = els.editEngineUrl.value.trim();
			const api = selectedEngineApi;

			if (editingEngineId !== 'default' && (!name || !url)) {
				alert(localization.translate('msgIncomplete'));
				return;
			}

			if (url && !url.includes('://') && editingEngineId !== 'default') url = 'https://' + url;

			let icon = '';
			if (editingEngineId !== 'default') {
				try {
					const hostname = new URL(url).hostname;
					icon = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
				} catch (e) {
					console.warn("无法生成 favicon URL:", e);
				}
			}

			if (editingEngineId) { // 编辑模式
				const index = config.engines.findIndex(e => e.id === editingEngineId);
				if (index !== -1) {
					const existing = config.engines[index];
					config.engines[index] = {
						...existing,
						name: existing.id === 'default' ? existing.name : name,
						url: existing.id === 'default' ? existing.url : url,
						icon: existing.id === 'default' ? existing.icon : icon,
						api
					};
				}
			} else { // 新增模式
				const newEngine = { id: 'custom_' + Date.now(), name, url, icon, api };
				config.engines.push(newEngine);
				config.currentEngineId = newEngine.id;
			}
			configManager.save();
			this.renderAll();
			els.engineEditorDialog.close();
		},

		/**
		 * 显示搜索建议列表。
		 * @param {string[]} list - 建议文本的数组。
		 */
		showSuggestions(list) {
			if (!list || !Array.isArray(list) || list.length === 0) {
				this.hideSuggestions();
				return;
			}
			activeSuggestionIndex = -1;
			const fragment = document.createDocumentFragment();
			list.forEach((text, index) => {
				const div = document.createElement('div');
				div.className = 'suggestion-item';
				div.setAttribute('role', 'option');
				div.dataset.index = index;
				div.innerHTML = `<svg class="suggestion-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg><span></span>`;
				div.querySelector('span').textContent = text;
				div.addEventListener('click', () => {
					els.searchInput.value = text;
					main.performSearch(text);
				});
				fragment.appendChild(div);
			});
			els.searchSuggestions.innerHTML = '';
			els.searchSuggestions.appendChild(fragment);
			els.searchSuggestions.style.display = 'flex';
		},

		/**
		 * 隐藏搜索建议列表。
		 */
		hideSuggestions() {
			if (els.searchSuggestions.style.display === 'none') return;
			els.searchSuggestions.style.display = 'none';
			activeSuggestionIndex = -1;
		},

		/**
		 * 隐藏搜索引擎选择下拉菜单。
		 */
		hideDropdown() {
			if (!els.engineDropdown.classList.contains('show')) return;
			els.engineDropdown.classList.remove('show');
			els.engineSelectorBtn.setAttribute('aria-expanded', 'false');
		},

		/**
		 * 切换搜索引擎选择下拉菜单的显示/隐藏状态。
		 * @param {Event} e - 事件对象。
		 */
		toggleDropdown(e) {
			e.stopPropagation();
			const isShown = els.engineDropdown.classList.toggle('show');
			els.engineSelectorBtn.setAttribute('aria-expanded', isShown);
			if (isShown) this.hideSuggestions();
		},

		/**
		 * 从 IndexedDB 加载并显示壁纸。
		 */
		async loadWallpaper() {
			try {
				const blob = await dbHelper.get();
				if (blob) {
					// 先释放旧的 URL
					if (this.lastWallpaperUrl) {
						URL.revokeObjectURL(this.lastWallpaperUrl);
						this.lastWallpaperUrl = null;
					}
					const url = URL.createObjectURL(blob);
					this.lastWallpaperUrl = url;

					els.wallpaperLayer.style.backgroundImage = `url(${url})`;
					els.wallpaperLayer.style.opacity = '1';
					els.wallpaperOverlay.style.opacity = '1';
				} else {
					els.wallpaperLayer.style.opacity = '0';
					els.wallpaperOverlay.style.opacity = '0';
				}
			} catch (e) {
				console.error("加载壁纸失败:", e);
				els.wallpaperLayer.style.opacity = '0';
				els.wallpaperOverlay.style.opacity = '0';
			}
		},

		/**
		 * 处理用户上传壁纸的事件。
		 * @param {Event} e - change 事件对象。
		 */
		async onBgUpload(e) {
			const file = e.target.files?.[0];
			if (file) {
				await dbHelper.save(file);
				config.bgSource = 'custom';
				configManager.save();
				await uiManager.loadWallpaper();
				uiManager.updateWallpaperButtonsState();
			}
		},

		/**
		 * 处理删除壁纸的事件。
		 */
		async onBgDelete() {
			if (!uiManager.lastWallpaperUrl) return;// 如果没有已加载的壁纸，则直接返回，不执行任何操作
			if (confirm(localization.translate('msgDelWallpaper'))) {
				await dbHelper.delete();
				config.bgSource = 'custom';
				configManager.save();
				if (uiManager.lastWallpaperUrl) {
					URL.revokeObjectURL(uiManager.lastWallpaperUrl);
					uiManager.lastWallpaperUrl = null;
				}
				// 强制移除类名和清空样式
				els.wallpaperLayer.style.backgroundImage = '';
				els.wallpaperLayer.style.opacity = '0';
				els.wallpaperOverlay.style.opacity = '0';

				uiManager.updateWallpaperButtonsState();
			}
		}
	};


	// =================================================================================
	// --- 模块 5: 搜索建议服务 ---
	// 负责从各种 API 获取搜索建议。
	// =================================================================================
	const suggestionService = {
		apis: {
			google: { url: q => `https://www.google.com/complete/search?client=firefox&q=${q}`, parser: json => json[1] },
			bing: { url: q => `https://www.bing.com/osjson.aspx?query=${q}`, parser: json => json[1] },
			baidu: { url: q => `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&wd=${q}`, parser: json => json.g?.map(item => item.q) || [] },
			duckduckgo: { url: q => `https://duckduckgo.com/ac/?q=${q}&type=list`, parser: json => json[1] },
			yandex: { url: q => `https://yandex.com/suggest/suggest-ya.cgi?part=${q}&v=4`, parser: json => json[1] },
			brave: { url: q => `https://search.brave.com/api/suggest?q=${q}`, parser: json => json[1] }
		},

		/**
		 * 根据当前搜索引擎和查询词获取搜索建议。
		 * @param {string} query - 用户输入的查询词。
		 */
		async fetch(query) {
			const engine = configManager.getCurrentEngine();
			const apiConfig = this.apis[engine.api];
			if (!apiConfig || engine.api === 'none') return uiManager.hideSuggestions();

			try {
				const encodedQuery = encodeURIComponent(query);
				const url = apiConfig.url(encodedQuery, engine.url);
				const response = await fetch(url);
				if (!response.ok) throw new Error(`HTTP 错误! 状态: ${response.status}`);
				const data = await response.json();
				const list = apiConfig.parser(data);
				if (els.searchInput.value.trim() !== query) return;// 如果当前输入框的值与发起请求时的查询词不一致，说明数据已过期，丢弃结果
				uiManager.showSuggestions(list);
			} catch (error) {
				console.error("搜索建议获取失败:", error);
				uiManager.hideSuggestions();
			}
		}
	};


	// =================================================================================
	// --- 模块 6: 事件绑定器 ---
	// 集中处理所有事件监听器的绑定和回调。
	// =================================================================================
	const eventBinder = {
		/**
		 * 绑定所有应用程序所需的事件监听器。
		 */
		bindAll() {
			els.searchForm.addEventListener('submit', this.onSearchSubmit);
			els.searchInput.addEventListener('input', this.onSearchInput);
			els.searchInput.addEventListener('keydown', this.onSearchKeyDown);

			els.engineSelectorBtn.addEventListener('click', (e) => uiManager.toggleDropdown(e));
			els.settingsBtn.addEventListener('click', this.onSettingsOpen);
			els.closeSettingsBtn.addEventListener('click', () => els.settingsDialog.close());
			els.settingsDialog.addEventListener('click', e => { if (e.target === els.settingsDialog) els.settingsDialog.close(); });

			els.showAddEngineForm.addEventListener('click', () => uiManager.openEngineEditor());
			els.engineList.addEventListener('click', (e) => uiManager.handleEngineAction(e));
			els.engineDropdown.addEventListener('click', this.onEngineDropdownClick);
			els.engineList.addEventListener('dragover', this.onEngineDragOver);

			els.saveEditEngine.addEventListener('click', () => uiManager.saveEngineFromEditor());
			els.cancelEditEngine.addEventListener('click', () => els.engineEditorDialog.close());
			els.engineEditorDialog.addEventListener('click', e => { if (e.target === els.engineEditorDialog) els.engineEditorDialog.close(); });

			els.opacitySlider.addEventListener('input', this.onOpacityInput);
			els.opacitySlider.addEventListener('change', this.onOpacitySave);

			els.bgUpload.addEventListener('change', uiManager.onBgUpload);
			els.bgBingCN.addEventListener('click', () => uiManager.fetchBingWallpaper('zh-CN'));
			els.bgBingGlobal.addEventListener('click', () => uiManager.fetchBingWallpaper('en-US'));
			els.bgDelete.addEventListener('click', uiManager.onBgDelete);

			this.setupCustomSelect(els.langSelectWrapper, this.onLangChange);
			this.setupCustomSelect(els.themeSelectWrapper, this.onThemeChange);
			this.setupCustomSelect(els.editEngineApiWrapper, this.onApiChange);
			this.setupTouchFeedback();

			document.addEventListener('click', this.onGlobalClick);
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.onSystemThemeChange);

			els.searchContainer.addEventListener('mouseenter', () => uiManager.preconnectToEngine(), { once: true });
			els.searchInput.addEventListener('focus', () => uiManager.preconnectToEngine(), { once: true });
		},

		onSearchSubmit(e) {
			e.preventDefault();
			const activeItem = els.searchSuggestions.querySelector('.suggestion-item.active');
			if (activeItem) {
				main.performSearch(activeItem.querySelector('span').textContent);
			} else {
				const val = els.searchInput.value.trim();
				if (val) main.performSearch(val);
			}
		},

		onSearchInput(e) {
			const val = e.target.value.trim();
			originalUserQuery = val;
			clearTimeout(suggestionDebounceTimer);
			uiManager.hideDropdown();
			if (!val) {
				uiManager.hideSuggestions();
				return;
			}
			suggestionDebounceTimer = setTimeout(() => suggestionService.fetch(val), 150);
		},

		onSearchKeyDown(e) {
			const suggestions = els.searchSuggestions.querySelectorAll('.suggestion-item');
			if (els.searchSuggestions.style.display === 'none' || suggestions.length === 0) return;

			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();

				if (activeSuggestionIndex > -1) {
					suggestions[activeSuggestionIndex].classList.remove('active');
				}

				if (e.key === 'ArrowDown') {
					activeSuggestionIndex = (activeSuggestionIndex + 1) % suggestions.length;
				} else { // ArrowUp
					activeSuggestionIndex = (activeSuggestionIndex - 1 + suggestions.length) % suggestions.length;
				}

				const newActiveItem = suggestions[activeSuggestionIndex];
				newActiveItem.classList.add('active');
				els.searchInput.value = newActiveItem.querySelector('span').textContent;
				newActiveItem.scrollIntoView({ block: 'nearest' });

			} else if (e.key === 'Escape') {
				uiManager.hideSuggestions();
				els.searchInput.value = originalUserQuery;
			} else if (e.key.length === 1 || e.key === 'Backspace') {
				if (activeSuggestionIndex > -1) {
					suggestions[activeSuggestionIndex].classList.remove('active');
					activeSuggestionIndex = -1;
				}
			}
		},

		onEngineDragOver(e) {
			e.preventDefault();
			const draggingItem = document.querySelector('.engine-list-item.dragging');
			if (!draggingItem) return;

			const siblings = [...els.engineList.querySelectorAll('.engine-list-item:not(.dragging):not(.fixed-item)')];

			const nextSibling = siblings.reduce((closest, child) => {
				const box = child.getBoundingClientRect();
				const offset = e.clientY - box.top - box.height / 2;
				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			}, { offset: Number.NEGATIVE_INFINITY }).element;

			if (nextSibling) {
				els.engineList.insertBefore(draggingItem, nextSibling);
			} else {
				els.engineList.appendChild(draggingItem);
			}
		},

		onEngineDropdownClick(e) {
			const option = e.target.closest('.engine-option');
			if (!option) return;

			config.currentEngineId = option.dataset.engineId;
			configManager.save();
			uiManager.renderAll();
			uiManager.hideDropdown();
			els.searchInput.focus();
			uiManager.preconnectToEngine();
		},

		onSettingsOpen() {
			uiManager.hideDropdown();
			uiManager.hideSuggestions();
			els.settingsDialog.showModal();
			uiManager.updateSlider(config.opacity);
		},

		onOpacityInput(e) {
			const val = Number(e.target.value);
			config.opacity = val;
			uiManager.updateSearchbarOpacity(val);
			uiManager.updateSlider(val);
		},

		onOpacitySave() {
			configManager.save();
		},

		onLangChange(value) { config.language = value; configManager.save(); uiManager.renderAll(); },
		onThemeChange(value) { config.theme = value; configManager.save(); uiManager.renderAll(); },
		onApiChange(value) { selectedEngineApi = value; uiManager.updateCustomSelect(els.editEngineApiWrapper, value); },
		onSystemThemeChange() { if (config.theme === 'system') uiManager.applyTheme(); },

		/**
		 * 处理全局点击事件，用于关闭打开的下拉菜单等。
		 */
		onGlobalClick(e) {
			if (!els.searchContainer.contains(e.target)) {
				uiManager.hideDropdown();
				uiManager.hideSuggestions();
			}
			document.querySelectorAll('.custom-select-wrapper.open').forEach(wrapper => {
				if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
			});
		},

		/**
		 * 设置自定义下拉框的行为。
		 * @param {HTMLElement} wrapper - 下拉框的包装器元素。
		 * @param {function(string): void} callback - 选中选项时的回调函数。
		 */
		setupCustomSelect(wrapper, callback) {
			if (!wrapper) return;
			const trigger = wrapper.querySelector('.custom-select-trigger');

			trigger.addEventListener('click', (e) => {
				e.stopPropagation();
				const isAlreadyOpen = wrapper.classList.contains('open');
				document.querySelectorAll('.custom-select-wrapper.open').forEach(openWrapper => {
					openWrapper.classList.remove('open');
				});
				if (!isAlreadyOpen) {
					wrapper.classList.add('open');
				}
			});

			wrapper.querySelectorAll('.custom-option').forEach(option => {
				option.addEventListener('click', () => {
					callback(option.dataset.value);
					wrapper.classList.remove('open');
				});
			});
		},

		/**
		 * 设置移动端触摸反馈，模拟:hover效果。
		 */
		setupTouchFeedback() {
			const interactiveSelector = '.md-btn, .icon-btn, .icon-btn-wrapper, .engine-option, .suggestion-item, .custom-select-trigger, .setting-action-row, .engine-list-item';
			let activeElement = null;

			document.addEventListener('touchstart', (e) => {
				const target = e.target.closest(interactiveSelector);
				if (target) {
					activeElement = target;
					activeElement.classList.add('touch-active');
				}
			}, { passive: true });

			document.addEventListener('touchend', () => {
				if (activeElement) {
					activeElement.classList.remove('touch-active');
					activeElement = null;
				}
			});

			document.addEventListener('touchcancel', () => {
				if (activeElement) {
					activeElement.classList.remove('touch-active');
					activeElement = null;
				}
			});
		}
	};


	// =================================================================================
	// --- 模块 7: 应用主控制器 ---
	// 初始化应用，并提供核心功能入口。
	// =================================================================================
	const main = {
		/**
		 * 应用程序的入口点。
		 */
		async init() {
			configManager.load();
			uiManager.renderAll();
			await uiManager.loadWallpaper();
			eventBinder.bindAll();
			this.checkAutoUpdateWallpaper();
			els.searchInput.focus();// 强制聚焦搜索框，提升用户体验
		},

		/**
		 * 检查是否需要自动更新 Bing 壁纸（例如日期变更时）。
		 */
		checkAutoUpdateWallpaper() {
			if (config.bgSource === 'custom') return;

			const today = new Date().toDateString();
			if (config.bgLastUpdate !== today) {
				console.log("检测到日期变更，尝试更新 Bing 壁纸...");
				const region = config.bgSource === 'bing-cn' ? 'zh-CN' : 'en-US';
				setTimeout(() => {
					uiManager.fetchBingWallpaper(region, true);
				}, 1000); // 延迟执行以避免影响初始加载
			}
		},

		/**
		 * 执行搜索。
		 * @param {string} text - 要搜索的文本。
		 */
		performSearch(text) {
			uiManager.hideSuggestions();
			const engine = configManager.getCurrentEngine();

			if (engine.id === 'default') {
				// 移动端直接跳转 Bing（因为移动端浏览器不支持 search API）
				if (isMobile) {
					window.location.href = 'https://www.bing.com/search?q=' + encodeURIComponent(text);
				}
				// 优先使用 Firefox 的 browser.search API
				else if (typeof browser !== 'undefined' && browser.search && browser.search.search) {
					browser.search.search({ query: text });
				}
				// 其次是 Chrome/Edge 的 chrome.search API
				else if (typeof chrome !== 'undefined' && chrome.search && chrome.search.query) {
					chrome.search.query({ text: text, disposition: 'CURRENT_TAB' })
						.catch(err => {
							console.error("Chrome search API failed. Fallback to Bing.", err);
							window.location.href = 'https://www.bing.com/search?q=' + encodeURIComponent(text);
						});
				}
				else {
					console.warn("Browser search API not available. Falling back to Bing.");
					window.location.href = 'https://www.bing.com/search?q=' + encodeURIComponent(text);
				}
			}
			else if (engine && engine.url) {
				window.location.href = engine.url + encodeURIComponent(text);
			}
		}
	};

	// 启动应用
	main.init();
});