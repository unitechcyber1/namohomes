import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { createPageUrl } from '../../utils';
// import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Building2, Home, Briefcase, Store, MapPinned, ArrowRight } from 'lucide-react';

const iconMap = {
    coworking: Briefcase,
    office: Building2,
    residential: Home,
    commercial: Store,
    sco_plots: MapPinned,
    retail: Store
};

const defaultCategories = [
    //   { name: 'Coworking', slug: 'coworking', description: 'Modern shared workspaces', icon: 'coworking', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
    { name: 'Residential', slug: 'residential', description: 'Your dream home awaits', icon: 'residential', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80' },
    { name: 'Commercial', slug: 'commercial', description: 'Business properties', icon: 'commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80' },
    { name: 'SCO Plots', slug: 'sco_plots', description: 'Shop-Cum-Office spaces', icon: 'sco_plots', image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80' },
  { name: 'Office Spaces', slug: 'office', description: 'Premium office solutions', icon: 'office', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80' },

];

export default function CategoryBlocks() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            //   const data = await base44.entities.Category.filter({ status: 'active' }, 'display_order', 10);
            const data = [];
            if (data.length > 0) {
                setCategories(data);
            } else {
                setCategories(defaultCategories);
            }
        };
        loadCategories();
    }, []);

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-amber-600 font-medium mb-4 block">Property Categories</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Explore By Property Type
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        From coworking spaces to luxury residences, find exactly what you're looking for.
                    </p>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.slice(0, 5).map((category, index) => {
                        const IconComponent = iconMap[category.icon] || iconMap[category.slug] || Building2;
                        const isLarge = index === 0 || index === 3;

                        return (
                            <motion.div
                                key={category.id || category.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={isLarge ? 'lg:col-span-2' : ''}
                            >
                                {/* to={createPageUrl(`Listings?category=${category.slug}`)} */}
                                {/* <Link > */}
                                <div className={`group relative overflow-hidden rounded-2xl ${isLarge ? 'h-72' : 'h-64'}`}>
                                    <img
                                        src={category.image_url || defaultCategories.find(c => c.slug === category.slug)?.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <IconComponent className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-1">
                                                    {category.name}
                                                </h3>
                                                <p className="text-slate-300">
                                                    {category.description || `Explore ${category.name.toLowerCase()} properties`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span>Explore Properties</span>
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                                {/* </Link> */}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}