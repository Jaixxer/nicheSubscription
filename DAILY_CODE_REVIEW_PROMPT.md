# 📋 **COMPREHENSIVE DAILY CODE REVIEW PROMPT**

## 🎯 **Copy and paste this exact prompt for daily reviews:**

---

**📅 Day [X] - Week [Y] Code Review Request**

I've completed Day [X] work from the roadmap. Please conduct a comprehensive code review and provide detailed feedback.

### **📦 TODAY'S ROADMAP TASKS COMPLETED:**
```
[Copy the exact bullet points from your roadmap for this day, e.g.:]

From Week 2, Day 3-4: Essential DTOs & Basic CQRS Setup
- ✅ Install and configure @nestjs/cqrs
- ✅ Create minimal essential DTOs (6-8 DTOs only):
  - ✅ CreateUserDto, LoginDto with basic validation
  - ✅ CreateProductDto, UpdateProductDto with basic validation
  - ✅ CreateSubscriptionDto, UpdateSubscriptionDto with basic validation
- ✅ Basic validation setup:
  - ✅ Install class-validator and class-transformer
  - ✅ Add global validation pipe
  - ✅ Basic decorators: @IsEmail, @IsString, @IsNumber, @MinLength
- ⏳ Simple CQRS foundation:
  - ✅ Create base Command and Query classes
  - ✅ Implement CommandBus and QueryBus
  - ⏳ Create 4-6 essential commands/queries for core operations (4/6 done)
```

### **📁 FILES MODIFIED/CREATED TODAY:**
```
[List every single file you touched, with status:]

NEW FILES:
- apps/api-gateway/src/users/dto/create-user.dto.ts
- apps/api-gateway/src/users/dto/login.dto.ts
- apps/api-gateway/src/users/dto/user-response.dto.ts
- apps/api-gateway/src/products/dto/create-product.dto.ts
- apps/api-gateway/src/products/dto/update-product.dto.ts
- apps/api-gateway/src/subscriptions/dto/create-subscription.dto.ts
- apps/api-gateway/src/common/commands/base.command.ts
- apps/api-gateway/src/common/queries/base.query.ts
- apps/api-gateway/src/users/commands/create-user.command.ts
- apps/api-gateway/src/users/commands/update-user.command.ts
- apps/api-gateway/src/users/handlers/create-user.handler.ts
- apps/api-gateway/src/users/handlers/update-user.handler.ts
- apps/api-gateway/src/users/queries/get-user.query.ts
- apps/api-gateway/src/users/handlers/get-user.handler.ts

MODIFIED FILES:
- package.json (added @nestjs/cqrs, class-validator, class-transformer)
- apps/api-gateway/src/main.ts (added global validation pipe)
- apps/api-gateway/src/app.module.ts (imported CqrsModule)
- apps/api-gateway/src/users/user.module.ts (added CQRS handlers)
- apps/api-gateway/src/users/user.controller.ts (updated to use commands/queries)
- apps/api-gateway/src/users/user.service.ts (refactored for CQRS)

DELETED FILES:
- [None]
```

### **🔍 SPECIFIC REVIEW FOCUS AREAS:**
```
[Be very specific about what you want reviewed:]

ARCHITECTURE & PATTERNS:
- CQRS implementation correctness and best practices
- Command/Query separation adherence
- Handler registration and dependency injection
- Event-driven architecture foundation

CODE QUALITY:
- TypeScript type safety and interface design
- SOLID principles adherence
- Clean code principles (naming, structure, readability)
- Error handling patterns and consistency

SECURITY CONSIDERATIONS:
- Input validation completeness and security
- DTO validation rules and edge cases
- Authentication/authorization integration
- SQL injection prevention
- XSS protection in DTOs

PERFORMANCE:
- Database query optimization potential
- Memory usage in handlers
- Validation performance impact
- Caching opportunities

TESTING:
- Test coverage for new components
- Unit test quality and edge cases
- Integration test requirements
- Mocking strategies for CQRS
```

### **❓ SPECIFIC QUESTIONS & CONCERNS:**
```
[Ask detailed, technical questions:]

ARCHITECTURE QUESTIONS:
1. Is my Base Command class design extensible for future commands?
2. Should I implement a Result pattern for command responses?
3. Am I correctly separating read/write concerns in CQRS?
4. Is the handler registration approach scalable?

VALIDATION QUESTIONS:
5. Are my password validation rules sufficient for security?
6. Should I add custom validators for business rules at this stage?
7. Is the error message strategy user-friendly and secure?
8. Are there any validation edge cases I'm missing?

PERFORMANCE QUESTIONS:
9. Will the current validation approach impact API response times?
10. Should I implement caching for query handlers now?
11. Are there any N+1 query risks in my current implementation?

SECURITY QUESTIONS:
12. Are there any security vulnerabilities in my DTO validation?
13. Should I add rate limiting at the command level?
14. Is my error handling exposing sensitive information?
15. Are there any injection attack vectors in my current code?

TESTING QUESTIONS:
16. What's the best approach for testing CQRS handlers?
17. Should I mock the entire Prisma service or specific methods?
18. How should I test validation scenarios comprehensively?
```

