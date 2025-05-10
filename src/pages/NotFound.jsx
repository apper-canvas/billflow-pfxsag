import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const HomeIcon = getIcon('Home');
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center text-center"
    >
      <div className="w-24 h-24 mb-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
        <AlertTriangleIcon size={40} />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Page Not Found</h2>
      
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. Please check the URL or go back to the home page.
      </p>
      
      <Link 
        to="/"
        className="button-primary py-3 px-6 flex items-center gap-2"
      >
        <HomeIcon size={20} />
        <span>Back to Home</span>
      </Link>
    </motion.div>
  );
};

export default NotFound;