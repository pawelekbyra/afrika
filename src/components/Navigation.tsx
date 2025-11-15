
"use client";

import React, { useContext } from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';

const Navigation = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null; // Or a loading state
  }

  const { user, logout } = auth;

  return (
    <nav>
      <Link href="/">Home</Link>
      {user ? (
        <>
          <Link href="/account">Account</Link>
          {user.isAdmin && <Link href="/admin">Admin</Link>}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
      <Link href="/test">Test</Link>
    </nav>
  );
};

export default Navigation;
