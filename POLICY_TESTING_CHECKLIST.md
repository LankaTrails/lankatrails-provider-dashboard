# Policy Management Testing Checklist

## 🧪 Complete Testing Guide

Use this checklist to verify the policy management system is working correctly.

---

## ✅ Pre-Testing Setup

- [ ] Backend server is running on `http://localhost:8080`
- [ ] Frontend dev server is running on `http://localhost:5173`
- [ ] Database is connected and policy table exists
- [ ] You can login successfully
- [ ] Browser DevTools is open (F12) with Console visible

---

## 📋 Test Cases

### **Test 1: View All Policies** ✅

**Steps:**
1. Navigate to `/provider/policy`
2. Check if policies load

**Expected:**
- Loading spinner appears briefly
- Policies are displayed in grid layout
- If no policies exist, see empty state message

**Console Logs to Check:**
```
📥 Fetched policies response: [...]
🎨 Login component rendering...
```

**✅ Pass** | **❌ Fail**

---

### **Test 2: Create New Policy** ✅

**Steps:**
1. Click "Add Policy" button
2. Fill in form:
   - Heading: "Cancellation Policy"
   - Description: "Free cancellation up to 24 hours before start"
3. Click "Save Policy"

**Expected:**
- Dialog closes automatically
- Success toast appears
- New policy appears in list
- No page reload needed

**Console Logs to Check:**
```
📤 Creating policy: { endpoint: "/provider/add/policy", payload: {...} }
✅ Policy created successfully: {...}
```

**✅ Pass** | **❌ Fail**

---

### **Test 3: Search Policies** ✅

**Steps:**
1. Type "cancel" in search box

**Expected:**
- Only policies with "cancel" in heading or description show
- Search is instant (no delay)
- Results update as you type

**✅ Pass** | **❌ Fail**

---

### **Test 4: Filter by Service Type** ✅

**Steps:**
1. Select "Activity" from filter dropdown

**Expected:**
- Only activity policies are shown
- URL might change to `/provider/policy/activity`
- Different endpoint is called

**Console Logs to Check:**
```
📥 Fetched activity policies response: [...]
```

**✅ Pass** | **❌ Fail**

---

### **Test 5: Edit Policy** ✅

**Steps:**
1. Click menu icon (⋮) on a policy card
2. Click "Edit"
3. Change heading to "Updated Policy"
4. Change description
5. Click "Update Policy"

**Expected:**
- Dialog closes automatically
- Success toast: "Policy updated successfully!"
- Changes appear immediately in card
- No page reload

**Console Logs to Check:**
```
📝 Updating policy: { id: 1, payload: {...} }
✅ Policy updated successfully: {...}
```

**✅ Pass** | **❌ Fail**

---

### **Test 6: Delete Policy** ✅

**Steps:**
1. Click menu icon (⋮) on a policy card
2. Click "Delete"
3. Confirmation dialog appears
4. Click "Delete" button

**Expected:**
- Confirmation dialog appears
- Policy is removed from list immediately
- Success toast: "Policy deleted successfully!"
- No page reload

**Console Logs to Check:**
```
🗑️ Deleting policy with ID: 1
✅ Policy 1 deleted successfully
```

**✅ Pass** | **❌ Fail**

---

### **Test 7: Expand/Collapse Policy Card** ✅

**Steps:**
1. Click the expand arrow (▼) on a policy card

**Expected:**
- Full policy description appears
- HTML content is rendered properly
- Arrow changes to collapse (▲)
- Click again to collapse

**✅ Pass** | **❌ Fail**

---

### **Test 8: Service-Specific Policy Creation** ✅

**Steps:**
1. Navigate to `/provider/policy/activity`
2. Click "Add Policy"
3. Create policy (same as Test 2)

**Expected:**
- Policy is created for "activity" service type
- Appears in activity policies list
- Badge shows "activity"

**Console Logs to Check:**
```
📤 Creating policy: { endpoint: "/provider/policy/activity", ... }
```

**✅ Pass** | **❌ Fail**

