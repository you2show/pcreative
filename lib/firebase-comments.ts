import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export const fetchCommentsFromFirebase = async (postId: string) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('post_id', '==', postId),
      orderBy('created_at', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
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
