import { useState, useEffect } from 'react';
import { PurchaseEvent, Product } from '../types';
import { FAKE_NAMES, FAKE_LOCATIONS, PRODUCT_LIST } from '../constants';

/**
 * Hook for generating site-wide activity notifications.
 */
export const useSiteActivity = () => {
  const [latestPurchase, setLatestPurchase] = useState<PurchaseEvent | null>(null);

  useEffect(() => {
    const generatePurchase = () => {
        const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
        const location = FAKE_LOCATIONS[Math.floor(Math.random() * FAKE_LOCATIONS.length)];
        const product = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];

        setLatestPurchase({
            name,
            location,
            productName: product.name,
            timestamp: new Date(),
        });
    }

    // Initial purchase event
    generatePurchase();

    const purchaseInterval = setInterval(generatePurchase, 9000); // Every 9 seconds

    return () => clearInterval(purchaseInterval);
  }, []);

  return { latestPurchase };
};


// Simple hash function to get a consistent random seed from a string
const stringToSeed = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Hook for generating real-time metrics for a specific product.
 */
export const useProductMetrics = (product: Product | null) => {
  const [viewers, setViewers] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [saleEndTime, setSaleEndTime] = useState<Date>(new Date());

  useEffect(() => {
    if (!product) return;

    // Seed initial values based on product ID to make them consistent for each product
    const seed = stringToSeed(product.id);
    const initialViewers = (seed % 20) + 10; // 10-29
    const initialStock = (seed % 15) + 5; // 5-19
    const saleDurationHours = ((seed % 3) + 2) * 60 * 60 * 1000; // 2-4 hours

    setViewers(initialViewers);
    setStock(initialStock);
    setSaleEndTime(new Date(Date.now() + saleDurationHours));

    const viewerInterval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(5, prev + change);
      });
    }, 3500);

    const stockInterval = setInterval(() => {
        setStock(prevStock => Math.max(0, prevStock - 1));
    }, 25000); // Slower stock decrease every 25s

    return () => {
        clearInterval(viewerInterval);
        clearInterval(stockInterval);
    };
  }, [product]);

  return { viewers, stock, saleEndTime };
};
