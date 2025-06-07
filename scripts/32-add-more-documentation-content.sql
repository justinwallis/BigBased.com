-- Add more comprehensive documentation content

-- Shop System Documentation
INSERT INTO documentation_articles (title, slug, content, excerpt, category_id, author_id, status, is_featured, version)
SELECT 
    'Complete Shop System Guide',
    'shop-system-guide',
    '<h1>Complete Shop System Guide</h1>
    
    <p>The Big Based Shop System is a comprehensive e-commerce solution that allows you to create and manage multiple online stores within your platform. This guide covers everything from initial setup to advanced features and optimization.</p>
    
    <h2>Shop System Overview</h2>
    
    <p>The Shop System provides:</p>
    
    <ul>
        <li><strong>Multi-shop Support:</strong> Create and manage multiple independent shops</li>
        <li><strong>Product Management:</strong> Comprehensive product catalog with variants and attributes</li>
        <li><strong>Order Processing:</strong> Complete order lifecycle management</li>
        <li><strong>Customer Management:</strong> Customer accounts, profiles, and order history</li>
        <li><strong>Payment Integration:</strong> Stripe and PayPal payment processing</li>
        <li><strong>Inventory Management:</strong> Stock tracking and low-stock alerts</li>
        <li><strong>Discount System:</strong> Coupons, promotions, and bulk discounts</li>
        <li><strong>Analytics:</strong> Sales reporting and performance metrics</li>
    </ul>
    
    <h2>Creating Your First Shop</h2>
    
    <h3>Shop Setup</h3>
    
    <ol>
        <li>Navigate to <strong>Admin → Shops</strong></li>
        <li>Click "Create New Shop"</li>
        <li>Fill in the shop details:
            <ul>
                <li><strong>Shop Name:</strong> The display name for your shop</li>
                <li><strong>Slug:</strong> URL-friendly identifier (e.g., "my-shop")</li>
                <li><strong>Description:</strong> Brief description of your shop</li>
                <li><strong>Domain:</strong> Custom domain or subdomain (optional)</li>
            </ul>
        </li>
        <li>Configure basic settings:
            <ul>
                <li><strong>Currency:</strong> Default currency for pricing</li>
                <li><strong>Tax Settings:</strong> Tax rates and calculation methods</li>
                <li><strong>Shipping:</strong> Shipping zones and rates</li>
            </ul>
        </li>
        <li>Click "Create Shop" to finish setup</li>
    </ol>
    
    <h3>Shop Configuration</h3>
    
    <p>After creating your shop, configure additional settings:</p>
    
    <h4>Payment Methods</h4>
    <ol>
        <li>Go to <strong>Shop Settings → Payment Methods</strong></li>
        <li>Enable desired payment methods:
            <ul>
                <li><strong>Stripe:</strong> Credit cards, digital wallets</li>
                <li><strong>PayPal:</strong> PayPal accounts and guest checkout</li>
                <li><strong>Bank Transfer:</strong> Manual payment processing</li>
            </ul>
        </li>
        <li>Configure payment method settings and test credentials</li>
    </ol>
    
    <h4>Shipping Configuration</h4>
    <ol>
        <li>Go to <strong>Shop Settings → Shipping</strong></li>
        <li>Create shipping zones (e.g., "Domestic", "International")</li>
        <li>Add shipping methods for each zone:
            <ul>
                <li><strong>Flat Rate:</strong> Fixed shipping cost</li>
                <li><strong>Free Shipping:</strong> No shipping cost (with optional minimum order)</li>
                <li><strong>Weight-based:</strong> Shipping cost based on total weight</li>
                <li><strong>Carrier Rates:</strong> Real-time rates from shipping carriers</li>
            </ul>
        </li>
    </ol>
    
    <h2>Product Management</h2>
    
    <h3>Creating Products</h3>
    
    <ol>
        <li>Navigate to <strong>Shop → Products</strong></li>
        <li>Click "Add New Product"</li>
        <li>Fill in product information:
            <ul>
                <li><strong>Product Name:</strong> Clear, descriptive name</li>
                <li><strong>Description:</strong> Detailed product description</li>
                <li><strong>SKU:</strong> Unique product identifier</li>
                <li><strong>Price:</strong> Regular price and sale price (optional)</li>
                <li><strong>Weight:</strong> For shipping calculations</li>
                <li><strong>Dimensions:</strong> Length, width, height</li>
            </ul>
        </li>
        <li>Add product images:
            <ul>
                <li>Upload multiple high-quality images</li>
                <li>Set the main product image</li>
                <li>Add alt text for accessibility</li>
            </ul>
        </li>
        <li>Configure inventory:
            <ul>
                <li><strong>Track Inventory:</strong> Enable/disable stock tracking</li>
                <li><strong>Stock Quantity:</strong> Current available stock</li>
                <li><strong>Low Stock Threshold:</strong> Alert when stock is low</li>
                <li><strong>Backorders:</strong> Allow orders when out of stock</li>
            </ul>
        </li>
        <li>Set up SEO:
            <ul>
                <li><strong>SEO Title:</strong> Search engine optimized title</li>
                <li><strong>Meta Description:</strong> Brief description for search results</li>
                <li><strong>URL Slug:</strong> Custom URL for the product</li>
            </ul>
        </li>
    </ol>
    
    <h3>Product Variants</h3>
    
    <p>Create product variants for items with different options (size, color, etc.):</p>
    
    <ol>
        <li>In the product editor, go to the "Variants" section</li>
        <li>Add variant attributes:
            <ul>
                <li><strong>Size:</strong> Small, Medium, Large, XL</li>
                <li><strong>Color:</strong> Red, Blue, Green, Black</li>
                <li><strong>Material:</strong> Cotton, Polyester, Wool</li>
            </ul>
        </li>
        <li>Generate variant combinations automatically</li>
        <li>Set individual prices, SKUs, and stock levels for each variant</li>
        <li>Upload variant-specific images</li>
    </ol>
    
    <h3>Product Categories</h3>
    
    <p>Organize products into categories for better navigation:</p>
    
    <ol>
        <li>Go to <strong>Shop → Categories</strong></li>
        <li>Create category hierarchy:
            <ul>
                <li><strong>Clothing</strong>
                    <ul>
                        <li>Men\'s Clothing</li>
                        <li>Women\'s Clothing</li>
                        <li>Accessories</li>
                    </ul>
                </li>
                <li><strong>Electronics</strong>
                    <ul>
                        <li>Computers</li>
                        <li>Mobile Devices</li>
                        <li>Audio</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>Assign products to appropriate categories</li>
        <li>Set category images and descriptions</li>
    </ol>
    
    <h2>Order Management</h2>
    
    <h3>Order Processing Workflow</h3>
    
    <p>Orders go through several status stages:</p>
    
    <ol>
        <li><strong>Pending:</strong> Order placed, payment processing</li>
        <li><strong>Confirmed:</strong> Payment successful, order confirmed</li>
        <li><strong>Processing:</strong> Order being prepared for shipment</li>
        <li><strong>Shipped:</strong> Order dispatched to customer</li>
        <li><strong>Delivered:</strong> Order received by customer</li>
        <li><strong>Completed:</strong> Order fulfilled and closed</li>
    </ol>
    
    <h3>Managing Orders</h3>
    
    <ol>
        <li>Navigate to <strong>Shop → Orders</strong></li>
        <li>View order list with filtering options:
            <ul>
                <li>Filter by status, date range, customer</li>
                <li>Search by order number or customer name</li>
                <li>Sort by date, total, or status</li>
            </ul>
        </li>
        <li>Click on an order to view details:
            <ul>
                <li>Customer information and shipping address</li>
                <li>Ordered items with quantities and prices</li>
                <li>Payment information and status</li>
                <li>Order timeline and status history</li>
            </ul>
        </li>
        <li>Update order status and add notes</li>
        <li>Process refunds and returns</li>
    </ol>
    
    <h3>Shipping and Fulfillment</h3>
    
    <ol>
        <li>When ready to ship, update order status to "Processing"</li>
        <li>Generate shipping labels (if integrated with carriers)</li>
        <li>Add tracking information to the order</li>
        <li>Update status to "Shipped"</li>
        <li>Send shipping notification to customer</li>
    </ol>
    
    <h2>Customer Management</h2>
    
    <h3>Customer Accounts</h3>
    
    <p>Customers can create accounts to:</p>
    
    <ul>
        <li>View order history and track shipments</li>
        <li>Save shipping and billing addresses</li>
        <li>Create wishlists and favorites</li>
        <li>Receive personalized recommendations</li>
        <li>Access exclusive member pricing</li>
    </ul>
    
    <h3>Customer Data</h3>
    
    <p>Access customer information in <strong>Shop → Customers</strong>:</p>
    
    <ul>
        <li><strong>Profile Information:</strong> Name, email, phone, addresses</li>
        <li><strong>Order History:</strong> All past orders and their status</li>
        <li><strong>Purchase Behavior:</strong> Favorite products, categories, spending patterns</li>
        <li><strong>Communication Preferences:</strong> Email and SMS notification settings</li>
    </ul>
    
    <h2>Discount and Promotion System</h2>
    
    <h3>Creating Discounts</h3>
    
    <ol>
        <li>Navigate to <strong>Shop → Discounts</strong></li>
        <li>Click "Create New Discount"</li>
        <li>Choose discount type:
            <ul>
                <li><strong>Percentage:</strong> Percentage off total or specific items</li>
                <li><strong>Fixed Amount:</strong> Dollar amount off total or specific items</li>
                <li><strong>Free Shipping:</strong> Waive shipping costs</li>
                <li><strong>Buy X Get Y:</strong> Purchase-based promotions</li>
            </ul>
        </li>
        <li>Set discount conditions:
            <ul>
                <li><strong>Minimum Order Value:</strong> Require minimum purchase</li>
                <li><strong>Specific Products:</strong> Apply to certain products only</li>
                <li><strong>Customer Groups:</strong> Limit to specific customer segments</li>
                <li><strong>Usage Limits:</strong> Limit total uses or uses per customer</li>
            </ul>
        </li>
        <li>Configure timing:
            <ul>
                <li><strong>Start Date:</strong> When discount becomes active</li>
                <li><strong>End Date:</strong> When discount expires</li>
                <li><strong>Time Restrictions:</strong> Specific hours or days</li>
            </ul>
        </li>
    </ol>
    
    <h3>Coupon Codes</h3>
    
    <p>Create coupon codes for targeted promotions:</p>
    
    <ol>
        <li>In the discount editor, enable "Requires Coupon Code"</li>
        <li>Set a memorable coupon code (e.g., "SAVE20", "FREESHIP")</li>
        <li>Distribute codes through:
            <ul>
                <li>Email marketing campaigns</li>
                <li>Social media promotions</li>
                <li>Printed materials</li>
                <li>Partner websites</li>
            </ul>
        </li>
    </ol>
    
    <h2>Analytics and Reporting</h2>
    
    <h3>Sales Analytics</h3>
    
    <p>Monitor shop performance with comprehensive analytics:</p>
    
    <ul>
        <li><strong>Revenue Tracking:</strong> Daily, weekly, monthly, and yearly revenue</li>
        <li><strong>Order Metrics:</strong> Order count, average order value, conversion rates</li>
        <li><strong>Product Performance:</strong> Best-selling products, revenue by product</li>
        <li><strong>Customer Analytics:</strong> New vs. returning customers, customer lifetime value</li>
        <li><strong>Geographic Data:</strong> Sales by location and shipping destination</li>
    </ul>
    
    <h3>Inventory Reports</h3>
    
    <ul>
        <li><strong>Stock Levels:</strong> Current inventory across all products</li>
        <li><strong>Low Stock Alerts:</strong> Products below threshold levels</li>
        <li><strong>Inventory Valuation:</strong> Total value of current stock</li>
        <li><strong>Movement Reports:</strong> Inventory changes over time</li>
    </ul>
    
    <h3>Financial Reports</h3>
    
    <ul>
        <li><strong>Profit and Loss:</strong> Revenue, costs, and profit margins</li>
        <li><strong>Tax Reports:</strong> Tax collected by jurisdiction</li>
        <li><strong>Payment Method Analysis:</strong> Revenue by payment method</li>
        <li><strong>Refund Reports:</strong> Refunds and returns tracking</li>
    </ul>
    
    <h2>Advanced Features</h2>
    
    <h3>Multi-shop Management</h3>
    
    <p>Manage multiple shops from a single admin interface:</p>
    
    <ul>
        <li><strong>Centralized Dashboard:</strong> Overview of all shops</li>
        <li><strong>Shared Resources:</strong> Products, customers, and inventory across shops</li>
        <li><strong>Individual Branding:</strong> Unique themes and branding per shop</li>
        <li><strong>Separate Analytics:</strong> Performance tracking per shop</li>
    </ul>
    
    <h3>API Integration</h3>
    
    <p>Integrate with external systems using the Shop API:</p>
    
    <ul>
        <li><strong>Inventory Management:</strong> Sync with external inventory systems</li>
        <li><strong>Accounting Software:</strong> Export orders and financial data</li>
        <li><strong>Shipping Carriers:</strong> Real-time shipping rates and label generation</li>
        <li><strong>Marketing Tools:</strong> Customer data for email marketing</li>
    </ul>
    
    <h3>Automation</h3>
    
    <p>Automate common tasks to save time:</p>
    
    <ul>
        <li><strong>Low Stock Alerts:</strong> Automatic notifications when inventory is low</li>
        <li><strong>Order Notifications:</strong> Automatic emails for order status changes</li>
        <li><strong>Abandoned Cart Recovery:</strong> Email reminders for incomplete purchases</li>
        <li><strong>Review Requests:</strong> Automatic requests for product reviews</li>
    </ul>
    
    <h2>Best Practices</h2>
    
    <h3>Product Optimization</h3>
    
    <ul>
        <li><strong>High-Quality Images:</strong> Use professional product photography</li>
        <li><strong>Detailed Descriptions:</strong> Include all relevant product information</li>
        <li><strong>SEO Optimization:</strong> Use keywords in titles and descriptions</li>
        <li><strong>Competitive Pricing:</strong> Research market prices regularly</li>
        <li><strong>Customer Reviews:</strong> Encourage and display customer feedback</li>
    </ul>
    
    <h3>Order Processing</h3>
    
    <ul>
        <li><strong>Fast Processing:</strong> Process orders within 24 hours</li>
        <li><strong>Clear Communication:</strong> Keep customers informed of order status</li>
        <li><strong>Accurate Inventory:</strong> Maintain real-time stock levels</li>
        <li><strong>Quality Control:</strong> Check orders before shipping</li>
        <li><strong>Packaging:</strong> Use appropriate packaging for product protection</li>
    </ul>
    
    <h3>Customer Service</h3>
    
    <ul>
        <li><strong>Responsive Support:</strong> Respond to inquiries quickly</li>
        <li><strong>Clear Policies:</strong> Publish clear return and refund policies</li>
        <li><strong>Easy Returns:</strong> Make the return process simple</li>
        <li><strong>Follow-up:</strong> Check customer satisfaction after delivery</li>
    </ul>
    
    <h2>Troubleshooting</h2>
    
    <h3>Common Issues</h3>
    
    <h4>Payment Processing Problems</h4>
    <ul>
        <li>Verify payment gateway credentials</li>
        <li>Check for SSL certificate issues</li>
        <li>Review payment method configuration</li>
        <li>Test with small amounts first</li>
    </ul>
    
    <h4>Inventory Discrepancies</h4>
    <ul>
        <li>Audit inventory counts regularly</li>
        <li>Check for overselling situations</li>
        <li>Review inventory adjustment logs</li>
        <li>Verify variant stock levels</li>
    </ul>
    
    <h4>Shipping Issues</h4>
    <ul>
        <li>Verify shipping zone configurations</li>
        <li>Check weight and dimension calculations</li>
        <li>Test shipping rate calculations</li>
        <li>Review carrier integration settings</li>
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
    
    <p>The Big Based CMS provides:</p>
    
    <ul>
        <li><strong>Flexible Content Types:</strong> Create custom content structures</li>
        <li><strong>Rich Text Editor:</strong> Advanced WYSIWYG editing with TipTap</li>
        <li><strong>Media Management:</strong> Centralized asset library</li>
        <li><strong>Version Control:</strong> Track changes and revert to previous versions</li>
        <li><strong>Workflow Management:</strong> Content approval and publishing workflows</li>
        <li><strong>SEO Optimization:</strong> Built-in SEO tools and optimization</li>
        <li><strong>Multi-language Support:</strong> Create content in multiple languages</li>
        <li><strong>API Access:</strong> Headless CMS capabilities</li>
    </ul>
    
    <h2>Content Types</h2>
    
    <h3>Understanding Content Types</h3>
    
    <p>Content types define the structure and fields for different kinds of content. Each content type can have:</p>
    
    <ul>
        <li><strong>Text Fields:</strong> Single-line and multi-line text</li>
        <li><strong>Rich Text Fields:</strong> Formatted content with media</li>
        <li><strong>Media Fields:</strong> Images, videos, and files</li>
        <li><strong>Reference Fields:</strong> Links to other content items</li>
        <li><strong>Date Fields:</strong> Dates and timestamps</li>
        <li><strong>Boolean Fields:</strong> True/false toggles</li>
        <li><strong>Number Fields:</strong> Integers and decimals</li>
        <li><strong>JSON Fields:</strong> Structured data</li>
    </ul>
    
    <h3>Creating Content Types</h3>
    
    <ol>
        <li>Navigate to <strong>Admin → CMS → Content Types</strong></li>
        <li>Click "Create Content Type"</li>
        <li>Define basic information:
            <ul>
                <li><strong>Name:</strong> Human-readable name (e.g., "Blog Post")</li>
                <li><strong>Slug:</strong> URL-friendly identifier (e.g., "blog-post")</li>
                <li><strong>Description:</strong> Purpose and usage of this content type</li>
                <li><strong>Icon:</strong> Visual identifier for the content type</li>
            </ul>
        </li>
        <li>Add fields to the content type:
            <ul>
                <li>Click "Add Field"</li>
                <li>Choose field type and configure properties</li>
                <li>Set validation rules and default values</li>
                <li>Define field relationships and dependencies</li>
            </ul>
        </li>
        <li>Configure content type settings:
            <ul>
                <li><strong>Versioning:</strong> Enable version tracking</li>
                <li><strong>Publishing:</strong> Set default publication status</li>
                <li><strong>SEO:</strong> Enable SEO field generation</li>
                <li><strong>Comments:</strong> Allow user comments</li>
            </ul>
        </li>
    </ol>
    
    <h3>Default Content Types</h3>
    
    <p>The system includes several pre-configured content types:</p>
    
    <h4>Page</h4>
    <ul>
        <li><strong>Title:</strong> Page title</li>
        <li><strong>Content:</strong> Rich text content</li>
        <li><strong>SEO Title:</strong> Search engine title</li>
        <li><strong>Meta Description:</strong> Search engine description</li>
        <li><strong>Featured Image:</strong> Page hero image</li>
    </ul>
    
    <h4>Article</h4>
    <ul>
        <li><strong>Title:</strong> Article title</li>
        <li><strong>Content:</strong> Article body</li>
        <li><strong>Excerpt:</strong> Brief summary</li>
        <li><strong>Author:</strong> Content author</li>
        <li><strong>Category:</strong> Article category</li>
        <li><strong>Tags:</strong> Article tags</li>
        <li><strong>Featured Image:</strong> Article image</li>
        <li><strong>Publication Date:</strong> When to publish</li>
    </ul>
    
    <h4>Product</h4>
    <ul>
        <li><strong>Name:</strong> Product name</li>
        <li><strong>Description:</strong> Product description</li>
        <li><strong>Price:</strong> Product price</li>
        <li><strong>SKU:</strong> Stock keeping unit</li>
        <li><strong>Images:</strong> Product images</li>
        <li><strong>Category:</strong> Product category</li>
        <li><strong>Attributes:</strong> Product specifications</li>
    </ul>
    
    <h2>Content Creation and Editing</h2>
    
    <h3>Creating New Content</h3>
    
    <ol>
        <li>Navigate to <strong>Admin → CMS → Content</strong></li>
        <li>Click "Create New Content"</li>
        <li>Select the content type you want to create</li>
        <li>Fill in the content fields:
            <ul>
                <li>Use the rich text editor for formatted content</li>
                <li>Upload and insert media as needed</li>
                <li>Set metadata and SEO information</li>
                <li>Configure publication settings</li>
            </ul>
        </li>
        <li>Save as draft or publish immediately</li>
    </ol>
    
    <h3>Rich Text Editor</h3>
    
    <p>The TipTap-based rich text editor provides:</p>
    
    <h4>Formatting Options</h4>
    <ul>
        <li><strong>Text Formatting:</strong> Bold, italic, underline, strikethrough</li>
        <li><strong>Headings:</strong> H1 through H6 heading levels</li>
        <li><strong>Lists:</strong> Bulleted and numbered lists</li>
        <li><strong>Links:</strong> Internal and external links</li>
        <li><strong>Quotes:</strong> Blockquotes and inline quotes</li>
        <li><strong>Code:</strong> Inline code and code blocks</li>
    </ul>
    
    <h4>Media Integration</h4>
    <ul>
        <li><strong>Images:</strong> Insert and resize images</li>
        <li><strong>Videos:</strong> Embed videos from various sources</li>
        <li><strong>Files:</strong> Link to downloadable files</li>
        <li><strong>Galleries:</strong> Create image galleries</li>
    </ul>
    
    <h4>Advanced Features</h4>
    <ul>
        <li><strong>Tables:</strong> Create and edit data tables</li>
        <li><strong>Embeds:</strong> Embed content from external services</li>
        <li><strong>Custom Components:</strong> Insert predefined content blocks</li>
        <li><strong>Collaboration:</strong> Real-time collaborative editing</li>
    </ul>
    
    <h3>Content Organization</h3>
    
    <h4>Categories</h4>
    <p>Organize content into hierarchical categories:</p>
    
    <ol>
        <li>Navigate to <strong>Admin → CMS → Categories</strong></li>
        <li>Create category structure:
            <ul>
                <li><strong>News</strong>
                    <ul>
                        <li>Company News</li>
                        <li>Industry News</li>
                        <li>Product Updates</li>
                    </ul>
                </li>
                <li><strong>Resources</strong>
                    <ul>
                        <li>Guides</li>
                        <li>Tutorials</li>
                        <li>Case Studies</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>Assign content to appropriate categories</li>
    </ol>
    
    <h4>Tags</h4>
    <p>Use tags for flexible content labeling:</p>
    
    <ul>
        <li>Add relevant tags to content items</li>
        <li>Create tag-based content filters</li>
        <li>Use tags for content recommendations</li>
        <li>Generate tag clouds and popular tags</li>
    </ul>
    
    <h2>Media Management</h2>
    
    <h3>Media Library</h3>
    
    <p>The centralized media library manages all your assets:</p>
    
    <h4>Uploading Media</h4>
    <ol>
        <li>Navigate to <strong>Admin → CMS → Media</strong></li>
        <li>Click "Upload Files" or drag and drop files</li>
        <li>Supported formats:
            <ul>
                <li><strong>Images:</strong> JPG, PNG, GIF, WebP, SVG</li>
                <li><strong>Videos:</strong> MP4, WebM, MOV</li>
                <li><strong>Documents:</strong> PDF, DOC, DOCX, XLS, XLSX</li>
                <li><strong>Archives:</strong> ZIP, RAR</li>
            </ul>
        </li>
        <li>Add metadata:
            <ul>
                <li><strong>Title:</strong> Descriptive title</li>
                <li><strong>Alt Text:</strong> Accessibility description</li>
                <li><strong>Caption:</strong> Display caption</li>
                <li><strong>Tags:</strong> Organizational tags</li>
            </ul>
        </li>
    </ol>
    
    <h4>Media Organization</h4>
    <ul>
        <li><strong>Folders:</strong> Organize media into folders</li>
        <li><strong>Collections:</strong> Group related media items</li>
        <li><strong>Search:</strong> Find media by name, tags, or metadata</li>
        <li><strong>Filters:</strong> Filter by file type, date, or size</li>
    </ul>
    
    <h4>Image Processing</h4>
    <ul>
        <li><strong>Automatic Optimization:</strong> Compress images for web</li>
        <li><strong>Responsive Images:</strong> Generate multiple sizes</li>
        <li><strong>Format Conversion:</strong> Convert to optimal formats</li>
        <li><strong>Basic Editing:</strong> Crop, resize, and rotate</li>
    </ul>
    
    <h2>Version Control and History</h2>
    
    <h3>Content Versioning</h3>
    
    <p>Track all changes to your content:</p>
    
    <ul>
        <li><strong>Automatic Versioning:</strong> Save versions on every change</li>
        <li><strong>Version Comparison:</strong> See differences between versions</li>
        <li><strong>Rollback:</strong> Restore previous versions</li>
        <li><strong>Version Notes:</strong> Add comments to versions</li>
    </ul>
    
    <h3>Change History</h3>
    
    <p>View detailed change history:</p>
    
    <ol>
        <li>Open any content item</li>
        <li>Click "Version History"</li>
        <li>View list of all versions with:
            <ul>
                <li>Timestamp of changes</li>
                <li>User who made changes</li>
                <li>Summary of modifications</li>
                <li>Version notes and comments</li>
            </ul>
        </li>
        <li>Compare versions side-by-side</li>
        <li>Restore any previous version</li>
    </ol>
    
    <h2>Publishing and Workflow</h2>
    
    <h3>Content Status</h3>
    
    <p>Content can have different publication statuses:</p>
    
    <ul>
        <li><strong>Draft:</strong> Work in progress, not visible to public</li>
        <li><strong>Review:</strong> Ready for review by editors</li>
        <li><strong>Scheduled:</strong> Set to publish at a future date</li>
        <li><strong>Published:</strong> Live and visible to public</li>
        <li><strong>Archived:</strong> No longer active but preserved</li>
    </ul>
    
    <h3>Publishing Workflow</h3>
    
    <p>Configure approval workflows for content:</p>
    
    <ol>
        <li>Navigate to <strong>Admin → CMS → Workflows</strong></li>
        <li>Create workflow stages:
            <ul>
                <li><strong>Author:</strong> Creates initial content</li>
                <li><strong>Editor:</strong> Reviews and edits content</li>
                <li><strong>Approver:</strong> Final approval for publication</li>
            </ul>
        </li>
        <li>Assign users to workflow roles</li>
        <li>Configure notification settings</li>
    </ol>
    
    <h3>Scheduled Publishing</h3>
    
    <p>Schedule content to publish automatically:</p>
    
    <ol>
        <li>In the content editor, set publication date</li>
        <li>Choose specific time for publication</li>
        <li>Content will automatically go live at scheduled time</li>
        <li>View scheduled content in the publishing queue</li>
    </ol>
    
    <h2>SEO and Optimization</h2>
    
    <h3>SEO Fields</h3>
    
    <p>Optimize content for search engines:</p>
    
    <ul>
        <li><strong>SEO Title:</strong> Optimized title for search results</li>
        <li><strong>Meta Description:</strong> Brief description for search snippets</li>
        <li><strong>URL Slug:</strong> Clean, keyword-rich URLs</li>
        <li><strong>Open Graph Tags:</strong> Social media sharing optimization</li>
        <li><strong>Schema Markup:</strong> Structured data for rich snippets</li>
    </ul>
    
    <h3>SEO Analysis</h3>
    
    <p>Built-in SEO analysis provides:</p>
    
    <ul>
        <li><strong>Keyword Density:</strong> Analyze keyword usage</li>
        <li><strong>Readability Score:</strong> Content readability assessment</li>
        <li><strong>Link Analysis:</strong> Internal and external link review</li>
        <li><strong>Image Optimization:</strong> Alt text and file size checks</li>
        <li><strong>Performance Score:</strong> Overall SEO performance rating</li>
    </ul>
    
    <h2>Multi-language Support</h2>
    
    <h3>Language Configuration</h3>
    
    <ol>
        <li>Navigate to <strong>Admin → CMS → Languages</strong></li>
        <li>Add supported languages:
            <ul>
                <li>English (default)</li>
                <li>Spanish</li>
                <li>French</li>
                <li>German</li>
                <li>Other languages as needed</li>
            </ul>
        </li>
        <li>Set default language and fallback behavior</li>
    </ol>
    
    <h3>Creating Translated Content</h3>
    
    <ol>
        <li>Create content in the default language</li>
        <li>Click "Add Translation"</li>
        <li>Select target language</li>
        <li>Translate all content fields</li>
        <li>Maintain separate SEO settings per language</li>
    </ol>
    
    <h2>API and Headless CMS</h2>
    
    <h3>Content API</h3>
    
    <p>Access content programmatically:</p>
    
    <pre><code>GET /api/v1/cms/content
