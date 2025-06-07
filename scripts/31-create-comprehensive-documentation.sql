-- Create comprehensive documentation with detailed feature explanations

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

-- Now add detailed documentation articles

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
    
    <p>The platform supports multiple tenants (organizations) with complete data isolation:</p>
    
    <h3>Domain-based Tenant Isolation</h3>
    <p>Each tenant can have multiple domains and subdomains configured, with automatic routing and configuration:</p>
    
    <ul>
        <li>Primary domains (example.com)</li>
        <li>Subdomains (shop.example.com, docs.example.com)</li>
        <li>Custom domain mapping and configuration</li>
        <li>Domain-specific settings and themes</li>
    </ul>
    
    <h3>Data Isolation</h3>
    <p>Tenant data is isolated through:</p>
    
    <ul>
        <li>Row-level security policies in the database</li>
        <li>Tenant-specific encryption keys</li>
        <li>Separate storage buckets for media and files</li>
        <li>Role-based access control within each tenant</li>
    </ul>
    
    <h2>Frontend Architecture</h2>
    
    <p>The frontend is built with a component-based architecture using React and Next.js:</p>
    
    <h3>UI Component Library</h3>
    <p>The platform includes a comprehensive UI component library built on shadcn/ui:</p>
    
    <ul>
        <li>Accessible components following WCAG guidelines</li>
        <li>Responsive design for all screen sizes</li>
        <li>Dark and light theme support</li>
        <li>Consistent design language across all features</li>
    </ul>
    
    <h3>Performance Optimization</h3>
    <p>The frontend is optimized for performance through:</p>
    
    <ul>
        <li>Code splitting and lazy loading</li>
        <li>Image optimization and responsive images</li>
        <li>Static generation for content-heavy pages</li>
        <li>Client-side caching strategies</li>
        <li>Progressive Web App capabilities</li>
    </ul>
    
    <h2>Backend Architecture</h2>
    
    <p>The backend uses a combination of serverless functions and database services:</p>
    
    <h3>API Layer</h3>
    <p>The API layer consists of:</p>
    
    <ul>
        <li>Next.js API routes for standard operations</li>
        <li>Server Actions for form submissions and mutations</li>
        <li>RESTful API endpoints for external integrations</li>
        <li>GraphQL API for complex data requirements</li>
    </ul>
    
    <h3>Database Layer</h3>
    <p>The database architecture includes:</p>
    
    <ul>
        <li>PostgreSQL for relational data storage</li>
        <li>Redis for caching and real-time features</li>
        <li>Search indexing for fast content retrieval</li>
        <li>Automated backups and point-in-time recovery</li>
    </ul>
    
    <h2>Security Architecture</h2>
    
    <p>Security is implemented at multiple layers:</p>
    
    <h3>Authentication</h3>
    <ul>
        <li>NextAuth.js for authentication providers</li>
        <li>JWT and session-based authentication</li>
        <li>Multi-factor authentication</li>
        <li>OAuth 2.0 integration for third-party services</li>
    </ul>
    
    <h3>Authorization</h3>
    <ul>
        <li>Role-based access control (RBAC)</li>
        <li>Permission-based feature access</li>
        <li>Row-level security in the database</li>
        <li>API key management for external access</li>
    </ul>
    
    <h3>Data Protection</h3>
    <ul>
        <li>Data encryption at rest and in transit</li>
        <li>Regular security audits and penetration testing</li>
        <li>GDPR and CCPA compliance features</li>
        <li>Comprehensive audit logging</li>
    </ul>
    
    <h2>Scalability and Performance</h2>
    
    <p>The platform is designed for horizontal scalability:</p>
    
    <ul>
        <li>Stateless application servers for easy scaling</li>
        <li>Database connection pooling and optimization</li>
        <li>Content delivery network (CDN) integration</li>
        <li>Caching strategies at multiple levels</li>
        <li>Asynchronous processing for heavy operations</li>
    </ul>
    
    <h2>Integration Architecture</h2>
    
    <p>The platform supports integration with external systems through:</p>
    
    <ul>
        <li>RESTful API endpoints</li>
        <li>Webhook subscriptions for event notifications</li>
        <li>OAuth 2.0 for third-party authentication</li>
        <li>Data import/export capabilities</li>
        <li>Custom integration adapters</li>
    </ul>
    
    <h2>Monitoring and Observability</h2>
    
    <p>Comprehensive monitoring is implemented through:</p>
    
    <ul>
        <li>Sentry integration for error tracking</li>
        <li>Performance monitoring and alerting</li>
        <li>User behavior analytics</li>
        <li>System health dashboards</li>
        <li>Automated incident response</li>
    </ul>
    
    <h2>Deployment Architecture</h2>
    
    <p>The platform uses a modern CI/CD pipeline:</p>
    
    <ul>
        <li>Automated testing and quality assurance</li>
        <li>Continuous integration and deployment</li>
        <li>Blue-green deployments for zero downtime</li>
        <li>Environment-specific configurations</li>
        <li>Rollback capabilities for failed deployments</li>
    </ul>
    
    <h2>Conclusion</h2>
    
    <p>The Big Based platform architecture is designed for enterprise-grade performance, security, and scalability. By leveraging modern technologies and best practices, the platform provides a robust foundation for building complex applications while maintaining flexibility for future growth and customization.</p>',
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
    
    <p>By requiring multiple factors, your account remains secure even if one factor (like your password) is compromised.</p>
    
    <h2>Supported MFA Methods</h2>
    
    <p>Big Based currently supports the following MFA methods:</p>
    
    <h3>Time-based One-Time Password (TOTP)</h3>
    <p>Uses an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator to generate time-based codes.</p>
    
    <ul>
        <li>Six-digit codes that change every 30 seconds</li>
        <li>Works offline without cellular or internet connection</li>
        <li>Compatible with most authenticator apps</li>
    </ul>
    
    <h3>Backup Codes</h3>
    <p>Single-use recovery codes for emergency access when you cannot use your primary MFA method.</p>
    
    <ul>
        <li>Set of 10 one-time use codes</li>
        <li>Each code can only be used once</li>
        <li>New codes can be generated as needed</li>
    </ul>
    
    <h2>Setting Up MFA</h2>
    
    <h3>Enabling TOTP Authentication</h3>
    
    <ol>
        <li>Navigate to <strong>Profile → Security → Two-Factor Authentication</strong></li>
        <li>Click <strong>Enable Two-Factor Authentication</strong></li>
        <li>Enter your password to confirm your identity</li>
        <li>Scan the displayed QR code with your authenticator app</li>
        <li>Enter the 6-digit code from your authenticator app</li>
        <li>Save the provided backup codes in a secure location</li>
        <li>Click <strong>Complete Setup</strong> to finish</li>
    </ol>
    
    <div class="note">
        <p><strong>Important:</strong> Store your backup codes in a secure location. These codes are your only way to regain access if you lose access to your authenticator app.</p>
    </div>
    
    <h3>Generating Backup Codes</h3>
    
    <ol>
        <li>Navigate to <strong>Profile → Security → Two-Factor Authentication</strong></li>
        <li>Under "Backup Codes", click <strong>Generate New Codes</strong></li>
        <li>Enter your password to confirm your identity</li>
        <li>Save the new backup codes in a secure location</li>
    </ol>
    
    <p>Generating new backup codes will invalidate any previously issued codes.</p>
    
    <h2>Using MFA During Sign-In</h2>
    
    <p>Once MFA is enabled, the sign-in process will require both your password and a verification code:</p>
    
    <ol>
        <li>Enter your email and password on the sign-in page</li>
        <li>On the verification page, enter the 6-digit code from your authenticator app</li>
        <li>Alternatively, click "Use a backup code" and enter one of your backup codes</li>
    </ol>
    
    <h2>Managing Trusted Devices</h2>
    
    <p>You can designate certain devices as "trusted" to reduce the frequency of MFA prompts:</p>
    
    <ol>
        <li>During sign-in with MFA, check "Remember this device for 30 days"</li>
        <li>The device will be added to your trusted devices list</li>
    </ol>
    
    <h3>Viewing and Managing Trusted Devices</h3>
    
    <ol>
        <li>Navigate to <strong>Profile → Security → Trusted Devices</strong></li>
        <li>View all devices currently trusted for MFA</li>
        <li>Click <strong>Remove</strong> next to any device to revoke its trusted status</li>
    </ol>
    
    <h2>Disabling MFA</h2>
    
    <p>If you need to disable MFA for your account:</p>
    
    <ol>
        <li>Navigate to <strong>Profile → Security → Two-Factor Authentication</strong></li>
        <li>Click <strong>Disable Two-Factor Authentication</strong></li>
        <li>Enter your password to confirm your identity</li>
        <li>Enter a verification code from your authenticator app</li>
        <li>Confirm that you want to disable MFA</li>
    </ol>
    
    <div class="warning">
        <p><strong>Warning:</strong> Disabling MFA significantly reduces the security of your account. We strongly recommend keeping MFA enabled.</p>
    </div>
    
    <h2>Recovering Account Access</h2>
    
    <p>If you lose access to both your authenticator app and backup codes:</p>
    
    <ol>
        <li>On the sign-in page, click "Can\'t access your account?"</li>
        <li>Select "I can\'t access my two-factor authentication device"</li>
        <li>Follow the account recovery process, which may include:</li>
        <ul>
            <li>Verifying your identity via email</li>
            <li>Answering security questions</li>
            <li>Waiting for a mandatory security hold period</li>
            <li>Contacting support with proof of identity</li>
        </ul>
    </ol>
    
    <h2>Security Best Practices</h2>
    
    <ul>
        <li><strong>Use a reputable authenticator app</strong> like Google Authenticator, Authy, or Microsoft Authenticator</li>
        <li><strong>Back up your authenticator app</strong> using the app\'s built-in backup feature if available</li>
        <li><strong>Store backup codes securely</strong>, separate from your password manager</li>
        <li><strong>Enable MFA for all admin accounts</strong> and encourage all users to enable it</li>
        <li><strong>Regularly review your trusted devices</strong> and remove any you no longer use</li>
        <li><strong>Consider using a hardware security key</strong> for the highest level of protection</li>
    </ul>
    
    <h2>Troubleshooting</h2>
    
    <h3>Time Synchronization Issues</h3>
    <p>If your codes are being rejected, your device\'s time may be out of sync:</p>
    <ul>
        <li>Ensure your device\'s time and date are set to automatic</li>
        <li>Try using a backup code instead</li>
        <li>Some authenticator apps have a time sync feature in settings</li>
    </ul>
    
    <h3>Lost or New Phone</h3>
    <p>If you get a new phone or lose your device:</p>
    <ul>
        <li>Use a backup code to sign in</li>
        <li>Set up the authenticator app on your new device</li>
        <li>Disable and re-enable MFA with the new device</li>
    </ul>
    
    <h3>Backup Codes Not Working</h3>
    <p>If your backup codes are being rejected:</p>
    <ul>
        <li>Ensure you\'re entering the full code including any hyphens</li>
        <li>Check if you\'ve already used that particular code</li>
        <li>Verify you\'re using the most recently generated set of codes</li>
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
    
    <h2>Accessing Your Profile</h2>
    
    <p>There are several ways to access your profile:</p>
    
    <ul>
        <li>Click your profile picture in the top-right corner and select "Profile"</li>
        <li>Navigate directly to <code>/profile</code></li>
        <li>Click your username anywhere it appears as a link</li>
    </ul>
    
    <h2>Profile Components</h2>
    
    <p>Your profile consists of several key components that you can customize:</p>
    
    <h3>Profile Picture (Avatar)</h3>
    
    <p>Your profile picture appears throughout the platform and helps others identify you.</p>
    
    <h4>Uploading a Profile Picture</h4>
    <ol>
        <li>Navigate to your profile page</li>
        <li>Hover over your current profile picture and click "Edit"</li>
        <li>Select an image file from your device (supported formats: JPG, PNG, GIF)</li>
        <li>Crop and adjust the image as needed</li>
        <li>Click "Save" to update your profile picture</li>
    </ol>
    
    <h4>Profile Picture Guidelines</h4>
    <ul>
        <li><strong>Size:</strong> Recommended minimum 400x400 pixels</li>
        <li><strong>Format:</strong> JPG, PNG, or GIF</li>
        <li><strong>File size:</strong> Maximum 5MB</li>
        <li><strong>Content:</strong> Should be appropriate and professional</li>
    </ul>
    
    <h3>Cover Photo (Banner)</h3>
    
    <p>The cover photo appears at the top of your profile page and provides visual personalization.</p>
    
    <h4>Uploading a Cover Photo</h4>
    <ol>
        <li>Navigate to your profile page</li>
        <li>Click the "Edit Cover Photo" button in the top-right corner of the banner area</li>
        <li>Select an image file from your device</li>
        <li>Adjust the positioning as needed</li>
        <li>Click "Save" to update your cover photo</li>
    </ol>
    
    <h4>Cover Photo Guidelines</h4>
    <ul>
        <li><strong>Size:</strong> Recommended 1500x500 pixels</li>
        <li><strong>Format:</strong> JPG, PNG, or GIF</li>
        <li><strong>File size:</strong> Maximum 10MB</li>
        <li><strong>Content:</strong> Should be appropriate and professional</li>
    </ul>
    
    <h3>Profile Information</h3>
    
    <p>Your profile information includes various details about you that are visible to others.</p>
    
    <h4>Editing Basic Information</h4>
    <ol>
        <li>Navigate to your profile page</li>
        <li>Click "Edit Profile"</li>
        <li>Update the following fields as desired:</li>
        <ul>
            <li><strong>Display Name:</strong> Your preferred name (can be different from username)</li>
            <li><strong>Username:</strong> Your unique identifier (used in URLs)</li>
            <li><strong>Bio:</strong> A brief description about yourself</li>
            <li><strong>Location:</strong> Your city, state, country, etc.</li>
            <li><strong>Website:</strong> Your personal or professional website</li>
        </ul>
        <li>Click "Save Changes" to update your profile</li>
    </ol>
    
    <h3>Social Media Links</h3>
    
    <p>Connect your social media accounts to your profile for easy access.</p>
    
    <h4>Adding Social Media Links</h4>
    <ol>
        <li>Navigate to your profile page</li>
        <li>Click "Edit Profile"</li>
        <li>Scroll to the "Social Media" section</li>
        <li>Add links to your social media profiles:</li>
        <ul>
            <li>Twitter/X</li>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
            <li>YouTube</li>
            <li>GitHub</li>
            <li>Other platforms</li>
        </ul>
        <li>Click "Save Changes" to update your profile</li>
    </ol>
    
    <h2>Profile Privacy Settings</h2>
    
    <p>Control who can see your profile and what information is visible.</p>
    
    <h3>Adjusting Privacy Settings</h3>
    <ol>
        <li>Navigate to <strong>Profile → Privacy</strong></li>
        <li>Configure the following settings:</li>
        <ul>
            <li><strong>Profile Visibility:</strong> Public, Members Only, or Private</li>
            <li><strong>Email Visibility:</strong> Public, Members Only, or Private</li>
            <li><strong>Social Links Visibility:</strong> Public, Members Only, or Private</li>
            <li><strong>Activity Visibility:</strong> Public, Members Only, or Private</li>
        </ul>
        <li>Click "Save Privacy Settings" to apply changes</li>
    </ol>
    
    <h2>Profile Analytics</h2>
    
    <p>Track engagement with your profile to understand your audience.</p>
    
    <h3>Viewing Profile Analytics</h3>
    <ol>
        <li>Navigate to your profile page</li>
        <li>Click "Profile Insights" or "Analytics"</li>
        <li>View statistics such as:</li>
        <ul>
            <li>Profile views</li>
            <li>Visitor demographics</li>
            <li>Traffic sources</li>
            <li>Engagement metrics</li>
        </ul>
    </ol>
    
    <h2>Profile Verification</h2>
    
    <p>Verified profiles have a badge indicating authenticity.</p>
    
    <h3>Requesting Verification</h3>
    <ol>
        <li>Ensure your profile is complete with a profile picture and bio</li>
        <li>Navigate to <strong>Profile → Verification</strong></li>
        <li>Click "Request Verification"</li>
        <li>Complete the verification form with required information</li>
        <li>Submit supporting documentation as requested</li>
        <li>Wait for review (typically 3-5 business days)</li>
    </ol>
    
    <h2>Profile Customization Best Practices</h2>
    
    <ul>
        <li><strong>Use a clear, recognizable profile picture</strong> that represents you professionally</li>
        <li><strong>Create a compelling bio</strong> that succinctly describes who you are</li>
        <li><strong>Choose a cover photo</strong> that reflects your personality or brand</li>
        <li><strong>Keep information current</strong> by updating regularly</li>
        <li><strong>Include relevant social media links</strong> to expand your network</li>
        <li><strong>Consider your privacy needs</strong> when adjusting visibility settings</li>
        <li><strong>Monitor profile analytics</strong> to understand your audience</li>
    </ul>
    
    <h2>Troubleshooting</h2>
    
    <h3>Image Upload Issues</h3>
    <ul>
        <li>Ensure the file is under the size limit (5MB for profile pictures, 10MB for cover photos)</li>
        <li>Check that you\'re using a supported file format (JPG, PNG, GIF)</li>
        <li>Try a different browser or device</li>
        <li>Resize the image before uploading</li>
    </ul>
    
    <h3>Username Change Limitations</h3>
    <ul>
        <li>Usernames can only be changed once every 30 days</li>
        <li>Usernames must be unique across the platform</li>
        <li>Usernames cannot contain special characters except underscores and periods</li>
        <li>Previous usernames may be reserved for a period to prevent confusion</li>
    </ul>
    
    <h3>Profile Not Updating</h3>
    <ul>
        <li>Clear your browser cache and cookies</li>
        <li>Try logging out and back in</li>
        <li>Check for any error messages during the save process</li>
        <li>Ensure all required fields are completed</li>
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
        <li>Navigate to <code>/admin</code> or click "Admin" in the user dropdown menu</li>
        <li>You will be presented with the admin dashboard overview</li>
    </ol>
    
    <div class="note">
        <p><strong>Note:</strong> Only users with administrator role can access the admin panel. If you need access, contact your organization\'s super administrator.</p>
    </div>
    
    <h2>Dashboard Overview</h2>
    
    <p>The admin dashboard provides a high-level overview of your platform\'s performance and status:</p>
    
    <ul>
        <li><strong>Key Metrics:</strong> User count, content statistics, and engagement data</li>
        <li><strong>Recent Activity:</strong> Latest user registrations, content updates, and system events</li>
        <li><strong>System Status:</strong> Platform health indicators and service status</li>
        <li><strong>Quick Actions:</strong> Shortcuts to common administrative tasks</li>
    </ul>
    
    <h2>User Management</h2>
    
    <p>The user management section allows you to manage all user accounts on the platform.</p>
    
    <h3>User List</h3>
    
    <p>View and manage all users with powerful filtering and search capabilities:</p>
    
    <ul>
        <li><strong>Search:</strong> Find users by name, email, or username</li>
        <li><strong>Filters:</strong> Filter by role, status, registration date, etc.</li>
        <li><strong>Bulk Actions:</strong> Perform actions on multiple users simultaneously</li>
        <li><strong>Export:</strong> Download user data in CSV or Excel format</li>
    </ul>
    
    <h3>User Details</h3>
    
    <p>View and edit detailed information for individual users:</p>
    
    <ul>
        <li><strong>Profile Information:</strong> Name, email, username, etc.</li>
        <li><strong>Security Settings:</strong> Password reset, MFA status, account locks</li>
        <li><strong>Role Management:</strong> Assign or revoke user roles and permissions</li>
        <li><strong>Activity Log:</strong> View user\'s recent actions and login history</li>
        <li><strong>Account Actions:</strong> Suspend, delete, or restore user accounts</li>
    </ul>
    
    <h3>Role Management</h3>
    
    <p>Create and manage user roles with customized permissions:</p>
    
    <ul>
        <li><strong>Default Roles:</strong> Administrator, Moderator, Editor, Member</li>
        <li><strong>Custom Roles:</strong> Create roles with specific permission sets</li>
        <li><strong>Permission Assignment:</strong> Granular control over feature access</li>
        <li><strong>Role Hierarchy:</strong> Establish permission inheritance between roles</li>
    </ul>
    
    <h2>Content Management System (CMS)</h2>
    
    <p>The CMS section provides tools for managing all content across the platform.</p>
    
    <h3>Content Types</h3>
    
    <p>Create and manage different types of content:</p>
    
    <ul>
        <li><strong>Type Definition:</strong> Define fields, validation rules, and relationships</li>
        <li><strong>Schema Management:</strong> Modify existing content types</li>
        <li><strong>Field Types:</strong> Text, rich text, images, files, references, etc.</li>
        <li><strong>Templates:</strong> Create templates for consistent content creation</li>
    </ul>
    
    <h3>Content Editor</h3>
    
    <p>Create and edit content with a powerful rich text editor:</p>
    
    <ul>
        <li><strong>WYSIWYG Editing:</strong> Visual editing with formatting tools</li>
        <li><strong>Media Integration:</strong> Embed images, videos, and files</li>
        <li><strong>Version History:</strong> Track changes and revert to previous versions</li>
        <li><strong>Collaborative Editing:</strong> Multiple editors can work simultaneously</li>
        <li><strong>Publishing Workflow:</strong> Draft, review, and publish states</li>
    </ul>
    
    <h3>Media Library</h3>
    
    <p>Manage all media assets in a centralized library:</p>
    
    <ul>
        <li><strong>Upload:</strong> Single or bulk upload of images, videos, and files</li>
        <li><strong>Organization:</strong> Folders, tags, and metadata management</li>
        <li><strong>Image Editing:</strong> Basic cropping, resizing, and optimization</li>
        <li><strong>Usage Tracking:</strong> See where assets are used across the platform</li>
        <li><strong>Access Control:</strong> Manage permissions for media assets</li>
    </ul>
    
    <h2>Documentation Management</h2>
    
    <p>Manage the platform\'s documentation system:</p>
    
    <h3>Categories</h3>
    
    <ul>
        <li><strong>Category Creation:</strong> Organize documentation into logical sections</li>
        <li><strong>Hierarchy:</strong> Create parent-child relationships between categories</li>
        <li><strong>Ordering:</strong> Arrange categories in a specific order</li>
        <li><strong>Visibility:</strong> Control which categories are publicly visible</li>
    </ul>
    
    <h3>Articles</h3>
    
    <ul>
        <li><strong>Article Editor:</strong> Create and edit documentation articles</li>
        <li><strong>Versioning:</strong> Track changes and maintain version history</li>
        <li><strong>SEO Settings:</strong> Optimize articles for search engines</li>
        <li><strong>Related Content:</strong> Link related articles and resources</li>
        <li><strong>Feedback Collection:</strong> Gather user feedback on articles</li>
    </ul>
    
    <h3>Analytics</h3>
    
    <ul>
        <li><strong>View Tracking:</strong> Monitor article popularity and engagement</li>
        <li><strong>Search Analytics:</strong> See what users are searching for</li>
        <li><strong>Feedback Analysis:</strong> Review user ratings and comments</li>
        <li><strong>Content Gaps:</strong> Identify missing or needed documentation</li>
    </ul>
    
    <h2>Community Management</h2>
    
    <p>Manage the community forum and user interactions:</p>
    
    <h3>Categories and Topics</h3>
    
    <ul>
        <li><strong>Category Management:</strong> Create and organize forum categories</li>
        <li><strong>Topic Moderation:</strong> Review, edit, or remove discussion topics</li>
        <li><strong>Pinned Topics:</strong> Highlight important discussions</li>
        <li><strong>Closed Topics:</strong> Prevent further replies to resolved discussions</li>
    </ul>
    
    <h3>Moderation Tools</h3>
    
    <ul>
        <li><strong>Content Approval:</strong> Review posts before they appear publicly</li>
        <li><strong>Flagged Content:</strong> Review content flagged by users</li>
        <li><strong>User Warnings:</strong> Issue warnings to users who violate guidelines</li>
        <li><strong>Temporary Suspensions:</strong> Restrict posting privileges temporarily</li>
        <li><strong>Ban Management:</strong> Permanently restrict access for severe violations</li>
    </ul>
    
    <h3>Community Insights</h3>
    
    <ul>
        <li><strong>Engagement Metrics:</strong> Track participation and activity levels</li>
        <li><strong>Popular Content:</strong> Identify trending topics and discussions</li>
        <li><strong>User Contributions:</strong> Monitor individual user participation</li>
        <li><strong>Community Health:</strong> Assess overall community vitality</li>
    </ul>
    
    <h2>Shop Management</h2>
    
    <p>Manage e-commerce functionality across the platform:</p>
    
    <h3>Shop Configuration</h3>
    
    <ul>
        <li><strong>Shop Creation:</strong> Set up new e-commerce shops</li>
        <li><strong>Settings:</strong> Configure payment methods, shipping, and taxes</li>
        <li><strong>Branding:</strong> Customize shop appearance and messaging</li>
        <li><strong>Multi-shop Management:</strong> Administer multiple shops from one interface</li>
    </ul>
    
    <h3>Product Management</h3>
    
    <ul>
        <li><strong>Product Catalog:</strong> Create and manage products</li>
        <li><strong>Inventory:</strong> Track stock levels and manage availability</li>
        <li><strong>Pricing:</strong> Set prices, discounts, and special offers</li>
        <li><strong>Categories:</strong> Organize products into browsable categories</li>
        <li><strong>Attributes:</strong> Define product variations (size, color, etc.)</li>
    </ul>
    
    <h3>Order Processing</h3>
    
    <ul>
        <li><strong>Order Management:</strong> View and process customer orders</li>
        <li><strong>Status Updates:</strong> Track order fulfillment status</li>
        <li><strong>Shipping:</strong> Generate shipping labels and tracking information</li>
        <li><strong>Returns:</strong> Process refunds and returns</li>
        <li><strong>Customer Communication:</strong> Send order updates and notifications</li>
    </ul>
    
    <h2>Domain Management</h2>
    
    <p>Manage domains and subdomains for the multi-tenant platform:</p>
    
    <h3>Domain Configuration</h3>
    
    <ul>
        <li><strong>Domain Registration:</strong> Add new domains to the platform</li>
        <li><strong>DNS Settings:</strong> Configure DNS records and verification</li>
        <li><strong>SSL Certificates:</strong> Manage HTTPS encryption for domains</li>
        <li><strong>Subdomain Creation:</strong> Set up specialized subdomains (docs, shop, etc.)</li>
    </ul>
    
    <h3>Domain Mapping</h3>
    
    <ul>
        <li><strong>Tenant Assignment:</strong> Map domains to specific tenants</li>
        <li><strong>Redirects:</strong> Configure domain redirects and aliases</li>
        <li><strong>Path Mapping:</strong> Customize URL structures for domains</li>
        <li><strong>Domain Verification:</strong> Verify domain ownership</li>
    </ul>
    
    <h2>Analytics and Reporting</h2>
    
    <p>Access comprehensive analytics and generate reports:</p>
    
    <h3>Platform Analytics</h3>
    
    <ul>
        <li><strong>User Analytics:</strong> Registration, engagement, and retention metrics</li>
        <li><strong>Content Analytics:</strong> Publication, views, and interaction data</li>
        <li><strong>Shop Analytics:</strong> Sales, revenue, and conversion metrics</li>
        <li><strong>Performance Analytics:</strong> System performance and resource usage</li>
    </ul>
    
    <h3>Custom Reports</h3>
    
    <ul>
        <li><strong>Report Builder:</strong> Create custom reports with selected metrics</li>
        <li><strong>Scheduled Reports:</strong> Automate report generation and delivery</li>
        <li><strong>Export Options:</strong> Download reports in various formats (PDF, Excel, CSV)</li>
        <li><strong>Data Visualization:</strong> Charts, graphs, and interactive dashboards</li>
    </ul>
    
    <h2>System Settings</h2>
    
    <p>Configure global platform settings:</p>
    
    <h3>General Settings</h3>
    
    <ul>
        <li><strong>Platform Name:</strong> Set the name displayed throughout the platform</li>
        <li><strong>Logo and Branding:</strong> Upload logos and configure brand colors</li>
        <li><strong>Date and Time:</strong> Set timezone and date format preferences</li>
        <li><strong>Language:</strong> Configure default and available languages</li>
    </ul>
    
    <h3>Security Settings</h3>
    
    <ul>
        <li><strong>Password Policy:</strong> Set requirements for user passwords</li>
        <li><strong>MFA Requirements:</strong> Configure multi-factor authentication rules</li>
        <li><strong>Session Management:</strong> Set session timeout and security parameters</li>
        <li><strong>API Keys:</strong> Manage access keys for external integrations</li>
    </ul>
    
    <h3>Email Settings</h3>
    
    <ul>
        <li><strong>SMTP Configuration:</strong> Set up email delivery services</li>
        <li><strong>Email Templates:</strong> Customize notification and system emails</li>
        <li><strong>Notification Rules:</strong> Configure when emails are sent</li>
        <li><strong>Email Testing:</strong> Send test emails to verify configuration</li>
    </ul>
    
    <h2>Enterprise Features</h2>
    
    <p>Access and configure advanced enterprise capabilities:</p>
    
    <h3>Knowledge Graph</h3>
    
    <ul>
        <li><strong>Content Relationships:</strong> Map connections between content items</li>
        <li><strong>Semantic Analysis:</strong> Automatically identify related content</li>
        <li><strong>Visualization:</strong> View content relationships graphically</li>
        <li><strong>Content Discovery:</strong> Enhance search with relationship data</li>
    </ul>
    
    <h3>Predictive Content Planning</h3>
    
    <ul>
        <li><strong>Content Performance:</strong> Analyze what content performs best</li>
        <li><strong>Topic Suggestions:</strong> AI-powered content topic recommendations</li>
        <li><strong>Scheduling Optimization:</strong> Determine optimal publishing times</li>
        <li><strong>Audience Insights:</strong> Understand what resonates with your audience</li>
    </ul>
    
    <h3>Compliance Automation</h3>
    
    <ul>
        <li><strong>Content Scanning:</strong> Automatically check content for compliance issues</li>
        <li><strong>Regulatory Updates:</strong> Stay informed about relevant regulations</li>
        <li><strong>Audit Trails:</strong> Maintain records for compliance verification</li>
        <li><strong>Compliance Reporting:</strong> Generate reports for regulatory requirements</li>
    </ul>
    
    <h3>Enterprise Integrations</h3>
    
    <ul>
        <li><strong>Third-party Services:</strong> Connect with external enterprise systems</li>
        <li><strong>Data Exchange:</strong> Configure data import/export with other platforms</li>
        <li><strong>Single Sign-On:</strong> Implement enterprise SSO solutions</li>
        <li><strong>Custom Integrations:</strong> Develop specialized integration solutions</li>
    </ul>
    
    <h2>Audit Logs</h2>
    
    <p>Review comprehensive logs of all administrative actions:</p>
    
    <ul>
        <li><strong>User Actions:</strong> Track changes made by administrators</li>
        <li><strong>System Events:</strong> Monitor automated system activities</li>
        <li><strong>Security Events:</strong> Log authentication and security-related events</li>
        <li><strong>Filtering:</strong> Search and filter logs by various criteria</li>
        <li><strong>Export:</strong> Download logs for external analysis or archiving</li>
    </ul>
    
    <h2>Admin Best Practices</h2>
    
    <ul>
        <li><strong>Regular Backups:</strong> Ensure data is backed up frequently</li>
        <li><strong>Least Privilege:</strong> Assign only necessary permissions to users</li>
        <li><strong>Audit Log Review:</strong> Regularly check admin actions for security</li>
        <li><strong>Two-Factor Authentication:</strong> Require MFA for all admin accounts</li>
        <li><strong>Documentation:</strong> Maintain internal documentation of admin procedures</li>
        <li><strong>Testing:</strong> Test changes in a staging environment before production</li>
        <li><strong>Regular Updates:</strong> Keep the platform updated with security patches</li>
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
    
    <p>The Big Based Enterprise Knowledge Graph is an advanced feature that creates a semantic network of relationships between content, users, and concepts across your platform. This document explains how to use and benefit from this powerful enterprise capability.</p>
    
    <h2>Understanding the Knowledge Graph</h2>
    
    <p>A knowledge graph is a structured representation of knowledge that connects entities (content, users, concepts) through meaningful relationships. The Big Based Knowledge Graph:</p>
    
    <ul>
        <li>Automatically identifies relationships between content items</li>
        <li>Maps connections between users and content</li>
        <li>Creates a semantic understanding of your platform\'s information</li>
        <li>Enhances search, discovery, and content recommendations</li>
        <li>Provides insights into content gaps and opportunities</li>
    </ul>
    
    <h2>Key Components</h2>
    
    <h3>Entities</h3>
    
    <p>Entities are the nodes in the knowledge graph and can include:</p>
    
    <ul>
        <li><strong>Content Items:</strong> Articles, pages, products, media</li>
        <li><strong>Concepts:</strong> Topics, themes, categories, tags</li>
        <li><strong>Users:</strong> Content creators, consumers, and contributors</li>
        <li><strong>Organizations:</strong> Companies, departments, teams</li>
        <li><strong>Events:</strong> Webinars, conferences, product launches</li>
    </ul>
    
    <h3>Relationships</h3>
    
    <p>Relationships define how entities are connected:</p>
    
    <ul>
        <li><strong>Content-to-Content:</strong> "References," "Similar to," "Prerequisite for"</li>
        <li><strong>User-to-Content:</strong> "Created," "Viewed," "Favorited"</li>
        <li><strong>Concept-to-Content:</strong> "Categorizes," "Tags," "Describes"</li>
        <li><strong>User-to-User:</strong> "Follows," "Collaborates with," "Reports to"</li>
    </ul>
    
    <h3>Attributes</h3>
    
    <p>Attributes provide additional information about entities and relationships:</p>
    
    <ul>
        <li><strong>Entity Attributes:</strong> Creation date, popularity, complexity level</li>
        <li><strong>Relationship Attributes:</strong> Strength, directionality, timestamp</li>
    </ul>
    
    <h2>Accessing the Knowledge Graph</h2>
    
    <h3>Admin Interface</h3>
    
    <p>Access the Knowledge Graph through the admin panel:</p>
    
    <ol>
        <li>Navigate to <strong>Admin → Enterprise Features → Knowledge Graph</strong></li>
        <li>The dashboard displays an overview of your knowledge graph</li>
        <li>Use the visualization tools to explore relationships</li>
        <li>Access analytics and insights about your content network</li>
    </ol>
    
    <h3>API Access</h3>
    
    <p>Developers can access the Knowledge Graph programmatically:</p>
    
    <pre><code>GET /api/v1/enterprise/knowledge-graph/entities/{id}
