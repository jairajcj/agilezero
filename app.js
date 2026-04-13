document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const emptyState = document.querySelector('.empty-state');
    const viewBtns = document.querySelectorAll('.view-btn');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const fontSelect = document.getElementById('font-select');
    const previewBtn = document.getElementById('preview-btn');
    const previewModal = document.getElementById('preview-modal');
    const closePreview = document.getElementById('close-preview');
    const previewFrame = document.getElementById('preview-frame');

    // State
    let blocks = [];

    // Component Templates
    const templates = {
        hero: `
            <div class="hero-tpl">
                <h1 contenteditable="true">Elevate Your Business with AeroZero</h1>
                <p contenteditable="true">The world's most intuitive no-code platform for high-growth teams. Launch your vision in minutes, not months.</p>
                <a href="#" class="cta">Get Started Free</a>
            </div>
        `,
        features: `
            <div class="features-tpl">
                <div class="feature-card">
                    <i class="fas fa-rocket"></i>
                    <h3 contenteditable="true">Lightning Fast</h3>
                    <p contenteditable="true">Optimized for speed and performance out of the box.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-shield-alt"></i>
                    <h3 contenteditable="true">Secure by Design</h3>
                    <p contenteditable="true">Enterprise-grade security for your digital assets.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-chart-line"></i>
                    <h3 contenteditable="true">Scalable Architecture</h3>
                    <p contenteditable="true">Built to grow as your business reaches new heights.</p>
                </div>
            </div>
        `,
        services: `
            <div class="services-tpl">
                <h2 contenteditable="true">Our Specialized Services</h2>
                <div class="service-list">
                    <div class="service-item">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <h4 contenteditable="true">Market Analysis</h4>
                            <p contenteditable="true">Deep dive into industry trends.</p>
                        </div>
                    </div>
                    <div class="service-item">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <h4 contenteditable="true">Brand Strategy</h4>
                            <p contenteditable="true">Crafting unique identities.</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
        testimonials: `
            <div class="testimonials-tpl">
                <div class="testimonial-grid">
                    <div class="testimonial-card">
                        <p contenteditable="true">"AeroZero transformed our workflow. We launched our MVP in 3 days!"</p>
                        <div class="testimonial-author">
                            <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" alt="User">
                            <div>
                                <strong contenteditable="true">John Doe</strong>
                                <span contenteditable="true" style="display:block; font-size:12px; color:#666">CEO, TechFlow</span>
                            </div>
                        </div>
                    </div>
                     <div class="testimonial-card">
                        <p contenteditable="true">"The aesthetics are unmatched. Best builder I've ever used."</p>
                        <div class="testimonial-author">
                             <img src="https://ui-avatars.com/api/?name=Jane+Smith&background=random" alt="User">
                            <div>
                                <strong contenteditable="true">Jane Smith</strong>
                                <span contenteditable="true" style="display:block; font-size:12px; color:#666">Founder, Creatively</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        contact: `
            <div class="contact-tpl">
                <h2 contenteditable="true" style="text-align:center; margin-bottom:30px">Connect With Us</h2>
                <div class="form-group">
                    <label>Your Name</label>
                    <input type="text" placeholder="John Wick">
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="john@example.com">
                </div>
                <div class="form-group">
                    <button>Send Message</button>
                </div>
            </div>
        `
    };

    // Initialize Drag and Drop
    const blockItems = document.querySelectorAll('.block-item');
    blockItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', item.dataset.type);
        });
        
        // Also allow clicking to add
        item.addEventListener('click', () => {
            addBlock(item.dataset.type);
        });
    });

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvas.classList.add('drag-over');
    });

    canvas.addEventListener('dragleave', () => {
        canvas.classList.remove('drag-over');
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.classList.remove('drag-over');
        const type = e.dataTransfer.getData('type');
        addBlock(type);
    });

    function addBlock(type) {
        if (templates[type]) {
            if (emptyState) emptyState.style.display = 'none';
            
            const blockWrapper = document.createElement('div');
            blockWrapper.className = 'canvas-block';
            blockWrapper.innerHTML = `
                ${templates[type]}
                <div class="block-actions">
                    <button class="action-btn move-up" title="Move Up"><i class="fas fa-chevron-up"></i></button>
                    <button class="action-btn move-down" title="Move Down"><i class="fas fa-chevron-down"></i></button>
                    <button class="action-btn delete-btn" title="Delete Block"><i class="fas fa-trash"></i></button>
                </div>
            `;

            // Action listeners
            blockWrapper.querySelector('.delete-btn').addEventListener('click', () => {
                blockWrapper.remove();
                if (canvas.children.length === 1 && canvas.children[0].classList.contains('empty-state')) {
                    emptyState.style.display = 'flex';
                }
            });

            blockWrapper.querySelector('.move-up').addEventListener('click', () => {
                const prev = blockWrapper.previousElementSibling;
                if (prev && !prev.classList.contains('empty-state')) {
                    canvas.insertBefore(blockWrapper, prev);
                }
            });

            blockWrapper.querySelector('.move-down').addEventListener('click', () => {
                const next = blockWrapper.nextElementSibling;
                if (next) {
                    canvas.insertBefore(next, blockWrapper);
                }
            });

            canvas.appendChild(blockWrapper);
            
            // Apply current global styles
            updateGlobalStyles();
        }
    }

    // View Controls
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            canvas.classList.remove('desktop-view', 'tablet-view', 'mobile-view');
            canvas.classList.add(`${btn.dataset.view}-view`);
        });
    });

    // Theme Customization
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            const primary = swatch.dataset.primary;
            const accent = swatch.dataset.accent;
            
            document.documentElement.style.setProperty('--accent-primary', primary);
            document.documentElement.style.setProperty('--accent-secondary', accent);
            document.documentElement.style.setProperty('--accent-glow', `rgba(${hexToRgb(primary)}, 0.3)`);
            
            updateGlobalStyles();
        });
    });

    fontSelect.addEventListener('change', () => {
        document.documentElement.style.setProperty('--font-heading', fontSelect.value);
        updateGlobalStyles();
    });

    function updateGlobalStyles() {
        const primary = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary');
        const headingFont = getComputedStyle(document.documentElement).getPropertyValue('--font-heading');
        
        // Apply to canvas elements
        const ctas = canvas.querySelectorAll('.cta');
        ctas.forEach(cta => cta.style.backgroundColor = primary);
        
        const icons = canvas.querySelectorAll('.feature-card i, .service-item i');
        icons.forEach(icon => icon.style.color = primary);
        
        const headings = canvas.querySelectorAll('h1, h2, h3, h4');
        headings.forEach(h => h.style.fontFamily = headingFont);
    }

    // Hex to RGB helper
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    }

    // Preview
    previewBtn.addEventListener('click', () => {
        const canvasClone = canvas.cloneNode(true);
        // Remove editing UI from clone
        canvasClone.querySelectorAll('.block-actions, .empty-state').forEach(el => el.remove());
        canvasClone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
        
        previewFrame.innerHTML = '';
        previewFrame.appendChild(canvasClone);
        
        // Ensure styles carry over
        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).map(s => s.outerHTML).join('');
        // We need to inject the CSS into the preview frame or it won't look right
        // For simplicity in this demo, we just append it to the body, but normally we'd isolate it
        
        previewModal.classList.add('active');
    });

    closePreview.addEventListener('click', () => {
        previewModal.classList.remove('active');
    });

    // Handle "Launch" / Export (Mock)
    document.getElementById('export-btn').addEventListener('click', () => {
        alert('Site published successfully! Your business is now live at aerozero.io/your-brand');
    });

});
