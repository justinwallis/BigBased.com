-- Create comprehensive documentation with properly escaped content

-- First, ensure we have all necessary categories
INSERT INTO documentation_categories (name, slug, description, icon, order_index, is_visible)
SELECT 'Platform Overview', 'platform-overview', 'Introduction and overview of the Big Based platform', 'layout', 1, true
WHERE NOT EXISTS (SELECT 1 FROM documentation_categories WHERE slug = 'platform-overview');

INSERT INTO documentation_categories (name, slug, description, icon, order_index, is_visible)
SELECT 'Authentication & Security', 'authentication-security', 'User authentication and security features', 'shield', 2, true
WHERE NOT EXISTS (SELECT 1 FROM documentation_categories WHERE slug = 'authentication-security');

INSERT INTO documentation_categories (name, slug, description, icon, order_index, is_visible)
SELECT 'User Profile System', 'user-profile', 'User profile management and customization', 'user', 3, true
WHERE NOT EXISTS (SELECT 1 FROM documentation_categories WHERE slug = 'user-profile');

INSERT INTO documentation_categories (name, slug, description, icon, order_index, is_visible)
SELECT 'Admin Panel', 'admin-panel', 'Administrative features and management tools', 'settings', 4, true
WHERE NOT EXISTS (SELECT 1 FROM documentation_categories WHERE slug = 'admin-panel');

INSERT INTO documentation_categories (name, slug, description, icon, order_index, is_visible)
SELECT 'Enterprise Features', 'enterprise-features', 'Advanced enterprise-grade platform capabilities', 'building', 5, true
WHERE NOT EXISTS (SELECT 1 FROM documentation_categories WHERE slug = 'enterprise-features');

INSERT INTO documentation_categories (name, slug, description, icon, order_index, is_visible)
SELECT 'Developer Resources', 'developer-resources', 'API documentation and developer tools', 'code', 6, true
WHERE NOT EXISTS (SELECT 1 FROM documentation_categories WHERE slug = 'developer-resources');

-- Platform Overview
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Big Based Platform Architecture',
    'platform-architecture',
    '<h1>Big Based Platform Architecture</h1>
    
    <p>The Big Based platform is built on a modern, scalable architecture designed for enterprise-grade performance, security, and flexibility. This document provides a comprehensive overview of the platform architecture, components, and design principles.</p>
    
    <h2>Core Architecture</h2>
    
    <p>Big Based is built on a multi-tenant architecture that allows for complete isolation between different organizations while maintaining a unified codebase and infrastructure. The platform leverages the following key technologies:</p>
    
    <ul>
        <li><strong>Next.js App Router</strong>: Server-side rendering and static site generation for optimal performance</li>
        <li><strong>React</strong>: Component-based UI development with hooks for state management</li>
        <li><strong>TypeScript</strong>: Type-safe code to reduce errors and improve developer experience</li>
        <li><strong>PostgreSQL</strong>: Enterprise-grade relational database for data storage</li>
        <li><strong>Supabase</strong>: Authentication, storage, and database services</li>
        <li><strong>Vercel</strong>: Edge-optimized hosting and serverless functions</li>
    </ul>
    
    <h2>Multi-tenant Architecture</h2>
    
    <p>The platform supports multiple tenants (organizations) with complete data isolation through domain-based tenant isolation, row-level security policies, and tenant-specific encryption keys.</p>
    
    <h2>Security Architecture</h2>
    
    <p>Security is implemented at multiple layers including NextAuth.js for authentication, role-based access control, and comprehensive data protection measures.</p>',
    'Comprehensive overview of the Big Based platform architecture, components, and design principles.',
    (SELECT id FROM documentation_categories WHERE slug = 'platform-overview'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'platform-architecture' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'platform-overview')
);

