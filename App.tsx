import React, { useState } from 'react';
import { ProductPage } from './components/ProductPage';
import { SocialProofToast } from './components/SocialProofToast';
import { useSiteActivity } from './hooks/useSocialProof';
import { PRODUCT_LIST } from './constants';
import { Product } from './types';

// --- START: In-file Components ---
// To meet the project structure constraints, these components are defined here.
// In a larger project, they would be in their own files.

const WatchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-3 text-cyan-400">
        <circle cx="12" cy="12" r="7"></circle>
        <polyline points="12 9 12 12 13.5 13.5"></polyline>
        <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"></path>
    </svg>
);

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-900/70 backdrop-blur-md z-50 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center md:justify-start h-16">
                    <div className="flex items-center">
                        <WatchIcon />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Aether Timepieces
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <div 
        className="group relative cursor-pointer bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2"
        onClick={() => onSelect(product)}
        aria-label={`View details for ${product.name}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(product) }}
    >
      <div className="w-full aspect-square bg-gray-700 rounded-lg overflow-hidden mb-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="text-left">
          <span className="text-cyan-400 font-semibold tracking-widest uppercase text-xs">{product.brand}</span>
          <h3 className="text-lg font-bold text-white mt-1 truncate">{product.name}</h3>
          <p className="text-2xl font-black text-gray-200 mt-2">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

interface ProductGridPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const ProductGridPage: React.FC<ProductGridPageProps> = ({ products, onSelectProduct }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-4xl lg:text-5xl font-black my-3 text-center mb-12 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Explore Our Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
        ))}
      </div>
    </div>
  );
};

// --- END: In-file Components ---


function App() {
  const { latestPurchase } = useSiteActivity();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectProduct = (product: Product) => {
    window.scrollTo(0, 0);
    setSelectedProduct(product);
  };

  const handleGoBack = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 pt-24">
        <div className="relative w-full max-w-6xl mx-auto">
          {selectedProduct ? (
            <ProductPage
              product={selectedProduct}
              onBack={handleGoBack}
            />
          ) : (
            <ProductGridPage
              products={PRODUCT_LIST}
              onSelectProduct={handleSelectProduct}
            />
          )}
          
          {latestPurchase && (
            <SocialProofToast
              key={latestPurchase.timestamp.getTime()}
              event={latestPurchase}
            />
          )}
        </div>
      </main>
    </>
  );
}

export default App;
