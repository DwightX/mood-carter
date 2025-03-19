"use client"

export default function Userinfo(user) {
  return (
    <div>
      <h1>Hey: {user.user.email}</h1>
    </div>
  );
}