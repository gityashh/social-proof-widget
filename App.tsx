import React, { useState, useMemo } from 'react';
import { ProductPage } from './components/ProductPage';
import { SocialProofToast } from './components/SocialProofToast';
import { useSiteActivity } from './hooks/useSocialProof';
import { PRODUCT_LIST } from './constants';
import { Product, CartItem } from './types';
import { stringToSeed } from './hooks/useSocialProof';


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

const CartIcon = ({ itemCount }: { itemCount: number }) => (
    <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-gray-900 ring-2 ring-gray-900">
                {itemCount}
            </span>
        )}
    </div>
);


const Header: React.FC<{ cartItemCount: number; onViewCart: () => void; }> = ({ cartItemCount, onViewCart }) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-900/70 backdrop-blur-md z-50 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <WatchIcon />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Aether Timepieces
                        </span>
                    </div>
                    <button onClick={onViewCart} className="group p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label={`View cart with ${cartItemCount} items`}>
                        <CartIcon itemCount={cartItemCount} />
                    </button>
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

// --- START: Cart Components ---
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

interface CartItemCardProps {
    item: CartItem;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemove: (productId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onUpdateQuantity, onRemove }) => (
    <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/60 border border-gray-700/50">
        <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
        <div className="flex-grow">
            <p className="text-sm text-cyan-400 uppercase tracking-wider">{item.product.brand}</p>
            <h4 className="text-lg font-bold text-white">{item.product.name}</h4>
            <p className="text-gray-400 text-sm mt-2">Price: ${item.product.price.toFixed(2)}</p>
        </div>
        <div className="flex flex-col items-end space-y-3">
            <div className="flex items-center border border-gray-600 rounded-full">
                <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} className="p-2 text-gray-400 hover:text-white disabled:opacity-50" disabled={item.quantity <= 1}><MinusIcon /></button>
                <span className="px-3 text-white font-semibold">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="p-2 text-gray-400 hover:text-white"><PlusIcon /></button>
            </div>
             <p className="text-lg font-bold text-white">${(item.product.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => onRemove(item.product.id)} className="text-red-500 hover:text-red-400 text-xs flex items-center"><TrashIcon/> <span className="ml-1">Remove</span></button>
        </div>
    </div>
);


const CartUrgencyWidget: React.FC<{ cart: CartItem[] }> = ({ cart }) => {
    const mostAtRiskItem = useMemo(() => {
        if (!cart.length) return null;
        return cart.reduce((lowest, current) => {
            const lowestStock = (stringToSeed(lowest.product.id) % 15) + 5;
            const currentStock = (stringToSeed(current.product.id) % 15) + 5;
            return currentStock < lowestStock ? current : lowest;
        });
    }, [cart]);

    if (!mostAtRiskItem) return null;
    
    const stock = (stringToSeed(mostAtRiskItem.product.id) % 15) + 5;

    return (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 p-4 rounded-lg text-center mb-8">
            <p className="font-bold text-lg mb-1">Place your order before it gets stock out!</p>
            <p className="text-sm">
                Demand is high for the <span className="font-semibold text-white">{mostAtRiskItem.product.name}</span>, with only <span className="font-semibold text-white">{stock}</span> left in stock.
            </p>
        </div>
    );
};


interface CartPageProps {
    cart: CartItem[];
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onGoToGrid: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, onUpdateQuantity, onRemoveItem, onGoToGrid }) => {
    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
    
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            <button onClick={onGoToGrid} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors mb-6">&larr; Back to shopping</button>
            <h1 className="text-4xl font-black mb-8 text-white">Your Cart</h1>
            {cart.length > 0 ? (
                <>
                    <CartUrgencyWidget cart={cart} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map(item => <CartItemCard key={item.product.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveItem} />)}
                        </div>
                        <div className="bg-gray-800/60 border border-gray-700/50 rounded-lg p-6 h-fit">
                            <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
                            <div className="space-y-2 text-gray-300">
                                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span className="text-cyan-400">FREE</span></div>
                                <hr className="border-gray-700 my-2" />
                                <div className="flex justify-between text-white font-bold text-xl"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
                            </div>
                            <button className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-3 rounded-full shadow-lg shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 ease-in-out">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-16 bg-gray-800/60 rounded-lg">
                    <h2 className="text-2xl font-bold text-white">Your cart is empty.</h2>
                    <p className="text-gray-400 mt-2">Looks like you haven't added anything to your cart yet.</p>
                </div>
            )}
        </div>
    );
};
// --- END: Cart Components ---


// --- END: In-file Components ---


function App() {
  const { latestPurchase } = useSiteActivity();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'grid' | 'product' | 'cart'>('grid');
  
  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const handleSelectProduct = (product: Product) => {
    window.scrollTo(0, 0);
    setSelectedProduct(product);
    setView('product');
  };

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.product.id === product.id);
        if (existingItem) {
            return prevCart.map(item =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
          handleRemoveItem(productId);
          return;
      }
      setCart(cart => cart.map(item => item.product.id === productId ? {...item, quantity: newQuantity} : item));
  };
  
  const handleRemoveItem = (productId: string) => {
      setCart(cart => cart.filter(item => item.product.id !== productId));
  };

  const handleGoBack = () => {
    setSelectedProduct(null);
    setView('grid');
  };
  
  const handleViewCart = () => {
      setView('cart');
  }

  const renderContent = () => {
    switch (view) {
        case 'product':
            return <ProductPage product={selectedProduct!} onBack={handleGoBack} onAddToCart={handleAddToCart} />;
        case 'cart':
            return <CartPage cart={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onGoToGrid={handleGoBack} />;
        case 'grid':
        default:
            return <ProductGridPage products={PRODUCT_LIST} onSelectProduct={handleSelectProduct} />;
    }
  };

  return (
    <>
      <Header cartItemCount={cartItemCount} onViewCart={handleViewCart} />
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 pt-24">
        <div className="relative w-full max-w-6xl mx-auto">
          {renderContent()}
          
          {view === 'grid' && latestPurchase && (
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