### **⚠️ CHALLENGES ENCOUNTERED:**
```
[Detail any problems you faced:]

TECHNICAL CHALLENGES:
- Difficulty understanding CQRS handler registration with NestJS
- Confusion about when to use Commands vs direct service calls
- TypeScript errors with generic command/query types
- Validation pipe not catching all DTO validation errors

IMPLEMENTATION CHALLENGES:
- Deciding on folder structure for CQRS components
- Balancing simple DTOs vs comprehensive validation
- Managing circular dependencies between modules
- Error handling strategy across command/query layers

DECISION POINTS:
- Whether to implement Result pattern or throw exceptions
- How granular to make commands (one command per action vs batch)
- Whether to add event publishing at this stage
- How to handle validation errors vs business logic errors

TIME CHALLENGES:
- Spent longer than expected on TypeScript configuration
- CQRS learning curve steeper than anticipated
- Package dependency conflicts during installation
```

### **⏰ TIME TRACKING:**
```
Estimated time spent: [X] hours
Actual time spent: [Y] hours
Time breakdown:
- Research/Learning: [X] hours
- Implementation: [Y] hours
- Debugging/Testing: [Z] hours
- Documentation: [W] hours

Productivity blockers:
- [List any major blockers or delays]
```

### **✅ COMPLETION STATUS:**
```
✅ [Completed task 1]
✅ [Completed task 2]
⏳ [Partially completed task 3 - 80% done]
❌ [Not started task 4 - moved to tomorrow]
🔄 [Task 5 - needs refactoring based on feedback]

QUALITY SELF-ASSESSMENT:
- Code Quality: [1-10 rating]
- Test Coverage: [percentage or N/A]
- Documentation: [Complete/Partial/None]
- Security Review: [Done/Partial/Needed]
```

### **🎯 TOMORROW'S PREPARATION:**
```
[What you plan to focus on next:]

PRIORITY TASKS:
1. [Task that must be completed tomorrow]
2. [Important follow-up from today's work]
3. [Preparation for upcoming features]

RESEARCH NEEDED:
- [Topics to study before tomorrow]
- [Documentation to review]
- [Patterns to understand better]

DEPENDENCIES:
- [Any blockers that need resolution]
- [External services to set up]
- [Team members to coordinate with]
```

**Please provide your detailed review with:**
1. ✅ **What's working well** - Positive feedback and good practices
2. ⚠️ **Areas for improvement** - Constructive suggestions for enhancement
3. 🚨 **Critical issues to fix** - Security, performance, or architectural problems
4. 🚀 **Optimization opportunities** - Performance, maintainability, scalability improvements
5. 🛡️ **Security considerations** - Vulnerabilities, best practices, compliance
6. 📋 **Preparation for tomorrow** - Setup, research, or planning for next day
7. 🧪 **Testing recommendations** - Testing strategy and coverage suggestions
8. 📚 **Learning suggestions** - Resources, patterns, or concepts to study

---

## 🎯 **Example Usage:**

**📅 Day 3 Code Review Request**

Hi! I've completed Day 3 of the roadmap. Please review my code and provide feedback.

### **📦 Today's Completed Tasks:**
```
- Install and configure @nestjs/cqrs
- Create minimal essential DTOs (CreateUserDto, LoginDto, CreateProductDto)
- Set up basic validation with class-validator
- Create base Command and Query classes
- Implement CommandBus and QueryBus
```

### **📁 Files Changed/Added:**
```
- apps/api-gateway/src/users/dto/create-user.dto.ts (new)
- apps/api-gateway/src/users/dto/login.dto.ts (new)
- apps/api-gateway/src/products/dto/create-product.dto.ts (new)
- apps/api-gateway/src/common/commands/base.command.ts (new)
- apps/api-gateway/src/common/queries/base.query.ts (new)
- apps/api-gateway/src/users/commands/create-user.command.ts (new)
- apps/api-gateway/src/users/handlers/create-user.handler.ts (new)
- package.json (modified - added cqrs dependencies)
```

### **🔍 Specific Areas for Review:**
```
- CQRS command/handler implementation
- DTO validation patterns
- Base command/query class design
- Package.json dependency versions
- Folder structure organization
```

### **❓ Questions/Concerns:**
```
- Is my base Command class design extensible enough?
- Are the validation decorators sufficient for security?
- Should I add more error handling in the command handlers?
- Is the folder structure following NestJS best practices?
```

### **⏰ Time Spent:**
```
Estimated time: 6 hours
Challenges faced: Understanding CQRS handler registration, setting up validation pipeline
```

### **📋 Checklist Completed:**
```
✅ Install and configure @nestjs/cqrs
✅ Create CreateUserDto, LoginDto with basic validation
✅ Create CreateProductDto, UpdateProductDto with basic validation
✅ Install class-validator and class-transformer
✅ Add global validation pipe
✅ Create base Command and Query classes
✅ Implement CommandBus and QueryBus
⏳ Create 4-6 essential commands/queries - (4/6 completed)
```

**Please provide your detailed review with:**
1. ✅ What's working well
2. ⚠️ Areas for improvement  
3. 🚨 Critical issues to fix
4. 🚀 Optimization opportunities
5. 📋 Preparation for tomorrow

---

## 💡 **Tips for Better Reviews:**

1. **Be Specific**: Include exact file paths and line numbers if possible
2. **Show Code Snippets**: Include problematic code sections in your message
3. **Ask Targeted Questions**: Focus on specific patterns or implementations
4. **Include Error Messages**: If you encountered issues, share the error logs
5. **Mention Performance Concerns**: Note any slow queries or operations
6. **Security Focus**: Always ask about security implications
7. **Testing Status**: Mention if you've written tests and their coverage

## 🚀 **Ready to Use!**

Just copy the template above, fill in your specific details, and send it for comprehensive daily code reviews!