-- Authentication & Security
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Multi-Factor Authentication (MFA)',
    'multi-factor-authentication',
    '<h1>Multi-Factor Authentication (MFA)</h1>
    
    <p>Big Based provides robust multi-factor authentication (MFA) to enhance account security beyond traditional password protection. This document explains how to set up, use, and manage MFA for your account.</p>
    
    <h2>Understanding Multi-Factor Authentication</h2>
    
    <p>Multi-factor authentication adds an additional layer of security by requiring two or more verification factors:</p>
    
    <ol>
        <li><strong>Something you know</strong> - Your password</li>
        <li><strong>Something you have</strong> - A mobile device with an authenticator app</li>
        <li><strong>Something you are</strong> - Biometric verification (not currently implemented)</li>
    </ol>
    
    <h2>Supported MFA Methods</h2>
    
    <h3>Time-based One-Time Password (TOTP)</h3>
    <p>Uses an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to generate time-based codes.</p>
    
    <h3>Backup Codes</h3>
    <p>Single-use recovery codes for emergency access when you cannot use your primary MFA method.</p>
    
    <h2>Setting Up MFA</h2>
    
    <ol>
        <li>Navigate to Profile → Security → Two-Factor Authentication</li>
        <li>Click Enable Two-Factor Authentication</li>
        <li>Enter your password to confirm your identity</li>
        <li>Scan the displayed QR code with your authenticator app</li>
        <li>Enter the 6-digit code from your authenticator app</li>
        <li>Save the provided backup codes in a secure location</li>
        <li>Click Complete Setup to finish</li>
    </ol>
    
    <h2>Security Best Practices</h2>
    
    <ul>
        <li>Use a reputable authenticator app</li>
        <li>Back up your authenticator app using built-in backup features</li>
        <li>Store backup codes securely</li>
        <li>Enable MFA for all admin accounts</li>
        <li>Regularly review trusted devices</li>
    </ul>',
    'Comprehensive guide to setting up and using multi-factor authentication (MFA) to secure your account.',
    (SELECT id FROM documentation_categories WHERE slug = 'authentication-security'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'multi-factor-authentication' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'authentication-security')
);

-- User Profile System
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Profile Customization and Management',
    'profile-customization',
    '<h1>Profile Customization and Management</h1>
    
    <p>The Big Based platform provides comprehensive profile customization options to help users create personalized, professional profiles. This document covers all aspects of profile management, from basic information to advanced customization.</p>
    
    <h2>Profile Components</h2>
    
    <h3>Profile Picture (Avatar)</h3>
    <p>Your profile picture appears throughout the platform and helps others identify you.</p>
    
    <h4>Uploading a Profile Picture</h4>
    <ol>
        <li>Navigate to your profile page</li>
        <li>Hover over your current profile picture and click Edit</li>
        <li>Select an image file from your device (supported formats: JPG, PNG, GIF)</li>
        <li>Crop and adjust the image as needed</li>
        <li>Click Save to update your profile picture</li>
    </ol>
    
    <h3>Cover Photo (Banner)</h3>
    <p>The cover photo appears at the top of your profile page and provides visual personalization.</p>
    
    <h3>Profile Information</h3>
    <p>Your profile information includes various details about you that are visible to others.</p>
    
    <h3>Social Media Links</h3>
    <p>Connect your social media accounts to your profile for easy access.</p>
    
    <h2>Profile Privacy Settings</h2>
    <p>Control who can see your profile and what information is visible.</p>
    
    <h2>Best Practices</h2>
    <ul>
        <li>Use a clear, recognizable profile picture</li>
        <li>Create a compelling bio that describes who you are</li>
        <li>Choose a cover photo that reflects your personality</li>
        <li>Keep information current by updating regularly</li>
        <li>Include relevant social media links</li>
    </ul>',
    'Complete guide to customizing and managing your user profile, including avatar, banner, and personal information.',
    (SELECT id FROM documentation_categories WHERE slug = 'user-profile'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'profile-customization' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'user-profile')
);

-- Admin Panel
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Admin Panel Complete Guide',
    'admin-panel-guide',
    '<h1>Admin Panel Complete Guide</h1>
    
    <p>The Big Based Admin Panel provides comprehensive tools for managing all aspects of your platform. This guide covers each section of the admin panel in detail, explaining available features and how to use them effectively.</p>
    
    <h2>Accessing the Admin Panel</h2>
    
    <p>To access the admin panel:</p>
    
    <ol>
        <li>Sign in with an account that has administrator privileges</li>
        <li>Navigate to /admin or click Admin in the user dropdown menu</li>
        <li>You will be presented with the admin dashboard overview</li>
    </ol>
    
    <h2>Dashboard Overview</h2>
    
    <p>The admin dashboard provides a high-level overview of your platform performance and status including key metrics, recent activity, system status, and quick actions.</p>
    
    <h2>User Management</h2>
    
    <p>The user management section allows you to manage all user accounts on the platform with powerful filtering, search capabilities, and bulk actions.</p>
    
    <h2>Content Management System (CMS)</h2>
    
    <p>The CMS section provides tools for managing all content across the platform including content types, rich text editing, media library, and publishing workflows.</p>
    
    <h2>Documentation Management</h2>
    
    <p>Manage the platform documentation system including categories, articles, versioning, and analytics.</p>
    
    <h2>Community Management</h2>
    
    <p>Manage the community forum including categories, topics, moderation tools, and community insights.</p>
    
    <h2>Shop Management</h2>
    
    <p>Manage e-commerce functionality including shop configuration, product management, and order processing.</p>
    
    <h2>Analytics and Reporting</h2>
    
    <p>Access comprehensive analytics and generate reports for platform performance, user engagement, and business metrics.</p>
    
    <h2>Best Practices</h2>
    
    <ul>
        <li>Regular backups of data</li>
        <li>Assign only necessary permissions to users</li>
        <li>Regularly check admin actions for security</li>
        <li>Require MFA for all admin accounts</li>
        <li>Maintain internal documentation of procedures</li>
    </ul>',
    'Comprehensive guide to the admin panel, including user management, content management, and system settings.',
    (SELECT id FROM documentation_categories WHERE slug = 'admin-panel'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'admin-panel-guide' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'admin-panel')
);

