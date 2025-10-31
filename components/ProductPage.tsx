import React from 'react';
import { Product } from '../types';
import { UrgencyBar } from './UrgencyBar';
import { ViewerCount } from './ViewerCount';
import { useProductMetrics } from '../hooks/useSocialProof';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
}

const AddToCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

export const ProductPage: React.FC<ProductPageProps> = ({ product, onBack }) => {
  const { viewers, stock, saleEndTime } = useProductMetrics(product);

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
              <ViewerCount count={viewers} />
          </div>

          <UrgencyBar stock={stock} saleEndTime={saleEndTime} />

          <div className="flex items-center justify-between mt-8">
            <span className="text-4xl font-bold text-white">${product.price.toFixed(2)}</span>
            <button className="flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out">
              <AddToCartIcon />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