GET /api/v1/cms/content/{id}
GET /api/v1/cms/content/type/{type}
GET /api/v1/cms/content/category/{category}</code></pre>
    
    <h3>Headless Implementation</h3>
    
    <p>Use the CMS as a headless content backend:</p>
    
    <ul>
        <li><strong>API-First:</strong> All content accessible via API</li>
        <li><strong>Frontend Flexibility:</strong> Use any frontend technology</li>
        <li><strong>Multi-channel:</strong> Deliver content to web, mobile, IoT</li>
        <li><strong>Performance:</strong> Optimized for fast content delivery</li>
    </ul>
    
    <h2>Advanced Features</h2>
    
    <h3>Custom Fields</h3>
    
    <p>Create specialized field types:</p>
    
    <ul>
        <li><strong>Repeater Fields:</strong> Multiple instances of field groups</li>
        <li><strong>Flexible Content:</strong> Mix and match content blocks</li>
        <li><strong>Relationship Fields:</strong> Connect content items</li>
        <li><strong>Conditional Fields:</strong> Show/hide fields based on conditions</li>
    </ul>
    
    <h3>Content Templates</h3>
    
    <p>Create reusable content templates:</p>
    
    <ol>
        <li>Design template structure with placeholders</li>
        <li>Save as template for future use</li>
        <li>Apply templates when creating new content</li>
        <li>Customize template content as needed</li>
    </ol>
    
    <h3>Bulk Operations</h3>
    
    <p>Perform operations on multiple content items:</p>
    
    <ul>
        <li><strong>Bulk Edit:</strong> Update multiple items simultaneously</li>
        <li><strong>Bulk Publish:</strong> Publish multiple drafts at once</li>
        <li><strong>Bulk Delete:</strong> Remove multiple items</li>
        <li><strong>Bulk Export:</strong> Export content data</li>
    </ul>
    
    <h2>Performance and Caching</h2>
    
    <h3>Content Caching</h3>
    
    <p>Optimize performance with intelligent caching:</p>
    
    <ul>
        <li><strong>Page Caching:</strong> Cache rendered pages</li>
        <li><strong>API Caching:</strong> Cache API responses</li>
        <li><strong>Image Caching:</strong> Cache processed images</li>
        <li><strong>CDN Integration:</strong> Distribute content globally</li>
    </ul>
    
    <h3>Performance Monitoring</h3>
    
    <ul>
        <li><strong>Load Times:</strong> Monitor page load performance</li>
        <li><strong>Cache Hit Rates:</strong> Track caching effectiveness</li>
        <li><strong>Database Queries:</strong> Optimize database performance</li>
        <li><strong>Content Size:</strong> Monitor content and media sizes</li>
    </ul>
    
    <h2>Best Practices</h2>
    
    <h3>Content Strategy</h3>
    
    <ul>
        <li><strong>Plan Content Types:</strong> Design content structure before creating</li>
        <li><strong>Consistent Naming:</strong> Use clear, consistent field names</li>
        <li><strong>Content Guidelines:</strong> Establish editorial guidelines</li>
        <li><strong>Regular Audits:</strong> Review and update content regularly</li>
    </ul>
    
    <h3>Performance Optimization</h3>
    
    <ul>
        <li><strong>Optimize Images:</strong> Compress and resize images appropriately</li>
        <li><strong>Minimize Content:</strong> Keep content focused and concise</li>
        <li><strong>Use Caching:</strong> Enable appropriate caching strategies</li>
        <li><strong>Monitor Performance:</strong> Regularly check site speed</li>
    </ul>
    
    <h3>SEO Best Practices</h3>
    
    <ul>
        <li><strong>Keyword Research:</strong> Research relevant keywords</li>
        <li><strong>Quality Content:</strong> Create valuable, original content</li>
        <li><strong>Internal Linking:</strong> Link related content appropriately</li>
        <li><strong>Regular Updates:</strong> Keep content fresh and current</li>
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
