# Contributing Guidelines

## Code Standards

### TypeScript
- Use strict mode
- Define types for all functions
- Avoid `any` type
- Use interfaces for object shapes

### Code Style
- Follow existing patterns
- Use meaningful variable names
- Keep functions focused and small
- Add comments for complex logic

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push to remote: `git push origin feature/your-feature`
4. Create pull request with description

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Build/dependency updates

Example: `feat: add website template selector`

## Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Add meaningful PR description
4. Request review from team
5. Address review comments
6. Merge after approval

## Testing

Run tests before committing:

```bash
# Frontend
npm run lint

# Backend
npm run lint
npm run typecheck

# All modules
npm run build
```

## Development Setup

1. Follow [Setup Guide](../setup/SETUP.md)
2. Create feature branch
3. Make changes
4. Test locally
5. Submit PR

## Project Structure

### Frontend
- `src/components/` - Reusable components
- `src/pages/` - Page components
- `src/store/` - Redux store
- `src/utils/` - Utility functions

### Backend
- `src/routes/` - API routes
- `src/controllers/` - Route handlers
- `src/models/` - MongoDB schemas
- `src/middleware/` - Express middleware
- `src/utils/` - Helper functions
- `src/config/` - Configuration files

### MCP Server
- `src/tools/` - MCP tools

### Shared
- `src/types/` - TypeScript types
- `src/utils/` - Shared utilities

## Code Review Checklist

- [ ] Code follows style guidelines
- [ ] TypeScript types are properly defined
- [ ] No console logs (except warnings/errors)
- [ ] Error handling is implemented
- [ ] Tests are added/updated
- [ ] Documentation is updated
- [ ] No hardcoded values
- [ ] Environment variables used for configuration

## Reporting Issues

When reporting issues, include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Node version, etc.)
- Error messages/logs

## Questions?

Open an issue or reach out to the team.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
