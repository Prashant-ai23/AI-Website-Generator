# Template Management Module - Quick Reference

## 🚀 Quick Start

### API Base URL
```
http://localhost:3000/api/v1/templates
```

### Frontend Routes
```
/templates              # Marketplace (view all)
/templates/create       # Create new template
/templates/:id          # View template details
/templates/:id/edit     # Edit template
```

---

## 📋 API Endpoints Summary

### Public Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | List templates (with filters) |
| GET | `/featured` | Get featured templates |
| GET | `/trending` | Get trending templates |
| GET | `/recommended` | Get recommended templates |
| GET | `/recent` | Get recent templates |
| GET | `/:id` | Get template details |
| GET | `/:id/versions` | Get version history |
| GET | `/creator/:creatorId` | Get creator's templates |
| GET | `/categories` | Get all categories |
| POST | `/:id/check-compatibility` | Check tech compatibility |
| POST | `/:id/download` | Track download |

### Protected Endpoints (Requires Auth)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/` | Create template |
| PUT | `/:id` | Update template |
| DELETE | `/:id` | Delete template |
| POST | `/:id/publish` | Publish template |
| POST | `/:id/clone` | Clone template |
| POST | `/:id/rate` | Submit rating |
| POST | `/:id/favorite` | Toggle favorite |
| GET | `/favorites` | Get favorite templates |
| POST | `/:id/versions` | Create version |
| POST | `/categories` | Create category |

---

## 🔍 Query Filters

### List Templates
```
GET /templates?page=1&limit=12&search=dashboard&category=admin&rating=4&sortBy=downloads&tags=responsive
```

**Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `search`: Search in title/description
- `category`: Filter by category ID
- `rating`: Minimum rating (2, 3, 4, 5)
- `sortBy`: newest, downloads, rating, views, featured
- `tags`: Comma-separated tags
- `status`: draft, published, deprecated, archived

---

## 💻 Frontend Service Usage

### Get Templates
```typescript
const templates = await TemplateService.getTemplates(
  1,           // page
  12,          // limit
  {
    search: 'dashboard',
    category: 'admin',
    sortBy: 'downloads'
  }
);
```

### Create Template
```typescript
const template = await TemplateService.createTemplate({
  name: 'My Template',
  description: 'Description here',
  category: 'categoryId',
  supportedStack: {
    frontend: ['React'],
    backend: ['Node.js'],
    database: ['MongoDB'],
    authentication: ['JWT']
  },
  components: [{ name: 'Button', description: 'Reusable button' }],
  pages: [{ name: 'Home', slug: 'home' }],
  tags: ['responsive', 'dark'],
  preview: { image: 'https://example.com/img.jpg' }
});
```

### Clone Template
```typescript
const cloned = await TemplateService.cloneTemplate(templateId);
// Returns: { template: {...}, message: "..." }
```

### Rate Template
```typescript
await TemplateService.rateTemplate(
  templateId,
  5,  // rating (1-5)
  'Great template!'  // comment
);
```

### Toggle Favorite
```typescript
await TemplateService.toggleFavorite(templateId);
```

### Download Template
```typescript
await TemplateService.downloadTemplate(templateId);
```

### Get Recommendations
```typescript
const recommended = await TemplateService.getRecommendedTemplates(6);
```

---

## 🗂️ Data Models

### Template
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string,
  description: string,
  category: ObjectId,
  supportedStack: {
    frontend: string[],
    backend: string[],
    database: string[],
    authentication: string[]
  },
  components: { name: string; description?: string }[],
  pages: { name: string; slug: string; description?: string }[],
  tags: string[],
  preview: {
    image: string,
    thumbnail?: string,
    gallery?: string[]
  },
  downloads: number,
  views: number,
  favorites: ObjectId[],
  rating: {
    average: number,
    count: number,
    sum: number
  },
  reviews: {
    user: ObjectId,
    rating: number,
    comment: string,
    createdAt: Date
  }[],
  creator: ObjectId,
  status: 'draft' | 'published' | 'deprecated' | 'archived',
  featured: boolean,
  aiScore: number,
  aiKeywords: string[],
  minNodeVersion?: string,
  maxNodeVersion?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### TemplateCategory
```typescript
{
  _id: ObjectId,
  name: string,
  slug: string,
  description: string,
  icon: string,
  color: string,
  order: number,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### TemplateVersion
```typescript
{
  _id: ObjectId,
  templateId: ObjectId,
  version: string,
  components: any[],
  pages: any[],
  config: any,
  description: string,
  author: ObjectId,
  isMajor: boolean,
  isMinor: boolean,
  isPatch: boolean,
  releasedAt: Date,
  createdAt: Date
}
```

---

## 🎨 Component Examples

### Display Marketplace
```typescript
import TemplateMarketplacePage from '@/pages/TemplateMarketplacePage';