GET /api/v1/enterprise/knowledge-graph/relationships?entity={id}
GET /api/v1/enterprise/knowledge-graph/search?q={query}</code></pre>
    
    <h2>Key Features</h2>
    
    <h3>Automatic Relationship Detection</h3>
    
    <p>The system automatically identifies relationships between content:</p>
    
    <ul>
        <li><strong>Content Analysis:</strong> Natural language processing identifies topics and concepts</li>
        <li><strong>Link Analysis:</strong> Detects explicit references between content</li>
        <li><strong>Usage Patterns:</strong> Identifies relationships based on user behavior</li>
        <li><strong>Semantic Similarity:</strong> Connects content with similar meaning or purpose</li>
    </ul>
    
    <h3>Visualization Tools</h3>
    
    <p>Explore your knowledge graph visually:</p>
    
    <ul>
        <li><strong>Interactive Graph:</strong> Navigate the network of relationships</li>
        <li><strong>Filtering:</strong> Focus on specific entity types or relationship types</li>
        <li><strong>Clustering:</strong> Identify groups of closely related content</li>
        <li><strong>Path Analysis:</strong> Find connections between seemingly unrelated entities</li>
    </ul>
    
    <h3>Content Recommendations</h3>
    
    <p>Leverage the knowledge graph for intelligent recommendations:</p>
    
    <ul>
        <li><strong>Related Content:</strong> Suggest truly relevant content to users</li>
        <li><strong>Learning Paths:</strong> Create sequences of content for progressive learning</li>
        <li><strong>Expertise Mapping:</strong> Connect users with relevant experts</li>
        <li><strong>Content Gap Analysis:</strong> Identify missing content opportunities</li>
    </ul>
    
    <h3>Enhanced Search</h3>
    
    <p>Improve search results using knowledge graph data:</p>
    
    <ul>
        <li><strong>Semantic Search:</strong> Find content based on meaning, not just keywords</li>
        <li><strong>Contextual Relevance:</strong> Rank results based on relationship strength</li>
        <li><strong>Faceted Navigation:</strong> Filter search results by relationship types</li>
        <li><strong>Knowledge Panels:</strong> Display related entities alongside search results</li>
    </ul>
    
    <h2>Managing the Knowledge Graph</h2>
    
    <h3>Manual Relationship Creation</h3>
    
    <p>Add relationships that may not be automatically detected:</p>
    
    <ol>
        <li>Navigate to <strong>Admin → Enterprise Features → Knowledge Graph → Relationships</strong></li>
        <li>Click "Create Relationship"</li>
        <li>Select the source entity, relationship type, and target entity</li>
        <li>Add any relevant attributes to the relationship</li>
        <li>Save the new relationship</li>
    </ol>
    
    <h3>Relationship Validation</h3>
    
    <p>Review and approve automatically detected relationships:</p>
    
    <ol>
        <li>Navigate to <strong>Admin → Enterprise Features → Knowledge Graph → Pending</strong></li>
        <li>Review suggested relationships identified by the system</li>
        <li>Approve, reject, or modify each suggestion</li>
        <li>Batch process relationships by type or confidence score</li>
    </ol>
    
    <h3>Knowledge Graph Maintenance</h3>
    
    <p>Keep your knowledge graph accurate and valuable:</p>
    
    <ul>
        <li><strong>Regular Audits:</strong> Review and clean up outdated relationships</li>
        <li><strong>Reprocessing:</strong> Update the graph when content changes significantly</li>
        <li><strong>Performance Monitoring:</strong> Track how the graph impacts user experience</li>
        <li><strong>Feedback Loop:</strong> Incorporate user feedback on recommendations</li>
    </ul>
    
    <h2>Analytics and Insights</h2>
    
    <h3>Content Network Analysis</h3>
    
    <p>Gain insights from your content network:</p>
    
    <ul>
        <li><strong>Centrality Analysis:</strong> Identify the most connected and influential content</li>
        <li><strong>Cluster Analysis:</strong> Discover natural content groupings</li>
        <li><strong>Path Analysis:</strong> Understand how users navigate between content</li>
        <li><strong>Isolation Detection:</strong> Find orphaned or disconnected content</li>
    </ul>
    
    <h3>Knowledge Gap Analysis</h3>
    
    <p>Identify opportunities for new content:</p>
    
    <ul>
        <li><strong>Missing Links:</strong> Detect expected but absent relationships</li>
        <li><strong>Topic Coverage:</strong> Analyze the depth of coverage across topics</li>
        <li><strong>User Needs:</strong> Identify searches and queries with poor results</li>
        <li><strong>Content Planning:</strong> Prioritize content creation based on gaps</li>
    </ul>
    
    <h2>Use Cases</h2>
    
    <h3>Documentation Improvement</h3>
    
    <p>Enhance technical documentation:</p>
    
    <ul>
        <li>Create logical learning paths through documentation</li>
        <li>Identify missing documentation topics</li>
        <li>Connect related concepts across different documentation sections</li>
        <li>Improve navigation between related documentation articles</li>
    </ul>
    
    <h3>E-commerce Enhancement</h3>
    
    <p>Improve shopping experiences:</p>
    
    <ul>
        <li>Create more accurate "related products" recommendations</li>
        <li>Build "frequently bought together" suggestions based on actual relationships</li>
        <li>Connect products with relevant documentation and support content</li>
        <li>Identify product categories with weak connections</li>
    </ul>
    
    <h3>Community Knowledge Sharing</h3>
    
    <p>Enhance community interactions:</p>
    
    <ul>
        <li>Connect forum discussions with relevant documentation</li>
        <li>Identify subject matter experts for specific topics</li>
        <li>Suggest relevant discussions to users based on their interests</li>
        <li>Map knowledge distribution across the community</li>
    </ul>
    
    <h2>Best Practices</h2>
    
    <ul>
        <li><strong>Start with Quality Content:</strong> The knowledge graph is only as good as your content</li>
        <li><strong>Define Clear Relationship Types:</strong> Create a consistent taxonomy of relationships</li>
        <li><strong>Balance Automation and Curation:</strong> Review automated suggestions regularly</li>
        <li><strong>Focus on User Value:</strong> Prioritize relationships that enhance user experience</li>
        <li><strong>Measure Impact:</strong> Track how the knowledge graph affects engagement metrics</li>
        <li><strong>Iterate and Improve:</strong> Continuously refine your knowledge graph strategy</li>
    </ul>
    
    <h2>Technical Specifications</h2>
    
    <ul>
        <li><strong>Storage:</strong> Specialized graph database optimized for relationship queries</li>
        <li><strong>Processing:</strong> Combination of batch processing and real-time updates</li>
        <li><strong>Scalability:</strong> Handles millions of entities and relationships</li>
        <li><strong>Performance:</strong> Sub-second query response for most operations</li>
        <li><strong>Integration:</strong> REST API and GraphQL endpoints for custom applications</li>
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
    
    <p>The Big Based platform provides comprehensive REST APIs that allow developers to integrate with and extend the platform\'s functionality. This guide covers authentication, endpoints, best practices, and example implementations.</p>
    
    <h2>API Overview</h2>
    
    <p>The Big Based API follows REST principles and uses standard HTTP methods:</p>
    
    <ul>
        <li><strong>GET</strong> - Retrieve resources</li>
        <li><strong>POST</strong> - Create new resources</li>
        <li><strong>PUT</strong> - Update existing resources</li>
        <li><strong>PATCH</strong> - Partially update resources</li>
        <li><strong>DELETE</strong> - Remove resources</li>
    </ul>
    
    <p>All API responses are in JSON format and include consistent status codes and error handling.</p>
    
    <h2>Base URL</h2>
    
    <p>All API requests should be made to the following base URL:</p>
    
    <pre><code>https://api.bigbased.com/v1/</code></pre>
    
    <p>For tenant-specific operations, use:</p>
    
    <pre><code>https://api.{tenant-domain}/v1/</code></pre>
    
    <h2>Authentication</h2>
    
    <p>The API supports multiple authentication methods:</p>
    
    <h3>API Key Authentication</h3>
    
    <p>For server-to-server integrations, use API key authentication:</p>
    
    <pre><code>curl -H "Authorization: Bearer YOUR_API_KEY" https://api.bigbased.com/v1/users</code></pre>
    
    <h4>Generating API Keys</h4>
    
    <ol>
        <li>Navigate to <strong>Admin → System Settings → API Keys</strong></li>
        <li>Click "Generate New API Key"</li>
        <li>Set permissions and expiration for the key</li>
        <li>Store the key securely - it will only be shown once</li>
    </ol>
    
    <h3>OAuth 2.0</h3>
    
    <p>For user-context operations, use OAuth 2.0:</p>
    
    <h4>Authorization Code Flow</h4>
    
    <ol>
        <li>Redirect the user to the authorization endpoint:
            <pre><code>https://auth.bigbased.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID
  &redirect_uri=YOUR_REDIRECT_URI
  &response_type=code
  &scope=read:users write:content</code></pre>
        </li>
        <li>User authenticates and authorizes your application</li>
        <li>User is redirected back with an authorization code</li>
        <li>Exchange the code for an access token:
            <pre><code>POST https://auth.bigbased.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
