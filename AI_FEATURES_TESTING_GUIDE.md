# AI Features - Testing & Validation Guide

## Pre-Testing Setup

### 1. Backend Verification
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Start the backend server
npm run dev
```

Expected output:
```
Server running on http://localhost:3000
Database connected to MongoDB at mongodb://localhost:27017/ai-website-generator
```

### 2. Frontend Verification
```bash
# In another terminal, navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the frontend development server
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. Database Verification
Ensure MongoDB is running:
```bash
mongod
```

---

## Testing Scenarios

### Scenario 1: Code Generation

**Steps**:
1. Open browser and go to `http://localhost:5173`
2. Login with credentials: `newtest123@example.com` / `password123`
3. Navigate to `/ai-features`
4. Click "Code Generator" tab

**Test Case 1.1: Generate React Component**
```
Input:
- Description: "Create a React component that displays a user profile card with avatar, name, email, and follow button"
- Language: TypeScript

Expected Output:
- Code preview showing React component
- Suggestions list appears
- Copy button works (copies code to clipboard)
```

**Test Case 1.2: Generate API Endpoint**
```
Input:
- Description: "Create an Express API endpoint that accepts a GET request to fetch all users from database"
- Language: TypeScript

Expected Output:
- Code with proper Express router setup
- Includes error handling
- Has async/await pattern
```

**Test Case 1.3: Generate Python Function**
```
Input:
- Description: "Write a Python function that calculates factorial using recursion"
- Language: Python

Expected Output:
- Valid Python code
- Includes base case
- Proper error handling
```

---

### Scenario 2: Code Analysis

**Steps**:
1. On AI Features page, click "Code Analyzer" tab
2. Paste code to analyze

**Test Case 2.1: Analyze Simple Function**
```javascript
Input Code:
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

Expected Output:
- Complexity: ~45-60 (High due to recursive nature)
- Maintainability: ~75-85
- Performance: ~40-50 (Poor)
Issues:
- Exponential time complexity
- Performance concerns
- Consider memoization or iterative approach
```

**Test Case 2.2: Analyze Well-Written Code**
```typescript
Input Code:
function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

Expected Output:
- Complexity: ~85-90 (Good)
- Maintainability: ~85-90
- Performance: ~90 (Excellent)
Issues: None or minimal
Suggestions:
- Consider adding JSDoc comments
- Add input validation
```

---

### Scenario 3: Bug Fixing

**Steps**:
1. Click "Bug Fixer" tab
2. Paste problematic code and error message

**Test Case 3.1: Null Reference Error**
```
Input:
Code: 
const user = getUserData();
console.log(user.name.toUpperCase());

Error: Cannot read property 'name' of null

Expected Output:
- Root cause: user is null/undefined
Fixes:
1. Add null check: if (user && user.name) { ... }
2. Optional chaining: user?.name?.toUpperCase()
3. Nullish coalescing: (user?.name ?? 'Unknown').toUpperCase()
```

**Test Case 3.2: Type Error**
```
Input:
Code:
const numbers = [1, 2, 3];
const result = numbers.find('2');

Error: TypeError: find expects a function, got string

Expected Output:
- Root cause: find() expects callback, not value
Fixes:
1. Use correct predicate: numbers.find(n => n === 2)
2. Use includes: numbers.includes(2)
3. Use indexOf: numbers.indexOf(2) !== -1
```

**Test Case 3.3: Logic Error**
```
Input:
Code:
function isOdd(n) {
  return n % 2 = 1;
}

Error: SyntaxError: Invalid left-hand side in assignment

Expected Output:
- Root cause: Using = instead of ==  or ===
Fixes:
1. Use comparison: n % 2 === 1
2. Use strict equality: n % 2 !== 0
```

---

### Scenario 4: Code Optimization

**Steps**:
1. Click "Code Optimizer" tab
2. Paste code to optimize

**Test Case 4.1: O(n²) to O(n)**
```
Input Code:
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

Expected Output:
- Original: O(n²) time
- Optimized: O(n) time
- Improvement: Use Set to track seen values
- Memory: Trade-off explanation
```

**Test Case 4.2: Recursive to Iterative**
```
Input Code:
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

Expected Output:
- Original: O(n) stack space (recursion)
- Optimized: O(1) space (iteration)
- Improvement: 90% less memory
- Trade-off: Slightly faster execution
```

**Test Case 4.3: Loop Optimization**
```
Input Code:
function processArray(arr) {
  const results = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0) {
      results.push(arr[i] * 2);
    }
  }
  return results;
}

Expected Output:
- Suggestion: Use filter + map
- Optimization: Better readability with same performance
- Alternative: Use reduce for combining operations
```

---

### Scenario 5: Workflows

**Steps**:
1. Click "Workflows" tab
2. View preset workflow options

**Test Case 5.1: View Workflows**
```
Expected Output:
- Shows 3 preset workflows:
  1. Generate and Optimize
  2. Fix and Verify
  3. Analyze, Optimize, Verify
- Each workflow shows:
  - Description
  - Steps involved
  - Execution order
```

---

## API Endpoint Testing

### Test Using cURL

