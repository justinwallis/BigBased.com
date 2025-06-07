-- Seed comprehensive documentation content (fixed version)

-- Getting Started Articles
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured) 
SELECT 
    'Welcome to Big Based Platform',
    'welcome-to-big-based',
    '<h1>Welcome to Big Based Platform</h1>
    <p>Big Based is a comprehensive platform that provides enterprise-grade solutions for content management, e-commerce, community building, and user management.</p>
    
    <h2>What You Can Do</h2>
    <ul>
        <li><strong>Manage Content:</strong> Create and manage websites, blogs, and digital content</li>
        <li><strong>Build Communities:</strong> Foster engagement with discussion forums and user interactions</li>
        <li><strong>Run E-commerce:</strong> Set up and manage online stores with full payment processing</li>
        <li><strong>User Management:</strong> Handle authentication, profiles, and user permissions</li>
        <li><strong>Analytics:</strong> Track performance and user engagement across all features</li>
    </ul>
    
    <h2>Getting Started</h2>
    <p>To begin using Big Based, you will need to:</p>
    <ol>
        <li>Create your account and complete your profile</li>
        <li>Choose your subscription plan</li>
        <li>Set up your first project or shop</li>
        <li>Explore the admin panel features</li>
    </ol>',
    'Learn the basics of the Big Based platform and get started with your first project.',
    (SELECT id FROM documentation_categories WHERE slug = 'getting-started'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE category_id = (SELECT id FROM documentation_categories WHERE slug = 'getting-started') 
    AND slug = 'welcome-to-big-based'
);

-- Admin Panel Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured) 
SELECT 
    'Admin Panel Overview',
    'admin-panel-overview',
    '<h1>Admin Panel Overview</h1>
    <p>The Big Based admin panel provides comprehensive control over all platform features. Access it at <code>/admin</code> after logging in with admin privileges.</p>
    
    <h2>Main Sections</h2>
    
    <h3>User Management</h3>
    <p>Manage all platform users, view profiles, and handle account issues.</p>
    <ul>
        <li>View user list with search and filtering</li>
        <li>Edit user profiles and permissions</li>
        <li>Handle account restoration requests</li>
        <li>Monitor user activity and security logs</li>
    </ul>
    
    <h3>Domain Management</h3>
    <p>Configure and manage domains for the platform.</p>
    <ul>
        <li>Add new domains and subdomains</li>
        <li>Configure domain settings and redirects</li>
        <li>Bulk import domain configurations</li>
        <li>Monitor domain analytics</li>
    </ul>
    
    <h3>Content Management System (CMS)</h3>
    <p>Full-featured content management with enterprise capabilities.</p>
    <ul>
        <li>Create and manage content types</li>
        <li>Rich text editor with media management</li>
        <li>Content versioning and workflow</li>
        <li>SEO optimization tools</li>
        <li>Content scheduling and publishing</li>
    </ul>
    
    <h3>Shop Management</h3>
    <p>E-commerce platform with multi-vendor support.</p>
    <ul>
        <li>Create and manage multiple shops</li>
        <li>Product catalog management</li>
        <li>Order processing and fulfillment</li>
        <li>Customer management</li>
        <li>Discount and promotion tools</li>
    </ul>
    
    <h3>Analytics Dashboard</h3>
    <p>Comprehensive analytics and reporting.</p>
    <ul>
        <li>User engagement metrics</li>
        <li>Content performance tracking</li>
        <li>E-commerce sales analytics</li>
        <li>Custom report generation</li>
    </ul>',
    'Complete overview of the Big Based admin panel and its features.',
    (SELECT id FROM documentation_categories WHERE slug = 'admin-panel'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE category_id = (SELECT id FROM documentation_categories WHERE slug = 'admin-panel') 
    AND slug = 'admin-panel-overview'
);

