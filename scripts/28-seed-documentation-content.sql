-- Seed comprehensive documentation content

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
    <p>To begin using Big Based, you''ll need to:</p>
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
ON CONFLICT (category_id, slug) DO NOTHING;

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
ON CONFLICT (category_id, slug) DO NOTHING;

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
ON CONFLICT (category_id, slug) DO NOTHING;

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
ON CONFLICT (category_id, slug) DO NOTHING;

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
ON CONFLICT (category_id, slug) DO NOTHING;

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
ON CONFLICT (category_id, slug) DO NOTHING;

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
ON CONFLICT (category_id, slug) DO NOTHING;
