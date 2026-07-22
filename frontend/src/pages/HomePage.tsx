import { FC } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ShieldCheck, Cpu, Database, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/page-transitions';

export const HomePage: FC = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-10 glass-panel border border-amber-500/20 overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Incubyte Technical Assessment
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Premium Car Dealership System Architecture
          </h1>
          <p className="text-slate-400 leading-relaxed text-base">
            Production-grade monorepo foundation engineered with Clean Architecture, SOLID principles, strict TypeScript contracts, and TDD readiness.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <Button variant="primary" size="lg">
              Explore Architecture Stack
            </Button>
          </div>
        </div>
      </div>

      {/* Architecture Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Cpu className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Clean Architecture</h3>
          <p className="text-sm text-slate-400">
            Separated Controller $\rightarrow$ Service $\rightarrow$ Repository layers with abstract contracts and Dependency Injection.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Type-Safe Mongoose</h3>
          <p className="text-sm text-slate-400">
            Strongly-typed schemas for User, Vehicle, and Purchase models matching domain interfaces.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">TDD Prepared</h3>
          <p className="text-sm text-slate-400">
            Jest & Supertest test suite pre-configured with sample health check & custom error unit tests.
          </p>
        </Card>
      </div>

      {/* Foundation Status */}
      <Card className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100">System Architecture Readiness Checklist</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Monorepo workspace configuration
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Zod request payload validation
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Express global error handler
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Zustand auth & UI state management
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> React Query & Axios client interceptors
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Tailwind v4 glassmorphic design system
          </li>
        </ul>
      </Card>
    </motion.div>
  );
};
