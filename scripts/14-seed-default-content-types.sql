-- Insert some default content types to get started
INSERT INTO content_types (name, slug, description, schema, settings) VALUES
(
  'Blog Post',
  'blog-post',
  'Standard blog post with rich content and SEO fields',
  '{
    "fields": {
      "excerpt": {
        "type": "textarea",
        "label": "Excerpt",
        "required": false,
        "description": "Brief summary of the post"
      },
      "body": {
        "type": "richtext",
        "label": "Content",
        "required": true,
        "description": "Main content of the blog post"
      },
      "author": {
        "type": "text",
        "label": "Author",
        "required": false,
        "description": "Post author name"
      },
      "tags": {
        "type": "tags",
        "label": "Tags",
        "required": false,
        "description": "Content tags for categorization"
      },
      "featured": {
        "type": "boolean",
        "label": "Featured Post",
        "required": false,
        "description": "Mark as featured content"
      }
    }
  }',
  '{
    "preview_url": "/blog/{slug}",
    "list_display": ["title", "author", "status", "created_at"],
    "search_fields": ["title", "excerpt", "body"],
    "ordering": ["-created_at"]
  }'
),
(
  'Page',
  'page',
  'Static pages with flexible content blocks',
  '{
    "fields": {
      "subtitle": {
        "type": "text",
        "label": "Subtitle",
        "required": false,
        "description": "Page subtitle or tagline"
      },
      "content": {
        "type": "richtext",
        "label": "Page Content",
        "required": true,
        "description": "Main page content"
      },
      "sidebar": {
        "type": "richtext",
        "label": "Sidebar Content",
        "required": false,
        "description": "Optional sidebar content"
      },
      "template": {
        "type": "select",
        "label": "Page Template",
        "required": false,
        "options": ["default", "full-width", "landing", "contact"],
        "description": "Choose page layout template"
      }
    }
  }',
  '{
    "preview_url": "/{slug}",
    "list_display": ["title", "template", "status", "updated_at"],
    "search_fields": ["title", "subtitle", "content"],
    "ordering": ["title"]
  }'
),
(
  'News Article',
  'news-article',
  'News articles with publication date and category',
  '{
    "fields": {
      "summary": {
        "type": "textarea",
        "label": "Summary",
        "required": true,
        "description": "Brief article summary"
      },
      "content": {
        "type": "richtext",
        "label": "Article Content",
        "required": true,
        "description": "Full article content"
      },
      "category": {
        "type": "select",
        "label": "Category",
        "required": true,
        "options": ["politics", "technology", "culture", "economy", "world"],
        "description": "Article category"
      },
      "source": {
        "type": "text",
        "label": "Source",
        "required": false,
        "description": "News source or reporter"
      },
      "breaking": {
        "type": "boolean",
        "label": "Breaking News",
        "required": false,
        "description": "Mark as breaking news"
      }
    }
  }',
  '{
    "preview_url": "/news/{slug}",
    "list_display": ["title", "category", "breaking", "published_at"],
    "search_fields": ["title", "summary", "content"],
    "ordering": ["-published_at"]
  }'
) ON CONFLICT (slug) DO NOTHING;
