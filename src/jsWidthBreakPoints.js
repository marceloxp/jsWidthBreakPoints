class JsWidthBreakPoints {
    // Default settings
    static defaults = {
        widths: [],               // Array of breakpoints (e.g., [400, 600, 800])
        onBreakPoint: null,       // Callback executed when a breakpoint is reached
        applyClasses: true,       // Dynamically apply CSS classes
        classPrefix: 'width-',    // Prefix for CSS classes
    };

    // Initialize the library
    static init(options = {}) {
        // Merge default options with user-provided options
        this.options = { ...this.defaults, ...options };

        // Sort breakpoints in descending order
        this.breakpoints = this.options.widths.sort((a, b) => b - a);

        // Get the current window width
        this.currentWidth = this.getWindowWidth();

        // Store the current class name
        this.currentClass = null;

        // Set up the window resize listener
        this.setupEventListeners();

        // Check and apply breakpoints immediately
        this.checkBreakPoints(true); // Pass `true` to force callback execution
    }

    // Get the current window width
    static getWindowWidth() {
        return window.innerWidth; // Use window.innerWidth directly
    }

    // Set up the window resize listener
    static setupEventListeners() {
        window.addEventListener('resize', () => {
            this.checkBreakPoints();
        });
    }

    // Check breakpoints and execute actions
    static checkBreakPoints(forceCallback = false) {
        const newWidth = this.getWindowWidth();

        // Check if the width has changed or if the callback should be forced
        if (newWidth !== this.currentWidth || forceCallback) {
            this.currentWidth = newWidth;
            const breakpoint = this.getCurrentBreakpoint();

            // Apply CSS classes if enabled
            if (this.options.applyClasses) {
                // Check if the breakpoint has changed
                if (breakpoint !== this.currentClass) {
                    const oldBreakpoint = this.currentClass;
                    this.currentClass = breakpoint;

                    // Execute the callback if defined
                    if (typeof this.options.onBreakPoint === 'function') {
                        this.options.onBreakPoint({
                            oldBreakpoint: oldBreakpoint || '',
                            currentWidth: this.currentWidth,
                            currentBreakpoint: breakpoint,
                        });
                    }

                    // Apply CSS classes based on the breakpoint
                    this.applyBreakpointClasses(breakpoint);
                }
            }
        }
    }

    // Get the current breakpoint
    static getCurrentBreakpoint() {
        if (this.currentWidth <= this.breakpoints[this.breakpoints.length - 1]) {
            return `lt${this.breakpoints[this.breakpoints.length - 1]}`;
        } else if (this.currentWidth >= this.breakpoints[0]) {
            return `gt${this.breakpoints[0]}`;
        } else {
            for (let i = 0; i < this.breakpoints.length; i++) {
                if (this.currentWidth >= this.breakpoints[i]) {
                    return `b${this.breakpoints[i]}a${this.breakpoints[i - 1]}`;
                }
            }
        }
        return null;
    }

    // Apply CSS classes based on the breakpoint
    static applyBreakpointClasses(breakpoint) {
        const body = document.body;
        const classPrefix = this.options.classPrefix;

        // Remove old classes
        body.classList.remove(
            ...Array.from(body.classList).filter((cls) => cls.startsWith(classPrefix))
        );

        // Add the new class
        if (breakpoint) {
            body.classList.add(`${classPrefix}${breakpoint}`);
        }
    }
}

// Expose the class globally
window.JsWidthBreakPoints = JsWidthBreakPoints;