&code=AUTHORIZATION_CODE
&redirect_uri=YOUR_REDIRECT_URI</code></pre>
        </li>
        <li>Use the access token for API requests:
            <pre><code>curl -H "Authorization: Bearer ACCESS_TOKEN" https://api.bigbased.com/v1/users/me</code></pre>
        </li>
    </ol>
    
    <h4>Registering OAuth Applications</h4>
    
    <ol>
        <li>Navigate to <strong>Admin → System Settings → OAuth Applications</strong></li>
        <li>Click "Register New Application"</li>
        <li>Provide application name, redirect URIs, and requested scopes</li>
        <li>Store the client ID and secret securely</li>
    </ol>
    
    <h2>API Endpoints</h2>
    
    <h3>User Management</h3>
    
    <h4>List Users</h4>
    <pre><code>GET /users</code></pre>
    <p>Query parameters:</p>
    <ul>
        <li><code>page</code> - Page number (default: 1)</li>
        <li><code>limit</code> - Results per page (default: 20, max: 100)</li>
        <li><code>sort</code> - Sort field (e.g., created_at, name)</li>
        <li><code>order</code> - Sort order (asc, desc)</li>
        <li><code>filter</code> - Filter criteria (JSON format)</li>
    </ul>
    
    <h4>Get User</h4>
    <pre><code>GET /users/{id}</code></pre>
    
    <h4>Create User</h4>
    <pre><code>POST /users</code></pre>
    <p>Request body:</p>
    <pre><code>{
  "email": "user@example.com",
  "name": "John Doe",
  "username": "johndoe",
  "role": "member",
  "password": "securepassword"
}</code></pre>
    
    <h4>Update User</h4>
    <pre><code>PUT /users/{id}</code></pre>
    <p>Request body:</p>
    <pre><code>{
  "name": "John Smith",
  "username": "johnsmith"
}</code></pre>
    
    <h4>Delete User</h4>
    <pre><code>DELETE /users/{id}</code></pre>
    
    <h3>Content Management</h3>
    
    <h4>List Content</h4>
    <pre><code>GET /content</code></pre>
    <p>Query parameters:</p>
    <ul>
        <li><code>type</code> - Content type (e.g., article, page)</li>
        <li><code>status</code> - Publication status (draft, published, archived)</li>
        <li><code>page</code> - Page number</li>
        <li><code>limit</code> - Results per page</li>
    </ul>
    
    <h4>Get Content Item</h4>
    <pre><code>GET /content/{id}</code></pre>
    
    <h4>Create Content</h4>
    <pre><code>POST /content</code></pre>
    <p>Request body:</p>
    <pre><code>{
  "title": "Article Title",
  "content": "Article content in HTML or Markdown",
  "type": "article",
  "status": "draft",
  "category_id": "category-uuid",
  "tags": ["tag1", "tag2"],
  "metadata": {
    "seo_title": "SEO Title",
    "seo_description": "SEO Description"
  }
}</code></pre>
    
    <h4>Update Content</h4>
    <pre><code>PUT /content/{id}</code></pre>
    
    <h4>Delete Content</h4>
    <pre><code>DELETE /content/{id}</code></pre>
    
    <h3>Shop Management</h3>
    
    <h4>List Products</h4>
    <pre><code>GET /shops/{shop_id}/products</code></pre>
    
    <h4>Create Product</h4>
    <pre><code>POST /shops/{shop_id}/products</code></pre>
    <p>Request body:</p>
    <pre><code>{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "currency": "USD",
  "sku": "PROD-001",
  "inventory": 100,
  "category_id": "category-uuid",
  "images": ["image1.jpg", "image2.jpg"],
  "attributes": {
    "color": "blue",
    "size": "large"
  }
}</code></pre>
    
    <h4>List Orders</h4>
    <pre><code>GET /shops/{shop_id}/orders</code></pre>
    
    <h4>Update Order Status</h4>
    <pre><code>PATCH /shops/{shop_id}/orders/{order_id}</code></pre>
    <p>Request body:</p>
    <pre><code>{
  "status": "shipped",
  "tracking_number": "1234567890"
}</code></pre>
    
    <h3>Documentation API</h3>
    
    <h4>List Documentation Categories</h4>
    <pre><code>GET /docs/categories</code></pre>
    
    <h4>List Articles</h4>
    <pre><code>GET /docs/articles</code></pre>
    
    <h4>Get Article</h4>
    <pre><code>GET /docs/articles/{id}</code></pre>
    
    <h4>Search Documentation</h4>
    <pre><code>GET /docs/search?q={query}</code></pre>
    
    <h3>Community API</h3>
    
    <h4>List Forum Categories</h4>
    <pre><code>GET /community/categories</code></pre>
    
    <h4>List Topics</h4>
    <pre><code>GET /community/topics</code></pre>
    
    <h4>Create Topic</h4>
    <pre><code>POST /community/topics</code></pre>
    <p>Request body:</p>
    <pre><code>{
  "title": "Topic Title",
  "content": "Topic content",
  "category_id": "category-uuid"
}</code></pre>
    
    <h4>Create Post</h4>
    <pre><code>POST /community/topics/{topic_id}/posts</code></pre>
    <p>Request body:</p>
    <pre><code>{
  "content": "Post content"
}</code></pre>
    
    <h2>Response Format</h2>
    
    <p>All API responses follow a consistent format:</p>
    
    <h3>Success Response</h3>
    <pre><code>{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}</code></pre>
    
    <h3>Error Response</h3>
    <pre><code>{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}</code></pre>
    
    <h2>Status Codes</h2>
    
    <p>The API uses standard HTTP status codes:</p>
    
    <ul>
        <li><strong>200 OK</strong> - Request successful</li>
        <li><strong>201 Created</strong> - Resource created successfully</li>
        <li><strong>400 Bad Request</strong> - Invalid request data</li>
        <li><strong>401 Unauthorized</strong> - Authentication required</li>
        <li><strong>403 Forbidden</strong> - Insufficient permissions</li>
        <li><strong>404 Not Found</strong> - Resource not found</li>
        <li><strong>422 Unprocessable Entity</strong> - Validation errors</li>
        <li><strong>429 Too Many Requests</strong> - Rate limit exceeded</li>
        <li><strong>500 Internal Server Error</strong> - Server error</li>
    </ul>
    
    <h2>Rate Limiting</h2>
    
    <p>API requests are rate limited to ensure fair usage:</p>
    
    <ul>
        <li><strong>Authenticated requests:</strong> 1000 requests per hour</li>
        <li><strong>Unauthenticated requests:</strong> 100 requests per hour</li>
        <li><strong>Burst limit:</strong> 100 requests per minute</li>
    </ul>
    
    <p>Rate limit headers are included in responses:</p>
    
    <pre><code>X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200</code></pre>
    
    <h2>Webhooks</h2>
    
    <p>Subscribe to real-time events using webhooks:</p>
    
    <h3>Setting Up Webhooks</h3>
    
    <ol>
        <li>Navigate to <strong>Admin → System Settings → Webhooks</strong></li>
        <li>Click "Create Webhook"</li>
        <li>Provide the endpoint URL and select events to subscribe to</li>
        <li>Configure authentication and retry settings</li>
    </ol>
    
    <h3>Available Events</h3>
    
    <ul>
        <li><code>user.created</code> - New user registration</li>
        <li><code>user.updated</code> - User profile changes</li>
        <li><code>content.published</code> - Content publication</li>
        <li><code>order.created</code> - New order placed</li>
        <li><code>order.updated</code> - Order status change</li>
        <li><code>topic.created</code> - New forum topic</li>
        <li><code>post.created</code> - New forum post</li>
    </ul>
    
    <h3>Webhook Payload</h3>
    
    <pre><code>{
  "event": "user.created",
  "timestamp": "2024-01-01T12:00:00Z",
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T12:00:00Z"
  }
}</code></pre>
    
    <h2>SDKs and Libraries</h2>
    
    <p>Official SDKs are available for popular programming languages:</p>
    
    <h3>JavaScript/Node.js</h3>
    <pre><code>npm install @bigbased/api-client</code></pre>
    
    <h3>Python</h3>
    <pre><code>pip install bigbased-api</code></pre>
    
    <h3>PHP</h3>
    <pre><code>composer require bigbased/api-client</code></pre>
    
    <h3>Example Usage (JavaScript)</h3>
    
    <pre><code>import { BigBasedAPI } from "@bigbased/api-client";