-- Profile Management Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured) 
SELECT 
    'User Profile Features',
    'user-profile-features',
    '<h1>User Profile Features</h1>
    <p>Big Based provides comprehensive user profile management with customization options and privacy controls.</p>
    
    <h2>Profile Sections</h2>
    
    <h3>Basic Information</h3>
    <ul>
        <li>Display name and username</li>
        <li>Profile picture and banner image</li>
        <li>Bio and description</li>
        <li>Contact information</li>
        <li>Social media links</li>
    </ul>
    
    <h3>Security Settings</h3>
    <ul>
        <li>Password management</li>
        <li>Two-factor authentication (2FA)</li>
        <li>Trusted devices</li>
        <li>Active sessions monitoring</li>
        <li>Security log and activity history</li>
    </ul>
    
    <h3>Notification Preferences</h3>
    <ul>
        <li>Email notification settings</li>
        <li>Push notification preferences</li>
        <li>Community activity alerts</li>
        <li>Marketing communication options</li>
    </ul>
    
    <h3>Billing and Subscriptions</h3>
    <ul>
        <li>Current subscription status</li>
        <li>Payment method management</li>
        <li>Billing history and invoices</li>
        <li>Subscription upgrades and downgrades</li>
    </ul>
    
    <h2>Privacy Controls</h2>
    <p>Users have full control over their privacy settings:</p>
    <ul>
        <li>Profile visibility options</li>
        <li>Data sharing preferences</li>
        <li>Account deletion and data export</li>
        <li>Cookie and tracking preferences</li>
    </ul>',
    'Learn about all user profile features and customization options.',
    (SELECT id FROM documentation_categories WHERE slug = 'profile-management'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE category_id = (SELECT id FROM documentation_categories WHERE slug = 'profile-management') 
    AND slug = 'user-profile-features'
);

-- Shop System Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured) 
SELECT 
    'Shop System Guide',
    'shop-system-guide',
    '<h1>Shop System Guide</h1>
    <p>The Big Based shop system provides a complete e-commerce solution with multi-vendor support and enterprise features.</p>
    
    <h2>Creating Your First Shop</h2>
    <ol>
        <li>Navigate to <code>/admin/shops</code></li>
        <li>Click "Create New Shop"</li>
        <li>Fill in shop details (name, description, category)</li>
        <li>Choose your subscription plan</li>
        <li>Configure shop settings</li>
    </ol>
    
    <h2>Shop Management Features</h2>
    
    <h3>Product Management</h3>
    <ul>
        <li>Add products with rich descriptions</li>
        <li>Multiple product images and galleries</li>
        <li>Inventory tracking and management</li>
        <li>Product variants (size, color, etc.)</li>
        <li>SEO optimization for products</li>
        <li>Product categories and tags</li>
    </ul>
    
    <h3>Order Processing</h3>
    <ul>
        <li>Order management dashboard</li>
        <li>Order status tracking</li>
        <li>Shipping and fulfillment</li>
        <li>Return and refund processing</li>
        <li>Customer communication tools</li>
    </ul>
    
    <h3>Customer Management</h3>
    <ul>
        <li>Customer profiles and history</li>
        <li>Customer groups and segmentation</li>
        <li>Loyalty programs</li>
        <li>Customer support tools</li>
    </ul>
    
    <h3>Marketing Tools</h3>
    <ul>
        <li>Discount codes and promotions</li>
        <li>Email marketing integration</li>
        <li>Social media sharing</li>
        <li>Analytics and reporting</li>
    </ul>
    
    <h2>Payment Processing</h2>
    <p>Integrated payment processing with multiple providers:</p>
    <ul>
        <li>Stripe integration for credit cards</li>
        <li>PayPal support</li>
        <li>Subscription billing</li>
        <li>Multi-currency support</li>
        <li>Tax calculation</li>
    </ul>',
    'Complete guide to setting up and managing e-commerce shops.',
    (SELECT id FROM documentation_categories WHERE slug = 'shop-system'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE category_id = (SELECT id FROM documentation_categories WHERE slug = 'shop-system') 
    AND slug = 'shop-system-guide'
);

