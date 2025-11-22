import React, { useState, useEffect } from 'react';

import {
    Boxes,
    BarChart3,
    Clock,
    Users,
    Bell,
    FileText,
    ArrowUpDown,
    Sun,
    Moon,
    Package,
    Building2,
    AlertCircle,
    Upload,
    Download,
    Shield
} from 'lucide-react';
import Login from './Login';
import { Route } from 'react-router-dom';

export default function StockMasterLandingPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        // Apply dark mode to body
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }

        // Initialize visibility for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.animate-section').forEach(section => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, [darkMode]);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-10 py-4 px-6 md:px-12 flex justify-between items-center transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                <div className="flex items-center gap-2">
                    <Package className="h-8 w-8 text-blue-600" />
                    <h1 className="text-2xl font-bold">StockMaster</h1>
                </div>

                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex gap-6">
                        <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
                        <a href="#benefits" className="hover:text-blue-500 transition-colors">Benefits</a>
                        <a href="#testimonials" className="hover:text-blue-500 transition-colors">Testimonials</a>
                        <a href="#pricing" className="hover:text-blue-500 transition-colors">Pricing</a>
                    </nav>

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-100 hover:bg-blue-200'}`}
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button >
                        <a
                            href="/login"
                            className={`hidden md:block py-2 px-4 rounded-lg font-medium transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            Get Started
                        </a>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className={`py-16 md:py-24 px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 animate-section ${isVisible['hero'] ? 'animate-fade-in' : 'opacity-0'}`} id="hero">
                <div className="flex-1 max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Real-Time, Scalable Inventory Management</h2>
                    <p className="text-lg mb-8 opacity-90">Streamline your inventory across multiple warehouses. Track stock changes, manage team access, and generate insightful reports—all in real-time.</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button >
                            <a
                                href="/login"
                                className={`hidden md:block py-3 px-6 rounded-lg font-medium transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                Start Free Trial
                            </a>
                        </button>
                        <button className={`py-3 px-6 rounded-lg font-medium border-2 transition-transform hover:scale-105 ${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-blue-200 hover:border-blue-300'}`}>
                            Book a Demo
                        </button>
                    </div>
                </div>

                <div className={`flex-1 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                    <div className={`w-full aspect-video rounded-lg overflow-hidden shadow-xl flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                        <div className="flex flex-col items-center gap-2">
                            <img src="https://www.wisys.com/wp-content/uploads/2020/06/manual-inventory-count.jpg" alt="StockMaster Demo" className="w-full h-auto rounded-lg" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={`py-16 md:py-24 px-6 md:px-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Powerful Features</h2>
                    <p className="text-lg mb-12 text-center max-w-3xl mx-auto opacity-90">Streamline your operations with these enterprise-grade tools designed for businesses of any size.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Feature 1 */}
                        <div
                            id="feature-1"
                            className={`animate-section p-6 rounded-lg transition-all duration-500 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-lg'} ${isVisible['feature-1'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                        >
                            <Shield size={36} className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h3 className="text-xl font-semibold mb-3">Role-Based Access Control</h3>
                            <p className="opacity-90">Empower your team with clear boundaries—admins control everything, managers focus on strategy, and staff handle day-to-day operations.</p>
                        </div>

                        {/* Feature 2 */}
                        <div
                            id="feature-2"
                            className={`animate-section p-6 rounded-lg transition-all duration-500 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-lg'} ${isVisible['feature-2'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '100ms' }}
                        >
                            <BarChart3 size={36} className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h3 className="text-xl font-semibold mb-3">Dynamic Inventory Dashboard</h3>
                            <p className="opacity-90">A live feed of stock levels, recent movements, and alerts right at your fingertips. Real-time insights keep your operations running smoothly.</p>
                        </div>

                        {/* Feature 3 */}
                        <div
                            id="feature-3"
                            className={`animate-section p-6 rounded-lg transition-all duration-500 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-lg'} ${isVisible['feature-3'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '200ms' }}
                        >
                            <Clock size={36} className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h3 className="text-xl font-semibold mb-3">Stock Movement History</h3>
                            <p className="opacity-90">Every inventory change is logged and timestamped with full traceability, making auditing and accountability straightforward.</p>
                        </div>

                        {/* Feature 4 */}
                        <div
                            id="feature-4"
                            className={`animate-section p-6 rounded-lg transition-all duration-500 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-lg'} ${isVisible['feature-4'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '300ms' }}
                        >
                            <FileText size={36} className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h3 className="text-xl font-semibold mb-3">Advanced Reporting & Analytics</h3>
                            <p className="opacity-90">Dive deep into your inventory with custom reports that track trends, identify fast-moving items, and visualize inventory valuation over time.</p>
                        </div>

                        {/* Feature 5 */}
                        <div
                            id="feature-5"
                            className={`animate-section p-6 rounded-lg transition-all duration-500 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-lg'} ${isVisible['feature-5'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '400ms' }}
                        >
                            <Building2 size={36} className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h3 className="text-xl font-semibold mb-3">Multi-Warehouse Flexibility</h3>
                            <p className="opacity-90">Assign products to different warehouses, seamlessly transfer stock, and track it all without losing sight of the bigger picture.</p>
                        </div>

                        {/* Feature 6 */}
                        <div
                            id="feature-6"
                            className={`animate-section p-6 rounded-lg transition-all duration-500 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:shadow-lg'} ${isVisible['feature-6'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '500ms' }}
                        >
                            <AlertCircle size={36} className={`mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <h3 className="text-xl font-semibold mb-3">Low Stock & Expiry Alerts</h3>
                            <p className="opacity-90">Get automatically notified when stock drops below thresholds or products approach expiry dates, with optional push/email notifications.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className={`py-16 md:py-24 px-6 md:px-12 animate-section ${isVisible['how-it-works'] ? 'animate-fade-in' : 'opacity-0'}`} id="how-it-works">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">How StockMaster Works</h2>
                    <p className="text-lg mb-12 text-center max-w-3xl mx-auto opacity-90">Our intuitive platform makes inventory management simpler and more efficient than ever before.</p>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className={`absolute left-4 md:left-1/2 top-0 bottom-0 w-1 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} hidden sm:block`}></div>

                        {/* Step 1 */}
                        <div className="flex flex-col sm:flex-row items-start mb-12 relative">
                            <div className={`sm:w-1/2 pr-8 mb-4 sm:mb-0 ${isVisible['step-1'] ? 'animate-slide-right' : 'opacity-0'} animate-section`} id="step-1">
                                <h3 className="text-xl font-semibold mb-2">Setup Your Inventory</h3>
                                <p className="opacity-90">Import your existing inventory or start from scratch. Define warehouses, categories, and user roles.</p>
                            </div>
                            <div className={`sm:absolute sm:left-1/2 sm:top-0 flex items-center justify-center w-8 h-8 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} transform sm:-translate-x-1/2 hidden sm:flex`}>
                                <span className="text-white font-bold">1</span>
                            </div>
                            <div className="sm:w-1/2 sm:pl-8"></div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col sm:flex-row items-start mb-12 relative">
                            <div className="sm:w-1/2 pr-8"></div>
                            <div className={`sm:absolute sm:left-1/2 sm:top-0 flex items-center justify-center w-8 h-8 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} transform sm:-translate-x-1/2 hidden sm:flex`}>
                                <span className="text-white font-bold">2</span>
                            </div>
                            <div className={`sm:w-1/2 sm:pl-8 ${isVisible['step-2'] ? 'animate-slide-left' : 'opacity-0'} animate-section`} id="step-2">
                                <h3 className="text-xl font-semibold mb-2">Track Real-Time Changes</h3>
                                <p className="opacity-90">Monitor stock levels as they change from sales, returns, and transfers. All updates happen in real-time across all devices.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col sm:flex-row items-start mb-12 relative">
                            <div className={`sm:w-1/2 pr-8 mb-4 sm:mb-0 ${isVisible['step-3'] ? 'animate-slide-right' : 'opacity-0'} animate-section`} id="step-3">
                                <h3 className="text-xl font-semibold mb-2">Analyze & Optimize</h3>
                                <p className="opacity-90">Generate reports to identify trends, optimize stock levels, and make data-driven decisions to improve your business.</p>
                            </div>
                            <div className={`sm:absolute sm:left-1/2 sm:top-0 flex items-center justify-center w-8 h-8 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} transform sm:-translate-x-1/2 hidden sm:flex`}>
                                <span className="text-white font-bold">3</span>
                            </div>
                            <div className="sm:w-1/2 sm:pl-8"></div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col sm:flex-row items-start relative">
                            <div className="sm:w-1/2 pr-8"></div>
                            <div className={`sm:absolute sm:left-1/2 sm:top-0 flex items-center justify-center w-8 h-8 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} transform sm:-translate-x-1/2 hidden sm:flex`}>
                                <span className="text-white font-bold">4</span>
                            </div>
                            <div className={`sm:w-1/2 sm:pl-8 ${isVisible['step-4'] ? 'animate-slide-left' : 'opacity-0'} animate-section`} id="step-4">
                                <h3 className="text-xl font-semibold mb-2">Scale With Your Business</h3>
                                <p className="opacity-90">As your business grows, StockMaster grows with you. Add more users, warehouses, and products without compromising performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`py-16 px-6 md:px-12 ${darkMode ? 'bg-blue-900' : 'bg-blue-600'} text-white animate-section ${isVisible['cta'] ? 'animate-fade-in' : 'opacity-0'}`} id="cta">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Inventory Management?</h2>
                    <p className="text-lg mb-8 opacity-90">Join thousands of businesses that have streamlined their operations with StockMaster.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="py-3 px-6 bg-white text-blue-600 rounded-lg font-medium transition-transform hover:scale-105">
                            Start 14-Day Free Trial
                        </button>
                        <button className="py-3 px-6 border-2 border-white rounded-lg font-medium transition-transform hover:scale-105">
                            Schedule a Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className={`py-16 md:py-24 px-6 md:px-12 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">What Our Customers Say</h2>
                    <p className="text-lg mb-12 text-center max-w-3xl mx-auto opacity-90">Businesses of all sizes trust StockMaster for their inventory management needs.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div
                            id="testimonial-1"
                            className={`animate-section p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} ${isVisible['testimonial-1'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                        >
                            <div className="flex items-center mb-4">
                                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                                    <Users size={24} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold">Sarah Johnson</h4>
                                    <p className="text-sm opacity-75">Retail Manager, StyleHub</p>
                                </div>
                            </div>
                            <p className="italic opacity-90">"StockMaster transformed how we manage inventory across our 5 locations. Real-time updates and low stock alerts have virtually eliminated stockouts."</p>
                        </div>

                        {/* Testimonial 2 */}
                        <div
                            id="testimonial-2"
                            className={`animate-section p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} ${isVisible['testimonial-2'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '100ms' }}
                        >
                            <div className="flex items-center mb-4">
                                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                                    <Users size={24} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold">Michael Chen</h4>
                                    <p className="text-sm opacity-75">Operations Director, TechPro</p>
                                </div>
                            </div>
                            <p className="italic opacity-90">"The reporting capabilities alone have saved us countless hours each month. We can now make data-driven decisions that have improved our bottom line."</p>
                        </div>

                        {/* Testimonial 3 */}
                        <div
                            id="testimonial-3"
                            className={`animate-section p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} ${isVisible['testimonial-3'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '200ms' }}
                        >
                            <div className="flex items-center mb-4">
                                <div className={`w-12 h-12 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                                    <Users size={24} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold">Emily Rodriguez</h4>
                                    <p className="text-sm opacity-75">Owner, Artisan Goods</p>
                                </div>
                            </div>
                            <p className="italic opacity-90">"As a small business owner, I needed something affordable yet powerful. StockMaster scales with my business and gives me enterprise-level tools at SMB pricing."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className={`py-16 md:py-24 px-6 md:px-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Simple, Transparent Pricing</h2>
                    <p className="text-lg mb-12 text-center max-w-3xl mx-auto opacity-90">Choose the plan that fits your business needs. All plans include our core features.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Starter Plan */}
                        <div
                            id="plan-1"
                            className={`animate-section p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} ${isVisible['plan-1'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                        >
                            <h3 className="text-xl font-semibold mb-2">Starter</h3>
                            <p className="text-3xl font-bold mb-4">$49<span className="text-base font-normal opacity-75">/month</span></p>
                            <p className="mb-6 opacity-90">Perfect for small businesses with basic inventory needs.</p>

                            <ul className="mb-8 space-y-3">
                                <li className="flex items-start gap-2">
                                    <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</div>
                                    <span>Up to 1,000 SKUs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</div>
                                    <span>2 user accounts</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</div>
                                    <span>1 warehouse location</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</div>
                                    <span>Basic reporting</span>
                                </li>
                            </ul>

                            <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                Get Started
                            </button>
                        </div>

                        {/* Professional Plan */}
                        <div
                            id="plan-2"
                            className={`animate-section p-6 rounded-lg relative ${darkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white ${isVisible['plan-2'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '100ms' }}
                        >
                            <div className="absolute -top-4 right-4 bg-yellow-500 text-gray-900 py-1 px-3 rounded-full text-sm font-semibold">Most Popular</div>
                            <h3 className="text-xl font-semibold mb-2">Professional</h3>
                            <p className="text-3xl font-bold mb-4">$99<span className="text-base font-normal opacity-75">/month</span></p>
                            <p className="mb-6 opacity-90">Ideal for growing businesses with multiple team members.</p>

                            <ul className="mb-8 space-y-3">
                                <li className="flex items-start gap-2">
                                    <div className="mt-1">✓</div>
                                    <span>Up to 10,000 SKUs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-1">✓</div>
                                    <span>10 user accounts</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-1">✓</div>
                                    <span>3 warehouse locations</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-1">✓</div>
                                    <span>Advanced reporting & analytics</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="mt-1">✓</div>
                                    <span>API access</span>
                                </li>
                            </ul>

                            <button>
                                <a
                                    href="/login"
                                    className="w-full py-3 px-6 bg-white text-blue-600 rounded-lg font-medium transition-transform hover:scale-105 block text-center"
                                >
                                    Get Started
                                </a>
                            </button>
                        </div>

                        {/* Enterprise Plan */}
                        <div
                            id="plan-3"
                            className={`animate-section p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} ${isVisible['plan-3'] ? 'animate-slide-up' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: '200ms' }}
                        >
                            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                            <p className="text-3xl font-bold mb-4">Custom</p>
                            <p className="mb-6 opacity-90">For large businesses with complex inventory requirements.</p>

                            <ul className="mb-8 space-y-3">
                                <li className="flex items-start gap-2">
                                    <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</div>
                                    <span>Unlimited SKUs</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</div>
                                    <span>Unlimited users</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</div>
                                    <span>Unlimited warehouse locations</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</div>
                                    <span>Custom integrations</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>✓</div>
                                    <span>Dedicated support team</span>
                                </li>
                            </ul>

                            <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
        </div>);
}

// Removed duplicate export default statement