import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export const fetchCommentsFromFirebase = async (postId: string) => {
  try {
    // Use only a simple equality filter to avoid requiring a composite Firestore index.
    // Sort the results client-side by created_at.
    const q = query(
      collection(db, 'comments'),
      where('post_id', '==', postId)
    );
    const querySnapshot = await getDocs(q);
    const rows = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Sort ascending by created_at string (ISO 8601 strings are lexicographically sortable)
    rows.sort((a: any, b: any) => {
      if (a.created_at < b.created_at) return -1;
      if (a.created_at > b.created_at) return 1;
      return 0;
    });
    return rows;
  } catch (error) {
    console.error('Error fetching comments from Firebase:', error);
    return [];
  }
};

export const addCommentToFirebase = async (commentData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      ...commentData,
      created_at: new Date().toISOString()
    });
    return {
      id: docRef.id,
      ...commentData,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding comment to Firebase:', error);
    return null;
  }
};