-- CMS Features Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured) 
SELECT 
    'Content Management System',
    'content-management-system',
    '<h1>Content Management System</h1>
    <p>Big Based includes a powerful CMS with enterprise-grade features for content creation, management, and publishing.</p>
    
    <h2>Content Types</h2>
    <p>Create custom content types for different kinds of content:</p>
    <ul>
        <li>Articles and blog posts</li>
        <li>Pages and landing pages</li>
        <li>Products and catalogs</li>
        <li>Events and announcements</li>
        <li>Custom content structures</li>
    </ul>
    
    <h2>Rich Text Editor</h2>
    <p>Advanced editing capabilities:</p>
    <ul>
        <li>WYSIWYG editor with formatting tools</li>
        <li>Code syntax highlighting</li>
        <li>Media embedding (images, videos, files)</li>
        <li>Table creation and editing</li>
        <li>Link management</li>
        <li>Custom HTML support</li>
    </ul>
    
    <h2>Media Management</h2>
    <ul>
        <li>Centralized media library</li>
        <li>Image optimization and resizing</li>
        <li>File organization with folders</li>
        <li>Bulk upload capabilities</li>
        <li>CDN integration for fast delivery</li>
    </ul>
    
    <h2>Publishing Workflow</h2>
    <ul>
        <li>Draft, review, and publish states</li>
        <li>Content scheduling</li>
        <li>Version control and history</li>
        <li>Collaborative editing</li>
        <li>Approval workflows</li>
    </ul>
    
    <h2>SEO Features</h2>
    <ul>
        <li>Meta title and description optimization</li>
        <li>URL slug customization</li>
        <li>Open Graph and Twitter Card support</li>
        <li>Sitemap generation</li>
        <li>Schema markup</li>
    </ul>
    
    <h2>Advanced Features</h2>
    <ul>
        <li>Content personalization</li>
        <li>A/B testing capabilities</li>
        <li>Multi-language support</li>
        <li>Content analytics</li>
        <li>API access for headless CMS</li>
    </ul>',
    'Learn about the powerful CMS features and content management capabilities.',
    (SELECT id FROM documentation_categories WHERE slug = 'cms-features'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE category_id = (SELECT id FROM documentation_categories WHERE slug = 'cms-features') 
    AND slug = 'content-management-system'
);

-- Security Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured) 
SELECT 
    'Security Features and Best Practices',
    'security-features',
    '<h1>Security Features and Best Practices</h1>
    <p>Big Based implements enterprise-grade security measures to protect your data and users.</p>
    
    <h2>Authentication Security</h2>
    
    <h3>Multi-Factor Authentication (MFA)</h3>
    <ul>
        <li>TOTP authenticator app support</li>
        <li>Backup codes for account recovery</li>
        <li>SMS verification (optional)</li>
        <li>Hardware security key support</li>
    </ul>
    
    <h3>Password Security</h3>
    <ul>
        <li>Strong password requirements</li>
        <li>Password strength meter</li>
        <li>Secure password reset process</li>
        <li>Password history tracking</li>
    </ul>
    
    <h2>Session Management</h2>
    <ul>
        <li>Secure session handling</li>
        <li>Device tracking and management</li>
        <li>Automatic session expiration</li>
        <li>Concurrent session limits</li>
        <li>Suspicious activity detection</li>
    </ul>
    
    <h2>Data Protection</h2>
    <ul>
        <li>End-to-end encryption for sensitive data</li>
        <li>GDPR compliance features</li>
        <li>Data anonymization tools</li>
        <li>Secure file storage</li>
        <li>Regular security audits</li>
    </ul>
    
    <h2>Access Control</h2>
    <ul>
        <li>Role-based permissions</li>
        <li>Granular access controls</li>
        <li>API key management</li>
        <li>IP whitelisting</li>
        <li>Rate limiting</li>
    </ul>
    
    <h2>Monitoring and Logging</h2>
    <ul>
        <li>Comprehensive security logs</li>
        <li>Real-time threat detection</li>
        <li>Automated security alerts</li>
        <li>Audit trail maintenance</li>
        <li>Incident response procedures</li>
    </ul>
    
    <h2>Best Practices</h2>
    <ol>
        <li>Enable MFA for all admin accounts</li>
        <li>Regularly review user permissions</li>
        <li>Monitor security logs for anomalies</li>
        <li>Keep software and dependencies updated</li>
        <li>Use strong, unique passwords</li>
        <li>Regularly backup important data</li>
    </ol>',
    'Comprehensive guide to security features and best practices.',
    (SELECT id FROM documentation_categories WHERE slug = 'security'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE category_id = (SELECT id FROM documentation_categories WHERE slug = 'security') 
    AND slug = 'security-features'
);

