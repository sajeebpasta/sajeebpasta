import { allProducts as staticProducts } from "@/data/products";

const DB_NAME = "PastaHubMockDB";
const STORE_NAME = "mock_products";

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMockProducts = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get("products");
      
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          // Initialize with static products if not exists
          setMockProducts(staticProducts).then(() => resolve(staticProducts));
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB error:", error);
    return staticProducts;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setMockProducts = async (products: any[]): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(products, "products");
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB error:", error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getMockQuotations = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get("quotations");
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB error:", error);
    return [];
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setMockQuotations = async (quotations: any[]): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(quotations, "quotations");
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB error:", error);
  }
};
