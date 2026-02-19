/**
 * 공통 컴포넌트 로더
 * header.html과 footer.html을 동적으로 로드합니다.
 */

(function() {
    'use strict';

    /**
     * Preloader 숨기기
     */
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }

    /**
     * 컴포넌트를 로드하는 함수
     * @param {string} componentPath - 컴포넌트 파일 경로
     * @param {string} targetSelector - 삽입할 대상 요소 선택자
     * @param {Function} callback - 로드 완료 후 실행할 콜백 함수
     */
    function loadComponent(componentPath, targetSelector, callback) {
        const target = document.querySelector(targetSelector);
        if (!target) {
            console.warn(`대상 요소를 찾을 수 없습니다: ${targetSelector}`);
            return;
        }

        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                target.innerHTML = html;
                
                // 스크립트 실행을 위해 로드된 HTML 내의 스크립트를 실행
                const scripts = target.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });

                // 콜백 실행
                if (callback && typeof callback === 'function') {
                    callback();
                }
            })
            .catch(error => {
                console.error(`컴포넌트 로드 실패 (${componentPath}):`, error);
                // 에러 발생 시에도 preloader 숨기기
                setTimeout(hidePreloader, 1000);
            });
    }

    /**
     * 헤더 로드 및 초기화
     */
    function loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (!headerPlaceholder) {
            console.warn('header-placeholder 요소를 찾을 수 없습니다.');
            hidePreloader();
            return;
        }

        loadComponent('components/header.html', '#header-placeholder', function() {
            // 헤더 로드 후 실행할 초기화 코드
            initializeHeader();
            hidePreloader();
        });
    }

    /**
     * 푸터 로드
     */
    function loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (!footerPlaceholder) {
            console.warn('footer-placeholder 요소를 찾을 수 없습니다.');
            return;
        }

        loadComponent('components/footer.html', '#footer-placeholder', function() {
            // 푸터 로드 완료 후 preloader 숨기기 (헤더가 이미 로드된 경우)
            if (document.getElementById('header-placeholder') && 
                document.getElementById('header-placeholder').innerHTML.trim() !== '') {
                hidePreloader();
            }
        });
    }

    /**
     * 헤더 초기화 함수 (검색 기능 등)
     */
    function initializeHeader() {
        // Search functionality (top nav)
        const searchToggle = document.getElementById('searchToggle');
        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.getElementById('searchInput');
        const searchClose = document.getElementById('searchClose');
        const searchWrapper = document.querySelector('.search-wrapper');

        if (searchToggle && searchContainer && searchInput && searchClose && searchWrapper) {
            // 검색 아이콘 클릭 시 검색창 표시
            searchToggle.addEventListener('click', function() {
                searchWrapper.classList.add('active');
                searchContainer.classList.add('active');
                searchToggle.classList.add('active');
                setTimeout(() => {
                    searchInput.focus();
                }, 100);
            });

            // 닫기 버튼 클릭 시 검색창 숨김
            searchClose.addEventListener('click', function() {
                searchWrapper.classList.remove('active');
                searchContainer.classList.remove('active');
                searchToggle.classList.remove('active');
                searchInput.value = '';
            });

            // ESC 키로 검색창 닫기
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
                    searchWrapper.classList.remove('active');
                    searchContainer.classList.remove('active');
                    searchToggle.classList.remove('active');
                    searchInput.value = '';
                }
            });

            // 검색 입력 처리
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        alert('검색어: ' + query);
                    }
                }
            });
        }

        // Mobile menu toggle
        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', function() {
                const menu = document.getElementById('mainmenu');
                if (menu) {
                    menu.classList.toggle('show');
                }
            });
        }

        // Header scroll effect (메인 페이지에서만 적용)
        const isMainPage = document.querySelector('.carousel-slide') !== null;
        
        if (isMainPage) {
            // 메인 페이지: 스크롤에 따라 transparent 클래스 토글
            window.addEventListener('scroll', function() {
                const header = document.querySelector('header');
                if (header) {
                    if (window.scrollY > 100) {
                        header.classList.remove('transparent');
                    } else {
                        header.classList.add('transparent');
                    }
                }
            });
        } else {
            // 다른 페이지: transparent 클래스 제거하여 항상 배경 표시
            const header = document.querySelector('header');
            if (header) {
                header.classList.remove('transparent');
            }
        }
    }

    /**
     * Smooth scrolling 초기화
     */
    function initializeSmoothScroll() {
        // Smooth scrolling (only for anchor links, not external links)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // 메가 메뉴 내부의 링크는 제외
            if (!anchor.closest('.mega-menu')) {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });

        // 메가 메뉴 내부의 외부 링크가 정상 작동하도록 보장
        document.querySelectorAll('.mega-menu a[href]').forEach(link => {
            const href = link.getAttribute('href');
            // 외부 링크(menu.html 등)는 기본 동작 허용
            if (href && !href.startsWith('#')) {
                link.addEventListener('click', function(e) {
                    // 기본 링크 동작 허용 (다른 이벤트 리스너가 막지 않도록)
                    e.stopPropagation();
                });
            }
        });

        // 상단 네비게이션 바의 외부 링크가 정상 작동하도록 보장
        document.querySelectorAll('.top-nav-bar a[href]').forEach(link => {
            const href = link.getAttribute('href');
            // 외부 링크(login.html, join.html 등)는 기본 동작 허용
            if (href && !href.startsWith('#')) {
                link.addEventListener('click', function(e) {
                    // 기본 링크 동작 허용
                    e.stopPropagation();
                });
            }
        });
    }

    /**
     * 페이지 로드 완료 처리
     */
    function handlePageLoad() {
        // 컴포넌트 로드
        loadHeader();
        loadFooter();
        initializeSmoothScroll();
        
        // Preloader 숨기기 (최대 2초 후 강제로 숨김)
        setTimeout(() => {
            hidePreloader();
        }, 2000);
        
        // 모든 리소스 로드 완료 시 즉시 숨기기
        if (document.readyState === 'complete') {
            setTimeout(hidePreloader, 500);
        } else {
            window.addEventListener('load', () => {
                setTimeout(hidePreloader, 500);
            });
        }
    }

    // DOMContentLoaded 이벤트에서 컴포넌트 로드
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handlePageLoad);
    } else {
        // 이미 로드된 경우 즉시 실행
        handlePageLoad();
    }
})();

