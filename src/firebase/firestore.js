import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './config';

/**
 * Save a footprint calculation to Firestore
 * @param {Object} data - The footprint calculation data
 * @returns {Promise<string>} The ID of the added document
 */
export async function saveCalculationToFirestore(data) {
  try {
    const docRef = await addDoc(collection(db, 'footprints'), data);
    return docRef.id;
  } catch (error) {
    console.error('Error saving calculation to Firestore: ', error);
    throw error;
  }
}

/**
 * Retrieve all footprint calculations from Firestore ordered by createdAt descending
 * @returns {Promise<Array>} An array of footprint documents with their IDs
 */
export async function getCalculationsFromFirestore() {
  try {
    const q = query(collection(db, 'footprints'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const footprints = [];
    querySnapshot.forEach((doc) => {
      footprints.push({ id: doc.id, ...doc.data() });
    });
    return footprints;
  } catch (error) {
    console.error('Error getting calculations from Firestore: ', error);
    throw error;
  }
}

/**
 * Delete a footprint calculation from Firestore by ID
 * @param {string} id - The document ID to delete
 * @returns {Promise<void>}
 */
export async function deleteCalculationFromFirestore(id) {
  try {
    await deleteDoc(doc(db, 'footprints', id));
  } catch (error) {
    console.error('Error deleting calculation from Firestore: ', error);
    throw error;
  }
}
