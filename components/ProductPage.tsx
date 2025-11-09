import React, { useState, useEffect } from 'react';
import { Product, PurchaseEvent } from '../types';
import { UrgencyBar } from './UrgencyBar';
import { ViewerCount } from './ViewerCount';
import { useProductMetrics } from '../hooks/useSocialProof'; // removed useProductPurchases
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
// --- START: In-file Components ---
const ProductPurchaseToast: React.FC<{ event: PurchaseEvent }> = ({ event }) => {
  const [visible, setVisible] = useState(false);

  const [viewerCount, setViewerCount] = useState<number | null>(null);
  const [viewerError, setViewerError] = useState<string | null>(null);

  useEffect(() => {
    setVisible(false); // Reset for new events
    const timerIn = setTimeout(() => setVisible(true), 100);
    const timerOut = setTimeout(() => setVisible(false), 5000);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timerOut);
    };
  }, [event]);

  return (
    <div
      className={`fixed bottom-5 right-5 w-80 p-4 rounded-xl shadow-2xl shadow-black/50 bg-gray-800 border border-gray-700
                  transform transition-all duration-500 ease-in-out z-50
                  ${visible ? 'translate-x-0 opacity-100' : 'translate-x-[calc(100%+2.5rem)] opacity-0'}`}
      aria-live="polite"
      role="status"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
            strokeLinecap="round" strokeLinejoin="round" 
            className="h-6 w-6 text-orange-400">
             <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5A7.5 7.5 0 0 1 12 20.5c-2.5 0-4.5-1-6-2.5-1.5-1.5-2.5-3.5-2.5-6A2.5 2.5 0 0 1 6 9.5c1.5 0 2.5 1 2.5 2.5z"></path>
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-bold text-white">
            {event.name}
          </p>
          <p className="mt-1 text-sm text-gray-300">
            Just purchased this product
          </p>
          <p className="mt-1 text-xs text-gray-500">
            A few seconds ago
          </p>
        </div>
      </div>
    </div>
  );
};
// --- END: In-file Components ---

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const AddToCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
        strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
        strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export const ProductPage: React.FC<ProductPageProps> = ({ product, onBack, onAddToCart }) => {
  const { viewers, stock, saleEndTime } = useProductMetrics(product);
  
  // 🔥 new state for WebSocket purchase notifications
  const [latestProductPurchase, setLatestProductPurchase] = useState<PurchaseEvent | null>(null);
  const [viewerCount, setViewerCount] = useState<number | null>(null);
  const [viewerError, setViewerError] = useState<string | null>(null);


  useEffect(() => {
  // Create a STOMP client instance
  const client = new Client({
    // Create the actual SockJS connection
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000, // Auto reconnect every 5s if connection drops
    debug: (str) => console.log(str), // Optional: helps debug connections
  });


  // Runs only when connection is established
  client.onConnect = () => {
    console.log("✅ Connected to WebSocket");

    client.subscribe("/topic/viewers", (message) => {
    try {
    const count = parseInt(message.body);
    console.log("👀 Live viewers:", count);
    setViewerCount(count); // you’ll create a new state for this
    } catch (err) {
    console.error("Failed to parse viewer count:", err);
    }
    });
    
    // Safe to subscribe here (connection is guaranteed)
    client.subscribe("/topic/notifications", (message) => {
      const event = {
        name: message.body || "Someone",
        timestamp: new Date(),
      };
      console.log("📩 Notification received:", event);
      setLatestProductPurchase(event);
    });

    

  };

  

  // Handle disconnection gracefully
  client.onStompError = (frame) => {
    console.error("STOMP error:", frame.headers["message"]);
    console.error("Details:", frame.body);
    setViewerError("Real-time connection lost. Viewer count unavailable.");
  };

  // Connect the client
  client.activate();

  // Cleanup when component unmounts
  return () => {
    if (client.active) {
      console.log("Disconnecting WebSocket...");
      client.deactivate();
    }
  };

  
  
}, []);

useEffect(() => {
  const client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log("✅ Connected to WebSocket");

    // Subscribe to viewer updates
    client.subscribe("/topic/viewers", (message) => {
      try {
        const count = parseInt(message.body);
        setViewerCount(count);
      } catch (err) {
        console.error("Failed to parse viewer count:", err);
      }
    });

    // Fetch initial viewer count
    fetch("http://localhost:8080/api/viewerCount")
      .then((res) => res.text())
      .then((count) => setViewerCount(parseInt(count)))
      .catch(() => console.warn("Could not fetch initial viewer count"));
  };

  client.activate();
  return () => client.deactivate();
}, []);

  return (
    <div className="relative w-full animate-fade-in">
      <button 
        onClick={onBack} 
        className="absolute -top-14 left-0 flex items-center text-cyan-400 hover:text-cyan-300 font-semibold transition-colors z-10"
        aria-label="Back to collection"
        >
        <BackIcon/>
        Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl shadow-cyan-500/10 border border-gray-700">
        {/* Product Image */}
        <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-w-md aspect-square object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col h-full justify-center">
          <div>
              <span className="text-cyan-400 font-semibold tracking-widest uppercase text-sm">{product.brand}</span>
              <h1 className="text-4xl lg:text-5xl font-black my-3 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{product.name}</h1>
              <p className="text-gray-300 mb-6 text-lg">{product.description}</p>
          </div>

          <div className="my-4">
              <ViewerCount 
  count={viewerCount !== null ? viewerCount : viewers} 
  error={viewerError} 
/>
          </div>

          <UrgencyBar stock={stock} saleEndTime={saleEndTime} />

          <div className="flex items-center justify-between mt-8">
            <span className="text-4xl font-bold text-white">${product.price.toFixed(2)}</span>
            <button onClick={() => onAddToCart(product)} className="flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out">
              <AddToCartIcon />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 Real WebSocket Notification */}
      {latestProductPurchase && (
        <ProductPurchaseToast 
          key={latestProductPurchase.timestamp.getTime()} 
          event={latestProductPurchase} 
        />
      )}
    </div>
  );
};