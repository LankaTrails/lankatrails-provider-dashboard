# 🔌 Backend Compatibility Guide - Ratings Analytics

## ⚠️ Current Status: **BACKEND NOT IMPLEMENTED**

The ratings analytics frontend is **fully built and ready**, but the backend endpoints **do not exist yet**. Here's what you need to implement.

---

## 📊 What the Frontend Expects

The `RatingsAnalytics` component currently uses **sample/mock data**. To show real data, you need to implement these backend endpoints.

---

## 🎯 Required Backend Endpoints

### **1. Get Overall Rating Statistics**
```java
GET /api/provider/analytics/ratings
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "averageRating": 4.8,
    "totalReviews": 230,
    "monthlyChange": 0.2,
    "responseRate": 95,
    "fiveStarCount": 150,
    "fourStarCount": 50,
    "threeStarCount": 20,
    "twoStarCount": 6,
    "oneStarCount": 4
  }
}
```

---

### **2. Get Rating Distribution**
```java
GET /api/provider/analytics/ratings/distribution
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "stars": 5,
      "count": 150,
      "percentage": 65.2
    },
    {
      "stars": 4,
      "count": 50,
      "percentage": 21.7
    },
    {
      "stars": 3,
      "count": 20,
      "percentage": 8.7
    },
    {
      "stars": 2,
      "count": 6,
      "percentage": 2.6
    },
    {
      "stars": 1,
      "count": 4,
      "percentage": 1.8
    }
  ]
}
```

---

### **3. Get Rating Trends**
```java
GET /api/provider/analytics/ratings/trends?months=6
```

**Query Parameters:**
- `months` (optional): Number of months to retrieve (default: 6)

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "month": "Jan",
      "year": 2024,
      "rating": 4.2,
      "reviews": 12
    },
    {
      "month": "Feb",
      "year": 2024,
      "rating": 4.3,
      "reviews": 15
    },
    {
      "month": "Mar",
      "year": 2024,
      "rating": 4.5,
      "reviews": 18
    }
  ]
}
```

---

### **4. Get Recent Reviews**
```java
GET /api/provider/analytics/reviews/recent?limit=5
```

**Query Parameters:**
- `limit` (optional): Number of reviews to retrieve (default: 5)

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "customer": "Liam Brown",
      "customerId": 123,
      "rating": 5,
      "comment": "Amazing experience! Highly recommend.",
      "date": "2024-01-21T10:30:00Z",
      "service": "Sigiriya Rock Climb",
      "serviceId": 456,
      "serviceType": "activity",
      "replied": true
    },
    {
      "id": 2,
      "customer": "Sophia Lee",
      "customerId": 124,
      "rating": 4,
      "comment": "Great guide and very friendly.",
      "date": "2024-01-18T14:20:00Z",
      "service": "Cultural Triangle Tour",
      "serviceId": 457,
      "serviceType": "tour-guide",
      "replied": false
    }
  ]
}
```

---

### **5. Service-Specific Analytics (Optional)**
```java
GET /api/provider/analytics/ratings/{serviceType}
GET /api/provider/analytics/reviews/{serviceType}
```

**Service Types:**
- `activity`
- `tour-guide`
- `transport`
- `food-beverage`
- `accommodation`

Same response format as general endpoints, but filtered by service type.

---

## 🏗️ Backend Implementation (Spring Boot)

### **Step 1: Create DTOs**

**RatingStatsDTO.java**
```java
package com.lankatrails.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RatingStatsDTO {
    private Double averageRating;
    private Integer totalReviews;
    private Double monthlyChange;
    private Integer responseRate;
    private Integer fiveStarCount;
    private Integer fourStarCount;
    private Integer threeStarCount;
    private Integer twoStarCount;
    private Integer oneStarCount;
}
```

**RatingDistributionDTO.java**
```java
package com.lankatrails.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RatingDistributionDTO {
    private Integer stars;
    private Integer count;
    private Double percentage;
}
```

**RatingTrendDTO.java**
```java
package com.lankatrails.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RatingTrendDTO {
    private String month;
    private Integer year;
    private Double rating;
    private Integer reviews;
}
```