-- API Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured) 
SELECT 
    'API Documentation Overview',
    'api-documentation-overview',
    '<h1>API Documentation Overview</h1>
    <p>Big Based provides comprehensive REST APIs for integrating with external systems and building custom applications.</p>
    
    <h2>Authentication</h2>
    <p>All API requests require authentication using API keys or OAuth tokens.</p>
    
    <h3>API Key Authentication</h3>
    <pre><code>curl -H "Authorization: Bearer YOUR_API_KEY" https://api.bigbased.com/v1/users</code></pre>
    
    <h3>OAuth 2.0</h3>
    <p>For user-specific operations, use OAuth 2.0 flow:</p>
    <ol>
        <li>Redirect user to authorization endpoint</li>
        <li>Receive authorization code</li>
        <li>Exchange code for access token</li>
        <li>Use access token for API calls</li>
    </ol>
    
    <h2>Available Endpoints</h2>
    
    <h3>User Management</h3>
    <ul>
        <li><code>GET /api/v1/users</code> - List users</li>
        <li><code>GET /api/v1/users/{id}</code> - Get user details</li>
        <li><code>POST /api/v1/users</code> - Create user</li>
        <li><code>PUT /api/v1/users/{id}</code> - Update user</li>
        <li><code>DELETE /api/v1/users/{id}</code> - Delete user</li>
    </ul>
    
    <h3>Content Management</h3>
    <ul>
        <li><code>GET /api/v1/content</code> - List content</li>
        <li><code>GET /api/v1/content/{id}</code> - Get content</li>
        <li><code>POST /api/v1/content</code> - Create content</li>
        <li><code>PUT /api/v1/content/{id}</code> - Update content</li>
        <li><code>DELETE /api/v1/content/{id}</code> - Delete content</li>
    </ul>
    
    <h3>Shop Management</h3>
    <ul>
        <li><code>GET /api/v1/shops</code> - List shops</li>
        <li><code>GET /api/v1/shops/{id}/products</code> - List products</li>
        <li><code>GET /api/v1/shops/{id}/orders</code> - List orders</li>
        <li><code>POST /api/v1/shops/{id}/products</code> - Create product</li>
    </ul>
    
    <h2>Response Format</h2>
    <p>All API responses follow a consistent JSON format:</p>
    <pre><code>{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}</code></pre>
    
    <h2>Error Handling</h2>
    <p>Error responses include detailed information:</p>
    <pre><code>{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}</code></pre>
    
    <h2>Rate Limiting</h2>
    <p>API requests are rate limited to ensure fair usage:</p>
    <ul>
        <li>1000 requests per hour for authenticated users</li>
        <li>100 requests per hour for unauthenticated requests</li>
        <li>Rate limit headers included in responses</li>
    </ul>',
    'Complete API documentation for developers and integrations.',
    (SELECT id FROM documentation_categories WHERE slug = 'api-documentation'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE category_id = (SELECT id FROM documentation_categories WHERE slug = 'api-documentation') 
    AND slug = 'api-documentation-overview'
);

