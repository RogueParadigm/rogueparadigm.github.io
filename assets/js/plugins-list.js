// Plugin List - Expand/Collapse Functionality
document.addEventListener('DOMContentLoaded', () => {
    const pluginItems = document.querySelectorAll('.plugin-item');
    
    pluginItems.forEach(item => {
        const header = item.querySelector('.plugin-header');
        
        header.addEventListener('click', (e) => {
            // Don't toggle if clicking on a link or button
            if (e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            
            // Close other expanded items (optional - comment out for multi-expand)
            pluginItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('expanded')) {
                    otherItem.classList.remove('expanded');
                }
            });
            
            // Toggle current item
            item.classList.toggle('expanded');
        });
    });
    
    // Optional: Expand first item by default
    if (pluginItems.length > 0) {
        pluginItems[0].classList.add('expanded');
    }
    
    // Optional: URL hash support (e.g., #plugin-genai)
    const hash = window.location.hash;
    if (hash) {
        const targetPlugin = document.querySelector(hash);
        if (targetPlugin && targetPlugin.classList.contains('plugin-item')) {
            targetPlugin.classList.add('expanded');
            targetPlugin.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});