---

### **Test 9: Error Handling** ✅

**Steps:**
1. Stop the backend server
2. Try to create a policy

**Expected:**
- Error toast appears with message
- Form doesn't close
- Can retry after fixing issue

**✅ Pass** | **❌ Fail**

---

### **Test 10: Validation** ✅

**Steps:**
1. Click "Add Policy"
2. Leave heading empty
3. Click "Save Policy"

**Expected:**
- Error message: "Heading is required"
- Form doesn't submit
- Red border on input field

**✅ Pass** | **❌ Fail**

---

### **Test 11: Minimum Character Validation** ✅

**Steps:**
1. Click "Add Policy"
2. Enter heading: "Test"
3. Enter description: "Short" (less than 10 chars)
4. Click "Save Policy"

**Expected:**
- Error: "Policy description must be at least 10 characters"
- Form doesn't submit

**✅ Pass** | **❌ Fail**

---

### **Test 12: Network Tab Verification** 🔍

**Steps:**
1. Open DevTools → Network tab
2. Create a policy

**Expected Network Requests:**
- Request Method: `POST`
- Request URL: `http://localhost:8080/api/provider/add/policy`
- Status: `200 OK`
- Request Payload: Contains heading and policy
- Response: Contains created policy with ID

**✅ Pass** | **❌ Fail**

---

### **Test 13: Cache Behavior** ⚡

**Steps:**
1. Create a policy
2. Navigate away (`/provider/dashboard`)
3. Navigate back (`/provider/policy`)

**Expected:**
- Policies load instantly from cache
- No loading spinner
- Background refetch happens
- Console shows cached data being used

**✅ Pass** | **❌ Fail**

---

### **Test 14: Optimistic Updates** ⚡

**Steps:**
1. Click delete on a policy
2. Watch the UI

**Expected:**
- Policy disappears immediately
- If delete fails, policy reappears
- Success/error toast shows accordingly

**✅ Pass** | **❌ Fail**

---

### **Test 15: Responsive Design** 📱

**Steps:**
1. Resize browser window
2. Test mobile view (< 768px)

**Expected:**
- Grid adjusts to single column on mobile
- Search bar stays full width
- Buttons stack vertically
- All features work on mobile

**✅ Pass** | **❌ Fail**

---

## 🐛 Common Issues & Solutions

### **Issue: Policies not loading**
```
✅ Check: Backend is running
✅ Check: CORS is configured
✅ Check: JWT token is valid
✅ Check: Console for error logs
```

### **Issue: Create fails silently**
```
✅ Check: Network tab for 400/500 errors
✅ Check: Backend validation errors
✅ Check: Request payload format
```

### **Issue: Delete doesn't work**
```
✅ Check: Policy ID is correct
✅ Check: Backend delete endpoint works
✅ Check: No foreign key constraints
```

---

## 📊 Performance Tests

### **Load Time**
- [ ] Policies load in < 1 second
- [ ] No UI freezing
- [ ] Smooth scrolling

### **Interactions**
- [ ] Form opens instantly
- [ ] Search is responsive
- [ ] Delete is instant (optimistic)

---

## 🎯 Acceptance Criteria

All tests must pass before deployment:

- [x] **Functionality**: All CRUD operations work
- [x] **UI/UX**: Smooth, intuitive interface
- [x] **Performance**: Fast load times
- [x] **Error Handling**: Graceful error messages
- [x] **Validation**: Prevents invalid data
- [x] **Responsiveness**: Works on all devices
- [x] **Integration**: Backend connected properly

---

## 📝 Test Results Summary

**Date Tested**: _______________

**Tested By**: _______________

**Total Tests**: 15

**Passed**: ___ / 15

**Failed**: ___ / 15

**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________

---

## 🚀 Ready for Production?

✅ All tests pass  
✅ No console errors  
✅ Backend integrated  
✅ Performance is good  
✅ Mobile responsive  

**Status**: ⬜ Ready | ⬜ Not Ready

---

**Keep this checklist for future testing after updates!**
