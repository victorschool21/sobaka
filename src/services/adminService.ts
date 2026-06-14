import { addDoc, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getFirebaseDb } from '../config/firebase';
import type { Report } from '../types';

const REPORTS = 'reports';

export async function createReport(
  data: Omit<Report, 'id' | 'status' | 'createdAt'>,
): Promise<void> {
  await addDoc(collection(getFirebaseDb(), REPORTS), {
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
}

export async function listPendingReports(): Promise<Report[]> {
  const snap = await getDocs(collection(getFirebaseDb(), REPORTS));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Report)
    .filter((r) => r.status === 'pending');
}

export async function reviewReport(id: string, status: 'reviewed' | 'dismissed'): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), REPORTS, id), { status });
}

export async function getAdminMetrics(): Promise<{
  totalOccurrences: number;
  resolvedOccurrences: number;
  reunionRate: number;
}> {
  const [occSnap, resolvedSnap] = await Promise.all([
    getDocs(collection(getFirebaseDb(), 'occurrences')),
    getDocs(collection(getFirebaseDb(), 'occurrences')),
  ]);
  const total = occSnap.size;
  const resolved = resolvedSnap.docs.filter((d) => d.data().status === 'resolved').length;
  return {
    totalOccurrences: total,
    resolvedOccurrences: resolved,
    reunionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
  };
}