-- Billing and Subscriptions Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured) 
SELECT 
    'Billing and Subscription Management',
    'billing-subscription-management',
    '<h1>Billing and Subscription Management</h1>
    <p>Big Based offers flexible billing and subscription options for individuals and enterprises.</p>
    
    <h2>Subscription Plans</h2>
    
    <h3>Free Tier</h3>
    <ul>
        <li>Basic profile features</li>
        <li>Limited storage (1GB)</li>
        <li>Community access</li>
        <li>Basic documentation access</li>
    </ul>
    
    <h3>Supporter Plan ($9.99/month)</h3>
    <ul>
        <li>Enhanced profile features</li>
        <li>Increased storage (10GB)</li>
        <li>Priority support</li>
        <li>Advanced analytics</li>
        <li>Custom domains</li>
    </ul>
    
    <h3>Patriot Plan ($19.99/month)</h3>
    <ul>
        <li>All Supporter features</li>
        <li>Unlimited storage</li>
        <li>Shop creation and management</li>
        <li>Advanced CMS features</li>
        <li>API access</li>
        <li>White-label options</li>
    </ul>
    
    <h2>Payment Methods</h2>
    <p>We accept multiple payment methods:</p>
    <ul>
        <li>Credit and debit cards (Visa, MasterCard, American Express)</li>
        <li>PayPal</li>
        <li>Bank transfers (for enterprise customers)</li>
        <li>Cryptocurrency (Bitcoin, Ethereum)</li>
    </ul>
    
    <h2>Billing Management</h2>
    
    <h3>Viewing Your Bills</h3>
    <ol>
        <li>Go to Profile → Billing</li>
        <li>View current subscription status</li>
        <li>Download invoices and receipts</li>
        <li>View payment history</li>
    </ol>
    
    <h3>Updating Payment Methods</h3>
    <ol>
        <li>Navigate to Billing settings</li>
        <li>Click "Add Payment Method"</li>
        <li>Enter payment details</li>
        <li>Set as default if desired</li>
    </ol>
    
    <h3>Subscription Changes</h3>
    <ul>
        <li><strong>Upgrades:</strong> Take effect immediately with prorated billing</li>
        <li><strong>Downgrades:</strong> Take effect at the end of current billing period</li>
        <li><strong>Cancellations:</strong> Access continues until end of billing period</li>
    </ul>
    
    <h2>Enterprise Billing</h2>
    <p>For enterprise customers, we offer:</p>
    <ul>
        <li>Custom pricing based on usage</li>
        <li>Annual billing with discounts</li>
        <li>Purchase orders and invoicing</li>
        <li>Dedicated account management</li>
        <li>SLA agreements</li>
    </ul>
    
    <h2>Refund Policy</h2>
    <ul>
        <li>30-day money-back guarantee for new subscriptions</li>
        <li>Prorated refunds for downgrades</li>
        <li>No refunds for partial months</li>
        <li>Enterprise customers: custom refund terms</li>
    </ul>',
    'Complete guide to billing, subscriptions, and payment management.',
    (SELECT id FROM documentation_categories WHERE slug = 'billing-subscriptions'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE category_id = (SELECT id FROM documentation_categories WHERE slug = 'billing-subscriptions') 
    AND slug = 'billing-subscription-management'
);