**ReviewDTO.java**
```java
package com.lankatrails.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private Long id;
    private String customer;
    private Long customerId;
    private Integer rating;
    private String comment;
    private LocalDateTime date;
    private String service;
    private Long serviceId;
    private String serviceType;
    private Boolean replied;
}
```

---

### **Step 2: Create Repository Methods**

**ReviewRepository.java**
```java
package com.lankatrails.repository;

import com.lankatrails.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Get all reviews for a provider
    List<Review> findByProviderId(Long providerId);
    
    // Get average rating
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.providerId = :providerId")
    Double getAverageRating(@Param("providerId") Long providerId);
    
    // Count reviews by rating
    @Query("SELECT COUNT(r) FROM Review r WHERE r.providerId = :providerId AND r.rating = :stars")
    Integer countByRating(@Param("providerId") Long providerId, @Param("stars") Integer stars);
    
    // Get reviews by date range
    List<Review> findByProviderIdAndDateBetween(
        Long providerId, 
        LocalDateTime start, 
        LocalDateTime end
    );
    
    // Get recent reviews
    List<Review> findTop10ByProviderIdOrderByDateDesc(Long providerId);
    
    // Count replied reviews
    @Query("SELECT COUNT(r) FROM Review r WHERE r.providerId = :providerId AND r.replied = true")
    Integer countRepliedReviews(@Param("providerId") Long providerId);
}
```

---

### **Step 3: Create Service Layer**

**AnalyticsService.java**
```java
package com.lankatrails.service;

import com.lankatrails.dto.*;
import com.lankatrails.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    public RatingStatsDTO getRatingStats(Long providerId) {
        RatingStatsDTO stats = new RatingStatsDTO();
        
        // Get average rating
        Double avgRating = reviewRepository.getAverageRating(providerId);
        stats.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        
        // Get total reviews
        Integer totalReviews = reviewRepository.findByProviderId(providerId).size();
        stats.setTotalReviews(totalReviews);
        
        // Count by star rating
        stats.setFiveStarCount(reviewRepository.countByRating(providerId, 5));
        stats.setFourStarCount(reviewRepository.countByRating(providerId, 4));
        stats.setThreeStarCount(reviewRepository.countByRating(providerId, 3));
        stats.setTwoStarCount(reviewRepository.countByRating(providerId, 2));
        stats.setOneStarCount(reviewRepository.countByRating(providerId, 1));
        
        // Calculate response rate
        Integer repliedCount = reviewRepository.countRepliedReviews(providerId);
        Integer responseRate = totalReviews > 0 ? (repliedCount * 100) / totalReviews : 0;
        stats.setResponseRate(responseRate);
        
        // Calculate monthly change (compare last month to previous month)
        LocalDateTime lastMonthStart = LocalDateTime.now().minusMonths(1).withDayOfMonth(1);
        LocalDateTime lastMonthEnd = LocalDateTime.now().withDayOfMonth(1);
        LocalDateTime prevMonthStart = lastMonthStart.minusMonths(1);
        
        List<Review> lastMonthReviews = reviewRepository.findByProviderIdAndDateBetween(
            providerId, lastMonthStart, lastMonthEnd
        );
        List<Review> prevMonthReviews = reviewRepository.findByProviderIdAndDateBetween(
            providerId, prevMonthStart, lastMonthStart
        );
        
        Double lastMonthAvg = calculateAverage(lastMonthReviews);
        Double prevMonthAvg = calculateAverage(prevMonthReviews);
        Double monthlyChange = lastMonthAvg - prevMonthAvg;
        stats.setMonthlyChange(Math.round(monthlyChange * 10.0) / 10.0);
        
        return stats;
    }
    
    public List<RatingDistributionDTO> getRatingDistribution(Long providerId) {
        List<RatingDistributionDTO> distribution = new ArrayList<>();
        Integer total = reviewRepository.findByProviderId(providerId).size();
        
        for (int stars = 5; stars >= 1; stars--) {
            Integer count = reviewRepository.countByRating(providerId, stars);
            Double percentage = total > 0 ? (count * 100.0) / total : 0.0;
            distribution.add(new RatingDistributionDTO(
                stars, 
                count, 
                Math.round(percentage * 10.0) / 10.0
            ));
        }
        
        return distribution;
    }
    
    public List<RatingTrendDTO> getRatingTrends(Long providerId, Integer months) {
        List<RatingTrendDTO> trends = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (int i = months - 1; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1);
            LocalDateTime monthEnd = monthStart.plusMonths(1);
            
            List<Review> monthReviews = reviewRepository.findByProviderIdAndDateBetween(
                providerId, monthStart, monthEnd
            );
            
            Double avgRating = calculateAverage(monthReviews);
            String monthName = Month.from(monthStart).name().substring(0, 3);
            int year = monthStart.getYear();
            
            trends.add(new RatingTrendDTO(
                monthName,
                year,
                Math.round(avgRating * 10.0) / 10.0,
                monthReviews.size()
            ));
        }
        
        return trends;
    }
    
    public List<ReviewDTO> getRecentReviews(Long providerId, Integer limit) {
        List<Review> reviews = reviewRepository.findTop10ByProviderIdOrderByDateDesc(providerId);
        List<ReviewDTO> dtos = new ArrayList<>();
        
        int count = Math.min(limit, reviews.size());
        for (int i = 0; i < count; i++) {
            Review r = reviews.get(i);
            dtos.add(new ReviewDTO(
                r.getId(),
                r.getCustomer().getName(),
                r.getCustomer().getId(),
                r.getRating(),
                r.getComment(),
                r.getDate(),
                r.getService().getName(),
                r.getService().getId(),
                r.getService().getType(),
                r.getReplied()
            ));
        }
        
        return dtos;
    }
    
    private Double calculateAverage(List<Review> reviews) {
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream()
            .mapToInt(Review::getRating)
            .average()
            .orElse(0.0);
    }
}
```

