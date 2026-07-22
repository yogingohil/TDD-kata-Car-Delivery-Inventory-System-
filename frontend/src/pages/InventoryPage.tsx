import { FC } from 'react';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/page-transitions';

export const InventoryPage: FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Vehicle Inventory Catalog</h1>
          <p className="text-sm text-slate-400">Inventory Module Architecture Foundation</p>
        </div>
      </div>

      <Card className="text-center py-16 space-y-3">
        <h3 className="text-lg font-bold text-slate-200">Vehicle Business Logic & CRUD Operations</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Mongoose models (`Vehicle`, `User`, `Purchase`), Repositories, and Zod Schemas are fully configured. CRUD endpoints will be driven by Test Driven Development (TDD).
        </p>
      </Card>
    </motion.div>
  );
};
