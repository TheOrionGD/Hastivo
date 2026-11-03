import React from 'react';
import AuthPortal from '../../components/auth/AuthPortal';

/**
 * SignIn Screen — Two-Column Layout
 * Left Section: Introductory Branding & Visual Showcase
 * Right Section: Welcome, Email/Username, Password, Sign In, OR, Google, Anonymous, Register Link
 */
export default function SignIn() {
  return <AuthPortal initialMode="signin" />;
}
