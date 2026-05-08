# AI Features - Quick Reference Guide

## Accessing AI Features

Navigate to `http://localhost:5173/ai-features` after logging in.

## Feature Overview

### 1. Code Generator 🔧
**Purpose**: Generate production-ready code from descriptions

**How to Use**:
1. Click "Code Generator" tab
2. Enter what you want to build (e.g., "React component that displays a product card")
3. Select target language (TypeScript, JavaScript, Python, Java)
4. Click "Generate Code"
5. Copy generated code using the copy button

**Best For**:
- Creating components quickly
- Boilerplate code generation
- Learning code patterns
- Rapid prototyping

**Example Input**:
```
Create a React component that displays a list of users 
with search functionality and pagination
```

---

### 2. Code Analyzer 📊
**Purpose**: Analyze code quality and get improvement suggestions

**How to Use**:
1. Click "Code Analyzer" tab
2. Paste your code
3. Click "Analyze Code"
4. Review metrics and suggestions

**Metrics Provided**:
- **Complexity**: Cyclomatic complexity (lower is better)
- **Maintainability**: How easy to maintain (0-100 scale)
- **Readability**: Code clarity (0-100 scale)
- **Performance**: Efficiency rating (0-100 scale)

**Color Coding**:
- 🟢 Green (80-100): Excellent
- 🟡 Yellow (60-79): Good
- 🔴 Red (0-59): Needs improvement

**Example Output**:
```
Metrics:
- Complexity: 45
- Maintainability: 78
- Readability: 82
- Performance: 75

Issues Found:
- Consider breaking down long functions
- Add JSDoc comments
- Use constants for magic numbers
```

---

### 3. Bug Fixer 🐛
**Purpose**: Get suggestions to fix bugs and errors

**How to Use**:
1. Click "Bug Fixer" tab
2. Paste problematic code
3. Paste the error message or describe the bug
4. Click "Find Bug Fixes"
5. Review suggested fixes and choose best solution

**Information Provided**:
- Root cause analysis
- Multiple fix suggestions
- Explanation of each fix
- Prevention strategies

**Example**:
```
Code: const x = null; x.toUpperCase();
Error: Cannot read property 'toUpperCase' of null

Fixes:
1. Add null check: if (x) { x.toUpperCase(); }
2. Use optional chaining: x?.toUpperCase()
3. Validate input: if (typeof x === 'string') { ... }
```

---

### 4. Code Optimizer ⚡
**Purpose**: Optimize algorithm complexity and performance

**How to Use**:
1. Click "Code Optimizer" tab
2. Paste code to optimize
3. Click "Optimize Code"
4. Review complexity improvements

**Optimization Areas**:
- Algorithm efficiency (O(n²) → O(n log n))
- Memory usage
- Loop optimization
- Caching opportunities

**Example Output**:
```
Original: O(n²) time, 2n memory
Optimized: O(n log n) time, n memory

Improvements:
- 50-90% faster execution
- 40-50% less memory usage
- Use binary search instead of linear search
```

---

### 5. Workflows 🔄
**Purpose**: Chain multiple agents for complex tasks

**Available Workflows**:

1. **Generate & Optimize**
   - Generates code
   - Analyzes the result
   - Optimizes for performance

2. **Fix & Verify**
   - Analyzes code
   - Suggests fixes
   - Verifies the fixes work

3. **Analyze, Optimize, Verify**
   - Analyzes code
   - Optimizes it
   - Re-analyzes for verification

---

## API Endpoints

### Execute Agent
```bash
curl -X POST http://localhost:3000/api/v1/ai/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agentType": "CODE_GENERATOR",
    "input": {
      "description": "Create a login form",
      "language": "typescript"
    }
  }'
```

### Execute Workflow
```bash
curl -X POST http://localhost:3000/api/v1/ai/workflow \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowType": "bug-fixing",
    "input": {
      "code": "const x = null; x.toUpperCase();",
      "error": "Cannot read property"
    }
  }'
```

### Query Memory (RAG)
```bash
curl -X POST http://localhost:3000/api/v1/ai/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I optimize database queries?",
    "conversationId": "conv-123",
    "topK": 5
  }'
```

### Get Templates
```bash
curl -X GET "http://localhost:3000/api/v1/ai/templates?agentType=CODE_GENERATOR" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Apply Template
```bash
curl -X POST http://localhost:3000/api/v1/ai/templates/apply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "gen-react-component",
    "variables": {
      "ComponentName": "UserCard",
      "componentName": "user-card"
    }
  }'
```

---

## Tips & Tricks

### Code Generator
- ✅ Be specific with requirements
- ✅ Mention frameworks and libraries
- ✅ Specify language and version
- ❌ Don't ask for entire applications
- ❌ Don't mix multiple unrelated features

### Code Analyzer
- ✅ Analyze complete functions/components
- ✅ Include all imports and dependencies
- ✅ Use real production code
- ❌ Don't analyze fragments
- ❌ Don't expect perfection metrics

### Bug Fixer
- ✅ Include full stack trace
- ✅ Describe when the bug occurs
- ✅ Include relevant context code
- ❌ Don't truncate error messages
- ❌ Don't assume root cause

### Code Optimizer
- ✅ Focus on performance-critical code
- ✅ Include data structure definitions
- ✅ Mention constraints (memory, time)
- ❌ Don't optimize for readability
- ❌ Don't ignore edge cases

---

## Performance Notes

- **Response Time**: 100-500ms depending on complexity
- **Max Code Size**: 50KB for analysis
- **Concurrent Requests**: Unlimited (backend scaled)
- **Memory Usage**: ~1MB per active workflow

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Authorization required" | Make sure you're logged in and have valid token |
| "Agent not found" | Check agentType spelling (case-sensitive) |
| "Workflow timeout" | Reduce code complexity or split into smaller tasks |
| "Empty results" | Verify input format and required fields |
| "401 Unauthorized" | Token may have expired, try logging out and in |

---

## Advanced Usage

### Custom Workflows
Combine agents programmatically:
```javascript
const response = await fetch('/api/v1/ai/workflow', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    workflowType: 'analyze-generate',
    input: { description: 'Create authentication system' }
  })
});
```

### Batch Processing
```javascript
const codes = [...]; // Array of code snippets
const results = await Promise.all(
  codes.map(code => 
    fetch('/api/v1/ai/execute', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        agentType: 'CODE_ANALYZER',
        input: { code }
      })
    })
  )
);
```

---

## Best Practices

1. **Start Simple**: Test single agents before workflows
2. **Provide Context**: More detail = better results
3. **Review Results**: Always review AI-generated code
4. **Iterate**: Use feedback to refine requests
5. **Combine Agents**: Use workflows for complex tasks
6. **Cache Results**: Reuse RAG queries for similar problems
7. **Monitor Performance**: Check statistics endpoint
8. **Test Thoroughly**: AI suggestions need verification

---

## Support & Feedback

- Check `/ai-features` page for interactive UI
- View API documentation in code comments
- Check server logs for detailed error messages
- Enable debug mode for verbose output

**Endpoint**: `GET /api/v1/ai/statistics` - View system performance and usage

---

**Version**: 1.0
**Last Updated**: 2024
**Status**: Production Ready ✅
