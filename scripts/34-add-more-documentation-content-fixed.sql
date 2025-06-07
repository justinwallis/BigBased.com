-- Add more comprehensive documentation content with properly escaped quotes

-- Shop System Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Complete Shop System Guide',
    'shop-system-guide',
    '<h1>Complete Shop System Guide</h1>
    
    <p>The Big Based Shop System is a comprehensive e-commerce solution that allows you to create and manage multiple online stores within your platform. This guide covers everything from initial setup to advanced features and optimization.</p>
    
    <h2>Shop System Overview</h2>
    
    <p>The Shop System provides multi-shop support, product management, order processing, customer management, payment integration, inventory management, discount system, and analytics.</p>
    
    <h2>Creating Your First Shop</h2>
    
    <h3>Shop Setup</h3>
    
    <ol>
        <li>Navigate to Admin → Shops</li>
        <li>Click Create New Shop</li>
        <li>Fill in the shop details including shop name, slug, description, and domain</li>
        <li>Configure basic settings including currency, tax settings, and shipping</li>
        <li>Click Create Shop to finish setup</li>
    </ol>
    
    <h3>Shop Configuration</h3>
    
    <p>After creating your shop, configure payment methods and shipping settings.</p>
    
    <h2>Product Management</h2>
    
    <h3>Creating Products</h3>
    
    <ol>
        <li>Navigate to Shop → Products</li>
        <li>Click Add New Product</li>
        <li>Fill in product information including name, description, SKU, price, weight, and dimensions</li>
        <li>Add product images with high-quality photos</li>
        <li>Configure inventory tracking and stock quantities</li>
        <li>Set up SEO with optimized titles and descriptions</li>
    </ol>
    
    <h3>Product Categories</h3>
    
    <p>Organize products into categories for better navigation. Create category hierarchy such as Clothing with subcategories for different types, and Electronics with subcategories for various devices.</p>
    
    <h2>Order Management</h2>
    
    <p>Orders go through several status stages from pending to completed. Manage orders through the admin interface with filtering, search, and status updates.</p>
    
    <h2>Customer Management</h2>
    
    <p>Customers can create accounts to view order history, save addresses, create wishlists, and receive personalized recommendations.</p>
    
    <h2>Discount and Promotion System</h2>
    
    <p>Create various types of discounts including percentage discounts, fixed amount discounts, free shipping, and buy-one-get-one promotions.</p>
    
    <h2>Analytics and Reporting</h2>
    
    <p>Monitor shop performance with comprehensive analytics including revenue tracking, order metrics, product performance, customer analytics, and geographic data.</p>
    
    <h2>Best Practices</h2>
    
    <ul>
        <li>Use high-quality product images</li>
        <li>Write detailed product descriptions</li>
        <li>Optimize for search engines</li>
        <li>Maintain competitive pricing</li>
        <li>Process orders quickly</li>
        <li>Provide excellent customer service</li>
    </ul>',
    'Comprehensive guide to setting up and managing the e-commerce shop system, including products, orders, and customers.',
    (SELECT id FROM documentation_categories WHERE slug = 'enterprise-features'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'shop-system-guide' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'enterprise-features')
);

-- CMS Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Content Management System (CMS) Guide',
    'cms-guide',
    '<h1>Content Management System (CMS) Guide</h1>
    
    <p>The Big Based CMS is a powerful, flexible content management system that allows you to create, manage, and publish content across your platform. This comprehensive guide covers all aspects of the CMS, from basic content creation to advanced features.</p>
    
    <h2>CMS Overview</h2>
    
    <p>The Big Based CMS provides flexible content types, rich text editor, media management, version control, workflow management, SEO optimization, multi-language support, and API access.</p>
    
    <h2>Content Types</h2>
    
    <h3>Understanding Content Types</h3>
    
    <p>Content types define the structure and fields for different kinds of content. Each content type can have text fields, rich text fields, media fields, reference fields, date fields, boolean fields, number fields, and JSON fields.</p>
    
    <h3>Creating Content Types</h3>
    
    <ol>
        <li>Navigate to Admin → CMS → Content Types</li>
        <li>Click Create Content Type</li>
        <li>Define basic information including name, slug, description, and icon</li>
        <li>Add fields to the content type with appropriate validation rules</li>
        <li>Configure content type settings for versioning, publishing, SEO, and comments</li>
    </ol>
    
    <h2>Content Creation and Editing</h2>
    
    <h3>Creating New Content</h3>
    
    <ol>
        <li>Navigate to Admin → CMS → Content</li>
        <li>Click Create New Content</li>
        <li>Select the content type you want to create</li>
        <li>Fill in the content fields using the rich text editor</li>
        <li>Upload and insert media as needed</li>
        <li>Set metadata and SEO information</li>
        <li>Save as draft or publish immediately</li>
    </ol>
    
    <h3>Rich Text Editor</h3>
    
    <p>The TipTap-based rich text editor provides comprehensive formatting options, media integration, and advanced features like tables, embeds, and collaborative editing.</p>
    
    <h2>Media Management</h2>
    
    <p>The centralized media library manages all your assets with support for various file formats, metadata management, and organization tools.</p>
    
    <h2>Version Control and History</h2>
    
    <p>Track all changes to your content with automatic versioning, version comparison, rollback capabilities, and detailed change history.</p>
    
    <h2>Publishing and Workflow</h2>
    
    <p>Content can have different publication statuses including draft, review, scheduled, published, and archived. Configure approval workflows and scheduled publishing.</p>
    
    <h2>SEO and Optimization</h2>
    
    <p>Optimize content for search engines with SEO fields, built-in SEO analysis, and performance scoring.</p>
    
    <h2>Multi-language Support</h2>
    
    <p>Create content in multiple languages with translation management and language-specific SEO settings.</p>
    
    <h2>Best Practices</h2>
    
    <ul>
        <li>Plan content types before creating</li>
        <li>Use consistent naming conventions</li>
        <li>Establish editorial guidelines</li>
        <li>Optimize images for web</li>
        <li>Keep content focused and concise</li>
        <li>Use appropriate caching strategies</li>
        <li>Research relevant keywords</li>
        <li>Create valuable, original content</li>
    </ul>',
    'Complete guide to the Content Management System, including content types, editing, media management, and publishing.',
    (SELECT id FROM documentation_categories WHERE slug = 'admin-panel'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'cms-guide' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'admin-panel')
);

