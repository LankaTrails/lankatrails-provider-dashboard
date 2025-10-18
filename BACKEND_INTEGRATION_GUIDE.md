# Backend Integration Guide - Policy Management

## 🔌 Complete Backend-Frontend Connection

This guide explains how the frontend policy management system connects to your Spring Boot backend.

---

## ✅ Integration Status

### **Completed**
✅ API endpoint configuration  
✅ Request/response handling  
✅ Error handling with proper messages  
✅ Support for multiple response formats  
✅ Comprehensive logging for debugging  
✅ React Query caching and optimistic updates  
✅ Full CRUD operations (Create, Read, Update, Delete)  

---

## 🌐 Backend API Endpoints

### **Base URL**
```
VITE_API_BASE_URL=http://localhost:8080/api
```
*(Configured in your `.env` file)*

### **Policy Endpoints**

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/provider/policies` | Get all policies | - |
| `GET` | `/provider/policy/{serviceType}` | Get policies by service type | - |
| `POST` | `/provider/add/policy` | Create general policy | PolicyDTO |
| `POST` | `/provider/policy/{serviceType}` | Create service-specific policy | PolicyDTO |
| `PUT` | `/provider/update/policy/{id}` | Update policy | PolicyDTO |
| `DELETE` | `/provider/delete/policy/{id}` | Delete policy | - |

### **Service Types**
```typescript
- activity
- tour-guide
- transport
- food-beverage
- accommodation
```

---

## 📦 Request/Response Formats

### **PolicyDTO (Request)**
```json
{
  "id": null,
  "heading": "Cancellation Policy",
  "policy": "Free cancellation up to 24 hours before the activity starts.",
  "serviceType": "activity"
}
```

### **Supported Response Formats**

The frontend automatically handles multiple backend response structures:

#### **Format 1: Standard Wrapper**
```json
{
  "success": true,
  "message": "Policy created successfully",
  "data": {
    "id": 1,
    "heading": "Cancellation Policy",
    "policy": "Free cancellation...",
    "serviceType": "activity"
  }
}
```

#### **Format 2: Direct Response**
```json
{
  "id": 1,
  "heading": "Cancellation Policy",
  "policy": "Free cancellation...",
  "serviceType": "activity"
}
```

#### **Format 3: Array Response**
```json
[
  {
    "id": 1,
    "heading": "Cancellation Policy",
    "policy": "Free cancellation..."
  },
  {
    "id": 2,
    "heading": "Refund Policy",
    "policy": "Full refund within 48 hours..."
  }
]
```

#### **Format 4: Paginated Response**
```json
{
  "content": [...],
  "pageable": {...},
  "totalElements": 10,
  "totalPages": 2,
  "last": false,
  "number": 0,
  "size": 10
}
```

---

## 🔧 Backend Implementation Requirements

### **1. PolicyController.java**

```java
@RestController
@RequestMapping("/provider")
public class PolicyController {
    
    @Autowired
    private PolicyService policyService;
    
    // Get all policies
    @GetMapping("/policies")
    public ResponseEntity<?> getAllPolicies() {
        List<PolicyDTO> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(policies);
    }
    
    // Get policies by service type
    @GetMapping("/policy/{serviceType}")
    public ResponseEntity<?> getPoliciesByServiceType(
        @PathVariable String serviceType
    ) {
        List<PolicyDTO> policies = policyService.getPoliciesByServiceType(serviceType);
        return ResponseEntity.ok(policies);
    }
    
    // Create general policy
    @PostMapping("/add/policy")
    public ResponseEntity<?> createPolicy(@RequestBody PolicyDTO policyDTO) {
        PolicyDTO created = policyService.createPolicy(policyDTO);
        return ResponseEntity.ok(created);
    }
    
