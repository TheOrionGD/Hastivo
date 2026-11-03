import React from 'react';
import AuthPortal from '../../components/auth/AuthPortal';

/**
 * Registration Screen — Two-Column Layout
 * Left Section: Introductory Branding & Visual Consistency
 * Right Section: Username, Full Name, Email, Phone, Password (Locked), Confirm Password (Re-entry), Role
 */
export default function Registration() {
  return <AuthPortal initialMode="register" />;
}