-- Enterprise Features
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Enterprise Knowledge Graph',
    'enterprise-knowledge-graph',
    '<h1>Enterprise Knowledge Graph</h1>
    
    <p>The Big Based Enterprise Knowledge Graph is an advanced feature that creates a semantic network of relationships between content, users, and concepts across your platform.</p>
    
    <h2>Understanding the Knowledge Graph</h2>
    
    <p>A knowledge graph is a structured representation of knowledge that connects entities through meaningful relationships. The Big Based Knowledge Graph automatically identifies relationships between content items, maps connections between users and content, and creates semantic understanding of your platform information.</p>
    
    <h2>Key Components</h2>
    
    <h3>Entities</h3>
    <p>Entities are the nodes in the knowledge graph and can include content items, concepts, users, organizations, and events.</p>
    
    <h3>Relationships</h3>
    <p>Relationships define how entities are connected including content-to-content, user-to-content, concept-to-content, and user-to-user relationships.</p>
    
    <h2>Key Features</h2>
    
    <h3>Automatic Relationship Detection</h3>
    <p>The system automatically identifies relationships between content through natural language processing, link analysis, usage patterns, and semantic similarity.</p>
    
    <h3>Visualization Tools</h3>
    <p>Explore your knowledge graph visually with interactive graphs, filtering, clustering, and path analysis.</p>
    
    <h3>Content Recommendations</h3>
    <p>Leverage the knowledge graph for intelligent recommendations including related content, learning paths, expertise mapping, and content gap analysis.</p>
    
    <h2>Use Cases</h2>
    
    <ul>
        <li>Documentation improvement and navigation</li>
        <li>E-commerce product recommendations</li>
        <li>Community knowledge sharing</li>
        <li>Content discovery and organization</li>
    </ul>',
    'Detailed explanation of the Enterprise Knowledge Graph feature, including setup, management, and use cases.',
    (SELECT id FROM documentation_categories WHERE slug = 'enterprise-features'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'enterprise-knowledge-graph' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'enterprise-features')
);

-- Developer Resources
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'API Integration Guide',
    'api-integration-guide',
    '<h1>API Integration Guide</h1>
    
    <p>The Big Based platform provides comprehensive REST APIs that allow developers to integrate with and extend the platform functionality. This guide covers authentication, endpoints, best practices, and example implementations.</p>
    
    <h2>API Overview</h2>
    
    <p>The Big Based API follows REST principles and uses standard HTTP methods including GET for retrieving resources, POST for creating new resources, PUT for updating existing resources, PATCH for partial updates, and DELETE for removing resources.</p>
    
    <h2>Authentication</h2>
    
    <p>The API supports multiple authentication methods including API key authentication for server-to-server integrations and OAuth 2.0 for user-context operations.</p>
    
    <h2>API Endpoints</h2>
    
    <h3>User Management</h3>
    <p>Endpoints for managing users including list users, get user details, create user, update user, and delete user operations.</p>
    
    <h3>Content Management</h3>
    <p>Endpoints for managing content including list content, get content items, create content, update content, and delete content operations.</p>
    
    <h3>Shop Management</h3>
    <p>Endpoints for e-commerce operations including product management, order processing, and customer management.</p>
    
    <h2>Response Format</h2>
    
    <p>All API responses follow a consistent JSON format with success indicators, data payload, and metadata for pagination.</p>
    
    <h2>Rate Limiting</h2>
    
    <p>API requests are rate limited to ensure fair usage with different limits for authenticated and unauthenticated requests.</p>
    
    <h2>Best Practices</h2>
    
    <ul>
        <li>Always use HTTPS for API requests</li>
        <li>Store credentials securely</li>
        <li>Handle rate limits with exponential backoff</li>
        <li>Validate responses and check success fields</li>
        <li>Use pagination for large datasets</li>
        <li>Cache responses when appropriate</li>
    </ul>',
    'Complete guide to integrating with the Big Based API, including authentication, endpoints, and best practices.',
    (SELECT id FROM documentation_categories WHERE slug = 'developer-resources'),
    '00000000-0000-0000-0000-000000000000',
    'published',
    true,
    '1.0'
WHERE NOT EXISTS (
    SELECT 1 FROM documentation_articles 
    WHERE slug = 'api-integration-guide' 
    AND category_id = (SELECT id FROM documentation_categories WHERE slug = 'developer-resources')
);

-- Update search index for all new articles
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