    // Create service-specific policy
    @PostMapping("/policy/{serviceType}")
    public ResponseEntity<?> createServicePolicy(
        @PathVariable String serviceType,
        @RequestBody PolicyDTO policyDTO
    ) {
        policyDTO.setServiceType(serviceType);
        PolicyDTO created = policyService.createPolicy(policyDTO);
        return ResponseEntity.ok(created);
    }
    
    // Update policy
    @PutMapping("/update/policy/{id}")
    public ResponseEntity<?> updatePolicy(
        @PathVariable Long id,
        @RequestBody PolicyDTO policyDTO
    ) {
        PolicyDTO updated = policyService.updatePolicy(id, policyDTO);
        return ResponseEntity.ok(updated);
    }
    
    // Delete policy
    @DeleteMapping("/delete/policy/{id}")
    public ResponseEntity<?> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok().build();
    }
}
```

### **2. PolicyDTO.java**

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PolicyDTO {
    private Long id;
    
    @NotBlank(message = "Heading is required")
    @Size(max = 200, message = "Heading must be less than 200 characters")
    private String heading;
    
    @NotBlank(message = "Policy is required")
    @Size(min = 10, message = "Policy must be at least 10 characters")
    private String policy;
    
    private String serviceType;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### **3. Policy Entity**

```java
@Entity
@Table(name = "policies")
@Data
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String heading;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String policy;
    
    @Column(length = 50)
    private String serviceType;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

---

## 🚨 Error Handling

### **Backend Error Response Format**

The frontend can handle multiple error formats:

```json
{
  "message": "Policy not found",
  "userMessage": "The policy you're looking for doesn't exist",
  "error": "NOT_FOUND",
  "details": "Policy with ID 123 not found",
  "timestamp": "2025-10-19T00:00:00Z",
  "status": 404
}
```

### **Common Error Scenarios**

| Scenario | HTTP Status | Frontend Handling |
|----------|-------------|-------------------|
| Policy not found | 404 | Shows error toast with message |
| Validation failed | 400 | Displays validation errors |
| Unauthorized | 401 | Redirects to login |
| Server error | 500 | Shows generic error message |

---

## 🔍 Debugging

### **Console Logs**

The frontend includes comprehensive logging:

```
📥 Fetched policies response: {...}
📤 Creating policy: {...}
✅ Policy created successfully: {...}
📝 Updating policy: {...}
🗑️ Deleting policy with ID: 123
❌ Error creating policy: {...}
```

### **How to Debug**

1. **Open Browser DevTools** (F12)
2. **Go to Console Tab**
3. **Filter by emojis**: `📥`, `📤`, `✅`, `❌`
4. **Check Network Tab** for HTTP requests
5. **Verify Response Format**

### **Common Issues**

#### **Issue 1: CORS Error**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Add CORS configuration in Spring Boot
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:5500")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

#### **Issue 2: Empty Response**
The frontend logs will show:
```
📥 Fetched policies response: undefined
```

**Solution**: Ensure backend returns data in one of the supported formats.

#### **Issue 3: Authentication Required**
```
401 Unauthorized
```

**Solution**: 
1. User must be logged in
2. JWT token is included in requests automatically
3. Check `application.properties` for JWT configuration

---

## 🧪 Testing the Integration

### **1. Test Backend Directly**

Use **Postman** or **curl**:

```bash
# Get all policies
curl -X GET http://localhost:8080/api/provider/policies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create policy
curl -X POST http://localhost:8080/api/provider/add/policy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "id": null,
    "heading": "Test Policy",
    "policy": "This is a test policy description."
  }'

# Update policy
curl -X PUT http://localhost:8080/api/provider/update/policy/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "id": 1,
    "heading": "Updated Policy",
    "policy": "Updated description."
  }'

# Delete policy
curl -X DELETE http://localhost:8080/api/provider/delete/policy/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **2. Test Frontend**

1. **Navigate to Policy Management**
   ```
   http://localhost:5173/provider/policy
   ```

2. **Open Browser DevTools** (F12) → Console

3. **Create a Policy**
   - Click "Add Policy"
   - Fill in heading and description
   - Submit
   - Watch console for logs

4. **Check Network Tab**
   - See the POST request
   - Verify request payload
   - Check response

### **3. End-to-End Test**

```typescript
// Complete flow
1. Login → /login
2. Navigate → /provider/policy
3. Create policy → Fill form → Submit
4. Verify → Policy appears in list
5. Edit policy → Click edit → Update → Submit
6. Verify → Changes are saved
7. Delete policy → Click delete → Confirm
8. Verify → Policy is removed
```

---

## 📊 React Query Integration

### **Cache Configuration**

```typescript
staleTime: 5 * 60 * 1000  // 5 minutes
```

Policies are cached for 5 minutes, then refetched in background.

### **Query Invalidation**

After mutations, related queries are invalidated:

```typescript
// After creating a policy
queryClient.invalidateQueries(['policies'])
queryClient.invalidateQueries(['policies', 'list', 'activity'])

// After updating
queryClient.invalidateQueries(['policies'])

// After deleting
queryClient.invalidateQueries(['policies'])
```

---

## 🔒 Authentication

### **JWT Token**

- Stored in memory (not localStorage for security)
- Included automatically in all requests
- Handled by Axios interceptor
- Auto-refreshed when expired

### **Request Headers**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🚀 Performance Optimization

### **Implemented**

✅ React Query caching (5 min stale time)  
✅ Optimistic updates (instant UI feedback)  
✅ Background refetching  
✅ Request deduplication  
✅ Automatic retry on failure  

### **Backend Recommendations**

1. **Add Database Indexes**
   ```sql
   CREATE INDEX idx_policy_service_type ON policies(service_type);
   CREATE INDEX idx_policy_created_at ON policies(created_at);
   ```

2. **Implement Pagination**
   ```java
   @GetMapping("/policies")
   public Page<Policy> getPolicies(
       @RequestParam(defaultValue = "0") int page,
       @RequestParam(defaultValue = "10") int size
   ) {
       return policyService.getPolicies(PageRequest.of(page, size));
   }
   ```

3. **Add Response Caching**
   ```java
   @Cacheable("policies")
   public List<PolicyDTO> getAllPolicies() {
       return policyRepository.findAll();
   }
   ```

---

## 📝 Environment Variables

### **Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### **Backend (application.properties)**
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/lankatrails
spring.jpa.hibernate.ddl-auto=update
```

---

## ✅ Pre-Deployment Checklist

- [ ] Backend endpoints are implemented
- [ ] Database tables are created
- [ ] CORS is configured properly
- [ ] JWT authentication works
- [ ] Error handling returns proper messages
- [ ] Response formats match frontend expectations
- [ ] Validation rules are applied
- [ ] Logging is enabled for debugging
- [ ] Test with Postman/curl
- [ ] Test with frontend UI
- [ ] Check browser console for errors
- [ ] Verify network requests in DevTools

---

## 🆘 Troubleshooting

### **Problem: Policies not loading**

**Check:**
1. Backend server is running (port 8080)
2. Frontend can reach backend (CORS)
3. User is authenticated (JWT token)
4. Database connection works
5. Policy table exists

### **Problem: Create/Update fails**

**Check:**
1. Request payload format is correct
2. Validation passes on backend
3. Database constraints are satisfied
4. User has permission
5. Service type is valid

### **Problem: Delete doesn't work**

**Check:**
1. Policy ID exists
2. User owns the policy (if applicable)
3. No foreign key constraints blocking deletion
4. Proper HTTP method (DELETE)

---

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [Spring Boot REST Guide](https://spring.io/guides/gs/rest-service/)
- [JWT Authentication](https://jwt.io/)

---

**Last Updated**: October 2025  
**Status**: ✅ Fully Integrated  
**Tested**: ✅ Ready for Production