---

### **Step 4: Create Controller**

**AnalyticsController.java**
```java
package com.lankatrails.controller;

import com.lankatrails.dto.*;
import com.lankatrails.service.AnalyticsService;
import com.lankatrails.util.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/provider/analytics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5500"})
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingStatsDTO>> getRatingStats() {
        // Get provider ID from authentication context
        Long providerId = getCurrentProviderId();
        
        RatingStatsDTO stats = analyticsService.getRatingStats(providerId);
        return ResponseEntity.ok(ApiResponse.success(stats, "Rating stats retrieved successfully"));
    }
    
    @GetMapping("/ratings/distribution")
    public ResponseEntity<ApiResponse<List<RatingDistributionDTO>>> getRatingDistribution() {
        Long providerId = getCurrentProviderId();
        
        List<RatingDistributionDTO> distribution = analyticsService.getRatingDistribution(providerId);
        return ResponseEntity.ok(ApiResponse.success(distribution, "Rating distribution retrieved"));
    }
    
    @GetMapping("/ratings/trends")
    public ResponseEntity<ApiResponse<List<RatingTrendDTO>>> getRatingTrends(
        @RequestParam(defaultValue = "6") Integer months
    ) {
        Long providerId = getCurrentProviderId();
        
        List<RatingTrendDTO> trends = analyticsService.getRatingTrends(providerId, months);
        return ResponseEntity.ok(ApiResponse.success(trends, "Rating trends retrieved"));
    }
    
    @GetMapping("/reviews/recent")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getRecentReviews(
        @RequestParam(defaultValue = "5") Integer limit
    ) {
        Long providerId = getCurrentProviderId();
        
        List<ReviewDTO> reviews = analyticsService.getRecentReviews(providerId, limit);
        return ResponseEntity.ok(ApiResponse.success(reviews, "Recent reviews retrieved"));
    }
    
    // Service-specific endpoints
    @GetMapping("/ratings/{serviceType}")
    public ResponseEntity<ApiResponse<RatingStatsDTO>> getServiceTypeRatings(
        @PathVariable String serviceType
    ) {
        Long providerId = getCurrentProviderId();
        // Filter by service type
        RatingStatsDTO stats = analyticsService.getRatingStatsByServiceType(providerId, serviceType);
        return ResponseEntity.ok(ApiResponse.success(stats, "Service ratings retrieved"));
    }
    
    private Long getCurrentProviderId() {
        // Get from Spring Security context
        // return SecurityContextHolder.getContext().getAuthentication()...
        return 1L; // Placeholder
    }
}
```

---

### **Step 5: Create Database Entities**

