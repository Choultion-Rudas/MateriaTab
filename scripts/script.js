/**
 * @file M3 New Tab Page Script
 * @description 处理新标签页的所有逻辑，包括设置、搜索、UI渲染和壁纸管理。
 * @version 1.3.0
 */

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
		{ id: 'wikipedia', name: 'Wikipedia', url: 'https://zh.wikipedia.org/wiki/', icon: 'https://zh.wikipedia.org/static/favicon/wikipedia.ico', api: 'wikipedia' }
	];

	const TRANSLATIONS = {
		zh: {
			pageTitle: "新标签页", settingsTitle: "设置", secEngine: "搜索引擎", btnAddEngine: "添加搜索引擎", secAppearance: "外观", lblLang: "语言", descLang: "界面显示语言", optSystem: "跟随系统", lblTheme: "主题", descTheme: "选择浅色或深色主题", optLight: "浅色", optDark: "深色", lblOpacity: "搜索栏不透明度", lblWallpaper: "背景图片", descWallpaper: "支持常见图片格式 (如 JPEG, PNG, WebP)", btnUpload: "上传图片", btnDelete: "删除图片", btnBingCN: "Bing 国内版壁纸", btnBingGlobal: "Bing 国际版壁纸", titleAddEngine: "添加搜索引擎", titleEditEngine: "编辑搜索引擎", lblEngineName: "名称", lblEngineUrl: "搜索 URL", lblEngineApi: "搜索建议源", optNone: "无建议", btnCancel: "取消", btnSave: "保存", engDefault: "浏览器默认", descDefaultEngine: "浏览器默认搜索引擎"
		},
		en: {
			pageTitle: "New Tab", settingsTitle: "Settings", secEngine: "Search Engines", btnAddEngine: "Add Search Engine", secAppearance: "Appearance", lblLang: "Language", descLang: "Interface language", optSystem: "System", lblTheme: "Theme", descTheme: "Choose a light or dark theme", optLight: "Light", optDark: "Dark", lblOpacity: "Search Bar Opacity", lblWallpaper: "Wallpaper", descWallpaper: "Supports common formats (e.g., JPEG, PNG, WebP)", btnUpload: "Upload Image", btnDelete: "Delete Image", btnBingCN: "Bing CN Wallpaper", btnBingGlobal: "Bing Global Wallpaper", titleAddEngine: "Add Engine", titleEditEngine: "Edit Engine", lblEngineName: "Name", lblEngineUrl: "Search URL", lblEngineApi: "Suggestion Source", optNone: "None", btnCancel: "Cancel", btnSave: "Save", engDefault: "Browser Default", descDefaultEngine: "Browser default search engine"
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
	 * @namespace configManager
	 * @description 管理应用配置的加载、保存和获取。使用 localStorage 进行持久化。
	 */
	const configManager = {
		defaultConfig: {
			engines: JSON.parse(JSON.stringify(PRESET_ENGINES)), // 深拷贝预设引擎
			currentEngineId: 'default', // 默认使用浏览器引擎
			theme: 'system',
			language: 'system',
			opacity: 90,
			// --- 壁纸状态 ---
			bgSource: 'custom', // 'custom', 'bing-cn', 'bing-global'
			bgLastUpdate: ''    // 'YYYY-MM-DD'
		},

		/**
		 * 从 localStorage 加载配置。如果失败或无配置，则使用默认配置。
		 */
		load() {
			try {
				const savedConfig = localStorage.getItem('m3_config');
				const parsed = savedConfig ? JSON.parse(savedConfig) : {};
				config = { ...this.defaultConfig, ...parsed };

				// 数据校验与修复
				if (!config.engines || !Array.isArray(config.engines) || config.engines.length === 0) {
					config.engines = JSON.parse(JSON.stringify(PRESET_ENGINES));
				}
				// 确保 'default' 引擎始终存在且在首位
				const defaultEngine = config.engines.find(e => e.id === 'default');
				if (!defaultEngine) {
					config.engines.unshift(PRESET_ENGINES[0]);
				} else if (config.engines[0].id !== 'default') {
					config.engines = [defaultEngine, ...config.engines.filter(e => e.id !== 'default')];
				}

				if (typeof config.opacity !== 'number' || config.opacity < 20 || config.opacity > 100) {
					config.opacity = this.defaultConfig.opacity;
				}

			} catch (error) {
				console.error("加载配置失败，将使用默认配置:", error);
				config = { ...this.defaultConfig };
			}
		},

		save() {
			try {
				localStorage.setItem('m3_config', JSON.stringify(config));
			} catch (error) {
				console.error("保存配置失败:", error);
			}
		},

		getCurrentEngine() {
			return config.engines.find(e => e.id === config.currentEngineId) || config.engines[0];
		}
	};

	/**
	 * @namespace dbHelper
	 * @description IndexedDB 的封装，用于高效存储和读取壁纸图片 (Blob)。
	 */
	const dbHelper = {
		dbName: 'M3NewTabDB',
		storeName: 'wallpapers',
		db: null,

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

		async save(file) {
			return this._transaction('readwrite', store => store.put(file, 'bgImage'));
		},

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

		async delete() {
			return this._transaction('readwrite', store => store.delete('bgImage'));
		}
	};

	/**
	 * @namespace localization
	 * @description 处理国际化 (i18n)。
	 */
	const localization = {
		getEffectiveLang() {
			if (config.language === 'system') {
				return navigator.language.startsWith('zh') ? 'zh' : 'en';
			}
			return config.language;
		},

		translate(key) {
			const lang = this.getEffectiveLang();
			return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key];
		},

		apply() {
			const lang = this.getEffectiveLang();
			const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

			document.title = t.pageTitle;
			document.querySelectorAll('[data-i18n]').forEach(el => {
				const key = el.dataset.i18n;
				if (t[key]) el.textContent = t[key];
			});

			this.updateSelectTriggerText(els.langSelectWrapper);
			this.updateSelectTriggerText(els.themeSelectWrapper);
			this.updateSelectTriggerText(els.editEngineApiWrapper);
		},

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

		applyTheme() {
			let theme = config.theme;
			if (theme === 'system') {
				theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			}
			els.root.setAttribute('data-theme', theme);
		},

		updateSearchbarOpacity(value) {
			els.searchContainer.style.opacity = value / 100;
		},

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
		 * 获取 Bing 壁纸 (优先尝试 4K)
		 * @param {'zh-CN' | 'en-US'} region 
		 * @param {boolean} isSilent 是否静默模式 (自动更新时为 true)
		 */
		async fetchBingWallpaper(region, isSilent = false) {
			const btn = region === 'zh-CN' ? els.bgBingCN : els.bgBingGlobal;
			if (!isSilent && btn) btn.disabled = true;

			try {
				const domain = 'https://www.bing.com';
				const jsonUrl = `${domain}/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=${region}`;

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时

				const res = await fetch(jsonUrl, { signal: controller.signal });
				clearTimeout(timeoutId);

				if (!res.ok) throw new Error('Network error');
				const data = await res.json();

				if (data.images && data.images.length > 0) {
					const imgInfo = data.images[0];
					const urlBase = imgInfo.urlbase;

					// 构造 4K UHD URL
					const uhdUrl = `${domain}${urlBase}_UHD.jpg`;
					// 构造 1080P 回退 URL (data.images[0].url 可能不带域名)
					const fallbackUrl = `${domain}${imgInfo.url}`;

					let blob;
					try {
						// 尝试下载 4K
						const imgRes = await fetch(uhdUrl, { cache: 'no-cache' });
						if (imgRes.ok) {
							blob = await imgRes.blob();
						} else {
							throw new Error('UHD not available');
						}
					} catch (e) {
						// 4K 下载失败，回退到 1080P
						console.log("UHD download failed, falling back to standard resolution.");
						const fallbackRes = await fetch(fallbackUrl, { cache: 'no-cache' });
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
					alert('获取 Bing 壁纸失败。请检查网络或稍后再试。');
				}
			} finally {
				if (!isSilent && btn) btn.disabled = false;
			}
		},

		updateWallpaperButtonsState() {
			els.bgBingCN.classList.toggle('active-source', config.bgSource === 'bing-cn');
			els.bgBingGlobal.classList.toggle('active-source', config.bgSource === 'bing-global');
		},

		renderEngineDropdown() {
			const fragment = document.createDocumentFragment();
			config.engines.forEach(eng => {
				const isSelected = eng.id === config.currentEngineId;
				const div = document.createElement('div');
				div.className = `engine-option ${isSelected ? 'selected' : ''}`;
				div.setAttribute('role', 'option');
				div.dataset.engineId = eng.id;
				if (isSelected) div.setAttribute('aria-selected', 'true');

				// 如果是默认引擎，使用翻译后的名称；否则使用配置中的名称
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

		renderEngineSettingsList() {
			const fragment = document.createDocumentFragment();
			// 只要引擎列表大于1，删除按钮就可用（除了默认引擎）
			const isOnlyOneEngine = config.engines.length <= 1;

			config.engines.forEach((eng) => {
				const isDefault = eng.id === 'default';
				const item = document.createElement('div');
				item.className = 'engine-list-item';
				if (isDefault) {
					item.classList.add('fixed-item');
				} else {
					item.setAttribute('draggable', 'true');
				}
				item.dataset.id = eng.id;
				item.setAttribute('role', 'option');

				if (eng.id === config.currentEngineId) item.classList.add('selected');

				// 获取翻译后的名称和描述
				const displayName = isDefault ? localization.translate('engDefault') : eng.name;
				const desc = isDefault ? localization.translate('descDefaultEngine') : eng.url;

				item.innerHTML = `
                    <div class="engine-list-info">
                        <div class="engine-name">${displayName}</div>
                        <div class="setting-desc">${desc}</div>
                    </div>
                    <div class="engine-actions">
                        <button class="icon-btn small edit-btn" title="编辑" data-action="edit">
                            <svg class="md-icon" style="width:18px;height:18px" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="icon-btn small delete-btn" title="删除" data-action="delete" ${isOnlyOneEngine || isDefault ? 'disabled' : ''}>
                            <svg class="md-icon" style="width:18px;height:18px" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                    <div class="drag-handle">
                        <svg class="md-icon" style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"/></svg>
                    </div>`;

				if (!isDefault) {
					item.addEventListener('dragstart', () => item.classList.add('dragging'));
					item.addEventListener('dragend', () => {
						item.classList.remove('dragging');
						this.updateEngineOrderFromDOM();
					});
				}

				fragment.appendChild(item);
			});

			els.engineList.innerHTML = '';
			els.engineList.appendChild(fragment);
		},

		updateEngineOrderFromDOM() {
			const newOrderIds = [...els.engineList.querySelectorAll('.engine-list-item')].map(item => item.dataset.id);
			config.engines = newOrderIds.map(id => config.engines.find(e => e.id === id)).filter(Boolean);
			configManager.save();
			this.renderEngineDropdown();
		},

		handleEngineAction(e) {
			const listItem = e.target.closest('.engine-list-item');
			if (!listItem) return;

			const engineId = listItem.dataset.id;
			const engine = config.engines.find(e => e.id === engineId);
			if (!engine) return;

			const action = e.target.closest('[data-action]')?.dataset.action;

			if (action === 'edit') {
				this.openEngineEditor(engine);
			} else if (action === 'delete') {
				if (engineId !== 'default' && config.engines.length > 1) this.deleteEngine(engine);
			} else {
				config.currentEngineId = engineId;
				configManager.save();
				this.renderAll();
			}
		},

		deleteEngine(engineToDelete) {
			if (confirm(`确定要删除 “${engineToDelete.name}” 吗?`)) {
				config.engines = config.engines.filter(e => e.id !== engineToDelete.id);
				if (config.currentEngineId === engineToDelete.id) {
					config.currentEngineId = config.engines[0]?.id;
				}
				configManager.save();
				this.renderAll();
			}
		},

		updateCustomSelect(wrapper, value) {
			if (!wrapper) return;
			wrapper.querySelectorAll('.custom-option').forEach(opt => {
				opt.classList.toggle('selected', opt.dataset.value === value);
			});
			localization.updateSelectTriggerText(wrapper);
		},

		updateSlider(value) {
			els.opacitySlider.value = value;
			els.opacitySliderWrapper.style.setProperty('--value', value + '%');
			els.opacityValueFilled.textContent = `${value}%`;
			els.opacityValueEmpty.textContent = `${value}%`;

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
		},

		openEngineEditor(engine = null) {
			editingEngineId = engine ? engine.id : null;
			els.engineEditorTitle.textContent = engine ? localization.translate('titleEditEngine') : localization.translate('titleAddEngine');

			const isDefault = engine && engine.id === 'default';

			if (engine) {
				// 如果是默认引擎，使用翻译后的名称填充输入框；否则使用存储的名称
				els.editEngineName.value = isDefault ? localization.translate('engDefault') : engine.name;
				els.editEngineUrl.value = engine.url;
				selectedEngineApi = engine.api || 'none';
			} else {
				els.editEngineName.value = '';
				els.editEngineUrl.value = '';
				selectedEngineApi = 'bing';
			}

			// 如果是默认引擎，禁用名称和URL编辑，只允许改搜索源
			els.editEngineName.disabled = isDefault;
			els.editEngineUrl.disabled = isDefault;

			this.updateCustomSelect(els.editEngineApiWrapper, selectedEngineApi);
			els.engineEditorDialog.showModal();
		},

		saveEngineFromEditor() {
			const name = els.editEngineName.value.trim();
			let url = els.editEngineUrl.value.trim();
			const api = selectedEngineApi;

			if (editingEngineId !== 'default' && (!name || !url)) {
				alert('请完整填写名称和搜索 URL');
				return;
			}

			if (url && !url.includes('://') && editingEngineId !== 'default') url = 'https://' + url;

			let icon = 'favicon/icon48.png';
			if (editingEngineId !== 'default') {
				try { icon = new URL(url).origin + '/favicon.ico'; } catch (e) { }
			} else {
				icon = '';
			}

			if (editingEngineId) {
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
			} else {
				const newEngine = { id: 'custom_' + Date.now(), name, url, icon, api };
				config.engines.push(newEngine);
				config.currentEngineId = newEngine.id;
			}
			configManager.save();
			this.renderAll();
			els.engineEditorDialog.close();
		},

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

		hideSuggestions() {
			if (els.searchSuggestions.style.display === 'none') return;
			els.searchSuggestions.style.display = 'none';
			activeSuggestionIndex = -1;
		},

		hideDropdown() {
			if (!els.engineDropdown.classList.contains('show')) return;
			els.engineDropdown.classList.remove('show');
			els.engineSelectorBtn.setAttribute('aria-expanded', 'false');
		},

		toggleDropdown(e) {
			e.stopPropagation();
			const isShown = els.engineDropdown.classList.toggle('show');
			els.engineSelectorBtn.setAttribute('aria-expanded', isShown);
			if (isShown) this.hideSuggestions();
		},

		async loadWallpaper() {
			try {
				const blob = await dbHelper.get();
				if (blob) {
					const url = URL.createObjectURL(blob);
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

		async onBgDelete() {
			if (confirm(localization.translate('btnDelete') + ' ' + localization.translate('lblWallpaper') + '?')) {
				await dbHelper.delete();
				// 关键修复：删除后重置源，防止自动更新逻辑再次拉取
				config.bgSource = 'custom';
				configManager.save();
				await uiManager.loadWallpaper();
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
			wikipedia: {
				url: (q, engineUrl) => {
					let lang = 'zh';
					try {
						const match = new URL(engineUrl).hostname.match(/^([a-z]{2,3}(?:-[a-z]+)?)\.wikipedia\.org$/);
						if (match && match[1]) lang = match[1];
					} catch (e) { }
					return `https://${lang}.wikipedia.org/w/api.php?action=opensearch&format=json&search=${q}&origin=*`;
				},
				parser: json => json[1]
			}
		},

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

			els.opacitySlider.addEventListener('input', this.onOpacityChange);
			els.bgUpload.addEventListener('change', uiManager.onBgUpload);
			els.bgBingCN.addEventListener('click', () => uiManager.fetchBingWallpaper('zh-CN'));
			els.bgBingGlobal.addEventListener('click', () => uiManager.fetchBingWallpaper('en-US'));
			els.bgDelete.addEventListener('click', uiManager.onBgDelete);

			this.setupCustomSelect(els.langSelectWrapper, this.onLangChange);
			this.setupCustomSelect(els.themeSelectWrapper, this.onThemeChange);
			this.setupCustomSelect(els.editEngineApiWrapper, this.onApiChange);

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
					if (activeSuggestionIndex < suggestions.length - 1) {
						activeSuggestionIndex++;
					}
				} else {
					if (activeSuggestionIndex > -1) {
						activeSuggestionIndex--;
					}
				}

				if (activeSuggestionIndex > -1) {
					const newActiveItem = suggestions[activeSuggestionIndex];
					newActiveItem.classList.add('active');
					els.searchInput.value = newActiveItem.querySelector('span').textContent;
					newActiveItem.scrollIntoView({ block: 'nearest' });
				} else {
					els.searchInput.value = originalUserQuery;
				}

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

			// 排除不可拖拽的默认引擎
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
		onOpacityChange(e) {
			const val = e.target.value;
			config.opacity = val;
			uiManager.updateSearchbarOpacity(val);
			uiManager.updateSlider(val);
			configManager.save();
		},
		onLangChange(value) { config.language = value; configManager.save(); uiManager.renderAll(); },
		onThemeChange(value) { config.theme = value; configManager.save(); uiManager.renderAll(); },
		onApiChange(value) { selectedEngineApi = value; uiManager.updateCustomSelect(els.editEngineApiWrapper, value); },
		onSystemThemeChange() { if (config.theme === 'system') uiManager.applyTheme(); },

		onGlobalClick(e) {
			if (!els.searchContainer.contains(e.target)) {
				uiManager.hideDropdown();
				uiManager.hideSuggestions();
			}
			document.querySelectorAll('.custom-select-wrapper.open').forEach(wrapper => {
				if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
			});
		},

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
		}
	};


	// =================================================================================
	// --- 模块 7: 应用主控制器 ---
	// 初始化应用，并提供核心功能入口。
	// =================================================================================
	const main = {
		async init() {
			configManager.load();
			uiManager.renderAll();
			await uiManager.loadWallpaper();
			uiManager.updateWallpaperButtonsState();
			eventBinder.bindAll();

			this.checkAutoUpdateWallpaper();
		},

		checkAutoUpdateWallpaper() {
			if (config.bgSource === 'custom') return;

			const today = new Date().toDateString();
			if (config.bgLastUpdate !== today) {
				console.log("检测到日期变更，尝试更新 Bing 壁纸...");
				const region = config.bgSource === 'bing-cn' ? 'zh-CN' : 'en-US';
				setTimeout(() => {
					uiManager.fetchBingWallpaper(region, true);
				}, 1000);
			}
		},

		performSearch(text) {
			uiManager.hideSuggestions();
			const engine = configManager.getCurrentEngine();

			// 修复回车无效的核心逻辑
			if (engine.id === 'default') {
				// 优先检测 Firefox (支持 browser.search)
				if (typeof browser !== 'undefined' && browser.search && browser.search.search) {
					browser.search.search({ query: text });
				}
				// 其次检测 Chrome/Edge (支持 chrome.search, 需 permissions: search)
				else if (typeof chrome !== 'undefined' && chrome.search && chrome.search.query) {
					chrome.search.query({ text: text, disposition: 'CURRENT_TAB' })
						.catch(err => console.error("Chrome search API failed:", err));
				}
				else {
					alert('无法调用默认搜索引擎，请检查 manifest 权限配置。');
				}
			}
			else if (engine) {
				window.location.href = engine.url + encodeURIComponent(text);
			}
		}
	};

	main.init();
});