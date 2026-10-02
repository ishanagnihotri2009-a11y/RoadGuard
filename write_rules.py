with open('firestore.rules', 'r', encoding='utf-8') as f:
    code = f.read()

# I will just rewrite the file with the exact proper rules
rules = '''rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && get(/databases//documents/users/).data.role == 'admin';
    }

    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow update: if isOwner(userId) 
                    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['points', 'role', 'verifiedReports', 'totalReports', 'tier', 'rank', 'banned', 'flagged']))
                    || isAdmin();
      allow create: if isOwner(userId) && request.resource.data.role == 'citizen';
      allow delete: if isAdmin();
    }
    
    match /reports/{reportId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() 
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.status == 'pending';
      allow update, delete: if isAdmin();
    }
    
    match /user_achievements/{docId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid || isAdmin();
      allow write: if isAdmin();
    }
    
    match /rewards/{docId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid || isAdmin();
      allow write: if isAdmin();
    }
    
    match /notifications/{docId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']);
      allow create, delete: if isAdmin();
    }
    
    match /suspicious_flags/{docId} {
      allow read, write: if isAdmin();
    }

    match /admin_actions/{docId} {
      allow read, write: if isAdmin();
    }
  }
}'''

with open('firestore.rules', 'w', encoding='utf-8') as f:
    f.write(rules)