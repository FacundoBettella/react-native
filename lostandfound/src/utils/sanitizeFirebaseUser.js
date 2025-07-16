export const sanitizeFirebaseUser = (user) => {
  if (!user) return null;

  return {
    uid: user.uid || null,
    email: user.email || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    emailVerified: user.emailVerified || false,
  };
};