const api = new BigBasedAPI({
  apiKey: "your-api-key",
  baseURL: "https://api.bigbased.com/v1"
});

// List users
const users = await api.users.list({
  page: 1,
  limit: 20
});

// Create content
const article = await api.content.create({
  title: "New Article",
  content: "Article content",
  type: "article",
  status: "published"
});</code></pre>
    
    <h2>Best Practices</h2>
    
    <ul>
        <li><strong>Use HTTPS:</strong> Always use HTTPS for API requests</li>
        <li><strong>Store credentials securely:</strong> Never expose API keys in client-side code</li>
        <li><strong>Handle rate limits:</strong> Implement exponential backoff for rate limit responses</li>
        <li><strong>Validate responses:</strong> Always check the success field in responses</li>
        <li><strong>Use pagination:</strong> Don\'t request all data at once for large datasets</li>
        <li><strong>Cache responses:</strong> Cache data when appropriate to reduce API calls</li>
        <li><strong>Monitor usage:</strong> Track your API usage to avoid hitting limits</li>
        <li><strong>Handle errors gracefully:</strong> Implement proper error handling and user feedback</li>
    </ul>
    
    <h2>Testing</h2>
    
    <p>Use the following tools to test API integration:</p>
    
    <ul>
        <li><strong>Postman Collection:</strong> Import our Postman collection for easy testing</li>
        <li><strong>Sandbox Environment:</strong> Test against sandbox.bigbased.com</li>
        <li><strong>API Explorer:</strong> Interactive documentation at docs.bigbased.com/api</li>
    </ul>
    
    <h2>Support</h2>
    
    <p>For API support and questions:</p>
    
    <ul>
        <li><strong>Documentation:</strong> Complete API reference at docs.bigbased.com/api</li>
        <li><strong>Community Forum:</strong> Ask questions at community.bigbased.com</li>
        <li><strong>Support Email:</strong> api-support@bigbased.com</li>
        <li><strong>Status Page:</strong> Monitor API status at status.bigbased.com</li>
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
