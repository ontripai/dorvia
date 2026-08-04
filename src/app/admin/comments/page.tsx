import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Not Found',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminCommentsPage() {
  // Due to critical security requirements and lack of a robust server-side authentication system,
  // this route is permanently disabled in production to prevent client-side password vulnerabilities.
  notFound();
}
