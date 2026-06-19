// MediOS - Authentication and Role Redirection Helpers
import { auth, db, doc, getDoc } from "./firebase.js";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * Checks if the current session is authenticated and authorized for specific roles.
 * Redirects to the appropriate dashboard or login screen if authorization checks fail.
 * @param {string[]} allowedRoles - List of roles permitted to view the page.
 * @returns {Promise<object|null>} Resolves with combined user and profile data, or null.
 */
async function checkAuthAndRole(allowedRoles) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // No session exists, redirect to login
        window.location.href = "login.html";
        resolve(null);
        return;
      }
      
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          console.error("User profile document not found in Firestore.");
          await signOut(auth);
          window.location.href = "login.html?error=profile_missing";
          resolve(null);
          return;
        }
        
        const userData = userDoc.data();
        const role = userData.role;
        
        // Check if user's role is allowed on this specific dashboard
        if (allowedRoles && !allowedRoles.includes(role)) {
          console.warn(`Unauthorized access attempt. Redirecting user with role: ${role}`);
          if (role === "admin") {
            window.location.href = "admin.html";
          } else if (role === "receptionist") {
            window.location.href = "receptionist.html";
          } else if (role === "doctor") {
            window.location.href = "doctor.html";
          } else {
            await signOut(auth);
            window.location.href = "login.html?error=unauthorized";
          }
          resolve(null);
          return;
        }
        
        resolve({ user, ...userData });
      } catch (err) {
        console.error("Error checking authorization role:", err);
        window.location.href = "login.html?error=system_error";
        resolve(null);
      }
    });
  });
}

/**
 * Logs in a user via email and password and returns their profile role.
 */
async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    throw new Error("Staff profile details missing from the database.");
  }
  
  const userData = userDoc.data();
  return { user, role: userData.role };
}

/**
 * Signs out the current session and redirects to the login screen.
 */
async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout failed:", error);
    window.location.href = "login.html";
  }
}

export { checkAuthAndRole, loginUser, logoutUser };
