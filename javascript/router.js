document.addEventListener('DOMContentLoaded', () => {
    // Router configuration
    const routes = {
        '/': 'home',
        '/home': 'home',
        '/about': 'about',
        '/products': 'products',
        '/contact': 'contact'
    };

    // Get the app container where views will be rendered
    const appDiv = document.getElementById('app');

    // Navigation click handler
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = link.getAttribute('href');
            navigateTo(path);
        });
    });

    // Handle navigation
    const navigateTo = async (path) => {
        // Update browser history
        window.history.pushState({}, '', path);
        
        // Render the appropriate view
        await loadView(path);
    };

    // Load and render view
    const loadView = async (path) => {
        // Get the view name from routes or use 404
        const viewName = routes[path] || '404';
        
        try {
            // Fetch the HTML content
            const response = await fetch(`/public/views/${viewName}.html`);
            
            if (response.ok) {
                const html = await response.text();
                
                // Extract the content inside the body tag if it's a full HTML document
                const bodyContent = extractBodyContent(html);
                appDiv.innerHTML = bodyContent;
                
                // Set page title
                if (viewName === 'home') {
                    document.title = 'Lucenex - Home';
                } else if (viewName === '404') {
                    document.title = '404 - Page Not Found';
                } else {
                    // Try to extract title from the HTML or capitalize the view name
                    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
                    document.title = titleMatch ? titleMatch[1] : `Lucenex - ${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`;
                }
            } else {
                // If view not found, load 404 page
                const notFoundResponse = await fetch('/public/views/404.html');
                if (notFoundResponse.ok) {
                    const notFoundHtml = await notFoundResponse.text();
                    appDiv.innerHTML = extractBodyContent(notFoundHtml);
                    document.title = '404 - Page Not Found';
                } else {
                    appDiv.innerHTML = '<h1>404 - Page Not Found</h1><p>Sorry, the page you are looking for does not exist.</p>';
                    document.title = '404 - Page Not Found';
                }
            }
        } catch (error) {
            console.error('Failed to load view:', error);
            appDiv.innerHTML = '<p>Error loading page content</p>';
        }
    };

    // Helper function to extract content from body tag
    function extractBodyContent(html) {
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        return bodyMatch ? bodyMatch[1].trim() : html;
    }

    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        loadView(window.location.pathname);
    });

    // Initial page load
    loadView(window.location.pathname);
});