-- Troubleshooting Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured) 
SELECT 
    'Common Issues and Solutions',
    'common-issues-solutions',
    '<h1>Common Issues and Solutions</h1>
    <p>Find solutions to common problems and issues you might encounter while using Big Based.</p>
    
    <h2>Login and Authentication Issues</h2>
    
    <h3>Cannot Log In</h3>
    <p><strong>Problem:</strong> Unable to access your account</p>
    <p><strong>Solutions:</strong></p>
    <ol>
        <li>Check your email and password are correct</li>
        <li>Try resetting your password</li>
        <li>Clear browser cache and cookies</li>
        <li>Disable browser extensions temporarily</li>
        <li>Try a different browser or incognito mode</li>
    </ol>
    
    <h3>Two-Factor Authentication Issues</h3>
    <p><strong>Problem:</strong> 2FA codes not working</p>
    <p><strong>Solutions:</strong></p>
    <ol>
        <li>Check your device time is synchronized</li>
        <li>Try generating a new code</li>
        <li>Use backup codes if available</li>
        <li>Contact support to disable 2FA temporarily</li>
    </ol>
    
    <h2>Profile and Account Issues</h2>
    
    <h3>Profile Picture Not Uploading</h3>
    <p><strong>Problem:</strong> Cannot upload or change profile picture</p>
    <p><strong>Solutions:</strong></p>
    <ol>
        <li>Check file size (max 5MB)</li>
        <li>Use supported formats (JPG, PNG, GIF)</li>
        <li>Try a different image</li>
        <li>Check internet connection</li>
        <li>Clear browser cache</li>
    </ol>
    
    <h3>Email Not Updating</h3>
    <p><strong>Problem:</strong> Email address changes not saving</p>
    <p><strong>Solutions:</strong></p>
    <ol>
        <li>Check the new email format is valid</li>
        <li>Verify the email is not already in use</li>
        <li>Check for verification email in spam folder</li>
        <li>Wait for verification before changes take effect</li>
    </ol>
    
    <h2>Shop and E-commerce Issues</h2>
    
    <h3>Payment Processing Errors</h3>
    <p><strong>Problem:</strong> Payments failing or not processing</p>
    <p><strong>Solutions:</strong></p>
    <ol>
        <li>Verify payment method details</li>
        <li>Check card has sufficient funds</li>
        <li>Contact your bank about international transactions</li>
        <li>Try a different payment method</li>
        <li>Check for payment processor outages</li>
    </ol>
    
    <h3>Products Not Displaying</h3>
    <p><strong>Problem:</strong> Products not showing in shop</p>
    <p><strong>Solutions:</strong></p>
    <ol>
        <li>Check product status is set to "Published"</li>
        <li>Verify product has images and descriptions</li>
        <li>Check inventory levels</li>
        <li>Clear cache and refresh page</li>
        <li>Check shop visibility settings</li>
    </ol>
    
    <h2>Performance Issues</h2>
    
    <h3>Slow Loading Pages</h3>
    <p><strong>Problem:</strong> Pages taking too long to load</p>
    <p><strong>Solutions:</strong></p>
    <ol>
        <li>Check your internet connection speed</li>
        <li>Clear browser cache and cookies</li>
        <li>Disable unnecessary browser extensions</li>
        <li>Try a different browser</li>
        <li>Check for system maintenance announcements</li>
    </ol>
    
    <h2>Getting Help</h2>
    
    <h3>Contact Support</h3>
    <p>If you cannot resolve your issue:</p>
    <ul>
        <li><strong>Community Forum:</strong> Ask questions in our community</li>
        <li><strong>Email Support:</strong> support@bigbased.com</li>
        <li><strong>Live Chat:</strong> Available for Supporter and Patriot subscribers</li>
        <li><strong>Phone Support:</strong> Enterprise customers only</li>
    </ul>
    
    <h3>Before Contacting Support</h3>
    <p>Please have ready:</p>
    <ul>
        <li>Your account email address</li>
        <li>Description of the problem</li>
        <li>Steps you have already tried</li>
        <li>Screenshots or error messages</li>
        <li>Browser and device information</li>
    </ul>',
    'Solutions to common problems and troubleshooting guide.',
    (SELECT id FROM documentation_categories WHERE slug = 'troubleshooting'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE category_id = (SELECT id FROM documentation_categories WHERE slug = 'troubleshooting') 
    AND slug = 'common-issues-solutions'
);