-- Security Features Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Security Features and Best Practices',
    'security-features',
    '<h1>Security Features and Best Practices</h1>
    
    <p>Big Based implements comprehensive security measures to protect your platform and user data. This guide covers all security features and provides best practices for maintaining a secure environment.</p>
    
    <h2>Authentication Security</h2>
    
    <p>The platform provides multiple authentication methods including password-based authentication, multi-factor authentication, OAuth integration, and session management.</p>
    
    <h2>Access Control</h2>
    
    <p>Implement role-based access control with customizable roles, permission management, and resource-level security.</p>
    
    <h2>Data Protection</h2>
    
    <p>Protect sensitive data with encryption at rest and in transit, secure data storage, and privacy controls.</p>
    
    <h2>Security Monitoring</h2>
    
    <p>Monitor security events with audit logging, intrusion detection, and security alerts.</p>
    
    <h2>Compliance</h2>
    
    <p>Meet regulatory requirements with GDPR compliance tools, data retention policies, and privacy management.</p>
    
    <h2>Security Best Practices</h2>
    
    <ul>
        <li>Enable multi-factor authentication for all admin accounts</li>
        <li>Use strong, unique passwords</li>
        <li>Regularly review user permissions</li>
        <li>Keep software updated with security patches</li>
        <li>Monitor security logs regularly</li>
        <li>Implement proper backup procedures</li>
        <li>Train users on security awareness</li>
        <li>Conduct regular security audits</li>
    </ul>
    
    <h2>Incident Response</h2>
    
    <p>Prepare for security incidents with incident response procedures, contact information, and recovery plans.</p>',
    'Comprehensive guide to security features and best practices for maintaining a secure platform.',
    (SELECT id FROM documentation_categories WHERE slug = 'authentication-security'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'security-features' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'authentication-security')
);

-- Community System Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Community Forum System Guide',
    'community-forum-guide',
    '<h1>Community Forum System Guide</h1>
    
    <p>The Big Based Community Forum provides a Discourse-style discussion platform for your users. This guide covers setting up, managing, and moderating your community forum.</p>
    
    <h2>Forum Overview</h2>
    
    <p>The community forum includes category organization, topic management, post system, reaction system, solution marking, moderation tools, user badges, and search functionality.</p>
    
    <h2>Setting Up Categories</h2>
    
    <ol>
        <li>Navigate to Admin → Community → Categories</li>
        <li>Click Create Category</li>
        <li>Define category name, description, and settings</li>
        <li>Set permissions and moderation rules</li>
        <li>Organize categories in logical hierarchy</li>
    </ol>
    
    <h2>Managing Topics and Posts</h2>
    
    <p>Users can create topics for discussion, reply to existing topics, and engage with content through reactions and voting.</p>
    
    <h2>Moderation Tools</h2>
    
    <p>Moderators can review content, manage user behavior, pin important topics, close discussions, and maintain community standards.</p>
    
    <h2>User Engagement</h2>
    
    <p>Encourage participation with reaction systems, solution marking, user badges, and recognition programs.</p>
    
    <h2>Community Analytics</h2>
    
    <p>Track community health with engagement metrics, popular content identification, user contribution monitoring, and activity analysis.</p>
    
    <h2>Best Practices</h2>
    
    <ul>
        <li>Establish clear community guidelines</li>
        <li>Encourage positive participation</li>
        <li>Respond to user questions promptly</li>
        <li>Recognize valuable contributors</li>
        <li>Moderate content fairly and consistently</li>
        <li>Foster inclusive discussions</li>
        <li>Organize content with appropriate categories</li>
        <li>Monitor community health regularly</li>
    </ul>',
    'Complete guide to setting up and managing the community forum system.',
    (SELECT id FROM documentation_categories WHERE slug = 'admin-panel'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'community-forum-guide' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'admin-panel')
);

-- Update search index for new articles
INSERT INTO unified_search_index (content_type, content_id, title, content, category_slug, author_id, updated_at)
SELECT 
    'documentation',
    da.id,
    da.title,
    da.content,
    dc.slug,
    da.author_id,
    NOW()
FROM documentation_articles da
JOIN documentation_categories dc ON da.category_id = dc.id
WHERE da.id NOT IN (
    SELECT content_id FROM unified_search_index 
    WHERE content_type = 'documentation'
);
