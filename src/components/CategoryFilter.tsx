import React from 'react';

const categories = [
  'All',
  'Cryptocurrency',
  'Digital Banking',
  'Investment',
  'Blockchain',
  'Payments',
  'RegTech',
];

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}