**Test 1: Execute Code Generator**
```bash
curl -X POST http://localhost:3000/api/v1/ai/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "agentType": "CODE_GENERATOR",
    "input": {
      "description": "Create a simple hello world function",
      "language": "javascript"
    }
  }'

Expected Response:
{
  "statusCode": 200,
  "data": {
    "agentId": "agent-1",
    "agentType": "CODE_GENERATOR",
    "status": "COMPLETED",
    "result": {
      "code": "...",
      "language": "javascript",
      "suggestions": [...]
    },
    "confidence": 0.95
  },
  "message": "Agent executed successfully"
}
```

**Test 2: Execute Code Analyzer**
```bash
curl -X POST http://localhost:3000/api/v1/ai/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "agentType": "CODE_ANALYZER",
    "input": {
      "code": "function add(a, b) { return a + b; }"
    }
  }'

Expected Response:
{
  "statusCode": 200,
  "data": {
    "agentType": "CODE_ANALYZER",
    "result": {
      "metrics": {
        "complexity": 15,
        "maintainability": 95,
        "readability": 98,
        "performance": 99
      },
      "issues": [],
      "suggestions": [...]
    }
  }
}
```

**Test 3: Bug Fix Workflow**
```bash
curl -X POST http://localhost:3000/api/v1/ai/bug-fix \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "code": "const x = null; console.log(x.toUpperCase());",
    "error": "Cannot read property toUpperCase of null"
  }'

Expected Response:
{
  "statusCode": 200,
  "data": {
    "analysis": {...},
    "fixes": {
      "issue": "...",
      "rootCause": "...",
      "fixes": [...]
    },
    "optimized": {...}
  }
}
```

**Test 4: Get Templates**
```bash
curl -X GET http://localhost:3000/api/v1/ai/templates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

Expected Response:
{
  "statusCode": 200,
  "data": {
    "templates": [
      {
        "id": "gen-react-component",
        "name": "React Component",
        "description": "Generate a React component",
        "agentType": "CODE_GENERATOR",
        "variables": ["ComponentName", "componentName"],
        "tags": ["react", "typescript", "component"]
      },
      ...
    ]
  }
}
```

**Test 5: Apply Template**
```bash
curl -X POST http://localhost:3000/api/v1/ai/templates/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "templateId": "gen-react-component",
    "variables": {
      "ComponentName": "MyButton",
      "componentName": "my-button"
    }
  }'

Expected Response:
{
  "statusCode": 200,
  "data": {
    "result": "import React from 'react';\n\ninterface MyButtonProps {\n  ...\n}\n\nexport function MyButton(props: MyButtonProps) { ... }"
  }
}
```

**Test 6: Get Statistics**
```bash
curl -X GET http://localhost:3000/api/v1/ai/statistics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

Expected Response:
{
  "statusCode": 200,
  "data": {
    "agents": {
      "totalAgents": 4,
      "agents": ["CODE_GENERATOR", "CODE_ANALYZER", "BUG_FIXER", "OPTIMIZER"]
    },
    "memory": {
      "totalEntries": 0,
      "conversations": 0,
      "maxEntries": 1000
    },
    "templates": {
      "totalTemplates": 5,
      "byAgentType": {...}
    }
  }
}
```

---

## Performance Testing

### Load Testing
```bash
# Generate 100 concurrent requests
ab -n 100 -c 10 -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/v1/ai/statistics
```

Expected:
- Response time: < 100ms per request
- Success rate: 100%
- No memory leaks

---

## Error Handling Tests

**Test 1: Missing Authentication**
```bash
curl -X POST http://localhost:3000/api/v1/ai/execute \
  -H "Content-Type: application/json" \
  -d '{"agentType": "CODE_GENERATOR", "input": {}}'

Expected: 401 Unauthorized
```

**Test 2: Invalid Agent Type**
```bash
curl -X POST http://localhost:3000/api/v1/ai/execute \
  -H "Authorization: Bearer TOKEN" \
  -d '{"agentType": "INVALID", "input": {}}'

Expected: 400 Bad Request
```

**Test 3: Missing Required Input**
```bash
curl -X POST http://localhost:3000/api/v1/ai/execute \
  -H "Authorization: Bearer TOKEN" \
  -d '{"agentType": "CODE_GENERATOR", "input": {}}'

Expected: 400 Bad Request with error message
```

---

## Success Criteria

✅ **All Tests Pass When**:
- Code Generator creates valid code
- Analyzer provides accurate metrics
- Bug Fixer identifies root causes
- Optimizer shows real improvements
- All endpoints return correct status codes
- Authentication is enforced
- Error handling works properly
- Response times < 500ms
- No memory leaks
- UI updates in real-time

---

## Troubleshooting

| Issue | Debug | Solution |
|-------|-------|----------|
| 401 errors | Check token in localStorage | Re-login to get fresh token |
| Empty results | Check console logs | Verify input format |
| Slow responses | Check network tab | May be simulated delays |
| Components not showing | Check React DevTools | Verify route mounting |
| Backend errors | Check server console | Check import paths |

---

**Testing Version**: 1.0
**Status**: Ready for Testing ✅
**Last Updated**: 2024