**Review.java**
```java
package com.lankatrails.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer rating; // 1-5
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Column(nullable = false)
    private Boolean replied = false;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;
    
    @ManyToOne
    @JoinColumn(name = "provider_id")
    private Provider provider;
    
    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;
    
    @Column(name = "provider_id", insertable = false, updatable = false)
    private Long providerId;
}
```

---

## ✅ Implementation Checklist

### **Database Setup**
- [ ] Create `reviews` table
- [ ] Add foreign keys (customer_id, provider_id, service_id)
- [ ] Add indexes on provider_id, date, rating
- [ ] Seed sample review data

### **Backend Code**
- [ ] Create DTOs (RatingStatsDTO, etc.)
- [ ] Create Review entity
- [ ] Create ReviewRepository
- [ ] Create AnalyticsService
- [ ] Create AnalyticsController
- [ ] Add CORS configuration
- [ ] Test all endpoints

### **Frontend Integration**
- [ ] Create `services/analytics/ratingsApi.ts`
- [ ] Create React Query hooks
- [ ] Replace sample data in RatingsAnalytics
- [ ] Test with real data

---

## 🧪 Testing the Backend

### **1. Start Backend**
```bash
cd lankatrails-backend
./mvnw spring-boot:run
```

### **2. Test with curl**

```bash
# Get rating stats
curl -X GET http://localhost:8080/api/provider/analytics/ratings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get distribution
curl -X GET http://localhost:8080/api/provider/analytics/ratings/distribution \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get trends
curl -X GET "http://localhost:8080/api/provider/analytics/ratings/trends?months=6" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get recent reviews
curl -X GET "http://localhost:8080/api/provider/analytics/reviews/recent?limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔌 Frontend Integration After Backend is Ready

### **Create API Service**

```typescript
// src/services/analytics/ratingsApi.ts
import api from '@/api/axiosInstance';

export const fetchRatingsStats = async () => {
  const response = await api.get('/provider/analytics/ratings');
  return response.data.data;
};

export const fetchRatingDistribution = async () => {
  const response = await api.get('/provider/analytics/ratings/distribution');
  return response.data.data;
};

export const fetchRatingTrends = async (months = 6) => {
  const response = await api.get(`/provider/analytics/ratings/trends?months=${months}`);
  return response.data.data;
};

export const fetchRecentReviews = async (limit = 5) => {
  const response = await api.get(`/provider/analytics/reviews/recent?limit=${limit}`);
  return response.data.data;
};
```

### **Create React Query Hooks**

```typescript
// src/services/analytics/useRatingsAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import * as api from './ratingsApi';

export const useRatingsStats = () => {
  return useQuery({
    queryKey: ['ratingsStats'],
    queryFn: api.fetchRatingsStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRatingDistribution = () => {
  return useQuery({
    queryKey: ['ratingDistribution'],
    queryFn: api.fetchRatingDistribution,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRatingTrends = (months = 6) => {
  return useQuery({
    queryKey: ['ratingTrends', months],
    queryFn: () => api.fetchRatingTrends(months),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecentReviews = (limit = 5) => {
  return useQuery({
    queryKey: ['recentReviews', limit],
    queryFn: () => api.fetchRecentReviews(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates)
  });
};
```

### **Update RatingsAnalytics Component**

```typescript
// Replace sample data with:
const { data: stats, isLoading: loadingStats } = useRatingsStats();
const { data: distribution, isLoading: loadingDistribution } = useRatingDistribution();
const { data: trends, isLoading: loadingTrends } = useRatingTrends();
const { data: reviews, isLoading: loadingReviews } = useRecentReviews();
```

---

## 📝 Summary

### **✅ Frontend Status**
- Component built and ready
- UI/UX complete
- Currently using sample data
- Waiting for backend

### **⏳ Backend Status**
- **NOT IMPLEMENTED**
- Need to create endpoints
- Need Review entity and repository
- Need AnalyticsService
- Need AnalyticsController

### **🚀 Next Steps**
1. Implement backend endpoints (see code above)
2. Test endpoints with Postman/curl
3. Create frontend API service
4. Replace sample data with API calls
5. Test end-to-end

---

**The frontend is 100% ready. Backend implementation needed to make it functional with real data.**
