import { FC } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/page-transitions';

export const LoginPage: FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 mb-2">
          <Car className="h-8 w-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100">Sign in to AutoVault</h2>
        <p className="text-sm text-slate-400">Authentication Architecture Shell</p>
      </div>

      <Card className="space-y-4">
        <Input label="Email Address" type="email" placeholder="admin@autovault.com" />
        <Input label="Password" type="password" placeholder="••••••••" />
        
        <Button variant="primary" className="w-full mt-2">
          Authenticate
        </Button>

        <p className="text-xs text-center text-slate-500 pt-2">
          Auth endpoints are structured as TDD architectural stubs per Incubyte assessment directives.
        </p>
      </Card>

      <div className="text-center">
        <Link to="/" className="text-xs text-amber-400 hover:underline font-medium">
          ← Back to Main Architecture Overview
        </Link>
      </div>
    </motion.div>
  );
};