function App() {
  return <TemplateMarketplacePage />;
}
```

### Display Template Card
```typescript
import TemplateCard from '@/components/Template/TemplateCard';

<TemplateCard
  template={template}
  onView={(id) => navigate(`/templates/${id}`)}
  onDownload={(id) => console.log('Download:', id)}
  onFavorite={(id) => console.log('Favorite:', id)}
  onClone={(id) => navigate(`/templates/${id}/edit`)}
/>
```

### Use Filters
```typescript
import { TemplateSearch } from '@/components/Template/TemplateFilters';

<TemplateSearch 
  onSearch={(query) => setSearchQuery(query)}
/>
```

---

## 🔐 Authentication

### Bearer Token
```typescript
Authorization: Bearer <jwt_token>
```

### User Context in API
```typescript
// req.user is available in protected routes
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}
```

---

## 📊 Common Patterns

### Load and Filter Templates
```typescript
const [templates, setTemplates] = useState([]);
const [filters, setFilters] = useState({});

useEffect(() => {
  const load = async () => {
    const data = await TemplateService.getTemplates(1, 12, filters);
    setTemplates(data.templates);
  };
  load();
}, [filters]);
```

### Create and Redirect
```typescript
const handleCreate = async (formData) => {
  try {
    const result = await TemplateService.createTemplate(formData);
    navigate(`/templates/${result.template._id}`);
  } catch (error) {
    console.error('Failed to create:', error);
  }
};
```

### Rate with Validation
```typescript
const handleRate = async (templateId, rating, comment) => {
  if (rating < 1 || rating > 5) {
    alert('Rating must be 1-5');
    return;
  }
  
  try {
    await TemplateService.rateTemplate(templateId, rating, comment);
    // Reload template
    await loadTemplate();
  } catch (error) {
    console.error('Failed to rate:', error);
  }
};
```

---

## 🧪 Testing Commands

### Create Test Template
```bash
curl -X POST http://localhost:3000/api/v1/templates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Template",
    "description": "A test template",
    "category": "admin",
    "supportedStack": {
      "frontend": ["React"],
      "backend": ["Node.js"],
      "database": ["MongoDB"],
      "authentication": ["JWT"]
    }
  }'
```

### List Templates
```bash
curl http://localhost:3000/api/v1/templates?page=1&limit=12
```

### Get Template Details
```bash
curl http://localhost:3000/api/v1/templates/TEMPLATE_ID
```

### Rate Template
```bash
curl -X POST http://localhost:3000/api/v1/templates/TEMPLATE_ID/rate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "comment": "Great!"}'
```

---

## 📋 Categories

Default template categories:
1. Admin Dashboard
2. Ecommerce
3. CRM
4. ERP
5. Portfolio
6. Blog
7. LMS
8. HRMS
9. DMS

---

## 🎯 Performance Tips

1. **Use Pagination** - Always paginate large result sets
2. **Filter Early** - Filter on server, not client
3. **Cache Categories** - Load once and reuse
4. **Debounce Search** - Use 300ms delay for search
5. **Lazy Load Images** - Use thumbnail for preview
6. **Optimize Queries** - Use specific fields in selects

---

## ⚠️ Common Issues

### Template Not Found
- Check template ID is valid ObjectId
- Verify template status is 'published'
- Check user authentication

### Authorization Error
- Verify Bearer token is valid
- Check token hasn't expired
- For edit/delete, verify you're the creator

### Filter Not Working
- Verify category ID is valid
- Check filter values are correct
- Ensure page/limit are positive integers

---

## 📞 Troubleshooting

### API Returns 404
```
Check: GET /api/v1/templates (without :id)
Should list templates, not get 404
```

### Frontend Routes Not Working
```
Check: frontend/src/config/routes.tsx
Verify imports are correct and routes are exported
```

### Image Not Displaying
```
Check: preview.image URL is valid
Verify CORS allows image URL
Use thumbnail if image is too large
```

---

## 📚 Related Documentation

- [TEMPLATE_MODULE_COMPLETE.md](./TEMPLATE_MODULE_COMPLETE.md) - Full documentation
- [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) - API reference
- [MONGODB_SCHEMAS.md](./backend/MONGODB_SCHEMAS.md) - Database schemas
- [PROJECT_COMPLETE_STATUS.md](./PROJECT_COMPLETE_STATUS.md) - Project status

---

**Last Updated**: Current Session
**Status**: Production Ready ✅
